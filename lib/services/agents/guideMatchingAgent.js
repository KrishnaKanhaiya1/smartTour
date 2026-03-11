// lib/services/agents/guideMatchingAgent.js
// Gemini-powered Guide Matching Agent

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are the Guide Matching Agent for SmartTour.
You generate realistic local tour guide profiles for any destination worldwide.
Create diverse guides with varied specialties, languages, experience levels, and price points.
Each guide should feel like a real person with a unique personality and expertise.
Always return valid JSON.`;

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

    const prompt = `Generate 4 local tour guide profiles for ${destination}.
Language: ${language}, Budget: ${typeof budget === 'object' ? budget.tier : budget}, Interests: ${interests.join(', ')}

Return JSON:
{
  "destination": "${destination}",
  "matchedGuides": [{ "id": string, "name": string, "bio": string (1-2 sentences), "languages": string[], "specialties": string[], "experience": number, "rating": number (4-5), "totalReviews": number, "price": number (daily USD), "preferredGroupSize": string, "availability": true, "certifications": string[], "compatibilityScore": number (60-98), "matchReason": string }] (4 guides, sorted by compatibilityScore desc),
  "bookingTips": string[] (2 tips)
}`;

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
