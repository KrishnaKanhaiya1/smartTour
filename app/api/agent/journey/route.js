// app/api/agent/journey/route.js
import { NextResponse } from 'next/server';
import { OrchestratorAgent } from '@/lib/services/agents/orchestrator';
import { JourneyRequestSchema } from '@/lib/validation';

export async function POST(request) {
  try {
    let userData;
    try {
      userData = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const parsed = JourneyRequestSchema.safeParse(userData);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ success: false, error: `Validation failed: ${errorMsg}` }, { status: 400 });
    }

    const orchestrator = new OrchestratorAgent();
    const result = await orchestrator.planUserJourney(parsed.data);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Journey API Error:', error);
    
    // Check if error is related to rate limits or key exhaustion
    const isRateLimit = error.status === 429 || 
      (error.message && (
        error.message.includes('exhausted') || 
        error.message.includes('quota') || 
        error.message.includes('rate limit') || 
        error.message.includes('Circuit breaker')
      ));

    if (isRateLimit) {
      return NextResponse.json({ 
        success: false, 
        code: 'AI_UNAVAILABLE', 
        error: 'Trip generation is temporarily unavailable due to high API traffic. Please try again in a minute.' 
      }, { status: 503 });
    }

    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to plan journey. Please check destination details and try again.' 
    }, { status: 500 });
  }
}
