// app/api/agent/attractions/route.js
import { NextResponse } from 'next/server';
import { RecommendationAgent } from '@/lib/services/agents/recommendationAgent';

export async function POST(request) {
    try {
        const body = await request.json();
        const { destination, interests, budget, travelStyle, groupSize } = body;

        if (!destination) {
            return NextResponse.json({ success: false, error: 'Destination is required' }, { status: 400 });
        }

        const agent = new RecommendationAgent();
        const result = await agent.findAttractions(destination, {
            interests: interests || [],
            budget: { tier: budget || 'moderate' },
            travelStyle: travelStyle || 'balanced',
            groupSize: groupSize || 2
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('Attractions API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
