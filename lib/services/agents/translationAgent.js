// lib/services/agents/translationAgent.js
// Gemini-powered Translation Agent

import { askGeminiJSON } from '@/lib/gemini';

const SYSTEM_PROMPT = `Polyglot travel translator. Provide accurate translations, phonetic guides, and cultural notes.`;

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

    const prompt = `Translate "${text}" to ${targetName}.${sourceLanguage !== 'auto' ? ` Source:${langNames[sourceLanguage] || sourceLanguage}` : ''}
JSON: {"originalText":"${text}","translatedText":str,"sourceLanguage":str,"targetLanguage":"${targetLanguage}","phonetic":str(pronunciation hint),"culturalNote":str/null,"confidence":num}`;

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

    const prompt = `12 essential travel phrases in ${targetName}. JSON: {"language":"${targetName}","languageCode":"${targetLanguage}","phrases":[{"english":str,"translated":str,"phonetic":str,"useCase":str(Greeting/Gratitude/Shopping/Emergency/Communication/Necessity/Restaurant/Food/Navigation/Tourism/Transport)}](12)}`;

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
