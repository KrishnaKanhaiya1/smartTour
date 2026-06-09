// lib/services/agents/safetyAgent.js
// Real Gemini-powered Safety & SOS Agent

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `Travel safety expert. Provide accurate emergency numbers, advisories, and safety tips for any destination.`;

// Destination-level cache for safety information
const destinationSafetyCache = new Map();

export class SafetyAgent {
  async assessSafety(destination, options = {}) {
    const destName = typeof destination === 'string'
      ? destination
      : (Array.isArray(destination) ? destination.map(l => l.name || l).join(', ') : 'the destination');

    // Check destination cache first
    const cacheKey = destName.toLowerCase().trim();
    if (destinationSafetyCache.has(cacheKey)) {
      console.log(`[SafetyAgent] Cache HIT for destination: ${destName}`);
      return destinationSafetyCache.get(cacheKey);
    }

    const prompt = `Safety info for ${destName}.${options.travelerType ? ` Traveler:${options.travelerType}` : ''}

JSON: {"destination":str,"overallSafetyRating":1-10,"safetyTier":str(Very Safe/Safe/Exercise Caution/High Caution/Dangerous),"travelAdvisory":{"level":1-4,"message":str,"issuedBy":str,"lastUpdated":str},"emergencyNumbers":[{"service":str,"number":str,"available":str,"notes":str}](3-4),"safetyTips":{"general":str[](3),"forWomen":str[](2),"forSoloTravelers":str[](2),"nightSafety":str[](2)},"commonScams":[{"scam":str,"howToAvoid":str}](2-3),"healthInfo":{"waterSafety":str,"foodSafety":str,"recommendedVaccines":str[],"healthRisks":str[],"nearestHospitalType":str,"medicalStandard":str(Excellent/Good/Basic/Limited)},"culturalDos":str[](3),"culturalDonts":str[](3),"localLaws":str[](2),"safeNeighborhoods":str[](2),"areasToAvoid":str[](2),"transportSafety":{"recommendedTransport":str[],"avoidTransport":str[],"taxiTips":str},"weatherRisks":str,"embassyInfo":{"note":str}}`;

    try {
      const result = await askGeminiJSON(SYSTEM_PROMPT, prompt);
      destinationSafetyCache.set(cacheKey, result); // Cache the successful result
      return result;
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
    const prompt = `Emergency numbers for ${destination || 'India'}. JSON: {"destination":str,"emergency":str,"contacts":[{"service":str,"number":str,"available":str}]}`;
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
