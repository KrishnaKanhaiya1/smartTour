// lib/services/agents/safetyAgent.js
// Real Gemini-powered Safety & SOS Agent

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are the Safety & SOS Agent for SmartTour.
You provide accurate, destination-specific safety information for travelers.
Include real emergency numbers, genuine travel advisories, and practical safety tips.
Always return valid JSON. Your information could impact traveler safety — be thorough and accurate.`;

export class SafetyAgent {
  async assessSafety(destination, options = {}) {
    const destName = typeof destination === 'string'
      ? destination
      : (Array.isArray(destination) ? destination.map(l => l.name || l).join(', ') : 'the destination');

    const prompt = `Safety info for travelers visiting ${destName}.${options.travelerType ? ` Traveler type: ${options.travelerType}` : ''}

Return JSON:
{
  "destination": string, "overallSafetyRating": number (1-10), "safetyTier": string (Very Safe/Safe/Exercise Caution/High Caution/Dangerous),
  "travelAdvisory": { "level": number (1-4), "message": string, "issuedBy": string, "lastUpdated": string },
  "emergencyNumbers": [{ "service": string, "number": string, "available": string, "notes": string }] (3-4 items),
  "safetyTips": { "general": string[] (3 tips), "forWomen": string[] (2 tips), "forSoloTravelers": string[] (2 tips), "nightSafety": string[] (2 tips) },
  "commonScams": [{ "scam": string, "howToAvoid": string }] (2-3 scams),
  "healthInfo": { "waterSafety": string, "foodSafety": string, "recommendedVaccines": string[], "healthRisks": string[], "nearestHospitalType": string, "medicalStandard": string (Excellent/Good/Basic/Limited) },
  "culturalDos": string[] (3 items), "culturalDonts": string[] (3 items),
  "localLaws": string[] (2 items), "safeNeighborhoods": string[] (2 items), "areasToAvoid": string[] (2 items),
  "transportSafety": { "recommendedTransport": string[], "avoidTransport": string[], "taxiTips": string },
  "weatherRisks": string, "embassyInfo": { "note": string }
}`;

    try {
      return await askGeminiJSON(SYSTEM_PROMPT, prompt);
    } catch (error) {
      console.error('SafetyAgent Error:', error);
      // Graceful Rate Limit Fallback
      return {
        destination: destName,
        overallSafetyRating: 7,
        safetyTier: "Safe",
        travelAdvisory: { level: 1, message: "Exercise normal precautions", issuedBy: "System Fallback", lastUpdated: new Date().toISOString() },
        emergencyNumbers: [{ service: "General", number: "112", available: "24/7", notes: "" }],
        safetyTips: {
          general: ["Keep copies of your passport", "Be aware of your surroundings"],
          forWomen: ["Avoid walking alone late at night in unlit areas"],
          forSoloTravelers: ["Share your itinerary with someone back home"],
          nightSafety: ["Stick to well-lit main streets"]
        },
        commonScams: [{ scam: "Overcharging taxi", howToAvoid: "Agree on price before getting in or use ride-hailing apps" }],
        healthInfo: {
          waterSafety: "Check locally before drinking tap water", foodSafety: "Eat at busy places",
          recommendedVaccines: ["Routine vaccines"], healthRisks: [], nearestHospitalType: "Public", medicalStandard: "Good"
        },
        culturalDos: ["Be respectful of local customs"], culturalDonts: ["Don't photograph people without permission"],
        localLaws: ["Carry ID at all times"], safeNeighborhoods: ["City Center"], areasToAvoid: ["Unknown outskirts"],
        transportSafety: { recommendedTransport: ["Public transit"], avoidTransport: ["Unlicensed cabs"], taxiTips: "Use official ranks" },
        weatherRisks: "Check local forecasts", embassyInfo: { note: "Always know where your embassy is" }
      };
    }
  }

  async getEmergencyContacts(destination) {
    const prompt = `List emergency contact numbers for ${destination || 'India'}.
    Return JSON: { "destination": string, "emergency": string, "contacts": [{"service": string, "number": string, "available": string}] }`;
    try {
      return await askGeminiJSON(SYSTEM_PROMPT, prompt);
    } catch {
      return {
        destination,
        emergency: '112',
        contacts: [
          { service: 'Police', number: '100', available: '24/7' },
          { service: 'Ambulance', number: '102', available: '24/7' },
          { service: 'Fire', number: '101', available: '24/7' }
        ]
      };
    }
  }

  // Legacy methods for backward compatibility
  async assessSafetyForLocations(locations) {
    const locationNames = locations.map(l => l.name || l).join(', ');
    return this.assessSafety(locationNames);
  }
}
