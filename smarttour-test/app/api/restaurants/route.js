// app/api/restaurants/route.js
import { NextResponse } from 'next/server';
import { OpenStreetMapService } from '@/lib/services/openstreetmap';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const restaurants = await OpenStreetMapService.getNearbyRestaurants(lat, lng);

    return NextResponse.json({ 
      success: true,
      count: restaurants.length,
      data: restaurants 
    });

  } catch (error) {
    console.error('Restaurants API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants', details: error.message },
      { status: 500 }
    );
  }
}