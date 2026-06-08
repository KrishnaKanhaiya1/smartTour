'use client';

import { useState, useEffect, useRef } from 'react';

export default function DirectionsPanel() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [mode, setMode] = useState('car');
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Leaflet references
  const directionsMapRef = useRef(null);
  const [leafletInstance, setLeafletInstance] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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

  // Initialize Map when directions results are ready
  useEffect(() => {
    if (mapLoaded && directionsMapRef.current && !leafletInstance && window.L && directions) {
      const L = window.L;
      const startLat = 8.5241;
      const startLng = 76.9366;
      const endLat = 12.9716;
      const endLng = 77.5946;

      const map = L.map(directionsMapRef.current, { zoomControl: false }).setView([startLat, startLng], 7);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Add Start Marker (green)
      const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      L.marker([startLat, startLng], { icon: greenIcon }).addTo(map).bindPopup('<b>Start: Kochi, Kerala</b>');

      // Add End Marker (default blue)
      L.marker([endLat, endLng]).addTo(map).bindPopup('<b>Destination: Bangalore</b>');

      // Draw route line coordinates (glowing teal polyline)
      const routeCoords = [
        [8.5241, 76.9366],
        [9.9312, 76.2673],
        [10.5276, 76.2144],
        [10.7867, 76.6548],
        [11.0168, 76.9558],
        [11.5034, 77.2444],
        [12.1812, 77.0142],
        [12.9716, 77.5946]
      ];

      // Outer glow line
      L.polyline(routeCoords, {
        color: 'var(--color-primary)',
        weight: 8,
        opacity: 0.3
      }).addTo(map);

      // Inner sharp route line
      L.polyline(routeCoords, {
        color: 'var(--color-primary-light)',
        weight: 4,
        opacity: 0.9
      }).addTo(map);

      map.fitBounds([
        [startLat, startLng],
        [endLat, endLng]
      ], { padding: [40, 40] });

      setLeafletInstance(map);
    }
  }, [mapLoaded, directions, leafletInstance]);

  // Reset Leaflet instance when new directions query starts
  const startNewSearch = () => {
    setLeafletInstance(null);
  };

  const getDirections = async (e) => {
    e.preventDefault();
    setError('');
    setDirections(null);
    startNewSearch();
    setLoading(true);

    try {
      const demoStart = { lat: 8.5241, lng: 76.9366 }; // Kochi
      const demoEnd = { lat: 12.9716, lng: 77.5946 };   // Bangalore

      const resp = await fetch('/api/directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startLat: demoStart.lat,
          startLng: demoStart.lng,
          endLat: demoEnd.lat,
          endLng: demoEnd.lng,
          profile: mode,
        }),
      });

      const data = await resp.json();

      if (data.success && data.data) {
        const route = Array.isArray(data.data) ? data.data[0] : data.data;
        setDirections(route);
      } else {
        setError(data.error || 'Failed to get directions');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fmtDist = (m) => m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
  const fmtDur = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const modeConfig = {
    car: { icon: '🚗', label: 'Car' },
    bike: { icon: '🏍️', label: 'Bike' },
    foot: { icon: '🚶', label: 'Walking' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="page-enter-active">
      {/* Header */}
      <div className="page-header">
        <div>
          <span className="label" style={{ color: 'var(--color-primary-light)' }}>OSRM ROUTING ENGINE</span>
          <h2 className="section-title">🧭 Route Directions</h2>
          <p className="section-subtitle">Get optimized routes with turn-by-turn instructions powered by OSRM</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="card" style={{ padding: '24px' }}>
        <form onSubmit={getDirections}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '20px' }} className="directions-inputs-grid">
            <div>
              <label className="label">Start Location</label>
              <div style={{ position: 'relative' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00b894" strokeWidth="2.5" style={{ position: 'absolute', left: '14px', top: '14px' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="e.g. Kochi, Kerala"
                  className="input-field"
                  style={{ paddingLeft: '42px', height: '46px' }}
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', marginTop: '4px' }}>
                📍 Demo defaults to Kochi, Kerala
              </div>
            </div>
            <div>
              <label className="label">Destination</label>
              <div style={{ position: 'relative' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" style={{ position: 'absolute', left: '14px', top: '14px' }}>
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                <input
                  type="text"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                  placeholder="e.g. Bangalore"
                  className="input-field"
                  style={{ paddingLeft: '42px', height: '46px' }}
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', marginTop: '4px' }}>
                🏁 Demo defaults to Bangalore
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="label">Travel Mode</label>
            <div className="segmented-control">
              {Object.entries(modeConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  className={`segmented-control-btn ${mode === key ? 'active' : ''}`}
                  onClick={() => setMode(key)}
                >
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '56px', fontSize: 'var(--text-base)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            {loading ? (
              <><span className="spinner" /> Calculating route...</>
            ) : (
              <><span style={{ fontSize: '1.1rem' }}>🧭</span> Get Directions</>
            )}
          </button>
        </form>
        
        <style jsx global>{`
          @media (min-width: 768px) {
            .directions-inputs-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }
        `}</style>
      </div>

      {error && (
        <div className="card" style={{ padding: '16px', background: 'var(--color-error-subtle)', border: '1px solid var(--color-error)' }}>
          <p style={{ color: 'var(--color-error)', fontWeight: 600, textAlign: 'center' }}>⚠️ {error}</p>
        </div>
      )}

      {/* Results Panels */}
      {directions && (
        <div className="directions-results-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {/* Left Panel: Summary & Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="directions-left-panel">
            {/* Route Summary */}
            <div className="card" style={{ padding: '24px', background: 'radial-gradient(circle at 10% 10%, rgba(12, 171, 168, 0.08) 0%, rgba(24, 25, 36, 0.7) 100%)' }}>
              <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Route Summary</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Total Distance</div>
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary-light)', fontFamily: 'var(--font-display)' }}>
                    {fmtDist(directions.distance || 0)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Estimated Time</div>
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-success)', fontFamily: 'var(--font-display)' }}>
                    {fmtDur(directions.duration || 0)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{modeConfig[mode]?.icon} {modeConfig[mode]?.label}</span>
                <span className="badge badge-success">🛣️ OSRM Optimized</span>
                {directions.summary && (
                  <span className="badge badge-cyan" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {directions.summary}
                  </span>
                )}
              </div>
            </div>

            {/* Turn-by-Turn Steps */}
            {directions.instructions && directions.instructions.length > 0 && (
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
                  📋 Turn-by-Turn Instructions
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {directions.instructions.slice(0, 8).map((step, i) => (
                    <div key={i} className="direction-step">
                      <div className="step-number">{i + 1}</div>
                      <div>
                        <div className="step-text" style={{ fontSize: 'var(--text-sm)' }}>
                          {step.direction ? <strong style={{ color: 'var(--color-primary-light)' }}>{step.direction} </strong> : null}
                          {step.instruction || 'Continue'}
                        </div>
                        <div className="step-meta" style={{ fontSize: 'var(--text-xs)' }}>
                          {fmtDist(step.distance || 0)} · {fmtDur(step.duration || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {directions.instructions.length > 8 && (
                    <div style={{ textAlign: 'center', padding: '12px 0', fontSize: '0.8rem', color: 'var(--color-text-faint)', fontStyle: 'italic' }}>
                      + {directions.instructions.length - 8} more steps
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Map */}
          <div style={{ 
            height: '450px', 
            borderRadius: 'var(--radius-xl)', 
            border: '1px solid var(--border-subtle)', 
            overflow: 'hidden', 
            position: 'relative', 
            background: 'var(--color-surface)',
            minHeight: '300px'
          }} className="directions-right-panel">
            <div ref={directionsMapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!directions && !loading && !error && (
        <div className="card" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ fontSize: '2.5rem', opacity: 0.5 }}>🧭</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--color-text)' }}>Ready to Navigate</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', maxWidth: '400px' }}>
            Click "Get Directions" to find the best route from Kochi to Bangalore using the OSRM routing engine.
          </p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 992px) {
          .directions-results-grid {
            grid-template-columns: 4fr 6fr !important;
          }
        }
      `}} />
    </div>
  );
}
