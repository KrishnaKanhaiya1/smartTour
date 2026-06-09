// lib/services/agents/recommendationAgent.js
// Real Gemini-powered Attraction Recommendation Agent

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `Tourist attraction expert. Recommend real, specific attractions with practical info.`;

export class RecommendationAgent {
    async findAttractions(destination, userProfile = {}) {
        const prompt = `6 top attractions in ${destination}. Interests:${(userProfile.interests || ['sightseeing']).join(', ')}. Budget:${userProfile.budget?.tier || 'moderate'}.

JSON: {"destination":str,"totalAttractions":num,"highlights":str,"attractions":[{"id":str,"name":str,"category":str(museum/temple/nature/viewpoint/market/palace/park/beach/historical/entertainment/art/adventure),"description":str,"address":str,"openingHours":str,"entryFeeUSD":num,"timeNeeded":str,"rating":4-5,"totalReviews":num,"bestTime":str,"tips":str,"mustSee":bool,"familyFriendly":bool}](6),"hiddenGems":[{"name":str,"description":str,"why":str}](2-3),"bestNeighborhoods":[{"name":str,"vibe":str,"bestFor":str}](2-3),"dayTrips":str[](2-3)}`;

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
        const prompt = `Details for "${attractionName}" in ${destination}. JSON: {"name":str,"description":str(5 sentences),"history":str(2 sentences),"practicalInfo":{"address":str,"openingHours":str,"entryFee":str,"website":str,"phone":str},"tips":str[],"nearbyFood":str[],"photoSpots":str[]}`;
        try {
            return await askGeminiJSON(SYSTEM_PROMPT, prompt);
        } catch (error) {
            console.error('Attraction Details Error:', error);
            throw error;
        }
    }
}
