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

    // 5. Deterministic Food Derivation
    const localDishes = localKB?.food?.mustTryDishes || [
      {
        name: 'Signature Local Culinary dish',
        description: 'Traditional regional cuisine highly rated by tourists.',
        averagePriceUSD: 8,
        isVegetarian: true,
        isVegan: false,
        isHalal: true,
        isGlutenFree: false,
        spiceLevel: 'Medium',
        localTip: 'Ask servers for daily local specials.',
      }
    ];

    // Extract restaurant venues directly from the generated itinerary activities
    const topRestaurants = [];
    const seenRestaurants = new Set();

    itinerary.days.forEach(day => {
      day.activities.forEach(act => {
        if (
          (act.category === 'food' || act.category === 'restaurant' || act.category === 'cafe' || act.name.toLowerCase().includes('restaurant') || act.name.toLowerCase().includes('cafe') || act.name.toLowerCase().includes('diner')) &&
          !seenRestaurants.has(act.name.toLowerCase())
        ) {
          seenRestaurants.add(act.name.toLowerCase());
          topRestaurants.push({
            name: act.name,
            cuisine: 'Local Cuisine',
            neighborhood: act.location.address || 'Central District',
            type: act.category === 'cafe' ? 'Café' : 'Casual',
            priceRange: act.cost.includes('Free') ? '$' : '$$',
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

    // Fallback if no restaurant was generated in the itinerary
    if (topRestaurants.length === 0) {
      const seedRest = restaurants[0] || localKB?.restaurants?.[0];
      topRestaurants.push({
        name: seedRest ? seedRest.name : 'Central Local Eatery',
        cuisine: seedRest?.cuisine || 'Local Specialties',
        neighborhood: seedRest?.address || 'City Center',
        type: 'Casual',
        priceRange: '$$',
        rating: 4.5,
        mustOrder: 'House Special',
        localFavorite: true,
        verified: !!seedRest,
        osmId: seedRest ? seedRest.osmId : 'ai/local-eatery',
        location: seedRest ? seedRest.location : center,
        mapUrl: seedRest ? seedRest.mapUrl : buildMapUrl(center.lat, center.lng, 'Central Local Eatery'),
      });
    }

    const foodRecommendations = {
      destination,
      cuisineOverview: localKB?.food?.cuisineOverview || `Explore the culinary scene of ${destination}. Local street food markets offer authentic local experiences, while traditional eateries provide classic dining options.`,
      vegetarianFriendly: userProfile.interests?.Vegetarian || userProfile.dietaryRestrictions?.includes('vegetarian') || true,
      halalFriendly: userProfile.dietaryRestrictions?.includes('halal') || false,
      drinkingWaterSafety: localKB?.food?.drinkingWaterSafety || 'Prefer bottled water or filtered water.',
      mustTryDishes: localDishes,
      topRestaurants: topRestaurants.slice(0, 4),
      foodBudgetTips: localKB?.food?.foodBudgetTips || [
        'Eat at crowded local spots for fresh street dishes.',
        'Choose lunch specials for premium meals at half price.',
      ],
    };

    // 6. Deterministic Safety Derivation
    const emergencyInfo = getCountryEmergency(destination);
    const safetyInformation = {
      destination,
      overallSafetyRating: localKB?.safety?.overallSafetyRating || 8,
      safetyTier: localKB?.safety?.safetyTier || 'Safe',
      travelAdvisory: localKB?.safety?.travelAdvisory || {
        level: 1,
        message: `Normal safety precautions recommended in ${destination}. Stay alert in crowded areas.`,
        issuedBy: 'SmartTour Travel Advisory',
        lastUpdated: new Date().toISOString(),
      },
      emergencyNumbers: localKB?.safety?.emergencyNumbers || emergencyInfo.numbers,
      safetyTips: localKB?.safety?.safetyTips || {
        general: ['Keep your wallet and phone secure in busy centers.', 'Stay aware of vehicle traffic when walking.'],
        forWomen: ['Use official pre-booked ride apps or transport stands.', 'Stick to busy and well-lit roads.'],
        forSoloTravelers: ['Share your daily coordinates with a relative.', 'Avoid remote areas alone at night.'],
        nightSafety: ['Stay in central neighborhoods after dark.', 'Use licensed cabs to travel at night.'],
      },
      commonScams: localKB?.safety?.commonScams || [
        { scam: 'Touts & Unofficial Guides', howToAvoid: 'Only book guides via official visitor kiosks or tourism desks.' },
        { scam: 'Taxi Overcharging', howToAvoid: 'Use ride apps or agree on rates with drivers before departing.' },
      ],
      healthInfo: localKB?.safety?.healthInfo || {
        waterSafety: 'Prefer bottled or sealed drinking water.',
        foodSafety: 'Choose dining spots that have high footfall.',
        recommendedVaccines: ['Routine vaccines'],
        healthRisks: [],
        nearestHospitalType: 'General Medical Center',
        medicalStandard: 'Good',
      },
      culturalDos: localKB?.safety?.culturalDos || ['Dress modestly when visiting local temples or churches.', 'Be respectful of local traditions.'],
      culturalDonts: localKB?.safety?.culturalDonts || ['Avoid photographing sensitive government or military installations.', 'Do not litter.'],
      localLaws: localKB?.safety?.localLaws || ['Carry copies of identification when moving around.'],
      safeNeighborhoods: localKB?.safety?.safeNeighborhoods || ['Tourist Centers', 'Downtown commercial strip'],
      areasToAvoid: localKB?.safety?.areasToAvoid || ['Dimly lit alleyways', 'Isolated suburbs after dark'],
      transportSafety: localKB?.safety?.transportSafety || {
        recommendedTransport: ['Public Transit / Metros', 'Registered Taxis', 'Ride-hailing Apps'],
        avoidTransport: ['Unmarked vehicles'],
        taxiTips: 'Use meter-based fares or mobile application booking.',
      },
      weatherRisks: localKB?.safety?.weatherRisks || 'Check general weather advisories before travel.',
      embassyInfo: localKB?.safety?.embassyInfo || { note: 'Locate your embassy location before departure.' },
    };

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
