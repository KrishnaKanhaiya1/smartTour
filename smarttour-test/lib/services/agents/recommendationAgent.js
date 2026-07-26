// lib/services/agents/recommendationAgent.js
// Deterministic Recommendation Agent - Bypasses Gemini to avoid rate limits,
// returning real OSM attractions and custom destination highlights.

import { OpenStreetMapService } from '@/lib/services/openstreetmap';
import { getDestinationKnowledge } from '@/lib/services/travelKnowledgeBase.mjs';
import { askGeminiJSON } from '@/lib/gemini';

export class RecommendationAgent {
  async findAttractions(destination, userProfile = {}) {
    // 1. Fetch supplementary KB context to use in Gemini prompt (NOT as a bypass)
    const localKB = getDestinationKnowledge(destination);
    let kbContext = "";
    if (localKB && localKB.attractions) {
      kbContext = `Additional context: Known attractions include ${localKB.attractions.map(a => a.name).join(', ')}. `;
    }

    // 2. PRIMARY DATA SOURCE: Call Gemini
    let geminiResult = null;
    try {
      console.log(`[RecommendationAgent] Fetching Gemini attractions for ${destination}...`);
      geminiResult = await askGeminiJSON(
        `You are the SmartTour Attractions Discovery Agent. Provide 4 real, famous, well-known attractions, 2 hidden gems, and 2 popular neighborhoods for ${destination}. Return JSON ONLY. Do NOT invent fictional places. ${kbContext}`,
        `Destination: ${destination}.
JSON Schema:
{
  "highlights": "Concise 1-sentence overview of ${destination}",
  "attractions": [
    {
      "name": "Exact real landmark name",
      "category": "historical | nature | cultural | architectural",
      "description": "Short description max 15 words",
      "address": "Neighborhood/Area in ${destination}",
      "openingHours": "e.g. 9:00 AM - 5:00 PM",
      "entryFeeUSD": 0,
      "timeNeeded": "2 hours",
      "rating": 4.7,
      "bestTime": "Morning",
      "tips": "Practical visitor tip"
    }
  ],
  "hiddenGems": [
    { "name": "Real hidden gem name", "description": "Short description", "why": "Why visit" }
  ],
  "bestNeighborhoods": [
    { "name": "Real area/district name", "vibe": "Colonial / Vibrant / Historic", "bestFor": "Walking & Dining" }
  ],
  "dayTrips": [ "Real nearby day trip destination" ]
}`
      );
    } catch (geminiErr) {
      console.error('[RecommendationAgent] Gemini attractions query failed:', geminiErr.message);
    }

    // 3. ENRICH with OSM data
    let center = { lat: 20.5937, lng: 78.9629 };
    let osmAttractions = [];
    try {
      const searchResults = await OpenStreetMapService.searchPlaces(destination);
      if (searchResults && searchResults.length > 0) {
        center = searchResults[0].location;
        osmAttractions = await OpenStreetMapService.getNearbyAttractions(center.lat, center.lng, 5000);
      }
    } catch (e) {
      console.warn('[RecommendationAgent] OSM attractions query failed:', e.message);
    }

    if (geminiResult && Array.isArray(geminiResult.attractions) && geminiResult.attractions.length > 0) {
      const formattedGeminiAttractions = geminiResult.attractions.map((item, idx) => {
        // Try to enrich with OSM data by name matching
        const osmMatch = osmAttractions.find(osm => osm.name && osm.name.toLowerCase().includes(item.name.toLowerCase()));
        
        return {
          id: osmMatch ? osmMatch.osmId : `ai-attraction-${idx}`,
          name: item.name,
          category: item.category || 'historical',
          description: item.description,
          address: item.address || destination,
          openingHours: item.openingHours || '9:00 AM - 6:00 PM',
          entryFeeUSD: item.entryFeeUSD || 0,
          timeNeeded: item.timeNeeded || '2 hours',
          rating: item.rating || 4.6,
          totalReviews: 1200,
          bestTime: item.bestTime || 'Morning',
          tips: item.tips || 'Bring comfortable walking shoes and camera.',
          mustSee: idx === 0,
          familyFriendly: true,
          verified: !!osmMatch,
          location: osmMatch ? osmMatch.location : center,
          mapUrl: osmMatch?.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + destination)}`
        };
      });

      return {
        destination,
        totalAttractions: formattedGeminiAttractions.length,
        highlights: geminiResult.highlights || `Explore top landmarks, heritage sites, and local culture in ${destination}.`,
        attractions: formattedGeminiAttractions,
        hiddenGems: geminiResult.hiddenGems || [],
        bestNeighborhoods: geminiResult.bestNeighborhoods || [],
        dayTrips: geminiResult.dayTrips || []
      };
    }

    // 4. FALLBACK ONLY (AI Unavailable)
    console.warn('[RecommendationAgent] Using hardcoded fallback (AI Unavailable)');
    const fallbackAttractions = [
      { name: `${destination} Central Heritage Walk (AI Unavailable Fallback)`, location: center, address: destination, category: 'historical', description: `Historic walking route showcasing landmark points of interest in ${destination}.` }
    ].map((item, idx) => ({
      id: `fallback-attraction-${idx}`,
      name: item.name,
      category: item.category || 'historical',
      description: item.description,
      address: item.address || destination,
      openingHours: item.openingHours || '9:00 AM - 6:00 PM',
      entryFeeUSD: 0,
      timeNeeded: '2 hours',
      rating: 4.5,
      totalReviews: 240,
      bestTime: 'Morning',
      tips: 'Bring comfortable walking shoes and camera.',
      mustSee: idx === 0,
      familyFriendly: true,
      verified: false,
      location: item.location,
      mapUrl: item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${item.location?.lat},${item.location?.lng}`
    }));

