// lib/services/agents/recommendationAgent.js
// Deterministic Recommendation Agent - Bypasses Gemini to avoid rate limits,
// returning real OSM attractions and custom destination highlights.

import { OpenStreetMapService } from '@/lib/services/openstreetmap';
import { getDestinationKnowledge } from '@/lib/services/travelKnowledgeBase.mjs';
import { askGeminiJSON } from '@/lib/gemini';

export class RecommendationAgent {
  async findAttractions(destination, userProfile = {}) {
    // 1. Check local knowledge base first
    const localKB = getDestinationKnowledge(destination);
    if (localKB && localKB.attractions) {
      console.log(`[RecommendationAgent] KB Match for destination: ${destination}`);
      return {
        destination,
        totalAttractions: localKB.attractions.length,
        highlights: `Discover ${destination} highlights including iconic landmarks, cultural heritage, and local experiences.`,
        attractions: localKB.attractions,
        hiddenGems: localKB.hiddenGems || [
          { name: 'Heritage Lane & Courtyards', description: 'Quiet historic streets far from mainstream crowds.', why: 'Authentic local atmosphere' }
        ],
        bestNeighborhoods: localKB.bestNeighborhoods || [
          { name: 'Old Town Quarter', vibe: 'Historic', bestFor: 'Heritage walking & street food' }
        ],
        dayTrips: localKB.dayTrips || [`Regional Scenic Excursion`]
      };
    }

    // 2. Resolve destination coordinates via OSM search
    let center = { lat: 20.5937, lng: 78.9629 };
    let attractions = [];

    try {
      const searchResults = await OpenStreetMapService.searchPlaces(destination);
      if (searchResults && searchResults.length > 0) {
        center = searchResults[0].location;
        attractions = await OpenStreetMapService.getNearbyAttractions(center.lat, center.lng, 5000);
      }
    } catch (e) {
      console.warn('[RecommendationAgent] OSM attractions query failed:', e.message);
    }

    // 3. If OSM returns no attractions, query Gemini for authentic landmarks
    if (attractions.length === 0) {
      try {
        console.log(`[RecommendationAgent] Fetching Gemini attractions for ${destination}...`);
        const geminiResult = await askGeminiJSON(
          `You are the SmartTour Attractions Discovery Agent. Provide 4 real, famous, well-known attractions, 2 hidden gems, and 2 popular neighborhoods for ${destination}. Return JSON ONLY. Do NOT invent fictional places.`,
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

        if (geminiResult && Array.isArray(geminiResult.attractions) && geminiResult.attractions.length > 0) {
          const formattedGeminiAttractions = geminiResult.attractions.map((item, idx) => ({
            id: `ai-attraction-${idx}`,
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
            verified: false,
            location: center,
            mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + destination)}`
          }));

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
      } catch (geminiErr) {
        console.warn('[RecommendationAgent] Gemini attractions query failed, falling back:', geminiErr.message);
      }
    }

    // 4. Fallback formatting if OSM/Gemini yield zero results
    const formattedAttractions = (attractions.length > 0 ? attractions : [
      { name: `${destination} Central Heritage Walk`, location: center, address: destination, category: 'historical', description: `Historic walking route showcasing landmark points of interest in ${destination}.` }
    ]).slice(0, 6).map((item, idx) => ({
      id: item.osmId || `attraction-${idx}`,
      name: item.name,
      category: item.category || 'historical',
      description: item.description || `Explore ${item.name}, a popular sightseeing spot in ${destination}.`,
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
      verified: !!item.id,
      location: item.location,
      mapUrl: item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${item.location?.lat},${item.location?.lng}`
    }));

    return {
      destination,
      totalAttractions: formattedAttractions.length,
      highlights: `Explore historical monuments, natural landmarks, and cultural spots in ${destination}.`,
      attractions: formattedAttractions,
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
    return {
      name: attractionName,
      description: `Visit "${attractionName}" in ${destination}, a highly rated point of interest offering visitors deep insights into regional culture and community architecture.`,
      history: `Constructed during previous centuries, this location serves as a symbolic historical landmark for local residents and national history.`,
      practicalInfo: {
        address: `${attractionName}, ${destination}`,
        openingHours: '9:30 AM - 5:30 PM (Daily)',
        entryFee: 'Varies by season (often free or nominal fee)',
        website: `https://www.tourism.${destination.toLowerCase().replace(/\s+/g, '')}.gov`,
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
