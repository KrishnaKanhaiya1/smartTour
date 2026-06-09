// lib/services/agents/foodRecommendationAgent.js
// Gemini-powered Food Recommendation Agent

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `Culinary expert. Recommend real dishes and restaurants with prices, dietary labels, and tips.`;

// Destination-level cache for food recommendations
const destinationFoodCache = new Map();

export class FoodRecommendationAgent {
  // Main entry point — used by /api/agent/food
  async findFood(destination, options = {}) {
    // Check destination cache first (ignores dietary restrictions/budget for cache key)
    const cacheKey = destination.toLowerCase().trim();
    if (destinationFoodCache.has(cacheKey)) {
      console.log(`[FoodAgent] Cache HIT for destination: ${destination}`);
      return destinationFoodCache.get(cacheKey);
    }

    const prompt = `Best local food in ${destination}. Budget:${options.budget || 'moderate'}, Dietary:${(options.dietaryRestrictions || []).join(', ') || 'none'}

JSON: {"destination":"${destination}","cuisineOverview":str,"vegetarianFriendly":bool,"halalFriendly":bool,"drinkingWaterSafety":str(Safe/Bottled only/Boil first),"mustTryDishes":[{"name":str,"description":str,"averagePriceUSD":num,"isVegetarian":bool,"isVegan":bool,"isHalal":bool,"isGlutenFree":bool,"spiceLevel":str(Mild/Medium/Spicy/Very Spicy),"localTip":str}](5),"topRestaurants":[{"name":str,"cuisine":str,"neighborhood":str,"type":str(Fine Dining/Casual/Street Food/Café/Local Eatery),"priceRange":str,"rating":4-5,"mustOrder":str,"localFavorite":bool}](4),"foodBudgetTips":str[](3)}`;

    try {
      const result = await askGeminiJSON(SYSTEM_PROMPT, prompt);
      destinationFoodCache.set(cacheKey, result); // Cache the successful result
      return result;
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
