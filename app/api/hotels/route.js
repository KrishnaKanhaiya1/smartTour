// app/api/hotels/route.js
import { NextResponse } from 'next/server';
import { OpenStreetMapService } from '@/lib/services/openstreetmap';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));
    const radius = parseInt(searchParams.get('radius')) || 5000;

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const hotels = await OpenStreetMapService.getNearbyHotels(lat, lng, radius);

    return NextResponse.json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    console.error('Hotels API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels', details: error.message },
      { status: 500 }
    );
  }
}
