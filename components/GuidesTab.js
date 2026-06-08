'use client';

import { useState } from 'react';

export default function GuidesTab({ guidesData, userProfile, destination }) {
    const [bookingId, setBookingId] = useState(null);
    const [dest, setDest] = useState(destination || '');
    const [guides, setGuides] = useState(guidesData || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [selectedLangs, setSelectedLangs] = useState([]);

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
        } catch (e) { 
            console.error(e); 
            setError('Network error or service unavailable.'); 
        }
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
        if (score >= 90) return 'var(--color-success)';
        if (score >= 75) return 'var(--color-primary-light)';
        return 'var(--color-warning)';
    };

    // Filter matched guides on the frontend
    const filteredGuides = guides?.matchedGuides?.filter(g => {
        if (selectedInterests.length > 0) {
            const hasSpecialty = g.specialties?.some(s => selectedInterests.includes(s));
            if (!hasSpecialty) return false;
        }
        if (selectedLangs.length > 0) {
            const hasLang = g.languages?.some(l => selectedLangs.includes(l));
            if (!hasLang) return false;
        }
        return true;
    }) || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="page-enter-active">
            {/* Header */}
            <div className="page-header">
                <div>
                    <span className="label" style={{ color: 'var(--color-primary-light)' }}>EXPERT LOCAL GUIDES</span>
                    <h2 className="section-title">👨‍🏫 Guide Matching Agent</h2>
                    <p className="section-subtitle">AI-matched local expert guides for any destination</p>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <input className="input-field" style={{ flex: 1 }}
                        placeholder="Destination (e.g. Kyoto, Marrakech, Rome...)"
                        value={dest} onChange={e => setDest(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && fetchGuides()} />
                    <button className="btn-primary" onClick={fetchGuides} disabled={loading || !dest.trim()} style={{ height: '46px', whiteSpace: 'nowrap' }}>
                        {loading ? <><span className="spinner" /> Finding guides...</> : 'Find Guides'}
                    </button>
                </div>

                {/* Filter by Interest */}
                <div style={{ marginBottom: '14px' }}>
                    <label className="label">Filter by Interest</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['Adventure', 'Food', 'History', 'Nature', 'Culture', 'Shopping', 'Wellness'].map(interest => {
                            const active = selectedInterests.includes(interest);
                            return (
                                <button
                                    key={interest}
                                    type="button"
                                    className={`pill-toggle ${active ? 'active' : ''}`}
                                    onClick={() => setSelectedInterests(prev => 
                                        prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
                                    )}
                                    style={{ padding: '5px 12px', fontSize: '11px' }}
                                >
                                    {interest}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Filter by Language */}
                <div>
                    <label className="label">Filter by Language</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['English', 'Spanish', 'French', 'Japanese', 'Arabic', 'German', 'Italian'].map(lang => {
                            const active = selectedLangs.includes(lang);
                            return (
                                <button
                                    key={lang}
                                    type="button"
                                    className={`pill-toggle ${active ? 'active' : ''}`}
                                    onClick={() => setSelectedLangs(prev => 
                                        prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
                                    )}
                                    style={{ padding: '5px 12px', fontSize: '11px' }}
                                >
                                    {lang}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {bookingId && (
                <div className="toast toast-success animate-fade-in-up">
                    ✅ Booking confirmed! ID: {bookingId}
                </div>
            )}

            {guides && (
                <div className="card-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-text)' }}>Matched Guides in {guides.destination || dest}</h3>
                    
                    {filteredGuides.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                            {filteredGuides.map((g, i) => {
                                const initials = g.name ? g.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?';
                                return (
                                    <div key={i} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                        {/* Card Header */}
                                        <div style={{ background: 'linear-gradient(135deg, rgba(12, 171, 168, 0.08) 0%, rgba(24, 25, 36, 0.7) 100%)', padding: '20px', display: 'flex', gap: '14px', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                                            <div style={{ 
                                                width: '54px', 
                                                height: '54px', 
                                                borderRadius: '50%', 
                                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                fontSize: '1.2rem', 
                                                flexShrink: 0, 
                                                fontFamily: 'var(--font-display)', 
                                                fontWeight: 800, 
                                                color: '#0a0b0f' 
                                            }}>
                                                {initials}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</p>
                                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{g.experience} yrs experience · Max {g.preferredGroupSize || '4'} guests</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                    <span style={{ color: 'var(--color-warning)', fontSize: '0.85rem' }}>{stars(g.rating)}</span>
                                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{g.rating?.toFixed(1)}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: scoreColor(g.compatibilityScore), fontFamily: 'var(--font-display)' }}>{g.compatibilityScore}%</div>
                                                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-faint)', fontWeight: 600 }}>MATCH</div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div style={{ padding: '18px' }}>
                                            {g.bio && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '14px', fontStyle: 'italic' }}>"{g.bio}"</p>}

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                                                {g.specialties?.map((s, j) => <span key={j} className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{s}</span>)}
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                <div>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-faint)' }}>Languages: </span>
                                                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{g.languages?.join(', ')}</span>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-warning)', fontFamily: 'var(--font-display)' }}>${g.price}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>/day</span>
                                                </div>
                                            </div>

                                            {g.matchReason && <p style={{ fontSize: '0.78rem', color: 'var(--color-success)', marginBottom: '14px' }}>✓ {g.matchReason}</p>}

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                <button onClick={() => bookGuide(g.name)} className="btn-primary" style={{ padding: '10px', fontSize: '0.82rem', justifyContent: 'center' }}>
                                                    Book Now
                                                </button>
                                                <button className="btn-secondary" style={{ padding: '10px', fontSize: '0.82rem', justifyContent: 'center' }} onClick={() => alert(`AI Guide Matcher details profile for ${g.name}`)}>
                                                    Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: '40px' }}>No guides match your filter criteria.</p>
                    )}

                    {guides.bookingTips?.length > 0 && (
                        <div className="card" style={{ padding: '20px', marginTop: '20px' }}>
                            <h4 style={{ fontWeight: 800, marginBottom: '12px', color: 'var(--color-warning)', fontFamily: 'var(--font-display)' }}>💡 Booking Tips</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                                {guides.bookingTips.map((tip, i) => (
                                    <p key={i} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', paddingLeft: '12px', borderLeft: '2px solid var(--color-warning)' }}>{tip}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && !guides && (
                <div className="card" style={{ padding: '24px', background: 'var(--color-error-subtle)', border: '1px solid var(--color-error)' }}>
                    <p style={{ color: 'var(--color-error)', fontWeight: 600, textAlign: 'center' }}>⚠️ {error}</p>
                </div>
            )}

            {!guides && !loading && !error && (
                <div className="card" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'bounce 3s infinite' }}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--color-text)' }}>AI Guide Matcher</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', maxWidth: '400px' }}>Enter a destination and filter by interests or languages to find local matched experts.</p>
                </div>
            )}
        </div>
    );
}
