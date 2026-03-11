// lib/services/openstreetmap.js

export class OpenStreetMapService {
  
  // Search for places
  static async searchPlaces(query) {
    try {
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.searchParams.append('q', query);
      url.searchParams.append('format', 'json');
      url.searchParams.append('addressdetails', '1');
      url.searchParams.append('limit', '10');

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SmartTourKerala/1.0'
        }
      });

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
        [out:json][timeout:25];
        (
          node["tourism"="hotel"](around:${radius},${lat},${lng});
          way["tourism"="hotel"](around:${radius},${lat},${lng});
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
          location: {
            lat: el.lat || el.center?.lat,
            lng: el.lon || el.center?.lon
          },
          address: el.tags['addr:full'] || el.tags['addr:street'] || 'Address not available',
          phone: el.tags.phone || 'N/A',
          website: el.tags.website || null,
          stars: el.tags.stars || 'N/A'
        }))
        .filter(place => place.location.lat && place.location.lng);
    } catch (error) {
      console.error('Hotels API Error:', error);
      throw error;
    }
  }

  // Get nearby restaurants
  static async getNearbyRestaurants(lat, lng, radius = 3000) {
    try {
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="restaurant"](around:${radius},${lat},${lng});
          node["amenity"="cafe"](around:${radius},${lat},${lng});
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
          cuisine: el.tags.cuisine || 'Various',
          location: {
            lat: el.lat,
            lng: el.lon
          },
          address: el.tags['addr:full'] || el.tags['addr:street'] || 'Address not available',
          phone: el.tags.phone || 'N/A'
        }));
    } catch (error) {
      console.error('Restaurants API Error:', error);
      throw error;
    }
  }
}