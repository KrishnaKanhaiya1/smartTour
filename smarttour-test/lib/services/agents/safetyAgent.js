// lib/services/agents/safetyAgent.js
// Deterministic Safety Agent - Bypasses Gemini entirely to ensure 100% reliability,
// using regional emergency databases and safety checklists.

import { getDestinationKnowledge } from '@/lib/services/travelKnowledgeBase.mjs';

const EMERGENCY_DB = {
  in: {
    country: 'India',
    overallSafetyRating: 7,
    safetyTier: 'Safe',
    message: 'Exercise normal safety precautions. Keep emergency numbers saved.',
    numbers: [
      { service: 'National Emergency', number: '112', available: '24/7', notes: 'All-in-one helpline' },
      { service: 'Police Helpline', number: '100', available: '24/7', notes: '' },
      { service: 'Ambulance Call', number: '102', available: '24/7', notes: '' }
    ]
  },
  us: {
    country: 'United States',
    overallSafetyRating: 8,
    safetyTier: 'Safe',
    message: 'Exercise normal safety precautions. Remain aware of local neighborhoods.',
    numbers: [
      { service: 'Emergency Dispatch', number: '911', available: '24/7', notes: 'Police, fire, medical' }
    ]
  },
  gb: {
    country: 'United Kingdom',
    overallSafetyRating: 9,
    safetyTier: 'Very Safe',
    message: 'Very safe destination. Keep standard precautions in crowded transit zones.',
    numbers: [
      { service: 'Emergency Services', number: '999', available: '24/7', notes: 'Police, fire, ambulance' },
      { service: 'NHS Non-Emergency', number: '111', available: '24/7', notes: 'Medical advice' }
    ]
  },
  fr: {
    country: 'France',
    overallSafetyRating: 8,
    safetyTier: 'Safe',
    message: 'Stay aware of pickpockets in main tourist spots and metro stations.',
    numbers: [
      { service: 'European Emergency', number: '112', available: '24/7', notes: 'General assistance' },
      { service: 'Medical Call', number: '15', available: '24/7', notes: 'Ambulance' }
    ]
  }
};

function resolveSafetyProfile(destination) {
  const norm = destination.toLowerCase();
  if (norm.includes('india') || norm.includes('kerala') || norm.includes('delhi') || norm.includes('mumbai') || norm.includes('kochi') || norm.includes('patna') || norm.includes('kashmir') || norm.includes('srinagar')) {
    return EMERGENCY_DB.in;
  }
  if (norm.includes('france') || norm.includes('paris') || norm.includes('lyon')) {
    return EMERGENCY_DB.fr;
  }
  if (norm.includes('united kingdom') || norm.includes('uk') || norm.includes('london')) {
    return EMERGENCY_DB.gb;
  }
  if (norm.includes('usa') || norm.includes('united states') || norm.includes('america') || norm.includes('new york') || norm.includes('california')) {
    return EMERGENCY_DB.us;
  }
  // Fallback profile
  return {
    country: 'Global Fallback',
    overallSafetyRating: 8,
    safetyTier: 'Safe',
    message: `Exercise normal safety precautions in ${destination}. Stay informed on local conditions.`,
    numbers: [
      { service: 'General Emergency', number: '112', available: '24/7', notes: 'Global emergency dial' }
    ]
  };
}

export class SafetyAgent {
  async assessSafety(destination, options = {}) {
    const destName = typeof destination === 'string'
      ? destination
      : (Array.isArray(destination) ? destination.map(l => l.name || l).join(', ') : 'the destination');

    // 1. Check local knowledge base first (Munnar/Delhi)
    const localKB = getDestinationKnowledge(destName);
    if (localKB && localKB.safety) {
      console.log(`[SafetyAgent] KB Match for destination: ${destName}`);
      return {
        ...localKB.safety,
        destination: destName
      };
    }

    const profile = resolveSafetyProfile(destName);

    return {
      destination: destName,
      overallSafetyRating: profile.overallSafetyRating,
      safetyTier: profile.safetyTier,
      travelAdvisory: {
        level: profile.overallSafetyRating > 7 ? 1 : 2,
        message: profile.message,
        issuedBy: 'SmartTour Safety Advisor',
        lastUpdated: new Date().toISOString()
      },
      emergencyNumbers: profile.numbers,
      safetyTips: {
        general: [
          'Store digital scans of passports and tickets securely.',
          'Keep your phone charged and carry a portable power bank.',
          'Stay aware of your surroundings in crowded squares.'
        ],
        forWomen: [
          'Choose official, pre-booked taxi stands or ride apps.',
          'Avoid walking alone on dark or isolated roads.'
        ],
        forSoloTravelers: [
          'Keep close relatives updated on your daily schedule.',
          'Secure your wallet in front pockets when visiting markets.'
        ],
        nightSafety: [
          'Use primary transit routes and avoid unlit shortcuts.',
          'Travel back to your lodging in groups or via registered cars.'
        ]
      },
      commonScams: [
        { scam: 'Touts & Unofficial Guides', howToAvoid: 'Only book tours at verified tourist info booths.' },
        { scam: 'Taxi Overcharging', howToAvoid: 'Insist on using the meter or book rides via smartphone apps.' }
      ],
      healthInfo: {
        waterSafety: 'Prefer bottled or sealed drinking water.',
        foodSafety: 'Choose dining places that have a busy crowd.',
        recommendedVaccines: ['Routine vaccines'],
        healthRisks: [],
        nearestHospitalType: 'General Medical Center',
        medicalStandard: 'Good'
      },
      culturalDos: ['Respect religious guidelines and dress rules.', 'Greet locals warmly.'],
      culturalDonts: ['Do not photograph military checkpoints.', 'Do not litter.'],
      localLaws: ['Always keep a photo ID card with you.'],
      safeNeighborhoods: ['Main Central Square', 'Hotel Strip'],
      areasToAvoid: ['Quiet alleyways late at night'],
      transportSafety: {
        recommendedTransport: ['Metros & Public Rail', 'Licensed Cabs', 'App-based Ride Services'],
        avoidTransport: ['Unlicensed private vehicles'],
        taxiTips: 'Verify driver details and rates before boarding.'
      },
      weatherRisks: 'Check local weather channels prior to transit.',
      embassyInfo: { note: 'Know the dial details of your national embassy.' }
    };
  }

  async getEmergencyContacts(destination) {
    const profile = resolveSafetyProfile(destination || 'India');
    return {
      destination: destination || 'India',
      emergency: profile.numbers[0]?.number || '112',
      contacts: profile.numbers.map(n => ({
        service: n.service,
        number: n.number,
        available: n.available
      }))
    };
  }

  async assessSafetyForLocations(locations) {
    const locationNames = locations.map(l => l.name || l).join(', ');
    return this.assessSafety(locationNames);
  }
}
