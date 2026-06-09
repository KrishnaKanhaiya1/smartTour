// lib/services/agents/journeyComboAgent.js
// Combined Journey Agent - generates itinerary, food, AND safety in ONE Gemini call
// Reduces API calls from 3 to 1 per journey request

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are the Complete Journey Planning Agent for SmartTour.
You generate comprehensive travel plans including: day-by-day itinerary, food recommendations, and safety information all in one unified response.
Always return valid JSON with all three components.`;

export class JourneyComboAgent {
  async generateCompleteJourney(userProfile) {
    const destination = userProfile.destination || 'India';
    const duration = userProfile.tripDuration || 3;
    const style = userProfile.travelStyle || 'balanced';
    const budget = typeof userProfile.budget === 'object' 
      ? userProfile.budget.tier 
      : userProfile.budget || 'moderate';

    const prompt = `Generate a complete ${duration}-day travel plan for ${destination} with itinerary, food, and safety info.

Traveler Profile:
- Travel Style: ${style}
- Budget: ${budget}
- Group Size: ${userProfile.groupSize || 1}
- Pace: ${userProfile.preferredPace || 'moderate'}
- Interests: ${Object.keys(userProfile.interests || {}).join(', ') || 'general'}
- Dietary Restrictions: ${(userProfile.dietaryRestrictions || []).join(', ') || 'none'}

