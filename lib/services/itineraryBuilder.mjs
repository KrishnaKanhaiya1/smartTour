export function buildVerifiedJourney({
  destination,
  center,
  attractions = [],
  restaurants = [],
  hotels = [],
  duration = 3,
  budget = 'moderate',
  style = 'balanced',
  interests = [],
  groupSize = 2,
}) {
  const safeAttractions = attractions.filter((item) => item?.location?.lat && item?.location?.lng);
  const safeRestaurants = restaurants.filter((item) => item?.location?.lat && item?.location?.lng);
  const safeHotels = hotels.filter((item) => item?.location?.lat && item?.location?.lng);

  if (!safeAttractions.length || !safeRestaurants.length) {
    throw new Error(`No verified places available for ${destination}`);
  }

  const days = Array.from({ length: duration }, (_, idx) => {
    const attraction = safeAttractions[idx % safeAttractions.length];
    const restaurant = safeRestaurants[idx % safeRestaurants.length];
    const hotel = safeHotels[idx % safeHotels.length] || safeRestaurants[idx % safeRestaurants.length];

    return {
      day: idx + 1,
      theme: `${interests[0] || 'Local highlights'} day`,
      duration: 'Full day',
      activities: [
        {
          name: attraction.name,
          time: '10:00 - 12:30',
          duration: 2,
          category: attraction.category || 'attraction',
          cost: budget === 'luxury' ? '$$' : '$',
          description: `Visit ${attraction.name} as a verified attraction near ${destination}.`,
          location: {
            name: attraction.name,
            address: attraction.address || destination,
            lat: attraction.location.lat,
            lng: attraction.location.lng,
          },
          osmId: attraction.osmId,
          verified: true,
          mapUrl: attraction.mapUrl,
          tips: 'Check opening hours before arrival.',
        },
        {
          name: restaurant.name,
          time: '13:00 - 14:30',
          duration: 1,
          category: 'food',
          cost: budget === 'luxury' ? '$$' : '$',
          description: `Eat at ${restaurant.name} for a local meal near ${destination}.`,
          location: {
            name: restaurant.name,
            address: restaurant.address || destination,
            lat: restaurant.location.lat,
            lng: restaurant.location.lng,
          },
          osmId: restaurant.osmId,
          verified: true,
          mapUrl: restaurant.mapUrl,
          tips: 'Reserve in advance if it is popular.',
        },
      ],
      meals: {
        breakfast: hotel.name,
        lunch: restaurant.name,
        dinner: restaurant.name,
      },
    };
  });

  return {
    destination,
    duration,
    itinerary: {
      destination,
      center,
      days,
      totalEstimatedCost: `approx $${duration * 120}`,
      packingTips: ['Comfortable shoes', 'Water bottle', 'Sun protection'],
      transportTips: 'Use verified local transport or taxi services.',
    },
    food: {
      destination,
      cuisineOverview: 'Food suggestions are based on verified nearby restaurants.',
      vegetarianFriendly: true,
      halalFriendly: true,
      drinkingWaterSafety: 'Use bottled or filtered water when unsure.',
      mustTryDishes: [
        {
          name: 'Local specialty',
          description: 'Try the signature dish of the region.',
          averagePriceUSD: 8,
          isVegetarian: true,
          isVegan: false,
          isHalal: false,
          isGlutenFree: false,
          spiceLevel: 'Medium',
          localTip: 'Ask for the house special.',
        },
      ],
      topRestaurants: safeRestaurants.slice(0, 4).map((restaurant) => ({
        name: restaurant.name,
        cuisine: restaurant.cuisine || 'Local',
        neighborhood: restaurant.address || destination,
        type: 'Verified',
        priceRange: budget === 'luxury' ? '$$' : '$',
        rating: 4.4,
        mustOrder: 'House special',
        localFavorite: true,
        verified: true,
        osmId: restaurant.osmId,
        location: restaurant.location,
        mapUrl: restaurant.mapUrl,
      })),
      foodBudgetTips: ['Look for local lunch specials', 'Book popular restaurants early'],
    },
    safety: {
      destination,
      overallSafetyRating: 7,
      safetyTier: 'Moderate',
      travelAdvisory: {
        level: 2,
        message: 'Exercise normal precautions and keep local emergency contacts.',
        issuedBy: 'System',
        lastUpdated: new Date().toISOString(),
      },
      emergencyNumbers: [{ service: 'Emergency', number: '112', available: '24/7', notes: '' }],
      safetyTips: {
        general: ['Stay aware of your surroundings'],
        forWomen: ['Avoid isolated areas at night'],
        forSoloTravelers: ['Share your route with someone'],
        nightSafety: ['Use well-lit routes'],
      },
      commonScams: [{ scam: 'Overcharging', howToAvoid: 'Agree on prices upfront' }],
      healthInfo: {
        waterSafety: 'Prefer bottled or filtered water',
        foodSafety: 'Eat at busy, reputable places',
        recommendedVaccines: ['Check current local health guidance'],
        healthRisks: [],
        nearestHospitalType: 'Hospital',
        medicalStandard: 'Good',
      },
      culturalDos: ['Be respectful'],
      culturalDonts: ['Do not photograph restricted sites'],
      localLaws: ['Carry ID if requested'],
      safeNeighborhoods: [destination],
      areasToAvoid: ['Unknown isolated areas'],
      transportSafety: {
        recommendedTransport: ['Official taxis', 'Ride apps'],
        avoidTransport: ['Unlicensed rides'],
        taxiTips: 'Use official taxi stands or app-based rides',
      },
      weatherRisks: 'Check local weather forecasts',
      embassyInfo: { note: 'Keep embassy details handy' },
    },
    locations: days.flatMap((day) => day.activities.map((activity) => ({
      name: activity.location.name,
      address: activity.location.address,
      lat: activity.location.lat,
      lng: activity.location.lng,
      day: day.day,
      category: activity.category,
      osmId: activity.osmId,
      verified: true,
      mapUrl: activity.mapUrl,
    }))),
    verifiedSources: {
      center,
      attractions: safeAttractions,
      restaurants: safeRestaurants,
      hotels: safeHotels,
    },
  };
}
