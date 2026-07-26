// app/api/weather/route.js
import { NextResponse } from 'next/server';
import { WeatherService } from '@/lib/services/weather';

async function geocodeCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    const { latitude, longitude, name, country } = data.results[0];
    return { lat: latitude, lng: longitude, name, country };
  }
  return null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let lat = parseFloat(searchParams.get('lat'));
    let lng = parseFloat(searchParams.get('lng'));
    const location = searchParams.get('location');

    // If city name provided, geocode it
    if (location && (!lat || !lng)) {
      const geo = await geocodeCity(location);
      if (!geo) {
        return NextResponse.json({ success: false, error: `Could not find location: ${location}` }, { status: 400 });
      }
      lat = geo.lat;
      lng = geo.lng;
    }

    if (!lat || !lng) {
      return NextResponse.json({ success: false, error: 'Provide lat/lng or a location name' }, { status: 400 });
    }

    const weather = await WeatherService.getWeather(lat, lng);
    return NextResponse.json({ success: true, data: weather });
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch weather', details: error.message }, { status: 500 });
  }
}
