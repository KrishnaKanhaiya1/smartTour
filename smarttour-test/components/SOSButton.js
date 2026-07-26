'use client';

import { useEffect, useMemo, useState } from 'react';

const EMERGENCY_BY_COUNTRY = {
  in: [
    { service: 'National Emergency', number: '112' },
    { service: 'Police', number: '100' },
    { service: 'Ambulance', number: '102' },
  ],
  us: [
    { service: 'Emergency', number: '911' },
  ],
  gb: [
    { service: 'Emergency', number: '999' },
    { service: 'EU Emergency', number: '112' },
  ],
  fr: [
    { service: 'Emergency', number: '112' },
    { service: 'Medical', number: '15' },
  ],
  de: [
    { service: 'Emergency', number: '112' },
    { service: 'Police', number: '110' },
  ],
  ae: [
    { service: 'Police', number: '999' },
    { service: 'Ambulance', number: '998' },
  ],
};

const DEFAULT_NUMBERS = [
  { service: 'Global Emergency', number: '112' },
];

function toMapsLink(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export default function SOSButton() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const emergencyNumbers = useMemo(() => {
    const code = countryCode.toLowerCase();
    return EMERGENCY_BY_COUNTRY[code] || DEFAULT_NUMBERS;
  }, [countryCode]);

  const fetchCountryFromCoordinates = async (lat, lng) => {
    try {
      const url = new URL('https://nominatim.openstreetmap.org/reverse');
      url.searchParams.set('lat', String(lat));
      url.searchParams.set('lon', String(lng));
      url.searchParams.set('format', 'json');
      url.searchParams.set('addressdetails', '1');

      const response = await fetch(url, {
        headers: { 'User-Agent': 'SmartTour/1.0' },
      });
      if (!response.ok) return;

      const data = await response.json();
      const cc = data?.address?.country_code || '';
      const cn = data?.address?.country || '';
      setCountryCode(cc);
      setCountryName(cn);
    } catch (error) {
      console.error('Reverse geocode failed:', error);
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setShareStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingLocation(true);
    setShareStatus('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const next = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setLocation(next);
        setLoadingLocation(false);
        await fetchCountryFromCoordinates(next.lat, next.lng);
      },
      (err) => {
        console.error(err);
        setLoadingLocation(false);
        setShareStatus('Unable to fetch your location. Check browser permission settings.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleOpen = () => {
    setOpen(true);
    if (!location) fetchLocation();
  };

  const shareLocation = async () => {
    if (!location) {
      setShareStatus('Fetch location first, then share.');
      return;
    }

    const mapsLink = toMapsLink(location.lat, location.lng);
    const text = `Emergency help needed. My location: ${mapsLink}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'SmartTour SOS Location', text, url: mapsLink });
        setShareStatus('Location shared successfully.');
        return;
      }
      await navigator.clipboard.writeText(text);
      setShareStatus('Web Share not available. Location copied to clipboard.');
    } catch (error) {
      console.error(error);
      setShareStatus('Sharing was cancelled or unavailable.');
    }
  };

  const whatsappHref = location
    ? `https://wa.me/?text=${encodeURIComponent(`Emergency help needed. My location: ${toMapsLink(location.lat, location.lng)}`)}`
    : '#';
  const smsHref = location
    ? `sms:?body=${encodeURIComponent(`Emergency help needed. My location: ${toMapsLink(location.lat, location.lng)}`)}`
    : '#';
  const mailHref = location
    ? `mailto:?subject=${encodeURIComponent('Emergency location')}&body=${encodeURIComponent(`Emergency help needed. My location: ${toMapsLink(location.lat, location.lng)}`)}`
    : '#';
  const hospitalHref = location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`hospital near ${location.lat},${location.lng}`)}`
    : 'https://www.google.com/maps/search/?api=1&query=hospital+near+me';

  return (
    <>
      {/* SOS FAB */}
      <button
        id="sos-fab"
        onClick={handleOpen}
        className="no-print"
        style={{
          position: 'fixed', bottom: '28px', left: '28px', zIndex: 9000,
          width: '56px', height: '56px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'var(--color-error)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 24px rgba(239, 68, 68, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', animation: 'sos-pulse 2s ease-in-out infinite',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sos-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239,68,68,0.5), 0 8px 24px rgba(239,68,68,0.3); }
          50% { transform: scale(1.06); box-shadow: 0 0 0 12px rgba(239,68,68,0), 0 8px 24px rgba(239,68,68,0.3); }
        }
      ` }} />

      {/* Full-screen Emergency Panel */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999, padding: '20px',
          animation: 'fade-in 0.2s ease',
        }}>
          <div style={{
            width: '100%', maxWidth: '480px',
            background: 'var(--color-surface-1)',
            boxShadow: '0 0 0 1px rgba(239,68,68,0.2), 0 24px 48px rgba(0,0,0,0.5)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
            animation: 'fade-up 0.3s var(--ease-out-expo)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 900, color: 'var(--color-error)' }}>
                  Emergency SOS
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Real emergency actions only
                </p>
              </div>
              <button id="close-sos-modal" onClick={() => setOpen(false)} className="btn-icon" style={{ color: 'var(--color-text-muted)' }} aria-label="Close SOS Modal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Location Card */}
            <div className="card card--flat" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)', background: 'var(--color-surface-0)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="label" style={{ marginBottom: 0 }}>Current Location</span>
                <button onClick={fetchLocation} disabled={loadingLocation} style={{
                  background: 'transparent', border: 'none', color: 'var(--color-primary-light)',
                  cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 700,
                }}>
                  {loadingLocation ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              {location ? (
                <>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: '2px' }}>
                    ±{location.accuracy.toFixed(1)}m accuracy {countryName ? `· ${countryName}` : ''}
                  </p>
                </>
              ) : (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  {loadingLocation ? 'Fetching GPS coordinates...' : 'Location not fetched yet.'}
                </p>
              )}
            </div>

            {/* Emergency Numbers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 'var(--space-4)' }}>
              {emergencyNumbers.map((entry) => (
                <a
                  key={`${entry.service}-${entry.number}`}
                  href={`tel:${entry.number}`}
                  className="card card--interactive card--flat"
                  style={{ textDecoration: 'none', padding: 'var(--space-3)', background: 'var(--color-surface-0)' }}
                >
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{entry.service}</p>
                  <p style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--color-error)' }}>Dial {entry.number}</p>
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--space-4)' }}>
              <button onClick={shareLocation} className="btn-danger" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share Location
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-secondary" style={{ justifyContent: 'center', textDecoration: 'none', fontSize: 'var(--text-xs)' }}>WhatsApp</a>
                <a href={smsHref} className="btn-secondary" style={{ justifyContent: 'center', textDecoration: 'none', fontSize: 'var(--text-xs)' }}>SMS</a>
                <a href={mailHref} className="btn-secondary" style={{ justifyContent: 'center', textDecoration: 'none', fontSize: 'var(--text-xs)' }}>Email</a>
              </div>
            </div>

            <a href={hospitalHref} target="_blank" rel="noreferrer" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Find Nearest Hospital
            </a>

            {shareStatus && (
              <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                {shareStatus}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
