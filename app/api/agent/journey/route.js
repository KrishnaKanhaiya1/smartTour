// app/api/agent/journey/route.js
import { NextResponse } from 'next/server';
import { OrchestratorAgent } from '@/lib/services/agents/orchestrator';

export async function POST(request) {
  try {
    const userData = await request.json();

    const orchestrator = new OrchestratorAgent();
    const result = await orchestrator.planUserJourney(userData);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Journey API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to plan journey' }, { status: 500 });
  }
}
