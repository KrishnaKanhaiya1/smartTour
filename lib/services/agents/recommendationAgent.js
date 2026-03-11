// lib/services/agents/recommendationAgent.js
// Real Gemini-powered Attraction Recommendation Agent

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are the Attraction Recommendation Agent for SmartTour.
You are an expert on tourist attractions, hidden gems, museums, parks, and experiences worldwide.
Recommend real, specific attractions for any destination.
Always return valid JSON. Include practical info like opening hours, costs, and tips.`;

export class RecommendationAgent {
    async findAttractions(destination, userProfile = {}) {
        const prompt = `Recommend 6 top tourist attractions in ${destination}.
Interests: ${(userProfile.interests || ['sightseeing']).join(', ')}. Budget: ${userProfile.budget?.tier || 'moderate'}.

Return JSON:
{
  "destination": string, "totalAttractions": number,
  "highlights": string (1-2 sentences),
  "attractions": [{ "id": string, "name": string, "category": string (museum/temple/nature/viewpoint/market/palace/park/beach/historical/entertainment/art/adventure), "description": string (1 sentence), "address": string, "openingHours": string, "entryFeeUSD": number, "timeNeeded": string, "rating": number (4-5), "totalReviews": number, "bestTime": string, "tips": string, "mustSee": boolean, "familyFriendly": boolean }],
  "hiddenGems": [{ "name": string, "description": string, "why": string }] (2-3 items),
  "bestNeighborhoods": [{ "name": string, "vibe": string, "bestFor": string }] (2-3 items),
  "dayTrips": string[] (2-3 nearby)
}`;

        try {
            return await askGeminiJSON(SYSTEM_PROMPT, prompt);
        } catch (error) {
            console.error('RecommendationAgent Error:', error);
            // Graceful fallback
            return {
                destination,
                totalAttractions: 2,
                highlights: "AI generation is temporarily paused due to rate limits. Here are some universally loved concepts.",
                attractions: [
                    {
                        id: "attr_fallback_1", name: "City Center Explorer", category: "historical",
                        description: "A great placeholder while our AI catches its breath.",
                        address: "Downtown", openingHours: "24/7", entryFeeUSD: 0, timeNeeded: "2-3 hours",
                        rating: 4.5, totalReviews: 1000, bestTime: "Morning", tips: "Wear comfortable shoes",
                        mustSee: true, familyFriendly: true, accessibility: "fully accessible", nearbyAttractions: [], imageKeyword: "city center"
                    }
                ],
                hiddenGems: [{ name: "Local Cafe", description: "Every city has one", why: "Great coffee" }],
                bestNeighborhoods: [{ name: "Downtown", vibe: "Bustling", bestFor: "First timers" }],
                dayTrips: ["Nearby Nature Reserve"]
            };
        }
    }

    async getAttractionDetails(attractionName, destination) {
        const prompt = `Give detailed information about "${attractionName}" in ${destination}.
    Return JSON: {
      "name": string, "description": string (5 sentences), "history": string (2 sentences),
      "practicalInfo": { "address": string, "openingHours": string, "entryFee": string, "website": string, "phone": string },
      "tips": string[], "nearbyFood": string[], "photoSpots": string[]
    }`;
        try {
            return await askGeminiJSON(SYSTEM_PROMPT, prompt);
        } catch (error) {
            console.error('Attraction Details Error:', error);
            throw error;
        }
    }
}
