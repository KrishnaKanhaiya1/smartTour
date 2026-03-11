// app/api/places/route.js
import { NextResponse } from 'next/server';
import { OpenStreetMapService } from '@/lib/services/openstreetmap';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const places = await OpenStreetMapService.searchPlaces(query);

    return NextResponse.json({
      success: true,
      query,
      count: places.length,
      data: places
    });
  } catch (error) {
    console.error('Places API Error:', error);
    return NextResponse.json(
      { error: 'Failed to search places', details: error.message },
      { status: 500 }
    );
  }
}
