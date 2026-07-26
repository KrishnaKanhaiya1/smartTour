const KNOWLEDGE_BASE = {
  munnar: {
    center: { lat: 10.089, lng: 77.059 },
    attractions: [
      {
        id: 'munnar-eravikulam',
        name: 'Eravikulam National Park',
        category: 'nature',
        description: 'High-altitude park known for the Nilgiri Tahr and sweeping views.',
        address: 'Eravikulam, Munnar, Kerala',
        location: { lat: 10.12, lng: 77.06 },
        openingHours: '8:00 AM - 4:00 PM',
        entryFeeUSD: 5,
        timeNeeded: '3-4 hours',
        rating: 4.8,
        totalReviews: 3000,
        bestTime: 'Morning',
        tips: 'Book the park slot early and carry light layers.',
        mustSee: true,
        familyFriendly: true,
        verified: true,
      },
      {
        id: 'munnar-kundala',
        name: 'Kundala Lake',
        category: 'nature',
        description: 'A serene lake surrounded by tea plantations and rolling hills.',
        address: 'Kundala, Munnar, Kerala',
        location: { lat: 10.23, lng: 77.12 },
        openingHours: 'Open all day',
        entryFeeUSD: 0,
        timeNeeded: '2 hours',
        rating: 4.6,
        totalReviews: 1800,
        bestTime: 'Late afternoon',
        tips: 'Great for boating and photography.',
        mustSee: true,
        familyFriendly: true,
        verified: true,
      },
    ],
    restaurants: [
      {
        id: 'munnar-rang-mahal',
        name: 'Rang Mahal',
        cuisine: 'North Indian',
        neighborhood: 'Munnar Town',
        type: 'Fine Dining',
        priceRange: '$$',
        rating: 4.5,
        mustOrder: 'Kerala Parotta',
        localFavorite: true,
        location: { lat: 10.088, lng: 77.063 },
        address: 'Munnar Town, Kerala',
        verified: true,
      },
      {
        id: 'munnar-mountain-cafe',
        name: 'Mountain View Cafe',
        cuisine: 'Continental',
        neighborhood: 'Munnar Town',
        type: 'Cafe',
        priceRange: '$',
        rating: 4.4,
        mustOrder: 'Tea and homemade cakes',
        localFavorite: true,
        location: { lat: 10.087, lng: 77.061 },
        address: 'Munnar Town, Kerala',
        verified: true,
      },
    ],
    hotels: [
      {
        id: 'munnar-hillview',
        name: 'Hotel Hillview',
        neighborhood: 'Munnar Town',
        stars: 3,
        pricePerNight: 70,
        totalPrice: 210,
        description: 'Comfortable stay close to the main town and viewpoints.',
        amenities: ['Free WiFi', 'Restaurant', 'Parking'],
        bookingTip: 'Book early on weekends.',
        type: 'Mid-Range',
        recommended: true,
      },
      {
        id: 'munnar-tea-resort',
        name: 'Tea Valley Resort',
        neighborhood: 'Munnar',
        stars: 4,
        pricePerNight: 120,
        totalPrice: 360,
        description: 'A scenic resort nestled in tea estates with good views.',
        amenities: ['Spa', 'Mountain View', 'Breakfast'],
        bookingTip: 'Ideal for couples and longer stays.',
        type: 'Resort',
        recommended: true,
      },
    ],
    guides: [
      {
        id: 'munnar-guide-1',
        name: 'Asha Thomas',
        bio: 'Local guide specializing in nature trails, tea gardens, and photography.',
        languages: ['English', 'Malayalam', 'Hindi'],
        specialties: ['Nature', 'Tea Estate Tours', 'Photography'],
        experience: 9,
        rating: 4.9,
        totalReviews: 180,
        price: 65,
        preferredGroupSize: '1-4 people',
        availability: true,
        certifications: ['Certified Tourism Guide'],
        compatibilityScore: 95,
        matchReason: 'Excellent for nature-focused travelers.',
      },
    ],
    safety: {
      destination: 'Munnar',
      overallSafetyRating: 8,
      safetyTier: 'Very Safe',
      travelAdvisory: { level: 1, message: 'Exercise normal precautions and respect local traffic rules.', issuedBy: 'Local Knowledge Base', lastUpdated: new Date().toISOString() },
      emergencyNumbers: [{ service: 'Emergency', number: '112', available: '24/7', notes: 'General emergency' }],
      safetyTips: { general: ['Keep valuables secure in crowded areas'], forWomen: ['Prefer well-lit routes at night'], forSoloTravelers: ['Share your route with someone'], nightSafety: ['Use registered taxis after dark'] },
      commonScams: [{ scam: 'Overpriced taxi rides', howToAvoid: 'Use official taxis or app-based rides' }],
      healthInfo: { waterSafety: 'Drink bottled or filtered water', foodSafety: 'Eat at busy restaurants', recommendedVaccines: ['No special vaccine required for most travelers'], healthRisks: ['High altitude weather changes'], nearestHospitalType: 'District Hospital', medicalStandard: 'Good' },
      culturalDos: ['Respect local religious spaces'],
      culturalDonts: ['Do not litter in protected areas'],
      localLaws: ['Carry ID if requested'],
      safeNeighborhoods: ['Munnar Town', 'Kundala'],
      areasToAvoid: ['Remote forest trails without a guide'],
      transportSafety: { recommendedTransport: ['Registered taxis', 'Private cars'], avoidTransport: ['Unlicensed rides'], taxiTips: 'Use official taxi stands or pre-booked transport' },
      weatherRisks: 'Check weather before visiting hill areas',
      embassyInfo: { note: 'Keep your embassy contacts handy' },
    },
  },
  delhi: {
    center: { lat: 28.6139, lng: 77.2090 },
    attractions: [
      {
        id: 'delhi-red-fort',
        name: 'Red Fort',
        category: 'historical',
        description: 'Historic Mughal fort that tells the story of imperial Delhi.',
        address: 'Netaji Subhash Marg, Delhi',
        location: { lat: 28.6562, lng: 77.2410 },
        openingHours: '9:30 AM - 4:30 PM',
        entryFeeUSD: 3,
        timeNeeded: '3 hours',
        rating: 4.7,
        totalReviews: 15000,
        bestTime: 'Morning',
        tips: 'Arrive early to avoid traffic and heat.',
        mustSee: true,
        familyFriendly: true,
        verified: true,
      },
    ],
    restaurants: [
      {
        id: 'delhi-bukhara',
        name: 'Bukhara',
        cuisine: 'North Indian',
        neighborhood: 'Maurya Sheraton',
        type: 'Fine Dining',
        priceRange: '$$$',
        rating: 4.7,
        mustOrder: 'Dal Bukhara',
        localFavorite: true,
        location: { lat: 28.6192, lng: 77.2192 },
        address: 'Maurya Sheraton, Delhi',
        verified: true,
      },
    ],
    hotels: [
      {
        id: 'delhi-maurya',
        name: 'The Maurya',
        neighborhood: 'Chanakyapuri',
        stars: 5,
        pricePerNight: 220,
        totalPrice: 660,
        description: 'Classic luxury hotel with easy access to key attractions.',
        amenities: ['Pool', 'Spa', 'Airport Transfer'],
        bookingTip: 'Reserve well in advance for Delhi events.',
        type: 'Luxury',
        recommended: true,
      },
    ],
    guides: [
      {
        id: 'delhi-guide-1',
        name: 'Ravi Sharma',
        bio: 'Expert guide for Old Delhi street food, monuments, and history.',
        languages: ['English', 'Hindi'],
        specialties: ['History', 'Food', 'Markets'],
        experience: 12,
        rating: 4.8,
        totalReviews: 220,
        price: 55,
        preferredGroupSize: '2-6 people',
        availability: true,
        certifications: ['Certified Local Guide'],
        compatibilityScore: 93,
        matchReason: 'Great for heritage-focused trips.',
      },
    ],
    safety: {
      destination: 'Delhi',
      overallSafetyRating: 5,
      safetyTier: 'Exercise Caution',
      travelAdvisory: { level: 2, message: 'Stay alert in crowded transit areas and avoid isolated routes at night.', issuedBy: 'Local Knowledge Base', lastUpdated: new Date().toISOString() },
      emergencyNumbers: [{ service: 'Emergency', number: '112', available: '24/7', notes: 'General emergency' }],
      safetyTips: { general: ['Keep your phone charged and your belongings close'], forWomen: ['Avoid poorly lit streets after dark'], forSoloTravelers: ['Use rideshare in the evening'], nightSafety: ['Stay in well-lit busy areas'] },
      commonScams: [{ scam: 'Taxi overcharging', howToAvoid: 'Use meter apps or official taxis' }],
      healthInfo: { waterSafety: 'Prefer bottled water', foodSafety: 'Choose busy, reputable eateries', recommendedVaccines: ['Routine vaccines'], healthRisks: ['Air pollution'], nearestHospitalType: 'Multi-specialty Hospital', medicalStandard: 'Good' },
      culturalDos: ['Respect local customs and dress modestly at religious sites'],
      culturalDonts: ['Do not photograph people without permission'],
      localLaws: ['Carry ID in public spaces'],
      safeNeighborhoods: ['Connaught Place', 'Chanakyapuri'],
      areasToAvoid: ['Isolated, poorly lit lanes at night'],
      transportSafety: { recommendedTransport: ['Metro', 'App-based cabs'], avoidTransport: ['Unlicensed taxis'], taxiTips: 'Plan routes in advance during rush hour' },
      weatherRisks: 'Expect heat and air pollution during summer',
      embassyInfo: { note: 'Keep your embassy contacts handy' },
    },
  },
};

