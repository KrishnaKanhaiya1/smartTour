// lib/services/agents/chatAgent.js
// Gemini-powered Conversational Chat Agent

import { askGeminiText } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are SmartTour AI — a world-class travel companion chatbot.
You have deep knowledge of destinations worldwide: culture, food, safety, packing, visas, weather, budgets, and local customs.
Be warm, concise, and helpful. Use emojis sparingly for personality.
If a user asks for recommendations, give specific, real-world answers (real restaurant names, real landmark names, real tips).
Never fabricate dangerous safety information — if unsure, say so.
Keep responses under 300 words unless the user asks for detail.`;

export class ChatAgent {
  async chat(message, history = []) {
    try {
      const formattedHistory = history
        .slice(-10) // Keep last 10 messages for context
        .map(m => {
          const role = (m.role === 'model' || m.role === 'assistant') ? 'Assistant' : 'User';
          return `${role}: ${m.content}`;
        })
        .join('\n');

      const prompt = formattedHistory
        ? `Conversation so far:\n${formattedHistory}\n\nUser: ${message}\n\nRespond helpfully:`
        : message;

      const response = await askGeminiText(SYSTEM_PROMPT, prompt);
      
      // Generate some quick followup suggestions based on the response
      const suggestions = [
        "Tell me more about safety here.",
        "What are the must-try local dishes?",
        "Help me plan a 3-day itinerary."
      ];

      return { response, reply: response, suggestions, timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('ChatAgent Error:', error);
      return {
        response: "I'm sorry, I'm having trouble processing that right now. (AI Service offline or rate-limited)",
        reply: "I'm sorry, I'm having trouble processing that right now.",
        suggestions: ["Try again in a few seconds"],
        timestamp: new Date().toISOString()
      };
    }
  }
}
