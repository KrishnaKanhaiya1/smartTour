// app/api/directions/route.js
import { NextResponse } from 'next/server';
import { RoutingService } from '@/lib/services/routing';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const startLat = parseFloat(searchParams.get('startLat'));
    const startLng = parseFloat(searchParams.get('startLng'));
    const endLat = parseFloat(searchParams.get('endLat'));
    const endLng = parseFloat(searchParams.get('endLng'));
    const profile = searchParams.get('profile') || 'car';

    if (!startLat || !startLng || !endLat || !endLng) {
      return NextResponse.json(
        { error: 'Start and end coordinates are required' },
        { status: 400 }
      );
    }

    const directions = await RoutingService.getDirections(
      startLat,
      startLng,
      endLat,
      endLng,
      profile
    );

    return NextResponse.json({
      success: true,
      data: directions
    });
  } catch (error) {
    console.error('Directions API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get directions', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { startLat, startLng, endLat, endLng, profile = 'car' } = body;

    if (!startLat || !startLng || !endLat || !endLng) {
      return NextResponse.json(
        { error: 'Start and end coordinates are required' },
        { status: 400 }
      );
    }

    const alternatives = await RoutingService.getAlternativeRoutes(
      startLat,
      startLng,
      endLat,
      endLng,
      profile
    );

    return NextResponse.json({
      success: true,
      count: alternatives.length,
      data: alternatives
    });
  } catch (error) {
    console.error('Alternative Routes API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get routes', details: error.message },
      { status: 500 }
    );
  }
}
