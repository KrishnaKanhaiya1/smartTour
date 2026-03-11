// app/api/agent/translate/route.js
import { NextResponse } from 'next/server';
import { TranslationAgent } from '@/lib/services/agents/translationAgent';

export async function POST(request) {
  try {
    const { text, targetLanguage, sourceLanguage, mode } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ success: false, error: 'Text and targetLanguage are required' }, { status: 400 });
    }

    const agent = new TranslationAgent();

    // If mode is 'phrases', generate travel phrases instead
    if (mode === 'phrases') {
      const result = await agent.getTravelPhrases(targetLanguage);
      return NextResponse.json({ success: true, data: result });
    }

    const result = await agent.translateText(text, targetLanguage, sourceLanguage || 'auto');
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Translate API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