    return {
      destination,
      totalAttractions: fallbackAttractions.length,
      highlights: `Explore historical monuments, natural landmarks, and cultural spots in ${destination}. (AI Unavailable)`,
      attractions: fallbackAttractions,
      hiddenGems: [
        { name: 'Heritage Quarter Courtyards', description: 'Peaceful historic streetways with local artisan stalls.', why: 'Authentic local culture away from tourist crowds.' }
      ],
      bestNeighborhoods: [
        { name: 'Historic District', vibe: 'Colonial & Cultural', bestFor: 'Heritage walks & street food' },
        { name: 'Central Commercial Area', vibe: 'Active & Vibrant', bestFor: 'Shopping & local markets' }
      ],
      dayTrips: [`Scenic Regional Excursion`]
    };
  }

  async getAttractionDetails(attractionName, destination) {
    try {
      console.log(`[RecommendationAgent] Fetching Gemini attraction details for ${attractionName} in ${destination}...`);
      const result = await askGeminiJSON(
        `You are a travel expert. Provide detailed visitor information for ${attractionName} in ${destination}. Return JSON ONLY.`,
        `Attraction: ${attractionName} in ${destination}
JSON Schema:
{
  "name": "${attractionName}",
  "description": "2-3 sentences describing the attraction",
  "history": "Brief historical significance",
  "practicalInfo": {
    "address": "Full address or location",
    "openingHours": "Specific opening hours",
    "entryFee": "Current entry fee information",
    "website": "Official or related website URL",
    "phone": "Contact number if any"
  },
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "nearbyFood": ["Restaurant 1", "Cafe 2"],
  "photoSpots": ["Spot 1", "Spot 2"]
}`
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.warn('[RecommendationAgent] Gemini attraction details failed:', e.message);
    }
    
    // AI Unavailable Fallback
    console.warn('[RecommendationAgent] Using hardcoded fallback details (AI Unavailable)');
    return {
      name: `${attractionName} (AI Unavailable)`,
      description: `Visit "${attractionName}" in ${destination}, a highly rated point of interest offering visitors deep insights into regional culture and community architecture.`,
      history: `Constructed during previous centuries, this location serves as a symbolic historical landmark for local residents and national history.`,
      practicalInfo: {
        address: `${attractionName}, ${destination}`,
        openingHours: '9:30 AM - 5:30 PM (Daily)',
        entryFee: 'Varies by season (often free or nominal fee)',
        website: `https://www.tourism.${destination.toLowerCase().replace(/\\s+/g, '')}.gov`,
        phone: 'Not available'
      },
      tips: [
        'Arrive at opening time to beat peak tourist crowds.',
        'Carry a light water bottle for walks.',
        'Respect guidelines on photography inside.'
      ],
      nearbyFood: ['Heritage Café', 'Traditional Corner Diner'],
      photoSpots: ['Main Entrance Archway', 'West Ridge Balcony View']
    };
  }
}