Return this JSON structure (EXACTLY):
{
  "destination": "${destination}",
  "duration": ${duration},
  "itinerary": {
    "days": [
      {
        "day": number,
        "theme": string,
        "duration": string,
        "activities": [
          {
            "name": string,
            "time": string,
            "duration": number,
            "category": string,
            "cost": string,
            "description": string,
            "location": { "name": string, "address": string },
            "tips": string
          }
        ] (4-6 activities),
        "meals": { "breakfast": string, "lunch": string, "dinner": string }
      }
    ] (${duration} days),
    "totalEstimatedCost": string,
    "packingTips": string[] (3-4),
    "transportTips": string
  },
  "food": {
    "destination": "${destination}",
    "cuisineOverview": string,
    "vegetarianFriendly": boolean,
    "halalFriendly": boolean,
    "drinkingWaterSafety": string,
    "mustTryDishes": [
      {
        "name": string,
        "description": string,
        "averagePriceUSD": number,
        "isVegetarian": boolean,
        "isVegan": boolean,
        "isHalal": boolean,
        "isGlutenFree": boolean,
        "spiceLevel": string,
        "localTip": string
      }
    ] (5 dishes),
    "topRestaurants": [
      {
        "name": string,
        "cuisine": string,
        "neighborhood": string,
        "type": string,
        "priceRange": string,
        "rating": number,
        "mustOrder": string,
        "localFavorite": boolean
      }
    ] (4 restaurants),
    "foodBudgetTips": string[] (3 tips)
  },
  "safety": {
    "destination": "${destination}",
    "overallSafetyRating": number (1-10),
    "safetyTier": string,
    "travelAdvisory": { "level": number, "message": string, "issuedBy": string, "lastUpdated": string },
    "emergencyNumbers": [{ "service": string, "number": string, "available": string, "notes": string }] (3-4),
    "safetyTips": {
      "general": string[] (3),
      "forWomen": string[] (2),
      "forSoloTravelers": string[] (2),
      "nightSafety": string[] (2)
    },
    "commonScams": [{ "scam": string, "howToAvoid": string }] (2-3),
    "healthInfo": {
      "waterSafety": string,
      "foodSafety": string,
      "recommendedVaccines": string[],
      "healthRisks": string[],
      "nearestHospitalType": string,
      "medicalStandard": string
    },
    "culturalDos": string[] (3),
    "culturalDonts": string[] (3),
    "localLaws": string[] (2),
    "safeNeighborhoods": string[] (2),
    "areasToAvoid": string[] (2),
    "transportSafety": {
      "recommendedTransport": string[],
      "avoidTransport": string[],
      "taxiTips": string
    },
    "weatherRisks": string,
    "embassyInfo": { "note": string }
  }
}`;

    try {
      const result = await askGeminiJSON(SYSTEM_PROMPT, prompt);

      // Build locations array from all activities
      const locationMap = new Map();
      (result.itinerary?.days || []).forEach(day => {
        (day.activities || []).forEach(act => {
          if (act.location && !locationMap.has(act.location.name)) {
            locationMap.set(act.location.name, act.location);
          }
        });
      });
      result.locations = Array.from(locationMap.values());

      return result;
    } catch (error) {
      console.error('JourneyComboAgent Error:', error);
      // Graceful fallback
      return {
        destination,
        duration,
        itinerary: {
          days: [
            {
              day: 1,
              theme: "Arrival & Exploration",
              duration: "6 hours",
              activities: [
                {
                  name: "City Center Walk",
                  time: "10:00 - 12:00",
                  duration: 2,
                  category: "cultural",
                  cost: "free",
                  description: "AI generation temporarily paused due to high traffic.",
                  location: { name: "City Center", address: "Main Square" },
                  tips: "Use offline maps"
                }
              ],
              meals: { breakfast: "Hotel", lunch: "Local Bistro", dinner: "Street Food" }
            }
          ],
          totalEstimatedCost: "N/A",
          packingTips: ["Comfortable shoes"],
          transportTips: "Use public transit"
        },
        food: {
          destination,
          cuisineOverview: "Local cuisine is excellent (AI offline)",
          vegetarianFriendly: true,
          halalFriendly: true,
          drinkingWaterSafety: "Check locally",
          mustTryDishes: [
            {
              name: "Local Specialty",
              description: "Traditional dish (fallback)",
              averagePriceUSD: 10,
              isVegetarian: false,
              isVegan: false,
              isHalal: false,
              isGlutenFree: false,
              spiceLevel: "Medium",
              localTip: "Ask locals for recommendations"
            }
          ],
          topRestaurants: [
            {
              name: "Local Favorite",
              cuisine: "Local",
              neighborhood: "City Center",
              type: "Casual",
              priceRange: "$$",
              rating: 4.5,
              mustOrder: "House Special",
              localFavorite: true
            }
          ],
          foodBudgetTips: ["Eat where locals eat", "Street food is authentic and cheap"]
        },
        safety: {
          destination,
          overallSafetyRating: 7,
          safetyTier: "Safe",
          travelAdvisory: {
            level: 1,
            message: "Exercise normal precautions",
            issuedBy: "System Fallback",
            lastUpdated: new Date().toISOString()
          },
          emergencyNumbers: [
            { service: "General", number: "112", available: "24/7", notes: "" }
          ],
          safetyTips: {
            general: ["Keep copies of passport", "Be aware of surroundings"],
            forWomen: ["Avoid walking alone late at night"],
            forSoloTravelers: ["Share itinerary with someone"],
            nightSafety: ["Stick to well-lit areas"]
          },
          commonScams: [
            { scam: "Overcharging", howToAvoid: "Agree on price beforehand" }
          ],
          healthInfo: {
            waterSafety: "Check locally",
            foodSafety: "Eat at busy places",
            recommendedVaccines: ["Check locally"],
            healthRisks: [],
            nearestHospitalType: "Public",
            medicalStandard: "Good"
          },
          culturalDos: ["Be respectful"],
          culturalDonts: ["Don't photograph without permission"],
          localLaws: ["Carry ID"],
          safeNeighborhoods: ["City Center"],
          areasToAvoid: ["Unknown areas"],
          transportSafety: {
            recommendedTransport: ["Public transit"],
            avoidTransport: ["Unlicensed cabs"],
            taxiTips: "Use official ranks"
          },
          weatherRisks: "Check forecasts",
          embassyInfo: { note: "Know your embassy location" }
        }
      };
    }
  }
}
