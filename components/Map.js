'use client';

import { useState, useRef } from 'react';

export default function Map() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [error, setError] = useState('');

  const searchPlaces = async (e) => {
    e.preventDefault();
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

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setSelectedType(type);

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

  const typeIcons = { hotels: '🏨', restaurants: '🍽️', places: '📍' };
  const typeColors = {
    hotels: 'rgba(16,185,129,0.15)',
    restaurants: 'rgba(245,158,11,0.15)',
    places: 'rgba(139,92,246,0.15)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
      {/* Controls */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-card-2)' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          {[
            { type: 'hotels', label: '🏨 Nearby Hotels' },
            { type: 'restaurants', label: '🍽️ Restaurants' },
            { type: 'places', label: '📍 Attractions' },
          ].map(({ type, label }) => (
            <button
              key={type}
              onClick={() => getNearbyPlaces(type)}
              disabled={loading}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: '0.85rem',
                border: selectedType === type ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: selectedType === type ? 'var(--gradient-accent)' : 'var(--bg-card)',
                color: 'var(--text-primary)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={searchPlaces} style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for any place..."
            className="input-field"
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ flexShrink: 0 }}
          >
            {loading ? '...' : '🔍 Search'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: 10,
            padding: '10px 14px',
            borderRadius: 8,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171',
            fontSize: '0.85rem',
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Map placeholder + results */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Location info bar */}
        {location && (
          <div style={{
            padding: '10px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'rgba(99,102,241,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}>
            <span>📍</span>
            <span>Your location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
            {selectedType && (
              <span className="pill pill-blue" style={{ marginLeft: 'auto' }}>
                {typeIcons[selectedType]} Showing {selectedType}
              </span>
            )}
          </div>
        )}

        {/* Results grid / empty state */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14, padding: 40 }}>
            <div className="animate-spin" style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} />
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Searching nearby places...</div>
          </div>
        ) : places.length > 0 ? (
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {places.map((place, i) => (
              <div
                key={place.id || i}
                style={{
                  background: 'var(--bg-card-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 14,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                  e.currentTarget.style.background = 'rgba(99,102,241,0.06)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--bg-card-2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {place.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {place.address || place.fullAddress || place.cuisine || place.type || 'No description'}
                </div>
                {place.phone && place.phone !== 'N/A' && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📞 {place.phone}</div>
                )}
                {place.rating && (
                  <div style={{ fontSize: '0.78rem', color: '#fbbf24', marginTop: 4 }}>★ {place.rating}</div>
                )}
                {place.type && (
                  <div style={{ marginTop: 8 }}>
                    <span className="pill pill-blue" style={{ fontSize: '0.7rem' }}>{place.type}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', opacity: 0.4 }}>🗺️</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Explore Places Around You</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 300 }}>
              Click a category button above to find nearby hotels, restaurants and attractions, or search for a specific location.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
