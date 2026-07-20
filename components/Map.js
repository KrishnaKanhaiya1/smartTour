'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const DAY_COLORS = ['#fdcb6e', '#00b894', '#74b9ff', '#fd79a8', '#a29bfe', '#55efc4', '#ffeaa7'];

function parseCoordinate(place) {
  const lat = Number(place?.lat ?? place?.latitude ?? place?.location?.lat);
  const lng = Number(place?.lng ?? place?.longitude ?? place?.location?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  return { lat, lng };
}

export default function Map({ locations = [], activeDay = 1, defaultDestination = '' }) {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(defaultDestination || '');
  const [selectedType, setSelectedType] = useState('places');
  const [error, setError] = useState('');
  const [routeSegments, setRouteSegments] = useState([]);

  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [leafletInstance, setLeafletInstance] = useState(null);
  const [markerGroup, setMarkerGroup] = useState(null);
  const [itineraryMarkerGroup, setItineraryMarkerGroup] = useState(null);
  const [routeLayerGroup, setRouteLayerGroup] = useState(null);

  const dayLocations = useMemo(() => {
    if (!Array.isArray(locations) || locations.length === 0) return [];
    return locations
      .filter((entry) => Number(entry.day || 1) === Number(activeDay || 1))
      .map((entry, index) => ({
        ...entry,
        order: index + 1,
        coords: parseCoordinate(entry),
      }))
      .filter((entry) => entry.coords);
  }, [locations, activeDay]);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && mapRef.current && !leafletInstance && window.L) {
      const L = window.L;
      const initialLat = location?.lat || dayLocations[0]?.coords?.lat || 20.5937;
      const initialLng = location?.lng || dayLocations[0]?.coords?.lng || 78.9629;

      const map = L.map(mapRef.current, { zoomControl: false }).setView([initialLat, initialLng], 13);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map);

      const exploreMarkers = L.layerGroup().addTo(map);
      const itineraryMarkers = L.layerGroup().addTo(map);
      const routes = L.layerGroup().addTo(map);

      setLeafletInstance(map);
      setMarkerGroup(exploreMarkers);
      setItineraryMarkerGroup(itineraryMarkers);
      setRouteLayerGroup(routes);

      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }
  }, [mapLoaded, location, leafletInstance, dayLocations]);

  useEffect(() => {
    if (leafletInstance) {
      const timer = setTimeout(() => {
        leafletInstance.invalidateSize();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [leafletInstance, activeDay, places]);

  useEffect(() => {
    if (leafletInstance && location) {
      leafletInstance.setView([location.lat, location.lng], 13);
    }
  }, [location, leafletInstance]);

  useEffect(() => {
    if (!leafletInstance || !markerGroup || !window.L) return;

    const L = window.L;
    markerGroup.clearLayers();

    if (!places.length) return;

    const bounds = [];
    places.forEach((place) => {
      const coords = parseCoordinate(place);
      if (!coords) return;

      bounds.push([coords.lat, coords.lng]);
      const marker = L.marker([coords.lat, coords.lng]).addTo(markerGroup);
      marker.bindPopup(`<b>${place.name}</b><br/>${place.address || place.type || place.cuisine || ''}`);
    });

    if (bounds.length) {
      leafletInstance.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [places, leafletInstance, markerGroup]);

  useEffect(() => {
    if (!window.L || !leafletInstance || !itineraryMarkerGroup || !routeLayerGroup) return;

    const L = window.L;
    itineraryMarkerGroup.clearLayers();
    routeLayerGroup.clearLayers();

    if (!dayLocations.length) return;

    const bounds = [];
    const color = DAY_COLORS[(Number(activeDay || 1) - 1) % DAY_COLORS.length];

    dayLocations.forEach((place) => {
      bounds.push([place.coords.lat, place.coords.lng]);

      const icon = L.divIcon({
        className: 'smarttour-day-marker',
        html: `<div style="background:${color};color:#09090b;width:30px;height:30px;border-radius:50%;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px #09090b, 0 0 12px ${color}44, 0 4px 12px rgba(0,0,0,0.5);font-family:var(--font-body);">${place.order}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([place.coords.lat, place.coords.lng], { icon }).addTo(itineraryMarkerGroup);
      const verified = place.verified ? '<span style="color:#22c55e;font-size:11px;">● Verified</span>' : '';
      marker.bindPopup(
        `<div style="font-family:var(--font-body);"><b style="font-size:13px;">${place.name || 'Stop ' + place.order}</b><br/>${verified}<br/><span style="color:#a1a1aa;font-size:12px;">${place.category || 'Itinerary stop'}</span>${place.mapUrl ? `<br/><a href="${place.mapUrl}" target="_blank" style="color:#2dd4bf;font-size:12px;">Open in Google Maps →</a>` : ''}</div>`
      );
    });

    routeSegments.forEach((segment) => {
      const points = (segment?.geometry?.coordinates || []).map(([lng, lat]) => [lat, lng]);
      if (!points.length) return;

      // Glow layer
      L.polyline(points, {
        color,
        weight: 10,
        opacity: 0.2,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routeLayerGroup);

      // Main line
      L.polyline(points, {
        color,
        weight: 3,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routeLayerGroup);
    });

    if (bounds.length) {
      leafletInstance.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [activeDay, dayLocations, itineraryMarkerGroup, leafletInstance, routeLayerGroup, routeSegments]);

  useEffect(() => {
    const fetchRouteSegments = async () => {
      if (dayLocations.length < 2) {
        setRouteSegments([]);
        return;
      }

      try {
        const routeCalls = [];
        for (let i = 0; i < dayLocations.length - 1; i += 1) {
          const start = dayLocations[i].coords;
          const end = dayLocations[i + 1].coords;
          routeCalls.push(
            fetch(`/api/directions?startLat=${start.lat}&startLng=${start.lng}&endLat=${end.lat}&endLng=${end.lng}`).then((r) => r.json())
          );
        }

        const all = await Promise.all(routeCalls);
        const clean = all
          .filter((item) => item?.success && item?.data?.geometry)
          .map((item) => item.data);
        setRouteSegments(clean);
      } catch (routeError) {
        console.error(routeError);
        setRouteSegments([]);
      }
    };

    fetchRouteSegments();
  }, [dayLocations]);

  const fetchCategoryPlaces = async (type, lat, lng, searchKeyword = '') => {
    try {
      const endpointMap = {
        hotels: '/api/hotels',
        restaurants: '/api/restaurants',
        places: '/api/foursquare',
      };
      const endpoint = endpointMap[type] || '/api/foursquare';
      const resp = await fetch(`${endpoint}?lat=${lat}&lng=${lng}`);
      const data = await resp.json();

      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setPlaces(data.data);
        return true;
      }
      
      // Fallback: If Overpass API returned 0 items for hotels/restaurants, query /api/places with location name
      if (searchKeyword) {
        console.log(`[Map] Overpass returned 0 for ${type}, querying /api/places fallback for ${searchKeyword}...`);
        const fallbackQuery = `${type === 'hotels' ? 'hotel' : type === 'restaurants' ? 'restaurant' : 'attraction'} in ${searchKeyword}`;
        const fallbackResp = await fetch(`/api/places?q=${encodeURIComponent(fallbackQuery)}`);
        const fallbackData = await fallbackResp.json();
        if (fallbackData.success && Array.isArray(fallbackData.data) && fallbackData.data.length > 0) {
          setPlaces(fallbackData.data);
          return true;
        }
      }

      setError(`No ${type} found in this area.`);
      return false;
    } catch (err) {
      setError(`Error fetching places: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const searchPlaces = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(`/api/places?q=${encodeURIComponent(searchQuery)}`);
      const data = await resp.json();
      if (data.success) {
        const resultPlaces = data.data || [];
        setPlaces(resultPlaces);
        if (resultPlaces.length > 0) {
          const firstCoords = parseCoordinate(resultPlaces[0]);
          if (firstCoords) {
            setLocation(firstCoords);
            // Fetch selected category for the searched location
            fetchCategoryPlaces(selectedType, firstCoords.lat, firstCoords.lng, searchQuery);
          }
        } else {
          setError('No places found for that search. Try another location.');
        }
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getNearbyPlaces = async (type) => {
    setLoading(true);
    setError('');
    setPlaces([]);
    setSelectedType(type);

    let targetLat = location?.lat || dayLocations[0]?.coords?.lat;
    let targetLng = location?.lng || dayLocations[0]?.coords?.lng;

    // If user typed a search query (e.g. "patna") and location is not set yet, geocode it first!
    if (searchQuery.trim()) {
      try {
        const resp = await fetch(`/api/places?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await resp.json();
        if (data.success && data.data && data.data.length > 0) {
          const firstCoords = parseCoordinate(data.data[0]);
          if (firstCoords) {
            targetLat = firstCoords.lat;
            targetLng = firstCoords.lng;
            setLocation(firstCoords);
          }
        }
      } catch (e) {
        console.warn('[Map] Geocoding query failed:', e.message);
      }
    }

    if (targetLat && targetLng) {
      await fetchCategoryPlaces(type, targetLat, targetLng, searchQuery);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          await fetchCategoryPlaces(type, latitude, longitude, searchQuery);
        },
        async () => {
          const fallbackLat = 20.5937;
          const fallbackLng = 78.9629;
          setLocation({ lat: fallbackLat, lng: fallbackLng });
          await fetchCategoryPlaces(type, fallbackLat, fallbackLng, searchQuery);
        },
        { timeout: 5000 }
      );
    } else {
      const fallbackLat = 20.5937;
      const fallbackLng = 78.9629;
      setLocation({ lat: fallbackLat, lng: fallbackLng });
      await fetchCategoryPlaces(type, fallbackLat, fallbackLng, searchQuery);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {dayLocations.length > 0 && (
        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Day {activeDay} itinerary loaded: {dayLocations.length} verified stop(s)
            </p>
            <span className="badge badge-success">🟢 Verified Route</span>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { type: 'hotels', label: '🏨 Nearby Hotels' },
            { type: 'restaurants', label: '🍽️ Restaurants' },
            { type: 'places', label: '🏛️ Attractions' },
          ].map(({ type, label }) => {
            const active = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => getNearbyPlaces(type)}
                disabled={loading}
                className={`pill-toggle ${active ? 'active' : ''}`}
                style={{ padding: '8px 16px', fontSize: 'var(--text-xs)' }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <form onSubmit={searchPlaces} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" style={{ position: 'absolute', left: '14px', top: '14px' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for any place..."
              className="input-field"
              style={{ paddingLeft: '42px', height: '46px' }}
            />
          </div>
          <button type="submit" disabled={loading || !searchQuery.trim()} className="btn-primary" style={{ height: '46px', whiteSpace: 'nowrap' }}>
            Search Map
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: 12,
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-error-subtle)',
            border: '1px solid var(--color-error)',
            color: 'var(--color-error)',
            fontSize: 'var(--text-xs)',
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      <div style={{
        height: '400px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--color-surface)',
      }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
        {loading && (
          <div className="skeleton" style={{ position: 'absolute', inset: 0, zIndex: 1000 }} />
        )}
      </div>

      {places.length > 0 && (
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-text)', marginTop: '8px' }}>
          Explore Results
        </h3>
      )}

      {places.length > 0 && (
        <div className="card-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {places.map((place, i) => (
            <div key={place.id || i} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>
                      {selectedType === 'hotels' ? '🏨' : selectedType === 'restaurants' ? '🍽️' : '🏛️'}
                    </span>
                    <h4 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {place.name}
                    </h4>
                  </div>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem', flexShrink: 0 }}>
                    {place.distance ? `${(place.distance / 1000).toFixed(1)} km` : 'Nearby'}
                  </span>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', lineHeight: 1.4, marginBottom: '10px' }}>
                  {place.address || place.fullAddress || place.cuisine || place.type || 'No description available'}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                {place.rating ? (
                  <span style={{ color: 'var(--color-warning)', fontSize: '0.78rem', fontWeight: 600 }}>★ {place.rating}</span>
                ) : (
                  <span style={{ color: 'var(--color-text-faint)', fontSize: '0.75rem' }}>No ratings</span>
                )}
                {place.phone && place.phone !== 'N/A' ? (
                  <span style={{ color: 'var(--color-text-faint)', fontSize: '0.75rem' }}>📞 {place.phone}</span>
                ) : (
                  <span style={{ color: 'var(--color-text-faint)', fontSize: '0.75rem' }}>No phone info</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
