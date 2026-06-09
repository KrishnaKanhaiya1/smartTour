// lib/services/agents/orchestrator.js
// Central orchestrator that coordinates all sub-agents

import { UserContextAgent } from './userContextAgent';
import { JourneyComboAgent } from './journeyComboAgent';
import { TranslationAgent } from './translationAgent';
import { GuideMatchingAgent } from './guideMatchingAgent';
import { RecommendationAgent } from './recommendationAgent';
import { askGeminiText } from '@/lib/gemini';

const CHAT_SYSTEM_PROMPT = `You are SmartTour AI — a world-class travel companion chatbot.
You have deep knowledge of destinations worldwide: culture, food, safety, packing, visas, weather, budgets, and local customs.
Be warm, concise, and helpful. Use emojis sparingly for personality.
If a user asks for recommendations, give specific, real-world answers (real restaurant names, real landmark names, real tips).
Never fabricate dangerous safety information — if unsure, say so.
Keep responses under 300 words unless the user asks for detail.`;

export class OrchestratorAgent {
  constructor() {
    this.userContext = new UserContextAgent();
    this.journeyCombo = new JourneyComboAgent(); // Unified agent for itinerary + food + safety
    this.translation = new TranslationAgent();
    this.guideMatching = new GuideMatchingAgent();
    this.recommendation = new RecommendationAgent();
  }

  // Chat method — used by /api/agent/chat
  async chat(message, history = []) {
    try {
      const formattedHistory = history
        .slice(-10) // Keep last 10 messages for context
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');

      const prompt = formattedHistory
        ? `Conversation so far:\n${formattedHistory}\n\nUser: ${message}\n\nRespond helpfully:`
        : message;

      const response = await askGeminiText(CHAT_SYSTEM_PROMPT, prompt);
      return { response, timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('Orchestrator Chat Error:', error);
      throw error;
    }
  }

  // Full journey planning — used by /api/agent/journey
  async planUserJourney(userData) {
    try {
      // Step 1: Build user profile (local processing, no API call)
      const userProfile = await this.userContext.analyzePreferences(userData);

      // Step 2: Generate COMPLETE journey (itinerary + food + safety in ONE Gemini call)
      // This reduces API calls from 3 to 1, preventing rate limiting
      const completeJourney = await this.journeyCombo.generateCompleteJourney({
        ...userProfile,
        destination: userData.destination || 'India',
      });

      return {
        userProfile,
        itinerary: completeJourney.itinerary,
        foodRecommendations: completeJourney.food,
        safetyInformation: completeJourney.safety,
        locations: completeJourney.locations,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Orchestrator Journey Error:', error);
      throw error;
    }
  }

  // Convenience alias
  async orchestrate(userData) {
    return this.planUserJourney(userData);
  }
}
