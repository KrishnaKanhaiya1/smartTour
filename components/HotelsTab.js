'use client';

import { useState } from 'react';

export default function HotelsTab() {
    const [destination, setDestination] = useState('');
    const [budget, setBudget] = useState('moderate');
    const [nights, setNights] = useState(3);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getHotels = async () => {
        if (!destination.trim()) return;
        setLoading(true); setData(null); setError(null);
        try {
            const r = await fetch('/api/agent/hotels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination, budget, nights })
            });
            const d = await r.json();
            if (d.success) setData(d.data);
            else setError(d.error || 'Failed to fetch hotels.');
        } catch (e) { 
            console.error(e); 
            setError('Network error or service unavailable.'); 
        }
        setLoading(false);
    };

    const starIcons = (n) => '★'.repeat(Math.round(n));

    const budgetColors = {
        budget: '#74b9ff', moderate: '#a29bfe', premium: '#fdcb6e', luxury: '#fd79a8'
    };

    const fillPercent = ((nights - 1) / 20) * 100;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="page-enter-active">
            {/* Header */}
            <div className="page-header">
                <div>
                    <span className="label" style={{ color: 'var(--color-primary-light)' }}>ACCOMMODATION FINDER</span>
                    <h2 className="section-title">🏨 Hotel Finder</h2>
                    <p className="section-subtitle">AI-recommended accommodations for every budget</p>
                </div>
            </div>

            {/* Search */}
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }} className="hotel-form-grid">
                    <div>
                        <label className="label">Destination</label>
                        <div style={{ position: 'relative' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" style={{ position: 'absolute', left: '14px', top: '14px' }}>
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <input className="input-field" placeholder="Kyoto, Paris, London, Bali..."
                                value={destination} onChange={e => setDestination(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && getHotels()}
                                style={{ paddingLeft: '42px', height: '46px' }} />
                        </div>
                    </div>
                    <div>
                        <label className="label">Budget</label>
                        <div className="segmented-control">
                            {[
                                { id: 'budget', label: 'Budget' },
                                { id: 'moderate', label: 'Moderate' },
                                { id: 'luxury', label: 'Luxury' }
                            ].map(btn => (
                                <button
                                    key={btn.id}
                                    type="button"
                                    className={`segmented-control-btn ${budget === btn.id ? 'active' : ''}`}
                                    onClick={() => setBudget(btn.id)}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <label className="label">Nights</label>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                                {nights} {nights === 1 ? 'Night' : 'Nights'}
                            </span>
                        </div>
                        <input type="range" min="1" max="21" value={nights}
                            onChange={e => setNights(Number(e.target.value))}
                            className="custom-slider"
                            style={{ 
                                width: '100%', 
                                backgroundSize: `${fillPercent}% 100%`,
                                marginTop: '10px'
                            }} />
                    </div>
                </div>
                <button className="btn-primary" onClick={getHotels} disabled={loading || !destination.trim()} style={{ width: '100%', padding: '13px', justifyContent: 'center', height: '46px' }}>
                    {loading ? <><span className="spinner" /> Finding hotels...</> : 'Find Hotels'}
                </button>
                <style jsx global>{`
                    @media (min-width: 768px) {
                        .hotel-form-grid {
                            grid-template-columns: 2fr 1.5fr 1fr !important;
                            align-items: end;
                        }
                    }
                `}</style>
            </div>

            {data && (
                <div className="card-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }}>Hotels in {data.destination}</h3>
                        <span className="badge" style={{ background: `${budgetColors[budget] || 'var(--color-primary)'}22`, color: budgetColors[budget] || 'var(--color-primary-light)', border: `1px solid ${budgetColors[budget] || 'var(--color-primary)'}44` }}>
                            {nights} nights · {budget} budget
                        </span>
                    </div>

                    {data.hotels?.map((h, i) => (
                        <div key={i} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ height: '3px', background: h.recommended ? 'var(--color-primary)' : 'var(--border-subtle)' }} />
                            <div style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>🏨</div>
                                <div style={{ flex: 1, minWidth: '160px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                                        <div>
                                            <h4 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-sm)' }}>{h.name}</h4>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>📍 {h.neighborhood} · <span style={{ color: 'var(--color-warning)' }}>{starIcons(h.stars)}</span> {h.stars}★</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-warning)' }}>${h.pricePerNight}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/night</span></div>
                                            {h.totalPrice && <div style={{ fontSize: '0.78rem', color: 'var(--color-text-faint)' }}>${h.totalPrice} total</div>}
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '10px' }}>{h.description}</p>
                                    {h.amenities?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                                            {h.amenities.map((a, j) => <span key={j} className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{a}</span>)}
                                        </div>
                                    )}
                                    {h.bookingTip && <p style={{ color: 'var(--color-warning)', fontSize: '0.78rem', fontStyle: 'italic' }}>💡 {h.bookingTip}</p>}
                                </div>
                                {h.recommended && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
                                        <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>🏆 AI Pick</span>
                                        {h.type && <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>{h.type}</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {data.bookingAdvice && (
                        <div className="card" style={{ padding: '20px', background: 'radial-gradient(circle at 10% 10%, rgba(12, 171, 168, 0.08) 0%, rgba(24, 25, 36, 0.7) 100%)' }}>
                            <h4 style={{ fontWeight: 800, marginBottom: '8px', color: 'var(--color-primary-light)', fontFamily: 'var(--font-display)' }}>📋 Booking Advice</h4>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{data.bookingAdvice}</p>
                        </div>
                    )}
                </div>
            )}

            {error && !data && (
                <div className="card" style={{ padding: '24px', background: 'var(--color-error-subtle)', border: '1px solid var(--color-error)' }}>
                    <p style={{ color: 'var(--color-error)', fontWeight: 600, textAlign: 'center' }}>⚠️ {error}</p>
                </div>
            )}

            {!data && !loading && !error && (
                <div className="card" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                    <style>{`
                        @keyframes windowLight {
                            0%, 100% { fill: rgba(255, 255, 255, 0.03); }
                            50% { fill: var(--color-warning); }
                        }
                        .win-1 { animation: windowLight 3s infinite; }
                        .win-2 { animation: windowLight 3s infinite 0.5s; }
                        .win-3 { animation: windowLight 3s infinite 1s; }
                        .win-4 { animation: windowLight 3s infinite 1.5s; }
                        .win-5 { animation: windowLight 3s infinite 2s; }
                    `}</style>
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Hotel Outline */}
                        <path d="M10 70 V15 C10 12.2 12.2 10 15 10 H65 C67.8 10 70 12.2 70 15 V70" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M5 70 H75" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
                        {/* Entrance */}
                        <path d="M34 70 V55 H46 V70" stroke="var(--color-primary)" strokeWidth="2.5" />
                        {/* Windows Matrix */}
                        <rect className="win-1" x="20" y="20" width="8" height="8" rx="1" />
                        <rect className="win-2" x="36" y="20" width="8" height="8" rx="1" />
                        <rect className="win-3" x="52" y="20" width="8" height="8" rx="1" />
                        <rect className="win-4" x="20" y="36" width="8" height="8" rx="1" />
                        <rect className="win-5" x="52" y="36" width="8" height="8" rx="1" />
                    </svg>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--color-text)' }}>AI Hotel Recommendation Engine</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', maxWidth: '400px' }}>Enter your destination, budget, and trip duration to find custom recommended hotels.</p>
                </div>
            )}
        </div>
    );
}
