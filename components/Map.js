'use client';

import { useState, useEffect, useRef } from 'react';

export default function Map() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('places');
  const [error, setError] = useState('');

  // Leaflet references
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [leafletInstance, setLeafletInstance] = useState(null);
  const [markerGroup, setMarkerGroup] = useState(null);

  // Load Leaflet dynamically on mount
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
      script.onload = () => {
        setMapLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (mapLoaded && mapRef.current && !leafletInstance && window.L) {
      const L = window.L;
      const initialLat = location?.lat || 20.5937; // Default India center
      const initialLng = location?.lng || 78.9629;
      
      const map = L.map(mapRef.current, { zoomControl: false }).setView([initialLat, initialLng], 13);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      const markers = L.layerGroup().addTo(map);

      setLeafletInstance(map);
      setMarkerGroup(markers);
    }
  }, [mapLoaded, location, leafletInstance]);

  // Update map center if geolocation changes
  useEffect(() => {
    if (leafletInstance && location && window.L) {
      leafletInstance.setView([location.lat, location.lng], 14);
    }
  }, [location, leafletInstance]);

  // Update markers when places array changes
  useEffect(() => {
    if (leafletInstance && markerGroup && window.L) {
      const L = window.L;
      markerGroup.clearLayers();

      if (places.length > 0) {
        const bounds = [];
        places.forEach(place => {
          const lat = place.latitude || place.lat;
          const lng = place.longitude || place.lng;
          if (lat && lng) {
            bounds.push([lat, lng]);
            const marker = L.marker([lat, lng]).addTo(markerGroup);
            marker.bindPopup(`<b>${place.name}</b><br/>${place.address || place.type || ''}`);
          }
        });

        if (bounds.length > 0) {
          leafletInstance.fitBounds(bounds, { padding: [40, 40] });
        }
      }
    }
  }, [places, leafletInstance, markerGroup]);

  const searchPlaces = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(`/api/places?q=${encodeURIComponent(searchQuery)}`);
      const data = await resp.json();
      if (data.success) {
        setPlaces(data.data);
        if (data.data.length === 0) setError('No places found for that search.');
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getNearbyPlaces = async (type) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError('');
    setPlaces([]);
    setSelectedType(type);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });

        try {
          const endpointMap = {
            hotels: '/api/hotels',
            restaurants: '/api/restaurants',
            places: '/api/foursquare',
          };
          const endpoint = endpointMap[type] || '/api/foursquare';
          const resp = await fetch(`${endpoint}?lat=${latitude}&lng=${longitude}`);
          const data = await resp.json();

          if (data.success) {
            setPlaces(data.data || []);
            if ((data.data || []).length === 0) setError('No results found nearby.');
          } else {
            setError(data.error || 'Failed to fetch places');
          }
        } catch (err) {
          setError('Error fetching places: ' + err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        const msgs = {
          1: 'Location permission denied. Please allow location access.',
          2: 'Location unavailable. Try again.',
          3: 'Location request timed out.',
        };
        setError(msgs[err.code] || 'Geolocation error.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <span className="label" style={{ color: 'var(--color-primary-light)' }}>POWERED BY OPENSTREETMAP</span>
          <h2 className="section-title">🗺️ Explore Places</h2>
          <p className="section-subtitle">Find nearby hotels, restaurants, and attractions using OpenStreetMap</p>
        </div>
      </div>

      {/* Controls Container */}
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

      {/* Map Display Card */}
      <div style={{ 
        height: '400px', 
        borderRadius: 'var(--radius-xl)', 
        border: '1px solid var(--border-subtle)', 
        overflow: 'hidden', 
        position: 'relative', 
        background: 'var(--color-surface)' 
      }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
        {loading && (
          <div className="skeleton" style={{ position: 'absolute', inset: 0, zIndex: 1000 }} />
        )}
      </div>

      {/* Results Title */}
      {places.length > 0 && (
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-text)', marginTop: '8px' }}>
          Explore Results
        </h3>
      )}

      {/* Results Grid */}
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
