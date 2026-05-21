'use client';
import { useState, useEffect } from 'react';

export default function SOSButton() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [alertTriggered, setAlertTriggered] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setAlertTriggered(true);
      setCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
        setLocLoading(false);
      },
      (err) => {
        console.error(err);
        setLocLoading(false);
        alert("Failed to get location. Make sure GPS permissions are allowed.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSOS = () => {
    setCountdown(5);
    setAlertTriggered(false);
    fetchLocation();
  };

  const cancelSOS = () => {
    setCountdown(null);
    setAlertTriggered(false);
  };

  return (
    <>
      {/* Floating pulsing button on bottom-left */}
      <button 
        onClick={() => { setOpen(true); fetchLocation(); }}
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '28px',
          zIndex: 9000,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #d63031, #e17055)',
          boxShadow: '0 8px 30px rgba(214,48,49,0.5)',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'sos-pulse 1.8s infinite',
        }}
      >
        🚨
      </button>

      {/* CSS Animation inline for SOS Pulse */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sos-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(214,48,49,0.7); }
          70% { transform: scale(1.08); box-shadow: 0 0 0 15px rgba(214,48,49,0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(214,48,49,0); }
        }
      `}} />

      {/* Modal/Overlay */}
      {open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '480px',
            padding: '30px',
            background: 'rgba(20, 10, 10, 0.95)',
            border: '2px solid rgba(214, 48, 49, 0.4)',
            boxShadow: '0 10px 50px rgba(214, 48, 49, 0.25)',
            animation: 'fadeInUp 0.35s ease'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>🚨</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#ff7675' }}>Emergency SOS Hub</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SAFETY FIRST, ALWAYS</p>
                </div>
              </div>
              <button 
                onClick={() => { setOpen(false); cancelSOS(); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            {/* Countdown or Alert Banner */}
            {countdown !== null && (
              <div style={{ background: 'rgba(214,48,49,0.15)', border: '1px dashed #d63031', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>TRIGGERING SOS BROADCAST IN</p>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ff7675', margin: '10px 0' }}>{countdown}</div>
                <button className="btn-secondary" onClick={cancelSOS} style={{ padding: '8px 20px', borderColor: '#d63031', color: '#ff7675' }}>
                  Cancel Broadcast
                </button>
              </div>
            )}

            {alertTriggered && (
              <div style={{ background: 'rgba(0,184,148,0.15)', border: '1px dashed var(--clr-success)', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '20px', animation: 'sos-pulse 1.5s infinite' }}>
                <p style={{ color: 'var(--clr-success)', fontWeight: 700, fontSize: '1.1rem' }}>✓ SOS ALERT BROADCASTED</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '6px' }}>Your current coordinates and profile have been simulated-shared with local authorities and emergency contacts.</p>
                <button className="btn-secondary" onClick={cancelSOS} style={{ padding: '6px 16px', fontSize: '0.78rem', marginTop: '12px' }}>
                  Clear Alert
                </button>
              </div>
            )}

            {/* General SOS Trigger button */}
            {countdown === null && !alertTriggered && (
              <button 
                onClick={handleSOS}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #d63031, #ff7675)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '16px',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(214,48,49,0.3)',
                  marginBottom: '20px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                🚨 BroadCast One-Tap SOS Alert
              </button>
            )}

            {/* GPS Location status */}
            <div className="glass-card" style={{ padding: '16px', marginBottom: '20px', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>📍 CURRENT GPS LOCATION</span>
                <button onClick={fetchLocation} disabled={locLoading} style={{ background: 'transparent', border: 'none', color: '#00CCCB', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                  {locLoading ? 'Refreshing...' : '🔄 Refresh'}
                </button>
              </div>
              {location ? (
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    Lat: {location.lat.toFixed(6)}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    Lng: {location.lng.toFixed(6)}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Accuracy: ±{location.accuracy.toFixed(1)} meters
                  </p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`SOS! My location: https://maps.google.com/?q=${location.lat},${location.lng}`);
                      alert("Location link copied to clipboard!");
                    }}
                    style={{ background: 'rgba(0, 204, 203, 0.1)', border: '1px solid rgba(0, 204, 203, 0.3)', color: '#00CCCB', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', marginTop: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    📋 Copy Location link
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {locLoading ? 'Fetching GPS coordinates...' : 'No GPS coordinates fetched yet.'}
                </p>
              )}
            </div>

            {/* Quick Contacts */}
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                Local Indian Hotline Numbers
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <a href="tel:112" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '1.2rem' }}>📞</span>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>National SOS</p>
                    <p style={{ fontSize: '0.75rem', color: '#ff7675' }}>Dial 112</p>
                  </div>
                </a>
                <a href="tel:100" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '1.2rem' }}>🚓</span>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Police</p>
                    <p style={{ fontSize: '0.75rem', color: '#ff7675' }}>Dial 100</p>
                  </div>
                </a>
                <a href="tel:102" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '1.2rem' }}>🚑</span>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Ambulance</p>
                    <p style={{ fontSize: '0.75rem', color: '#ff7675' }}>Dial 102</p>
                  </div>
                </a>
                <a href="tel:1363" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '1.2rem' }}>🧳</span>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Tourist Helpline</p>
                    <p style={{ fontSize: '0.75rem', color: '#ff7675' }}>Dial 1363</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
