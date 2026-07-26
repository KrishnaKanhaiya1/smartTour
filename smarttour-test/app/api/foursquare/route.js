// app/api/foursquare/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));
    const query = searchParams.get('q') || 'tourism';

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Using alternative data source since Foursquare requires API key
    const places = await searchNearbyPlaces(lat, lng, query);

    return NextResponse.json({
      success: true,
      lat,
      lng,
      query,
      count: places.length,
      data: places
    });
  } catch (error) {
    console.error('Places Search Error:', error);
    return NextResponse.json(
      { error: 'Failed to search places', details: error.message },
      { status: 500 }
    );
  }
}

async function searchNearbyPlaces(lat, lng, category) {
  try {
    // Using Overpass API as fallback
    const categoryTags = {
      'tourism': '["tourism"~"museum|monument|attraction|viewpoint"]',
      'food': '["amenity"~"restaurant|cafe|bar"]',
      'shopping': '["shop"~"mall|market|supermarket"]',
      'entertainment': '["leisure"~"cinema|theatre|park"]'
    };

    const tags = categoryTags[category] || categoryTags.tourism;
    const query = `
      [out:json][timeout:25];
      (
        node${tags}(around:2000,${lat},${lng});
        way${tags}(around:2000,${lat},${lng});
      );
      out body;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.elements
      .filter(el => el.tags && el.tags.name)
      .map(el => ({
        id: el.id,
        name: el.tags.name,
        lat: el.lat || el.center?.lat,
        lng: el.lon || el.center?.lon,
        type: el.tags.tourism || el.tags.amenity || el.tags.shop,
        website: el.tags.website || null,
        phone: el.tags.phone || null,
        openingHours: el.tags.opening_hours || null
      }))
      .filter(place => place.lat && place.lng);
  } catch (error) {
    console.error('Overpass API Error:', error);
    return [];
  }
}
