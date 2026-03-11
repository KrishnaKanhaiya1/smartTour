// app/api/agent/safety/route.js
import { NextResponse } from 'next/server';
import { SafetyAgent } from '@/lib/services/agents/safetyAgent';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination') || 'India';

    const agent = new SafetyAgent();
    const result = await agent.assessSafety(destination);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Safety API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const destination = body.destination || body.location || 'India';

    const agent = new SafetyAgent();
    const result = await agent.assessSafety(destination, { travelerType: body.travelerType });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Safety API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
