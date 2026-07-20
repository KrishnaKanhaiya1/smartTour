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

    let hotels = await OpenStreetMapService.getNearbyHotels(lat, lng, radius);
    if (hotels.length === 0) {
      try {
        const fallbackPlaces = await OpenStreetMapService.searchPlaces(`hotel near ${lat},${lng}`);
        if (fallbackPlaces && fallbackPlaces.length > 0) {
          hotels = fallbackPlaces.map((p, idx) => ({
            id: p.id || `hotel-fb-${idx}`,
            osmType: 'node',
            osmId: `node/${p.id || idx}`,
            name: p.name,
            location: p.location,
            address: p.fullAddress || 'Address not available',
            phone: 'N/A',
            website: null,
            stars: 'N/A',
            verified: true,
            mapUrl: OpenStreetMapService.buildGoogleMapsLink(p.location.lat, p.location.lng, p.name)
          }));
        }
      } catch (fbErr) {
        console.warn('[Hotels API] Fallback search failed:', fbErr.message);
      }
    }

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