const TRANSLATION_DICTIONARY = {
  hi: { hello: 'नमस्ते', thankyou: 'धन्यवाद', yes: 'हाँ', no: 'नहीं', where: 'कहाँ', help: 'मदद' },
  fr: { hello: 'Bonjour', thankyou: 'Merci', yes: 'Oui', no: 'Non', where: 'Où', help: 'Aide' },
  es: { hello: 'Hola', thankyou: 'Gracias', yes: 'Sí', no: 'No', where: 'Dónde', help: 'Ayuda' },
  de: { hello: 'Hallo', thankyou: 'Danke', yes: 'Ja', no: 'Nein', where: 'Wo', help: 'Hilfe' },
};

function normalizeDestination(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getDestinationKnowledge(destination) {
  const normalized = normalizeDestination(destination);
  if (!normalized) return null;

  const directMatch = KNOWLEDGE_BASE[normalized];
  if (directMatch) return directMatch;

  const matchKey = Object.keys(KNOWLEDGE_BASE).find((key) => normalized.includes(key) || key.includes(normalized));
  return matchKey ? KNOWLEDGE_BASE[matchKey] : null;
}

export function translateWithKnowledge(text, targetLanguage = 'hi') {
  const normalizedText = normalizeDestination(text);
  const words = normalizedText.split(' ');
  const translations = TRANSLATION_DICTIONARY[targetLanguage.toLowerCase()] || {};
  const translatedWords = words.map((word) => translations[word] || word);
  return {
    originalText: text,
    translatedText: translatedWords.join(' '),
    sourceLanguage: 'en',
    targetLanguage,
    phonetic: null,
    culturalNote: 'Translated using local travel phrase support.',
    confidence: 0.92,
  };
}
