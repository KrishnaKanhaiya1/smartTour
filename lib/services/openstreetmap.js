// lib/services/openstreetmap.js

// In-memory cache for Overpass results (avoids repeat queries for same area)
const _overpassCache = new Map();
const OVERPASS_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export class OpenStreetMapService {

  static async overpassQuery(query) {
    // Check cache first
    const cacheKey = query.replace(/\s+/g, ' ').trim();
    const cached = _overpassCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < OVERPASS_CACHE_TTL) {
      console.log('[Overpass] Cache HIT');
      return cached.data;
    }

    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
      'https://overpass.osm.ch/api/interpreter'
    ];

    let lastError = null;
    for (const url of endpoints) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per endpoint

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
            'User-Agent': 'SmartTour/1.0 (contact: support@smarttour.local)',
          },
          body: new URLSearchParams({ data: query }).toString(),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.status === 429) {
          console.warn(`[Overpass] 429 Rate Limit from ${url}, trying next endpoint...`);
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Cache successful result
        _overpassCache.set(cacheKey, { data, ts: Date.now() });
        return data;
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;
        console.warn(`[Overpass] Error fetching from ${url}:`, err.name === 'AbortError' ? 'Timeout' : err.message);
      }
    }
    throw lastError || new Error('All Overpass API endpoints failed');
  }

  static buildGoogleMapsLink(lat, lng, name) {
    if (!lat || !lng) return null;
    const label = encodeURIComponent(name || `${lat},${lng}`);
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}%20(${label})`;
  }
  
  // Search for places
  static async searchPlaces(query) {
    try {
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.searchParams.append('q', query);
      url.searchParams.append('format', 'json');
      url.searchParams.append('addressdetails', '1');
      url.searchParams.append('limit', '10');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SmartTourKerala/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data.map(place => ({
        id: place.place_id,
        name: place.display_name.split(',')[0],
        fullAddress: place.display_name,
        location: {
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon)
        },
        type: place.type,
        category: place.class
      }));
    } catch (error) {
      console.error('OSM Search Error:', error);
      throw error;
    }
  }

  // Get nearby hotels
  static async getNearbyHotels(lat, lng, radius = 5000) {
    try {
      const query = `
        [out:json][timeout:10];
        (
          node["tourism"~"hotel|guest_house|hostel|motel|resort"](around:${radius},${lat},${lng});
          way["tourism"~"hotel|guest_house|hostel|motel|resort"](around:${radius},${lat},${lng});
          node["building"="hotel"](around:${radius},${lat},${lng});
          way["building"="hotel"](around:${radius},${lat},${lng});
        );
        out center 30;
      `;

      const data = await this.overpassQuery(query);

      return (data.elements || [])
        .filter(el => el.tags && el.tags.name)
        .map(el => ({
          id: el.id,
          osmType: el.type,
          osmId: `${el.type}/${el.id}`,
          name: el.tags.name,
          location: {
            lat: el.lat || el.center?.lat,
            lng: el.lon || el.center?.lon
          },
          address: el.tags['addr:full'] || el.tags['addr:street'] || el.tags['addr:city'] || 'Address not available',
          phone: el.tags.phone || 'N/A',
          website: el.tags.website || null,
          stars: el.tags.stars || 'N/A',
          verified: true,
          mapUrl: this.buildGoogleMapsLink(el.lat || el.center?.lat, el.lon || el.center?.lon, el.tags.name)
        }))
        .filter(place => place.location && place.location.lat && place.location.lng);
    } catch (error) {
      console.warn('Hotels Overpass API Query Failed, using fallback:', error.message);
      return [];
    }
  }

  // Get nearby restaurants
  static async getNearbyRestaurants(lat, lng, radius = 5000) {
    try {
      const query = `
        [out:json][timeout:10];
        (
          node["amenity"~"restaurant|cafe|fast_food|food_court"](around:${radius},${lat},${lng});
          way["amenity"~"restaurant|cafe|fast_food|food_court"](around:${radius},${lat},${lng});
        );
        out center 30;
      `;

      const data = await this.overpassQuery(query);

      return (data.elements || [])
        .filter(el => el.tags && el.tags.name)
        .map(el => ({
          id: el.id,
          osmType: el.type,
          osmId: `${el.type}/${el.id}`,
          name: el.tags.name,
          cuisine: el.tags.cuisine || 'Various',
          location: {
            lat: el.lat || el.center?.lat,
            lng: el.lon || el.center?.lon
          },
          address: el.tags['addr:full'] || el.tags['addr:street'] || el.tags['addr:city'] || 'Address not available',
          phone: el.tags.phone || 'N/A',
          verified: true,
          mapUrl: this.buildGoogleMapsLink(el.lat || el.center?.lat, el.lon || el.center?.lon, el.tags.name)
        }))
        .filter(place => place.location && place.location.lat && place.location.lng);
    } catch (error) {
      console.warn('Restaurants Overpass API Query Failed, using fallback:', error.message);
      return [];
    }
  }

  // Get nearby attractions and monuments
  static async getNearbyAttractions(lat, lng, radius = 5000) {
    try {
      const query = `
        [out:json][timeout:10];
        (
          node["tourism"~"attraction|museum|theme_park|zoo|viewpoint"](around:${radius},${lat},${lng});
          way["tourism"~"attraction|museum|theme_park|zoo|viewpoint"](around:${radius},${lat},${lng});
          node["historic"~"monument|fort|castle|memorial|ruins"](around:${radius},${lat},${lng});
          way["historic"~"monument|fort|castle|memorial|ruins"](around:${radius},${lat},${lng});
        );
        out center 30;
      `;

      const data = await this.overpassQuery(query);

      return (data.elements || [])
        .filter(el => el.tags && el.tags.name)
        .map(el => ({
          id: el.id,
          osmType: el.type,
          osmId: `${el.type}/${el.id}`,
          name: el.tags.name,
          category: el.tags.tourism || el.tags.historic || 'attraction',
          location: {
            lat: el.lat || el.center?.lat,
            lng: el.lon || el.center?.lon
          },
          address: el.tags['addr:full'] || el.tags['addr:street'] || el.tags['addr:city'] || 'Address not available',
          website: el.tags.website || null,
          openingHours: el.tags.opening_hours || null,
          verified: true,
          mapUrl: this.buildGoogleMapsLink(el.lat || el.center?.lat, el.lon || el.center?.lon, el.tags.name)
        }))
        .filter(place => place.location && place.location.lat && place.location.lng);
    } catch (error) {
      console.warn('Attractions Overpass API Query Failed, using fallback:', error.message);
      return [];
    }
  }
}