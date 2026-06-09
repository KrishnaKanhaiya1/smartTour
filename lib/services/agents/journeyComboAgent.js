// lib/services/agents/journeyComboAgent.js
// Combined Journey Agent - generates itinerary, food, AND safety in ONE Gemini call
// Reduces API calls from 3 to 1 per journey request

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `Travel planning agent. Return unified itinerary + food + safety JSON for any destination.`;

export class JourneyComboAgent {
  async generateCompleteJourney(userProfile) {
    const destination = userProfile.destination || 'India';
    const duration = userProfile.tripDuration || 3;
    const style = userProfile.travelStyle || 'balanced';
    const budget = typeof userProfile.budget === 'object' 
      ? userProfile.budget.tier 
      : userProfile.budget || 'moderate';

    const prompt = `${duration}-day plan for ${destination}. Style:${style}, Budget:${budget}, Group:${userProfile.groupSize || 1}, Pace:${userProfile.preferredPace || 'moderate'}, Interests:${Object.keys(userProfile.interests || {}).join(', ') || 'general'}, Dietary:${(userProfile.dietaryRestrictions || []).join(', ') || 'none'}

JSON: {"destination":"${destination}","duration":${duration},"itinerary":{"days":[{"day":int,"theme":str,"duration":str,"activities":[{"name":str,"time":str,"duration":int,"category":str,"cost":str,"description":str,"location":{"name":str,"address":str},"tips":str}](4-6),"meals":{"breakfast":str,"lunch":str,"dinner":str}}](${duration}),"totalEstimatedCost":str,"packingTips":str[](3-4),"transportTips":str},"food":{"destination":"${destination}","cuisineOverview":str,"vegetarianFriendly":bool,"halalFriendly":bool,"drinkingWaterSafety":str,"mustTryDishes":[{"name":str,"description":str,"averagePriceUSD":num,"isVegetarian":bool,"isVegan":bool,"isHalal":bool,"isGlutenFree":bool,"spiceLevel":str,"localTip":str}](5),"topRestaurants":[{"name":str,"cuisine":str,"neighborhood":str,"type":str,"priceRange":str,"rating":num,"mustOrder":str,"localFavorite":bool}](4),"foodBudgetTips":str[](3)},"safety":{"destination":"${destination}","overallSafetyRating":1-10,"safetyTier":str,"travelAdvisory":{"level":1-4,"message":str,"issuedBy":str,"lastUpdated":str},"emergencyNumbers":[{"service":str,"number":str,"available":str,"notes":str}](3-4),"safetyTips":{"general":str[](3),"forWomen":str[](2),"forSoloTravelers":str[](2),"nightSafety":str[](2)},"commonScams":[{"scam":str,"howToAvoid":str}](2-3),"healthInfo":{"waterSafety":str,"foodSafety":str,"recommendedVaccines":str[],"healthRisks":str[],"nearestHospitalType":str,"medicalStandard":str},"culturalDos":str[](3),"culturalDonts":str[](3),"localLaws":str[](2),"safeNeighborhoods":str[](2),"areasToAvoid":str[](2),"transportSafety":{"recommendedTransport":str[],"avoidTransport":str[],"taxiTips":str},"weatherRisks":str,"embassyInfo":{"note":str}}}`;

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
