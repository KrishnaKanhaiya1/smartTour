'use client';
import { useState } from 'react';

export default function GuidesTab({ guidesData, userProfile, destination }) {
    const [bookingId, setBookingId] = useState(null);
    const [dest, setDest] = useState(destination || '');
    const [guides, setGuides] = useState(guidesData || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchGuides = async () => {
        if (!dest.trim()) return;
        setLoading(true); setGuides(null); setError(null);
        try {
            const r = await fetch('/api/agent/guides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination: dest, ...(userProfile || {}) })
            });
            const d = await r.json();
            if (d.success) setGuides(d.data);
            else setError(d.error || 'Failed to fetch guides.');
        } catch (e) { console.error(e); setError('Network error or service unavailable.'); }
        setLoading(false);
    };

    const bookGuide = (name) => {
        const id = 'BK' + Date.now();
        setBookingId(`${id} — ${name}`);
        setTimeout(() => setBookingId(null), 4000);
    };

    const stars = (rating) => {
        const full = Math.round(rating || 4);
        return '★'.repeat(full) + '☆'.repeat(5 - full);
    };

    const scoreColor = (score) => {
        if (score >= 90) return 'var(--clr-success)';
        if (score >= 75) return 'var(--clr-secondary)';
        return 'var(--clr-gold)';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
                <h2 className="section-title">👨‍🏫 Guide Matching Agent</h2>
                <p className="section-subtitle">AI-matched local expert guides for any destination</p>
            </div>

            {/* Search */}
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input className="input-field" style={{ flex: 1, minWidth: '200px' }}
                        placeholder="Destination (e.g. Kyoto, Marrakech, Rome...)"
                        value={dest} onChange={e => setDest(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && fetchGuides()} />
                    <button className="btn-primary" onClick={fetchGuides} disabled={loading || !dest.trim()} style={{ padding: '12px 24px' }}>
                        {loading ? <><span className="spinner" /> Finding guides...</> : '🔍 Find Guides'}
                    </button>
                </div>
            </div>

            {bookingId && (
                <div className="toast toast-success animate-fade-in-up">
                    ✅ Booking confirmed! ID: {bookingId}
                </div>
            )}

            {guides?.matchedGuides?.length > 0 && (
                <div className="stagger">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                        {guides.matchedGuides.map((g, i) => (
                            <div key={i} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                                {/* Card Header */}
                                <div style={{ background: 'linear-gradient(135deg, rgba(108,92,231,0.3), rgba(0,204,203,0.15))', padding: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                                    <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white' }}>
                                        {g.name?.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</p>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{g.experience} yrs experience · {g.preferredGroupSize}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                            <span style={{ color: 'var(--clr-gold)', fontSize: '0.85rem' }}>{stars(g.rating)}</span>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{g.rating?.toFixed(1)} ({g.totalReviews} reviews)</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: scoreColor(g.compatibilityScore), fontFamily: 'var(--font-display)' }}>{g.compatibilityScore}%</div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>MATCH</div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div style={{ padding: '18px' }}>
                                    {g.bio && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '14px', fontStyle: 'italic' }}>"{g.bio}"</p>}

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                                        {g.specialties?.map((s, j) => <span key={j} className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{s}</span>)}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Languages: </span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{g.languages?.join(' · ')}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--clr-gold)', fontFamily: 'var(--font-display)' }}>${g.price}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/day</span>
                                        </div>
                                    </div>

                                    {g.matchReason && <p style={{ fontSize: '0.78rem', color: 'var(--clr-success)', marginBottom: '14px' }}>✓ {g.matchReason}</p>}

                                    <button onClick={() => bookGuide(g.name)} className="btn-primary"
                                        style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}>
                                        📞 Book {g.name?.split(' ')[0]}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {guides.bookingTips?.length > 0 && (
                        <div className="glass-card" style={{ padding: '20px', marginTop: '20px' }}>
                            <h4 style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--clr-gold)' }}>💡 Booking Tips</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
                                {guides.bookingTips.map((tip, i) => (
                                    <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingLeft: '12px', borderLeft: '2px solid var(--clr-gold)' }}>{tip}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && !guides && (
                <div className="glass-card" style={{ padding: '24px', background: 'rgba(214,48,49,0.06)', border: '1px solid rgba(214,48,49,0.3)' }}>
                    <p style={{ color: 'var(--clr-danger)', fontWeight: 600, textAlign: 'center' }}>⚠️ {error}</p>
                </div>
            )}

            {!guides && !loading && !error && (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '16px' }}>👨‍🏫</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Enter a destination to find AI-matched local expert guides</p>
                </div>
            )}
        </div>
    );
}
