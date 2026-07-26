// app/api/agent/guides/route.js
import { NextResponse } from 'next/server';
import { GuideMatchingAgent } from '@/lib/services/agents/guideMatchingAgent';

export async function POST(request) {
  try {
    const body = await request.json();

    const agent = new GuideMatchingAgent();
    const result = await agent.findMatchingGuides({
      destination: body.destination || 'India',
      language: body.language || 'English',
      budget: body.budget || 'moderate',
      interests: body.interests || ['sightseeing', 'culture'],
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Guides API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
