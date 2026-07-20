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
      throw new Error(`Unable to translate text into ${targetName} right now.`);
    }
  }

  async translateQuery(query) {
    return this.translateText(query);
  }

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
      throw new Error(`Unable to fetch travel phrases for ${targetName} right now.`);
    }
  }
}
