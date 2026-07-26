// lib/services/agents/journeyComboAgent.js
// Simplified Journey Combo Agent - Generates itinerary JSON via Gemini,
// and derives food and safety information deterministically.

import { askGeminiJSON } from '@/lib/gemini';
import { OpenStreetMapService } from '@/lib/services/openstreetmap';
import { getDestinationKnowledge } from '@/lib/services/travelKnowledgeBase.mjs';
import { ItinerarySchema } from '@/lib/validation';

const SYSTEM_PROMPT = `You are the core Itinerary Planning Agent for SmartTour.
Create a highly detailed, realistic, and practical travel itinerary.
You MUST return a JSON object matching the requested schema.`;

const DEFAULT_RADIUS_METERS = 5000;

function buildMapUrl(lat, lng, name) {
  if (!lat || !lng) return null;
  const label = encodeURIComponent(name || `${lat},${lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}%20(${label})`;
}

// Emergency numbers database mapped to country/region keywords
const EMERGENCY_DB = {
  in: {
    country: 'India',
    numbers: [
      { service: 'National Emergency', number: '112', available: '24/7', notes: 'All-in-one emergency' },
      { service: 'Police', number: '100', available: '24/7', notes: '' },
      { service: 'Ambulance', number: '102', available: '24/7', notes: '' },
    ]
  },
  us: {
    country: 'United States',
    numbers: [
      { service: 'Emergency Services', number: '911', available: '24/7', notes: 'Police, fire, ambulance' }
    ]
  },
  gb: {
    country: 'United Kingdom',
    numbers: [
      { service: 'Emergency', number: '999', available: '24/7', notes: 'Police, fire, ambulance' },
      { service: 'NHS Non-Emergency', number: '111', available: '24/7', notes: 'Medical advice' }
    ]
  },
  fr: {
    country: 'France',
    numbers: [
      { service: 'European Emergency', number: '112', available: '24/7', notes: 'All services' },
      { service: 'Medical (SAMU)', number: '15', available: '24/7', notes: '' }
    ]
  },
  de: {
    country: 'Germany',
    numbers: [
      { service: 'Emergency Call', number: '112', available: '24/7', notes: 'Fire, medical' },
      { service: 'Police', number: '110', available: '24/7', notes: '' }
    ]
  }
};

function getCountryEmergency(destinationName) {
  const norm = destinationName.toLowerCase();
  if (norm.includes('india') || norm.includes('kerala') || norm.includes('delhi') || norm.includes('mumbai') || norm.includes('patna') || norm.includes('kochi') || norm.includes('kashmir') || norm.includes('srinagar')) {
    return EMERGENCY_DB.in;
  }
  if (norm.includes('france') || norm.includes('paris') || norm.includes('lyon') || norm.includes('marseille')) {
    return EMERGENCY_DB.fr;
  }
  if (norm.includes('united kingdom') || norm.includes('uk') || norm.includes('london') || norm.includes('scotland') || norm.includes('england')) {
    return EMERGENCY_DB.gb;
  }
  if (norm.includes('germany') || norm.includes('berlin') || norm.includes('munich') || norm.includes('frankfurt')) {
    return EMERGENCY_DB.de;
  }
  if (norm.includes('usa') || norm.includes('united states') || norm.includes('america') || norm.includes('new york') || norm.includes('california') || norm.includes('chicago') || norm.includes('texas')) {
    return EMERGENCY_DB.us;
  }
  // Default to General European/Global fallback
  return {
    country: 'Global Fallback',
    numbers: [
      { service: 'General Emergency', number: '112', available: '24/7', notes: 'Global emergency number standard' }
    ]
  };
}

export class JourneyComboAgent {
  async generateCompleteJourney(userProfile) {
    const destination = userProfile.destination || 'India';
    const duration = userProfile.tripDuration || 3;
    const style = userProfile.travelStyle || 'balanced';
    const budget = typeof userProfile.budget === 'object'
      ? userProfile.budget.tier
      : userProfile.budget || 'moderate';

    // 1. Geocode location using OpenStreetMap search
    let center = { lat: 20.5937, lng: 78.9629 }; // India center default
    let attractions = [];
    let restaurants = [];
    let hotels = [];

    try {
      const destResults = await OpenStreetMapService.searchPlaces(destination);
      if (destResults && destResults.length > 0) {
        center = destResults[0].location;
      }
    } catch (e) {
      console.warn('[JourneyComboAgent] OSMSearch failed, using general coordinate defaults:', e.message);
    }

    // 2. Fetch nearby places for RAG grounding
    try {
      const [attractionsReq, restaurantsReq, hotelsReq] = await Promise.allSettled([
        OpenStreetMapService.getNearbyAttractions(center.lat, center.lng, DEFAULT_RADIUS_METERS),
        OpenStreetMapService.getNearbyRestaurants(center.lat, center.lng, DEFAULT_RADIUS_METERS),
        OpenStreetMapService.getNearbyHotels(center.lat, center.lng, DEFAULT_RADIUS_METERS),
      ]);

      attractions = (attractionsReq.status === 'fulfilled' ? attractionsReq.value : []).slice(0, 15);
      restaurants = (restaurantsReq.status === 'fulfilled' ? restaurantsReq.value : []).slice(0, 15);
      hotels = (hotelsReq.status === 'fulfilled' ? hotelsReq.value : []).slice(0, 8);
    } catch (e) {
      console.warn('[JourneyComboAgent] Overpass API queries failed, relying on Gemini knowledge fallback:', e.message);
    }

    // Merge with static local knowledge if present
    const localKB = getDestinationKnowledge(destination);
    if (localKB) {
      center = localKB.center || center;
      if (attractions.length === 0 && localKB.attractions) attractions = localKB.attractions;
      if (restaurants.length === 0 && localKB.restaurants) restaurants = localKB.restaurants;
      if (hotels.length === 0 && localKB.hotels) hotels = localKB.hotels;
    }

    // 3. Format verified lists for the prompt context
    const hasVerifiedData = attractions.length > 0 && restaurants.length > 0;
    const formatPlaces = (title, list) => {
      const rows = list.map(p => `- ${p.name} | lat:${p.location.lat} | lng:${p.location.lng} | address:${p.address || ''} | category:${p.category || p.cuisine || 'general'}`);
      return `${title}:\n${rows.length ? rows.join('\n') : '- None available'}`;
    };

    const verifiedContext = [
      `Destination center: ${destination} (${center.lat}, ${center.lng})`,
      formatPlaces('VERIFIED_ATTRACTIONS', attractions),
      formatPlaces('VERIFIED_RESTAURANTS', restaurants),
      formatPlaces('VERIFIED_HOTELS', hotels),
    ].join('\n\n');

    const rules = hasVerifiedData
      ? `RULES:
1) Use ONLY places listed in VERIFIED_ATTRACTIONS / VERIFIED_RESTAURANTS / VERIFIED_HOTELS where possible.
2) Every activity and meal suggestion must include the exact name from the verified lists.
3) Set verified: true for activities taken from the verified lists.
4) If the category lists are short, reuse verified entries; never invent fictional places.`
      : `RULES:
1) Supplement with your own knowledge of REAL, popular, well-known landmarks/venues in ${destination}.
2) For places from your own knowledge: set verified: false, estimate coordinates {lat, lng}, and set osmId to "ai/name-slug".
3) Do NOT invent fictional restaurants, landmarks or hotels. All places must be real.`;

    const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination}.
Style: ${style}
Budget Tier: ${budget}
Interests: ${Object.keys(userProfile.interests || {}).join(', ') || 'Culture, Food'}
Group Size: ${userProfile.groupSize || 2}

${rules}

${verifiedContext}

JSON Schema:
{
  "destination": "${destination}",
  "duration": ${duration},
  "itinerary": {
    "days": [
      {
        "day": number,
        "theme": string,
        "duration": string (e.g. "8 hours"),
        "activities": [
          {
            "name": string (exact name of activity/attraction/restaurant),
            "time": string (e.g. "09:00 - 11:30"),
            "duration": number (hours),
            "category": string (attraction, food, shopping, relaxation, adventure),
            "cost": string (e.g. "₹500" or "Free"),
            "description": string (maximum 12 words),
            "location": {
              "name": string,
              "address": string,
              "lat": number,
              "lng": number
            },
            "osmId": string (use the verified list id or "ai/name-slug"),
            "verified": boolean,
            "mapUrl": string,
            "tips": string (maximum 10 words)
          }
        ] (exactly 3 activities per day),
        "meals": {
          "breakfast": string,
          "lunch": string,
          "dinner": string
        }
      }
    ],
    "totalEstimatedCost": string (e.g. "₹15,000 - ₹25,000 per person"),
    "packingTips": string[] (3-4 essential packing items),
    "transportTips": string (general advice for moving around the city)
  }
}`;

    // 4. Query Gemini and validate shape via Zod. Keep the schema compact so a
    // complete real-AI itinerary fits within the reliable JSON output window.
    console.log(`[JourneyComboAgent] Planning itinerary for ${destination} using Gemini...`);
    const rawResult = await askGeminiJSON(SYSTEM_PROMPT, prompt);

    // Zod validation validates the top level and itinerary schema
    const parsed = ItinerarySchema.parse(rawResult);
    const itinerary = parsed.itinerary;

    // Build coordinates and mapUrls for activities
    itinerary.days.forEach(day => {
      day.activities.forEach(act => {
        if (!act.mapUrl) {
          act.mapUrl = buildMapUrl(act.location.lat, act.location.lng, act.name);
        }
      });
    });

    // 5. AI-Powered Food Recommendations via Gemini
    let foodRecommendations;
    try {
      const restaurantContext = restaurants.length > 0
        ? `VERIFIED restaurants near ${destination}:\n${restaurants.slice(0, 8).map(r => `- ${r.name} (${r.cuisine || 'Local'}) at ${r.address || 'central area'}`).join('\n')}`
        : `No verified restaurant data available. Use your knowledge of real, well-known restaurants in ${destination}.`;

      const foodPrompt = `You are a culinary expert for ${destination}. Provide authentic food recommendations.

${restaurantContext}

Return JSON:
{
  "cuisineOverview": "2-3 sentence overview of ${destination}'s food scene",
  "mustTryDishes": [
    {
      "name": "Exact real dish name",
      "description": "What it is, max 12 words",
      "averagePriceUSD": number,
      "isVegetarian": boolean,
      "isVegan": boolean,
      "isHalal": boolean,
      "isGlutenFree": boolean,
      "spiceLevel": "Mild | Medium | Hot",
      "localTip": "Where/how to eat it best"
    }
  ] (exactly 4 dishes),
  "topRestaurants": [
    {
      "name": "Real restaurant name in ${destination}",
      "cuisine": "Cuisine type",
      "neighborhood": "Area/locality",
      "type": "Fine Dining | Casual | Street Food | Café",
      "priceRange": "$ | $$ | $$$",
      "rating": number (4.0-4.9),
      "mustOrder": "Signature dish name",
      "localFavorite": boolean
    }
  ] (exactly 3 restaurants),
  "foodBudgetTips": ["tip1", "tip2"] (exactly 2 tips),
  "drinkingWaterSafety": "Brief water safety advice for ${destination}",
  "vegetarianFriendly": true
}`;

      console.log(`[JourneyComboAgent] Generating food recommendations via Gemini for ${destination}...`);
      const geminiFood = await askGeminiJSON(
        'You are the SmartTour Food Recommendation Agent. Provide REAL, authentic food recommendations only. Never invent fictional restaurants.',
        foodPrompt
      );

      // Merge OSM verified data into Gemini results
      const enrichedRestaurants = (geminiFood.topRestaurants || []).map((r, idx) => {
        const osmMatch = restaurants.find(osm => osm.name.toLowerCase().includes(r.name.toLowerCase().split(' ')[0]));
        return {
          ...r,
          verified: !!osmMatch,
          osmId: osmMatch?.osmId || `ai/${r.name.toLowerCase().replace(/\s+/g, '-')}`,
          location: osmMatch?.location || center,
          mapUrl: osmMatch?.mapUrl || buildMapUrl(center.lat, center.lng, r.name),
        };
      });

      foodRecommendations = {
        destination,
        cuisineOverview: geminiFood.cuisineOverview || `Explore the culinary scene of ${destination}.`,
        vegetarianFriendly: geminiFood.vegetarianFriendly ?? true,
        halalFriendly: geminiFood.halalFriendly ?? false,
        drinkingWaterSafety: geminiFood.drinkingWaterSafety || 'Prefer bottled water.',
        mustTryDishes: geminiFood.mustTryDishes || [],
        topRestaurants: enrichedRestaurants.slice(0, 4),
        foodBudgetTips: geminiFood.foodBudgetTips || ['Eat where locals eat for best value.'],
      };
    } catch (foodErr) {
      console.warn('[JourneyComboAgent] Gemini food generation failed, using itinerary-derived fallback:', foodErr.message);
      // Extract restaurant venues from itinerary activities as last resort
      const topRestaurants = [];
      const seenRestaurants = new Set();
      itinerary.days.forEach(day => {
        day.activities.forEach(act => {
          if (
            (act.category === 'food' || act.name.toLowerCase().includes('restaurant') || act.name.toLowerCase().includes('cafe')) &&
            !seenRestaurants.has(act.name.toLowerCase())
          ) {
            seenRestaurants.add(act.name.toLowerCase());
            topRestaurants.push({
              name: act.name,
              cuisine: 'Local Cuisine',
              neighborhood: act.location.address || 'Central District',
              type: 'Casual',
              priceRange: '$$',
              rating: 4.4,
              mustOrder: 'Chef recommended specialty',
              localFavorite: true,
              verified: act.verified,
              osmId: act.osmId,
              location: act.location,
              mapUrl: act.mapUrl || buildMapUrl(act.location.lat, act.location.lng, act.name),
            });
          }
        });
      });

      if (topRestaurants.length === 0 && restaurants.length > 0) {
        const seed = restaurants[0];
        topRestaurants.push({
          name: seed.name,
          cuisine: seed.cuisine || 'Local Specialties',
          neighborhood: seed.address || 'City Center',
          type: 'Casual', priceRange: '$$', rating: 4.5, mustOrder: 'House Special',
          localFavorite: true, verified: true, osmId: seed.osmId,
          location: seed.location, mapUrl: seed.mapUrl,
        });
      }

      foodRecommendations = {
        destination,
        cuisineOverview: `Explore the culinary scene of ${destination}. Local restaurants offer authentic regional dishes.`,
        vegetarianFriendly: true, halalFriendly: false,
        drinkingWaterSafety: 'Prefer bottled or filtered water.',
        mustTryDishes: [{ name: 'Local Specialty', description: 'Ask locals for today\'s best dishes.', averagePriceUSD: 8, isVegetarian: true, isVegan: false, isHalal: true, isGlutenFree: false, spiceLevel: 'Medium', localTip: 'Try restaurants with high local foot traffic.' }],
        topRestaurants: topRestaurants.slice(0, 4),
        foodBudgetTips: ['Eat at crowded local spots.', 'Choose lunch specials for value.'],
      };
    }

    // 6. AI-Powered Safety Advisory via Gemini (emergency numbers stay deterministic for reliability)
    const emergencyInfo = getCountryEmergency(destination);
    let safetyInformation;
    try {
      const safetyPrompt = `You are a travel safety expert. Provide a comprehensive safety briefing for travelers visiting ${destination}.

Return JSON:
{
  "overallSafetyRating": number (1-10, where 10 is safest),
  "safetyTier": "Very Safe | Safe | Moderate | Caution Advised",
  "travelAdvisory": {
    "level": number (1-4),
    "message": "Specific advisory for ${destination}, max 2 sentences"
  },
  "safetyTips": {
    "general": ["tip1", "tip2"] (2 tips specific to ${destination}),
    "forWomen": ["tip1", "tip2"],
    "forSoloTravelers": ["tip1", "tip2"],
    "nightSafety": ["tip1", "tip2"]
  },
  "commonScams": [
    { "scam": "Specific scam name in ${destination}", "howToAvoid": "How to avoid it" }
  ] (2 scams),
  "healthInfo": {
    "waterSafety": "Water safety advice for ${destination}",
    "foodSafety": "Food safety advice",
    "recommendedVaccines": ["vaccine1"],
    "healthRisks": [],
    "nearestHospitalType": "Type of hospitals available",
    "medicalStandard": "Good | Adequate | Limited"
  },
  "culturalDos": ["do1", "do2"],
  "culturalDonts": ["dont1", "dont2"],
  "safeNeighborhoods": ["area1", "area2"],
  "areasToAvoid": ["area1"],
  "transportSafety": {
    "recommendedTransport": ["transport1", "transport2"],
    "avoidTransport": ["type1"],
    "taxiTips": "Specific taxi advice for ${destination}"
  }
}`;

      console.log(`[JourneyComboAgent] Generating safety advisory via Gemini for ${destination}...`);
      const geminiSafety = await askGeminiJSON(
        'You are the SmartTour Safety Advisory Agent. Provide REAL, accurate safety information. Never downplay genuine risks.',
        safetyPrompt
      );

      safetyInformation = {
        destination,
        overallSafetyRating: geminiSafety.overallSafetyRating || 7,
        safetyTier: geminiSafety.safetyTier || 'Safe',
        travelAdvisory: {
          ...(geminiSafety.travelAdvisory || {}),
          issuedBy: 'SmartTour AI Safety Advisory',
          lastUpdated: new Date().toISOString(),
        },
        emergencyNumbers: emergencyInfo.numbers, // Always use reliable DB
        safetyTips: geminiSafety.safetyTips || {},
        commonScams: geminiSafety.commonScams || [],
        healthInfo: geminiSafety.healthInfo || {},
        culturalDos: geminiSafety.culturalDos || [],
        culturalDonts: geminiSafety.culturalDonts || [],
        localLaws: geminiSafety.localLaws || ['Carry ID at all times.'],
        safeNeighborhoods: geminiSafety.safeNeighborhoods || [],
        areasToAvoid: geminiSafety.areasToAvoid || [],
        transportSafety: geminiSafety.transportSafety || {},
        weatherRisks: geminiSafety.weatherRisks || 'Check weather advisories before travel.',
        embassyInfo: geminiSafety.embassyInfo || { note: 'Locate your embassy before departure.' },
      };
    } catch (safetyErr) {
      console.warn('[JourneyComboAgent] Gemini safety generation failed, using deterministic fallback:', safetyErr.message);
      safetyInformation = {
        destination,
        overallSafetyRating: 7,
        safetyTier: 'Safe',
        travelAdvisory: {
          level: 1,
          message: `Normal safety precautions recommended in ${destination}. Stay alert in crowded areas.`,
          issuedBy: 'SmartTour Travel Advisory',
          lastUpdated: new Date().toISOString(),
        },
        emergencyNumbers: emergencyInfo.numbers,
        safetyTips: {
          general: ['Keep valuables secure in busy areas.', 'Stay aware of traffic.'],
          forWomen: ['Use official transport services.', 'Stay in well-lit areas.'],
          forSoloTravelers: ['Share your location with someone.', 'Avoid remote areas alone at night.'],
          nightSafety: ['Stay in central areas after dark.', 'Use licensed cabs.'],
        },
        commonScams: [
          { scam: 'Unofficial Guides', howToAvoid: 'Book via official tourism desks.' },
          { scam: 'Taxi Overcharging', howToAvoid: 'Use ride apps or agree fares beforehand.' },
        ],
        healthInfo: { waterSafety: 'Prefer bottled water.', foodSafety: 'Eat at high-footfall spots.', recommendedVaccines: ['Routine vaccines'], healthRisks: [], nearestHospitalType: 'General', medicalStandard: 'Good' },
        culturalDos: ['Dress modestly at religious sites.', 'Respect local customs.'],
        culturalDonts: ['Avoid photographing sensitive areas.', 'Do not litter.'],
        localLaws: ['Carry ID when traveling.'],
        safeNeighborhoods: ['Tourist Centers', 'Downtown'],
        areasToAvoid: ['Isolated areas after dark'],
        transportSafety: { recommendedTransport: ['Metro', 'Ride apps'], avoidTransport: ['Unmarked vehicles'], taxiTips: 'Use meter or app booking.' },
        weatherRisks: 'Check weather advisories.',
        embassyInfo: { note: 'Locate your embassy before departure.' },
      };
    }

    // 7. Extract locations array for the map plotting
    const locations = [];
    const locationMap = new Map();
    itinerary.days.forEach(day => {
      day.activities.forEach(act => {
        if (act.location && !locationMap.has(act.location.name)) {
          locationMap.set(act.location.name, true);
          locations.push({
            name: act.location.name,
            address: act.location.address || '',
            lat: act.location.lat,
            lng: act.location.lng,
            day: day.day,
            category: act.category,
            osmId: act.osmId,
            verified: act.verified,
            mapUrl: act.mapUrl,
          });
        }
      });
    });

    const verifiedSources = {
      center,
      attractions,
      restaurants,
      hotels,
    };

    return {
      destination,
      duration,
      itinerary,
      food: foodRecommendations,
      safety: safetyInformation,
      locations,
      verifiedSources,
    };
  }
}
