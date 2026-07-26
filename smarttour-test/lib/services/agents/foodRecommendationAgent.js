import { OpenStreetMapService } from '@/lib/services/openstreetmap';
import { getDestinationKnowledge } from '@/lib/services/travelKnowledgeBase.mjs';
import { askGeminiJSON } from '@/lib/gemini';

function buildMapUrl(lat, lng, name) {
  if (!lat || !lng) return null;
  const label = encodeURIComponent(name || `${lat},${lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}%20(${label})`;
}

const REGIONAL_CUISINE_DB = {
  in: {
    cuisineOverview: 'Rich, diverse Indian cuisine characterized by aromatic spices, fresh herbs, and a wide variety of vegetarian choices.',
    mustTryDishes: [
      { name: 'Biryani', description: 'Fragrant long-grain basmati rice cooked with saffron, spices, and marinated vegetables or protein.', averagePriceUSD: 5, isVegetarian: false, isVegan: false, isHalal: true, isGlutenFree: true, spiceLevel: 'Spicy', localTip: 'Pair with raita (yogurt dip) to balance the heat.' },
      { name: 'Masala Dosa', description: 'Crispy fermented rice pancake stuffed with a spiced potato mash, served with sambar and coconut chutney.', averagePriceUSD: 2, isVegetarian: true, isVegan: true, isHalal: true, isGlutenFree: true, spiceLevel: 'Mild', localTip: 'Best enjoyed piping hot for breakfast.' },
      { name: 'Paneer Butter Masala', description: 'Soft cottage cheese cubes simmered in a rich, creamy tomato and cashew-based gravy.', averagePriceUSD: 4, isVegetarian: true, isVegan: false, isHalal: true, isGlutenFree: true, spiceLevel: 'Medium', localTip: 'Eat with freshly made garlic naan.' }
    ],
    drinkingWaterSafety: 'Prefer bottled or sealed drinking water only.'
  },
  jp: {
    cuisineOverview: 'Japanese cuisine emphasizes seasonal ingredients, natural flavors, and aesthetic presentation, ranging from sushi to hot noodle soups.',
    mustTryDishes: [
      { name: 'Ramen', description: 'Wheat noodles in a rich savory broth flavored with soy sauce or miso, topped with sliced green onions and soft-boiled egg.', averagePriceUSD: 10, isVegetarian: false, isVegan: false, isHalal: false, isGlutenFree: false, spiceLevel: 'Mild', localTip: 'Slurping your noodles is polite and cools them down.' },
      { name: 'Sushi', description: 'Vinegared rice paired with fresh raw seafood, vegetables, or egg, rolled in sheets of nori seaweed.', averagePriceUSD: 15, isVegetarian: false, isVegan: false, isHalal: true, isGlutenFree: true, spiceLevel: 'Mild', localTip: 'Do not mix wasabi directly into your soy sauce bowl.' }
    ],
    drinkingWaterSafety: 'Tap water is generally safe and drinkable.'
  },
  fr: {
    cuisineOverview: 'French cuisine is celebrated globally for its refined cooking techniques, rich butter-based sauces, artisanal cheeses, and fresh baguettes.',
    mustTryDishes: [
      { name: 'Crêpes', description: 'Thin wheat or buckwheat pancakes folded with sweet fillings like chocolate or savory choices like ham and cheese.', averagePriceUSD: 6, isVegetarian: true, isVegan: false, isHalal: true, isGlutenFree: false, spiceLevel: 'Mild', localTip: 'Try a savory galette for lunch and a sweet crêpe for dessert.' }
    ],
    drinkingWaterSafety: 'Tap water is clean and safe to drink.'
  }
};

function getRegionalProfile(destination) {
  const norm = destination.toLowerCase();
  if (norm.includes('india') || norm.includes('kerala') || norm.includes('delhi') || norm.includes('mumbai') || norm.includes('kochi') || norm.includes('patna') || norm.includes('kashmir') || norm.includes('srinagar')) {
    return REGIONAL_CUISINE_DB.in;
  }
  if (norm.includes('japan') || norm.includes('tokyo') || norm.includes('kyoto') || norm.includes('osaka')) {
    return REGIONAL_CUISINE_DB.jp;
  }
  if (norm.includes('france') || norm.includes('paris') || norm.includes('lyon')) {
    return REGIONAL_CUISINE_DB.fr;
  }
  return {
    cuisineOverview: `Explore local gastronomy in ${destination}. Taste traditional recipes and regional specialties at nearby diners.`,
    mustTryDishes: [
      { name: 'Traditional Regional Specialty', description: 'A signature dish representing local heritage and culinary traditions.', averagePriceUSD: 9, isVegetarian: true, isVegan: false, isHalal: true, isGlutenFree: false, spiceLevel: 'Medium', localTip: 'Ask restaurant staff for their signature recommendations.' }
    ],
    drinkingWaterSafety: 'Drink bottled or filtered water when unsure.'
  };
}

export class FoodRecommendationAgent {
  async findFood(destination, options = {}) {
    // 1. Get supplementary context (no longer returning early)
    const localKB = getDestinationKnowledge(destination) || {};
    const regional = getRegionalProfile(destination) || {};

    // 2. Resolve destination coordinates via search & get OSM grounding context
    let center = { lat: 20.5937, lng: 78.9629 };
    let osmRestaurants = [];

    try {
      const searchResults = await OpenStreetMapService.searchPlaces(destination);
      if (searchResults && searchResults.length > 0) {
        center = searchResults[0].location;
        osmRestaurants = await OpenStreetMapService.getNearbyRestaurants(center.lat, center.lng, 5000);
      }
    } catch (e) {
      console.warn('[FoodAgent] OSM restaurant lookup failed:', e.message);
    }

    // 3. ALWAYS query Gemini AI first for authentic culinary recommendations
    try {
      console.log(`[FoodAgent] Fetching Gemini food recommendations for ${destination}...`);
      
      const osmContext = osmRestaurants.length > 0 
        ? `\nNearby OSM Restaurants: ${osmRestaurants.slice(0, 10).map(r => r.name).join(', ')}` 
        : '';
      const kbContext = localKB.food ? `\nLocal Knowledge Base tips: ${JSON.stringify(localKB.food.mustTryDishes || [])}` : '';
      
      const promptContext = `Destination: ${destination}.${osmContext}${kbContext}
Options: ${JSON.stringify(options)}`;

      const geminiResult = await askGeminiJSON(
        `You are the SmartTour Food & Culinary Agent. Provide authentic food recommendations for ${destination}, including 3 famous must-try local dishes and 3 real, specific popular restaurant names in ${destination}. Use the provided OSM restaurants and Knowledge Base context if relevant. Return JSON ONLY. Do NOT invent fictional places.`,
        `${promptContext}
JSON Schema:
{
  "cuisineOverview": "Overview of local cuisine in ${destination}",
  "drinkingWaterSafety": "Water safety advice",
  "mustTryDishes": [
    {
      "name": "Exact real dish name",
      "description": "Short description",
      "averagePriceUSD": 8,
      "isVegetarian": true,
      "isVegan": false,
      "isHalal": true,
      "isGlutenFree": false,
      "spiceLevel": "Mild | Medium | Spicy",
      "localTip": "Culinary tip"
    }
  ],
  "topRestaurants": [
    {
      "name": "Real famous restaurant name in ${destination}",
      "cuisine": "Cuisine type",
      "neighborhood": "Area/District in ${destination}",
      "type": "Casual | Fine Dining | Street Food | Café",
      "priceRange": "$$",
      "rating": 4.6,
      "mustOrder": "Popular dish to order",
      "location": { "lat": 12.34, "lng": 56.78 }
    }
  ],
  "foodBudgetTips": [ "Tip 1", "Tip 2" ]
}`
      );

      if (geminiResult && Array.isArray(geminiResult.topRestaurants) && geminiResult.topRestaurants.length > 0) {
        const formattedGeminiRestaurants = geminiResult.topRestaurants.map((r, idx) => ({
          name: r.name,
          cuisine: r.cuisine || 'Regional Cuisine',
          neighborhood: r.neighborhood || destination,
          type: r.type || 'Casual',
          priceRange: r.priceRange || '$$',
          rating: r.rating || 4.5,
          mustOrder: r.mustOrder || 'House Special',
          localFavorite: true,
          verified: false,
          osmId: `ai-restaurant-${idx}`,
          location: r.location && typeof r.location.lat === 'number' ? r.location : center,
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' ' + destination)}`
        }));

        return {
          destination,
          cuisineOverview: geminiResult.cuisineOverview || regional.cuisineOverview,
          vegetarianFriendly: options.dietaryRestrictions?.includes('vegetarian') || true,
          halalFriendly: options.dietaryRestrictions?.includes('halal') || false,
          drinkingWaterSafety: geminiResult.drinkingWaterSafety || regional.drinkingWaterSafety,
          mustTryDishes: geminiResult.mustTryDishes || regional.mustTryDishes,
          topRestaurants: formattedGeminiRestaurants,
          foodBudgetTips: geminiResult.foodBudgetTips || [
            'Eat at busy local restaurants for fresh ingredients.',
            'Order regional lunch platters for value.'
          ]
        };
      }
    } catch (geminiErr) {
      console.warn('[FoodAgent] Gemini food query failed, falling back:', geminiErr.message);
    }

    // 4. Fallback formatting if Gemini genuinely throws/yields zero results
    const topRestaurantsFormatted = (osmRestaurants.length > 0 ? osmRestaurants : [
      { name: `${destination} Central Eatery`, location: center, address: destination, cuisine: 'Local Specialties', osmId: 'ai/fallback-eatery' }
    ]).slice(0, 4).map(r => ({
      name: r.name,
      cuisine: r.cuisine || 'Regional Cuisine',
      neighborhood: r.address || 'Central Neighborhood',
      type: r.cuisine?.toLowerCase().includes('cafe') ? 'Café' : 'Casual',
      priceRange: '$$',
      rating: 4.4,
      mustOrder: 'Signature House Dish',
      localFavorite: true,
      verified: !!r.id,
      osmId: r.osmId || 'ai/restaurant',
      location: r.location,
      mapUrl: r.mapUrl || buildMapUrl(r.location.lat, r.location.lng, r.name),
    }));

    return {
      destination,
      cuisineOverview: (localKB.food && localKB.food.cuisineOverview) || regional.cuisineOverview,
      vegetarianFriendly: options.dietaryRestrictions?.includes('vegetarian') || true,
      halalFriendly: options.dietaryRestrictions?.includes('halal') || false,
      drinkingWaterSafety: (localKB.food && localKB.food.drinkingWaterSafety) || regional.drinkingWaterSafety,
      mustTryDishes: (localKB.food && localKB.food.mustTryDishes) || regional.mustTryDishes,
      topRestaurants: topRestaurantsFormatted,
      foodBudgetTips: (localKB.food && localKB.food.foodBudgetTips) || [
        'Eat at busy local restaurants for fresh ingredients.',
        'Order regional lunch platters for value.',
        'Use local street food stalls for quick bites.'
      ]
    };
  }

  // Compatibility methods
  async recommendPlaces(userProfile, context) {
    const destination = context?.destination || userProfile?.destination || 'India';
    return this.findFood(destination, {
      budget: userProfile?.budget?.tier || 'moderate',
      dietaryRestrictions: userProfile?.dietaryRestrictions || [],
    });
  }

  async quickFoodSearch(location) {
    const dest = typeof location === 'string' ? location : 'nearby area';
    return this.findFood(dest, { budget: 'moderate' });
  }
}
