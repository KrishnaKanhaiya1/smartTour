'use client';

import { useState } from 'react';

export default function DirectionsPanel() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [mode, setMode] = useState('car');
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getDirections = async (e) => {
    e.preventDefault();
    setError('');
    setDirections(null);
    setLoading(true);

    try {
      // Using hardcoded demo coordinates (Kochi → Bangalore)
      const demoStart = { lat: 8.5241, lng: 76.9366 }; // Kochi, Kerala
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
        // POST returns getAlternativeRoutes which returns an array
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
    car: { icon: '🚗', label: 'Car', color: 'var(--accent)' },
    bike: { icon: '🏍️', label: 'Bike', color: 'var(--orange)' },
    foot: { icon: '🚶', label: 'Walking', color: 'var(--green)' },
  };

  return (
    <div style={{ padding: '28px', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
      <form onSubmit={getDirections} style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div className="input-group">
            <label className="input-label">Start Location</label>
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="e.g. Kochi, Kerala"
              className="input-field"
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              📍 Demo uses Kochi, Kerala
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Destination</label>
            <input
              type="text"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              placeholder="e.g. Bangalore"
              className="input-field"
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              🏁 Demo uses Bangalore
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="input-label" style={{ marginBottom: 12 }}>Travel Mode</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {Object.entries(modeConfig).map(([key, cfg]) => (
              <label
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: mode === key ? `1px solid var(--accent)` : '1px solid var(--border)',
                  background: mode === key ? 'rgba(99,102,241,0.1)' : 'var(--bg-card-2)',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="radio"
                  name="mode"
                  value={key}
                  checked={mode === key}
                  onChange={() => setMode(key)}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '1.1rem' }}>{cfg.icon}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: mode === key ? 'var(--accent)' : 'var(--text-secondary)' }}>
                  {cfg.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: 8, alignItems: 'center' }}>
          {loading
            ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Finding best route...</>
            : <><span>🧭</span> Get Directions</>
          }
        </button>
      </form>

      {error && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 10,
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#f87171',
          fontSize: '0.875rem',
          marginBottom: 20,
        }}>
          ⚠️ {error}
        </div>
      )}

      {directions && (
        <div style={{ animation: 'fadeUp 0.4s ease forwards' }}>
          {/* Route Summary */}
          <div style={{
            borderRadius: 16,
            padding: 24,
            background: 'var(--bg-card-2)',
            border: '1px solid rgba(99,102,241,0.3)',
            marginBottom: 20,
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 16 }}>
              Route Summary
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Total Distance</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', fontFamily: "'Syne', sans-serif" }}>
                  {fmtDist(directions.distance || 0)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Estimated Time</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green)', fontFamily: "'Syne', sans-serif" }}>
                  {fmtDur(directions.duration || 0)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="pill pill-blue">
                {modeConfig[mode]?.icon} {modeConfig[mode]?.label}
              </span>
              <span className="pill pill-green">🛣️ Optimised Route</span>
              {directions.summary && (
                <span className="pill pill-purple" style={{ fontSize: '0.7rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {directions.summary}
                </span>
              )}
            </div>
          </div>

          {/* Turn-by-turn instructions */}
          {directions.instructions && directions.instructions.length > 0 && (
            <div style={{ background: 'var(--bg-card-2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 16 }}>
                📋 Turn-by-Turn Instructions
              </div>
              <div>
                {directions.instructions.slice(0, 8).map((step, i) => (
                  <div key={i} className="direction-step">
                    <div className="step-number">{i + 1}</div>
                    <div>
                      <div className="step-text">
                        {step.direction ? <strong style={{ color: 'var(--accent)' }}>{step.direction} </strong> : null}
                        {step.instruction || 'Continue'}
                      </div>
                      <div className="step-meta">
                        {fmtDist(step.distance || 0)} · {fmtDur(step.duration || 0)}
                      </div>
                    </div>
                  </div>
                ))}
                {directions.instructions.length > 8 && (
                  <div style={{ textAlign: 'center', padding: '12px 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    + {directions.instructions.length - 8} more steps
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!directions && !loading && !error && (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          background: 'var(--bg-card-2)',
          border: '1px solid var(--border)',
          borderRadius: 16,
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12, opacity: 0.5 }}>🧭</div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Ready to Navigate</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Click "Get Directions" to find the best route from Kochi to Bangalore using the OSRM routing engine.
          </div>
        </div>
      )}
    </div>
  );
}
