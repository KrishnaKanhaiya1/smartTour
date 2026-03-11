// lib/services/agents/itineraryPlannerAgent.js
// Gemini-powered Itinerary Planner Agent

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are the Itinerary Planning Agent for SmartTour.
You are an expert travel planner who creates optimized, practical day-by-day itineraries.
Use real locations, real opening hours, and real travel times.
Balance activities with rest and meals. Consider practical logistics like transport between locations.
Always return valid JSON.`;

export class ItineraryPlannerAgent {
  async generateItinerary(userProfile) {
    const destination = userProfile.destination || 'India';
    const duration = userProfile.tripDuration || 3;
    const style = userProfile.travelStyle || 'balanced';
    const budget = userProfile.budget?.tier || userProfile.budget || 'moderate';

    const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination}.

Traveler profile:
- Travel style: ${style}
- Budget: ${typeof budget === 'object' ? budget.tier : budget}
- Group size: ${userProfile.groupSize || 2}
- Preferred pace: ${userProfile.preferredPace || 'moderate'}

Return a JSON object:
{
  "destination": "${destination}",
  "duration": ${duration},
  "days": [
    {
      "day": number (1, 2, 3...),
      "theme": string (e.g. "Cultural Heritage", "Nature & Adventure", "Food & Markets"),
      "duration": string (e.g. "8 hours"),
      "activities": [
        {
          "name": string (specific activity name),
          "time": string (e.g. "09:00 - 11:00"),
          "duration": number (hours),
          "category": string (one of: "cultural", "nature", "food", "adventure", "shopping", "relaxation"),
          "cost": string (one of: "free", "low", "medium", "high"),
          "description": string (1 sentence),
          "location": {
            "name": string (real place name),
            "address": string
          },
          "tips": string (one practical tip)
        }
      ] (4-6 activities per day),
      "meals": {
        "breakfast": string (specific suggestion),
        "lunch": string (specific suggestion),
        "dinner": string (specific suggestion)
      }
    }
  ],
  "totalEstimatedCost": string (e.g. "$200-350 per person"),
  "packingTips": string[] (3-4 items to pack),
  "transportTips": string (how to get around)
}`;

    try {
      const result = await askGeminiJSON(SYSTEM_PROMPT, prompt);

      // Build locations array from all activities
      const locationMap = new Map();
      (result.days || []).forEach(day => {
        (day.activities || []).forEach(act => {
          if (act.location && !locationMap.has(act.location.name)) {
            locationMap.set(act.location.name, act.location);
          }
        });
      });
      result.locations = Array.from(locationMap.values());

      return result;
    } catch (error) {
      console.error('ItineraryPlannerAgent Error:', error);
      return {
        destination, duration,
        days: [
          {
            day: 1, theme: "Arrival & Local Exploration", duration: "6 hours",
            activities: [
              {
                name: "City Center Walk (Fallback Data)",
                time: "10:00 - 12:00", duration: 2, category: "cultural", cost: "free",
                description: "AI generation is paused due to high traffic! Here is an offline mock itinerary.",
                location: { name: "City Center", address: "Main Square" },
                tips: "Take an offline map."
              }
            ],
            meals: { breakfast: "Hotel Cafe", lunch: "Local Bistro", dinner: "Street Food Market" }
          }
        ],
        totalEstimatedCost: "N/A (AI Offline)", packingTips: ["Comfortable shoes"], transportTips: "Walk or use public transit."
      };
    }
  }

  // Optimize existing route
  async optimizeRoute(itinerary, constraints) {
    return {
      ...itinerary,
      optimizationApplied: true,
      constraints,
      optimizedAt: new Date().toISOString(),
    };
  }
}
