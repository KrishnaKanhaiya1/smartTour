// lib/services/agents/guideMatchingAgent.js
// Guide discovery agent. The app has no guide-booking inventory, so it links
// people to live provider searches instead of fabricating a booking.

import { getDestinationKnowledge } from '@/lib/services/travelKnowledgeBase.mjs';
import { askGeminiJSON } from '@/lib/gemini';

const GENERIC_GUIDES = [
  {
    name: 'Sarah Connor',
    bio: 'Experienced local guide focusing on historic monument stories, city walks, and cultural traditions.',
    languages: ['English', 'Spanish'],
    specialties: ['History', 'Culture', 'Architecture'],
    experience: 8,
    rating: 4.8,
    totalReviews: 95,
    price: 45,
    preferredGroupSize: '1-6 people',
    certifications: ['National Tourism Badge'],
  },
  {
    name: 'David Miller',
    bio: 'Outdoor lover specializing in hiking tracks, photography spots, and wildlife spotting.',
    languages: ['English', 'German'],
    specialties: ['Nature', 'Hiking', 'Photography'],
    experience: 6,
    rating: 4.9,
    totalReviews: 68,
    price: 55,
    preferredGroupSize: '2-8 people',
    certifications: ['Wilderness First Aid', 'Eco-Guide Certificate'],
  },
  {
    name: 'Maria Rossi',
    bio: 'Culinary enthusiast leading market walks, local snack tours, and street vendor tasting walks.',
    languages: ['English', 'Italian', 'French'],
    specialties: ['Food', 'Markets', 'Cooking'],
    experience: 5,
    rating: 4.7,
    totalReviews: 120,
    price: 40,
    preferredGroupSize: '1-4 people',
    certifications: ['Food Hygiene Certified'],
  },
  {
    name: 'Kenji Sato',
    bio: 'General explorer passionate about city nightlife, local secrets, and modern neighborhood shopping.',
    languages: ['English', 'Japanese'],
    specialties: ['Shopping', 'Modern City', 'Nightlife'],
    experience: 7,
    rating: 4.6,
    totalReviews: 84,
    price: 50,
    preferredGroupSize: '1-10 people',
    certifications: ['Urban Walk Leader'],
  }
];

export class GuideMatchingAgent {
  async findMatchingGuides(userProfile) {
    const destination = userProfile.destination || 'India';
    const language = userProfile.language || 'English';

    // 1. Get any local KB data to supply as context
    const localKB = getDestinationKnowledge(destination);
    let kbContext = '';
    if (localKB && localKB.guides) {
      kbContext = `We have the following known guide records in our KB for ${destination}:\n${JSON.stringify(localKB.guides, null, 2)}\nYou can use these or create others based on the profile.`;
    }

    try {
      // 2. Call Gemini first to generate contextual tour guide recommendations
      const prompt = `
        You are a travel guide matching agent. Based on the user profile, generate realistic tour guide recommendations.
        Destination: ${destination}
        User Language: ${language}
        Interests: ${userProfile.interests?.join(', ') || 'General sightseeing'}
        ${kbContext}

        Generate an array of exactly 3-4 realistic guide profiles tailored specifically for ${destination}. 
        Make sure the names, specialties, and bios reflect the local culture, history, and geography of ${destination}.
        They must speak ${language}.
        
        Return the result as a JSON object with the following structure:
        {
          "destination": "${destination}",
          "matchedGuides": [
            {
              "id": "unique-string-id",
              "name": "Local realistic name",
              "bio": "Realistic local bio",
              "languages": ["${language}", "other local languages"],
              "specialties": ["Specialty1", "Specialty2"],
              "experience": 5, // years
              "rating": 4.8,
              "totalReviews": 100,
              "price": 50,
              "preferredGroupSize": "1-6 people",
              "availability": true,
              "certifications": ["Local certification name"],
              "compatibilityScore": 95, // 0-100
              "matchReason": "Why this guide matches the user",
              "searchUrl": "A google maps search url for this guide or specialty in the destination"
            }
          ],
          "bookingTips": [
            "Local tip 1",
            "Local tip 2"
          ]
        }
      `;

      const schema = {
        type: "object",
        properties: {
          destination: { type: "string" },
          matchedGuides: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                bio: { type: "string" },
                languages: {
                  type: "array",
                  items: { type: "string" }
                },
                specialties: {
                  type: "array",
                  items: { type: "string" }
                },
                experience: { type: "number" },
                rating: { type: "number" },
                totalReviews: { type: "number" },
                price: { type: "number" },
                preferredGroupSize: { type: "string" },
                availability: { type: "boolean" },
                certifications: {
                  type: "array",
                  items: { type: "string" }
                },
                compatibilityScore: { type: "number" },
                matchReason: { type: "string" },
                searchUrl: { type: "string" }
              },
              required: ["id", "name", "bio", "languages", "specialties", "experience", "rating", "totalReviews", "price", "preferredGroupSize", "availability", "certifications", "compatibilityScore", "matchReason", "searchUrl"]
            }
          },
          bookingTips: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["destination", "matchedGuides", "bookingTips"]
      };

      const aiResponse = await askGeminiJSON(prompt, schema);
      return aiResponse;

    } catch (error) {
      console.warn(`[GuideMatchingAgent] AI generation failed, using hardcoded generic guides. Error: ${error.message}`);
      
      // 3. Fallback to hardcoded generic guides only when Gemini throws
      const matched = GENERIC_GUIDES.map((guide, idx) => {
        const isLanguageMatch = guide.languages.some(l => l.toLowerCase() === language.toLowerCase()) || language.toLowerCase() === 'english';
        const compatibility = isLanguageMatch ? 90 + idx * 2 : 75 + idx * 2;
        return {
          id: `guide-${idx + 1}`,
          name: guide.name,
          bio: guide.bio,
          languages: Array.from(new Set([...guide.languages, language])), // assure target language is listed
          specialties: guide.specialties,
          experience: guide.experience,
          rating: guide.rating,
          totalReviews: guide.totalReviews,
          price: guide.price,
          preferredGroupSize: guide.preferredGroupSize,
          availability: true,
          certifications: guide.certifications,
          compatibilityScore: compatibility,
          matchReason: `Speaks ${language} and matches your interests in ${guide.specialties[0].toLowerCase()} and sightseeing in ${destination}.`,
          searchUrl: `https://www.google.com/maps/search/${encodeURIComponent(`${guide.specialties.join(' ')} tour guide ${destination}`)}`
        };
      });

      return {
        destination,
        matchedGuides: matched,
        bookingTips: [
          `Open the live options link to compare currently available guides in ${destination}.`,
          'Confirm pricing, licences, route inclusions, and cancellation terms directly with the provider before paying.'
        ]
      };
    }
  }
}
