// lib/services/agents/guideMatchingAgent.js
// Gemini-powered Guide Matching Agent

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `Tour guide generator. Generate realistic local tour guide profiles with diverse specialties, languages, and pricing.`;

export class GuideMatchingAgent {
  async findMatchingGuides(userProfile) {
    const destination = userProfile.destination || 'India';
    const language = userProfile.language || 'English';
    const budget = userProfile.budget?.tier || userProfile.budget || 'moderate';
    const interests = userProfile.interests
      ? (Array.isArray(userProfile.interests)
        ? userProfile.interests
        : Object.keys(userProfile.interests))
      : ['sightseeing'];

    const prompt = `4 local guide profiles for ${destination}. Lang:${language}, Budget:${typeof budget === 'object' ? budget.tier : budget}, Interests:${interests.join(', ')}.
JSON: {"destination":"${destination}","matchedGuides":[{"id":str,"name":str,"bio":str(1-2 sentences),"languages":str[],"specialties":str[],"experience":num,"rating":4-5,"totalReviews":num,"price":num,"preferredGroupSize":str,"availability":true,"certifications":str[],"compatibilityScore":60-98,"matchReason":str}](4),"bookingTips":str[](2)}`;

    try {
      return await askGeminiJSON(SYSTEM_PROMPT, prompt);
    } catch (error) {
      console.error('GuideMatchingAgent Error:', error);
      return {
        destination,
        matchedGuides: [
          {
            id: "guide_fallback_1", name: "Local Expert (Fallback)", bio: "AI generation is paused due to high traffic, but local guides are always ready to show you around!",
            languages: [language, "English"], specialties: interests,
            experience: 5, rating: 4.8, totalReviews: 120, price: 50,
            preferredGroupSize: "1-4 people", availability: true,
            certifications: ["Certified Tour Guide"], compatibilityScore: 90, matchReason: `Matches your interest in ${interests[0]}`
          },
          {
            id: "guide_fallback_2", name: "City Specialist (Fallback)", bio: "A temporary fallback guide while our AI service cools down.",
            languages: ["English"], specialties: ["Sightseeing", "History"],
            experience: 10, rating: 4.9, totalReviews: 340, price: 80,
            preferredGroupSize: "2-8 people", availability: true,
            certifications: ["Historical Society Member"], compatibilityScore: 85, matchReason: "Highly rated for general tours"
          }
        ],
        bookingTips: ["Book in advance during peak season", "(AI tips temporarily unavailable)"]
      };
    }
  }

  // Book a guide (simulated)
  async bookGuide(guideId, userId, dates) {
    return {
      bookingId: `BK${Date.now()}`,
      guideId,
      userId,
      dates,
      status: 'confirmed',
      bookingTime: new Date().toISOString(),
      cancelPolicy: '48 hours free cancellation',
    };
  }
}
