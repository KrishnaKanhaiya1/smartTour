// lib/services/agents/translationAgent.js
// Gemini-powered Translation Agent

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are the Translation Agent for SmartTour.
You are a world-class polyglot translator specializing in travel-related translations.
Provide accurate, natural-sounding translations with phonetic pronunciation guides.
Always return valid JSON. Include cultural context notes when the phrase has cultural significance.`;

export class TranslationAgent {
  async translateText(text, targetLanguage = 'hi', sourceLanguage = 'auto') {
    const langNames = {
      hi: 'Hindi', fr: 'French', es: 'Spanish', de: 'German',
      ja: 'Japanese', zh: 'Mandarin Chinese', ar: 'Arabic', pt: 'Portuguese',
      ru: 'Russian', ko: 'Korean', it: 'Italian', ml: 'Malayalam',
      ta: 'Tamil', bn: 'Bengali', th: 'Thai', vi: 'Vietnamese',
      en: 'English', nl: 'Dutch', tr: 'Turkish', sw: 'Swahili',
    };

    const targetName = langNames[targetLanguage] || targetLanguage;

    const prompt = `Translate the following text to ${targetName}.
${sourceLanguage !== 'auto' ? `Source language: ${langNames[sourceLanguage] || sourceLanguage}` : 'Auto-detect the source language.'}

Text to translate: "${text}"

Return a JSON object:
{
  "originalText": "${text}",
  "translatedText": string (the accurate translation in ${targetName}),
  "sourceLanguage": string (detected source language code, e.g. "en"),
  "targetLanguage": "${targetLanguage}",
  "phonetic": string (romanized pronunciation guide — for non-Latin scripts like Hindi, Japanese, Chinese, Arabic, Korean, etc. For Latin-script languages like French or Spanish, provide IPA-style pronunciation hints. Keep it concise),
  "culturalNote": string or null (if the phrase has cultural significance in the target culture, add a brief note — e.g. formality levels, when to use it, local customs. null if not applicable),
  "confidence": number (0.0 to 1.0, your confidence in translation accuracy)
}`;

    try {
      return await askGeminiJSON(SYSTEM_PROMPT, prompt);
    } catch (error) {
      console.error('TranslationAgent Error:', error);
      // Graceful fallback using a free public API when Gemini limits are hit
      try {
        const urlSource = sourceLanguage === 'auto' ? 'en' : sourceLanguage;
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${urlSource}|${targetLanguage}`);
        const data = await res.json();
        if (data && data.responseData && data.responseData.translatedText) {
          return {
            originalText: text,
            translatedText: data.responseData.translatedText,
            sourceLanguage: urlSource,
            targetLanguage,
            phonetic: null,
            culturalNote: "Note: AI translation is temporarily unavailable due to limits. This is a basic fallback translation.",
            confidence: 0.8
          };
        }
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
      }
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage,
        targetLanguage,
        phonetic: null,
        culturalNote: null,
        confidence: 0,
        error: 'Translation service temporarily unavailable due to high AI traffic.',
      };
    }
  }

  // Alias for orchestrator compatibility
  async translateQuery(query) {
    return this.translateText(query);
  }

  // Generate essential travel phrases for a language
  async getTravelPhrases(targetLanguage = 'hi') {
    const langNames = {
      hi: 'Hindi', fr: 'French', es: 'Spanish', de: 'German',
      ja: 'Japanese', zh: 'Mandarin Chinese', ar: 'Arabic', pt: 'Portuguese',
      ru: 'Russian', ko: 'Korean', it: 'Italian', ml: 'Malayalam',
      ta: 'Tamil', bn: 'Bengali', th: 'Thai', vi: 'Vietnamese',
    };

    const targetName = langNames[targetLanguage] || targetLanguage;

    const prompt = `Generate 12 essential travel phrases in ${targetName} that every tourist should know.

Return JSON:
{
  "language": "${targetName}",
  "languageCode": "${targetLanguage}",
  "phrases": [
    {
      "english": string (phrase in English),
      "translated": string (phrase in ${targetName}),
      "phonetic": string (Romanized pronunciation),
      "useCase": string (one of: "Greeting", "Gratitude", "Shopping", "Emergency", "Communication", "Necessity", "Restaurant", "Food", "Navigation", "Tourism", "Transport")
    }
  ]
}`;

    try {
      return await askGeminiJSON(SYSTEM_PROMPT, prompt);
    } catch (error) {
      console.error('Travel Phrases Error:', error);
      // Graceful fallback for phrases
      return {
        language: targetName,
        languageCode: targetLanguage,
        phrases: [
          { english: "Hello / Good morning", translated: "Use translator above to translate", phonetic: "N/A", useCase: "Greeting" },
          { english: "Thank you very much", translated: "Use translator above to translate", phonetic: "N/A", useCase: "Gratitude" },
          { english: "Please call the police", translated: "Use translator above to translate", phonetic: "N/A", useCase: "Emergency" },
          { english: "How much does this cost?", translated: "Use translator above to translate", phonetic: "N/A", useCase: "Shopping" }
        ]
      };
    }
  }
}
