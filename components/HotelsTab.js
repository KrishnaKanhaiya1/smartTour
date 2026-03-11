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
        } catch (e) { console.error(e); setError('Network error or service unavailable.'); }
        setLoading(false);
    };

    const starIcons = (n) => '⭐'.repeat(Math.round(n));

    const budgetColors = {
        budget: '#74b9ff', moderate: '#a29bfe', premium: '#fdcb6e', luxury: '#fd79a8'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
                <h2 className="section-title">🏨 Hotel Finder</h2>
                <p className="section-subtitle">AI-recommended accommodations for every budget</p>
            </div>

            {/* Search */}
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label className="label">Destination</label>
                        <input className="input-field" placeholder="Paris, Tokyo, Bali..."
                            value={destination} onChange={e => setDestination(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && getHotels()} />
                    </div>
                    <div>
                        <label className="label">Budget</label>
                        <select className="input-field" value={budget} onChange={e => setBudget(e.target.value)}>
                            <option value="budget">💰 Budget</option>
                            <option value="moderate">💳 Moderate</option>
                            <option value="premium">💎 Premium</option>
                            <option value="luxury">👑 Luxury</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Nights ({nights})</label>
                        <input type="range" min="1" max="21" value={nights}
                            onChange={e => setNights(Number(e.target.value))}
                            style={{ width: '100%', marginTop: '12px', accentColor: 'var(--clr-primary)' }} />
                    </div>
                </div>
                <button className="btn-primary" onClick={getHotels} disabled={loading || !destination.trim()} style={{ width: '100%', padding: '13px' }}>
                    {loading ? <><span className="spinner" /> Finding hotels...</> : '🔍 Find Hotels'}
                </button>
            </div>

            {data && (
                <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }}>Hotels in {data.destination}</h3>
                        <span className="badge" style={{ background: `${budgetColors[budget]}22`, color: budgetColors[budget], border: `1px solid ${budgetColors[budget]}44` }}>
                            {nights} nights · {budget} budget
                        </span>
                    </div>

                    {data.hotels?.map((h, i) => (
                        <div key={i} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ height: '3px', background: h.recommended ? 'var(--grad-primary)' : 'var(--border-subtle)' }} />
                            <div style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'rgba(108,92,231,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>🏨</div>
                                <div style={{ flex: 1, minWidth: '160px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                                        <div>
                                            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{h.name}</h4>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>📍 {h.neighborhood} · {starIcons(h.stars)} {h.stars}★</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--clr-gold)' }}>${h.pricePerNight}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/night</span></div>
                                            {h.totalPrice && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>${h.totalPrice} total</div>}
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '10px' }}>{h.description}</p>
                                    {h.amenities?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                                            {h.amenities.map((a, j) => <span key={j} className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{a}</span>)}
                                        </div>
                                    )}
                                    {h.bookingTip && <p style={{ color: 'var(--clr-gold)', fontSize: '0.78rem', fontStyle: 'italic' }}>💡 {h.bookingTip}</p>}
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
                        <div className="glass-card" style={{ padding: '20px', background: 'rgba(108,92,231,0.06)' }}>
                            <h4 style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--clr-primary)' }}>📋 Booking Advice</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{data.bookingAdvice}</p>
                        </div>
                    )}
                </div>
            )}

            {error && !data && (
                <div className="glass-card" style={{ padding: '24px', background: 'rgba(214,48,49,0.06)', border: '1px solid rgba(214,48,49,0.3)' }}>
                    <p style={{ color: 'var(--clr-danger)', fontWeight: 600, textAlign: 'center' }}>⚠️ {error}</p>
                </div>
            )}

            {!data && !loading && !error && (
                <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <p style={{ fontSize: '4rem', marginBottom: '16px' }}>🏨</p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '8px' }}>AI Hotel Recommendations</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Enter a destination and budget for curated hotel picks</p>
                </div>
            )}
        </div>
    );
}
