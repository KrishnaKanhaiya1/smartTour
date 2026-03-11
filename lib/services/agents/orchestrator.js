// lib/services/agents/orchestrator.js
// Central orchestrator that coordinates all sub-agents

import { UserContextAgent } from './userContextAgent';
import { ItineraryPlannerAgent } from './itineraryPlannerAgent';
import { FoodRecommendationAgent } from './foodRecommendationAgent';
import { TranslationAgent } from './translationAgent';
import { GuideMatchingAgent } from './guideMatchingAgent';
import { SafetyAgent } from './safetyAgent';
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
    this.itineraryPlanner = new ItineraryPlannerAgent();
    this.foodRecommendation = new FoodRecommendationAgent();
    this.translation = new TranslationAgent();
    this.guideMatching = new GuideMatchingAgent();
    this.safety = new SafetyAgent();
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
      // Step 1: Build user profile
      const userProfile = await this.userContext.analyzePreferences(userData);

      // Step 2: Generate itinerary
      const itinerary = await this.itineraryPlanner.generateItinerary({
        ...userProfile,
        destination: userData.destination || 'India',
      });

      // Step 3: Get food recommendations + safety in parallel
      const [foodRecs, safetyInfo] = await Promise.all([
        this.foodRecommendation.findFood(userData.destination || 'India', {
          budget: userProfile.budget?.tier || 'moderate',
          dietaryRestrictions: userProfile.dietaryRestrictions || [],
        }).catch(err => {
          console.error('Food agent error (non-fatal):', err.message);
          return null;
        }),
        this.safety.assessSafety(userData.destination || 'India').catch(err => {
          console.error('Safety agent error (non-fatal):', err.message);
          return null;
        }),
      ]);

      return {
        userProfile,
        itinerary,
        foodRecommendations: foodRecs,
        safetyInformation: safetyInfo,
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
