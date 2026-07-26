// app/api/agent/hotels/route.js
import { NextResponse } from 'next/server';
import { OpenStreetMapService } from '@/lib/services/openstreetmap';
import { getDestinationKnowledge } from '@/lib/services/travelKnowledgeBase.mjs';

function buildMapUrl(lat, lng, name) {
  if (!lat || !lng) return null;
  const label = encodeURIComponent(name || `${lat},${lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}%20(${label})`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { destination, budget, nights } = body;

    if (!destination) {
      return NextResponse.json({ success: false, error: 'Destination is required' }, { status: 400 });
    }

    const localKB = getDestinationKnowledge(destination);
    if (localKB && localKB.hotels) {
      return NextResponse.json({
        success: true,
        data: {
          destination,
          hotels: localKB.hotels.map(h => ({
            ...h,
            totalPrice: h.pricePerNight * (nights || 3)
          })),
          bookingAdvice: 'Local lodging recommended. Secure rooms early near sight spots.'
        }
      });
    }

    // Resolve destination coordinates via search
    let center = { lat: 20.5937, lng: 78.9629 };
    let hotels = [];

    try {
      const searchResults = await OpenStreetMapService.searchPlaces(destination);
      if (searchResults && searchResults.length > 0) {
        center = searchResults[0].location;
        // Fetch real nearby hotels
        hotels = await OpenStreetMapService.getNearbyHotels(center.lat, center.lng, 5000);
      }
    } catch (e) {
      console.warn('[HotelsAPI] OSM hotels query failed, using templates:', e.message);
    }

    // Format hotels from OSM data or fallbacks
    const nightsCount = Number(nights || 3);
    const budgetVal = budget || 'moderate';
    const ratePerNight = budgetVal === 'luxury' ? 180 : (budgetVal === 'budget' ? 35 : 75);

    const formattedHotels = (hotels.length > 0 ? hotels : [
      { name: 'Grand Central Stay', location: center, address: destination, stars: '4', id: 'ai/fallback-hotel' }
    ]).slice(0, 5).map((item, idx) => ({
      name: item.name,
      neighborhood: item.address || 'Central District',
      stars: Number(item.stars && !isNaN(item.stars) ? item.stars : (3 + (idx % 3))),
      pricePerNight: ratePerNight + (idx * 15) - (idx % 2 * 10),
      totalPrice: (ratePerNight + (idx * 15) - (idx % 2 * 10)) * nightsCount,
      description: `Comfortable and convenient lodging option in the heart of ${destination}, located close to transit routes and sightseeing landmarks.`,
      amenities: idx === 0 ? ['Free WiFi', 'Breakfast', 'Pool'] : ['Free WiFi', 'Air Conditioning', 'Gym'],
      bookingTip: 'Book online early for special discounts.',
      type: idx === 0 ? 'Boutique' : (budgetVal === 'luxury' ? 'Luxury' : 'Mid-Range'),
      recommended: idx === 0,
      mapUrl: item.mapUrl || buildMapUrl(item.location?.lat, item.location?.lng, item.name),
    }));

    return NextResponse.json({
      success: true,
      data: {
        destination,
        hotels: formattedHotels,
        bookingAdvice: `Compare online ratings and book your stay in ${destination} at least a few weeks in advance for better tariffs.`
      }
    });
  } catch (error) {
    console.error('Hotels Agent Route Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error while processing hotels.' }, { status: 500 });
  }
}
