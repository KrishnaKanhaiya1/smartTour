// lib/services/agents/foodRecommendationAgent.js
// Gemini-powered Food Recommendation Agent

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are the Food Recommendation Agent for SmartTour.
You are a world-class culinary expert with deep knowledge of local cuisines worldwide.
Recommend real, specific dishes and restaurants for any destination.
Always return valid JSON. Include practical info like prices, dietary labels, and local tips.`;

export class FoodRecommendationAgent {
  // Main entry point — used by /api/agent/food
  async findFood(destination, options = {}) {
    const prompt = `Recommend the best local food and restaurants in ${destination}.

Budget: ${options.budget || 'moderate'}, Dietary: ${(options.dietaryRestrictions || []).join(', ') || 'none'}

Return JSON:
{
  "destination": "${destination}",
  "cuisineOverview": string (1-2 sentences),
  "vegetarianFriendly": boolean, "halalFriendly": boolean,
  "drinkingWaterSafety": string (Safe to drink/Bottled only/Boil first),
  "mustTryDishes": [{ "name": string, "description": string (1 sentence), "averagePriceUSD": number, "isVegetarian": boolean, "isVegan": boolean, "isHalal": boolean, "isGlutenFree": boolean, "spiceLevel": string (Mild/Medium/Spicy/Very Spicy), "localTip": string }] (5 dishes),
  "topRestaurants": [{ "name": string, "cuisine": string, "neighborhood": string, "type": string (Fine Dining/Casual/Street Food/Café/Local Eatery), "priceRange": string, "rating": number (4-5), "mustOrder": string, "localFavorite": boolean }] (4 restaurants),
  "foodBudgetTips": string[] (3 tips)
}`;

    try {
      return await askGeminiJSON(SYSTEM_PROMPT, prompt);
    } catch (error) {
      console.error('Food Agent Error:', error);
      // Graceful fallback when rate limits hit
      return {
        destination,
        cuisineOverview: `The food scene here is incredible, though AI recommendations are temporarily unavailable due to high traffic. Enjoy the local cuisine!`,
        vegetarianFriendly: (options.dietaryRestrictions || []).includes('vegetarian'),
        halalFriendly: (options.dietaryRestrictions || []).includes('halal'),
        drinkingWaterSafety: "Check local guidelines",
        mustTryDishes: [
          {
            name: "Local Signature Dish",
            description: "A traditional favorite in this region. (Fallback Data)",
            isVegetarian: false, isVegan: false, isHalal: false, isGlutenFree: false,
            spiceLevel: "Medium", averagePriceUSD: 10, localTip: "Always check for fresh ingredients!"
          }
        ],
        topRestaurants: [
          {
            name: "The Famous Local Spot",
            type: "Casual", neighborhood: "City Center", cuisine: "Local",
            rating: 4.5, priceRange: "$$", mustOrder: "The House Special", localFavorite: true
          }
        ],
        foodBudgetTips: [
          "Eat where the locals eat for the best prices.",
          "Street food is usually cheaper and authentic.",
          "(AI tips temporarily unavailable)"
        ]
      };
    }
  }

  // Legacy methods for orchestrator compatibility
  async recommendPlaces(userProfile, context) {
    const destination = context?.destination || userProfile?.destination || 'India';
    return this.findFood(destination, {
      budget: userProfile?.budget?.tier || 'moderate',
      dietaryRestrictions: userProfile?.dietaryRestrictions || [],
      travelStyle: userProfile?.travelStyle || 'balanced',
    });
  }

  async quickFoodSearch(location) {
    const dest = typeof location === 'string' ? location : 'nearby area';
    return this.findFood(dest, { budget: 'moderate' });
  }
}
