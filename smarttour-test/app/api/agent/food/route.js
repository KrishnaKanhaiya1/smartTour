// app/api/agent/food/route.js
import { NextResponse } from 'next/server';
import { FoodRecommendationAgent } from '@/lib/services/agents/foodRecommendationAgent';

export async function POST(request) {
  try {
    const body = await request.json();
    const { destination, budget, dietaryRestrictions, travelStyle } = body;

    if (!destination) {
      return NextResponse.json({ success: false, error: 'Destination is required' }, { status: 400 });
    }

    const agent = new FoodRecommendationAgent();
    const result = await agent.findFood(destination, {
      budget: budget || 'moderate',
      dietaryRestrictions: dietaryRestrictions || [],
      travelStyle: travelStyle || 'balanced',
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Food API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
