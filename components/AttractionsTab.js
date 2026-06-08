'use client';

import { useState } from 'react';

const CATEGORY_ICONS = {
    museum: '🏛️', temple: '🛕', nature: '🌿', viewpoint: '🌅', market: '🛍️',
    palace: '🏰', park: '🌳', beach: '🏖️', historical: '⚔️', entertainment: '🎭',
    art: '🎨', adventure: '🏔️',
};

const CATEGORY_COLORS = {
    museum: '#74b9ff', temple: '#fdcb6e', nature: '#00b894', viewpoint: '#fd79a8',
    market: '#e17055', palace: '#a29bfe', park: '#55efc4', beach: '#0984e3',
    historical: '#6c5ce7', entertainment: '#fab1a0', art: '#fd79a8', adventure: '#d63031',
};

export default function AttractionsTab() {
    const [destination, setDestination] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCat, setSelectedCat] = useState('all');
    const [selectedAttr, setSelectedAttr] = useState(null);
    const [savedAttrs, setSavedAttrs] = useState({});
    const [resultsSubTab, setResultsSubTab] = useState('must-see');

    const search = async (targetDest) => {
        const query = targetDest || destination;
        if (!query.trim()) return;
        setLoading(true); setData(null); setSelectedAttr(null); setError(null);
        try {
            const r = await fetch('/api/agent/attractions', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination: query })
            });
            const d = await r.json();
            if (d.success) setData(d.data);
            else setError(d.error || 'Failed to fetch attractions.');
        } catch (e) { 
            console.error(e); 
            setError('Network error or service unavailable.'); 
        }
        setLoading(false);
    };

    const toggleSave = (name, e) => {
        e.stopPropagation();
        setSavedAttrs(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const categories = data ? ['all', ...new Set(data.attractions?.map(a => a.category) || [])] : [];
    const filtered = data?.attractions?.filter(a => selectedCat === 'all' || a.category === selectedCat) || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="page-enter-active">
            {/* Header */}
            <div className="page-header">
                <div>
                    <span className="label" style={{ color: 'var(--color-primary-light)' }}>AI DISCOVERY ENGINE</span>
                    <h2 className="section-title">🏛️ Attractions & Experiences</h2>
                    <p className="section-subtitle">AI-curated sights, landmarks, and hidden gems</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignSelf: 'end' }}>
                    <span className="pill pill-blue" style={{ animation: 'bounce 3s infinite' }}>🏛️ Museums</span>
                    <span className="pill pill-green" style={{ animation: 'bounce 4s infinite 0.5s' }}>🌳 Parks</span>
                    <span className="pill pill-purple" style={{ animation: 'bounce 5s infinite 1s' }}>💎 Gems</span>
                </div>
            </div>

            {/* Search Container */}
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input className="input-field" style={{ flex: 1, minWidth: '200px', height: '46px' }}
                        placeholder="Paris, Kyoto, Cairo, New York, Dubai..."
                        value={destination} onChange={e => setDestination(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && search()} />
                    <button className="btn-primary" onClick={() => search()} disabled={loading || !destination.trim()} style={{ height: '46px', whiteSpace: 'nowrap' }}>
                        {loading ? <><span className="spinner" /> Discovering...</> : 'Discover Attractions'}
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>Popular Suggestions:</span>
                    {['Kyoto', 'Paris', 'New York', 'Rome'].map(city => (
                        <button key={city} onClick={() => { setDestination(city); search(city); }} className="pill-toggle" style={{ padding: '4px 10px', fontSize: '11px' }}>
                            {city}
                        </button>
                    ))}
                </div>
            </div>

            {data && (
                <div className="card-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Destination Banner / Overview */}
                    <div className="card" style={{ padding: '28px', background: 'radial-gradient(circle at 10% 10%, rgba(12, 171, 168, 0.08) 0%, rgba(24, 25, 36, 0.7) 100%)' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>{data.destination}</h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '16px', fontSize: 'var(--text-sm)' }}>{data.highlights}</p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <span className="badge badge-primary">🏛️ {data.totalAttractions} Sights</span>
                            {data.hiddenGems?.length > 0 && <span className="badge badge-warning">💎 {data.hiddenGems.length} Hidden Gems</span>}
                            {data.bestNeighborhoods?.length > 0 && <span className="badge badge-cyan">🗺️ {data.bestNeighborhoods.length} Neighbourhoods</span>}
                        </div>
                    </div>

                    {/* Results Sub-Tabs */}
                    <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-subtle)', overflowX: 'auto', paddingBottom: '2px' }}>
                        {[
                            { id: 'must-see', label: '🏛️ Attractions' },
                            { id: 'gems', label: '💎 Hidden Gems' },
                            { id: 'neighbourhoods', label: '🏘️ Neighbourhoods' },
                            { id: 'trips', label: '🚌 Day Trips' },
                        ].map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => setResultsSubTab(sub.id)}
                                style={{
                                    padding: '10px 16px',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: resultsSubTab === sub.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    color: resultsSubTab === sub.id ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                                    borderBottom: resultsSubTab === sub.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {sub.label}
                            </button>
                        ))}
                    </div>

                    {/* SUB-TAB 1: ATTRACTIONS & EXPERIENCES */}
                    {resultsSubTab === 'must-see' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Category Filter Pills */}
                            {categories.length > 1 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {categories.map(cat => (
                                        <button key={cat} onClick={() => setSelectedCat(cat)}
                                            className={`pill-toggle ${selectedCat === cat ? 'active' : ''}`}
                                            style={{
                                                padding: '6px 14px', fontSize: 'var(--text-xs)',
                                                borderColor: selectedCat === cat ? CATEGORY_COLORS[cat] : 'var(--border-subtle)',
                                                color: selectedCat === cat ? 'var(--color-text)' : 'var(--color-text-muted)'
                                            }}>
                                            {cat === 'all' ? '✨ All' : `${CATEGORY_ICONS[cat] || '📍'} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Masonry Layout Grid */}
                            <div className="masonry-grid">
                                {filtered.map((a, i) => {
                                    const isSaved = savedAttrs[a.name];
                                    return (
                                        <div key={i} className="card masonry-item" style={{ padding: '0', cursor: 'pointer' }}
                                            onClick={() => setSelectedAttr(selectedAttr?.name === a.name ? null : a)}>
                                            <div style={{ height: '4px', background: CATEGORY_COLORS[a.category] || 'var(--color-primary)' }} />
                                            <div style={{ padding: '18px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '1.2rem' }}>{CATEGORY_ICONS[a.category] || '📍'}</span>
                                                        <h4 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-sm)', lineHeight: 1.3 }}>{a.name}</h4>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                        {a.mustSee && <span className="badge badge-warning" style={{ fontSize: '0.62rem', flexShrink: 0 }}>⭐ MUST</span>}
                                                        <button 
                                                            onClick={(e) => toggleSave(a.name, e)}
                                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', padding: '2px', fontSize: '1.1rem' }}
                                                        >
                                                            {isSaved ? '❤️' : '🤍'}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '12px' }}>
                                                    {a.description}
                                                </p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <span style={{ color: 'var(--color-warning)', fontSize: '0.85rem' }}>★</span>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>{a.rating?.toFixed(1)}</span>
                                                        {a.totalReviews && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>({(a.totalReviews / 1000).toFixed(0)}k)</span>}
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: a.entryFeeUSD === 0 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                                            {a.entryFeeUSD === 0 ? '🆓 Free' : `$${a.entryFeeUSD}`}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                                    <span className="badge" style={{ fontSize: '0.7rem', background: `${CATEGORY_COLORS[a.category] || 'var(--color-primary)'}18`, color: CATEGORY_COLORS[a.category] || 'var(--color-primary)', border: `1px solid ${CATEGORY_COLORS[a.category] || 'var(--color-primary)'}30` }}>
                                                        {a.category}
                                                    </span>
                                                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>⏱ {a.timeNeeded}</span>
                                                    {a.familyFriendly && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>👨‍👩‍👧 Family</span>}
                                                </div>

                                                {/* Expanded Details */}
                                                {selectedAttr?.name === a.name && (
                                                    <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        {a.openingHours && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>🕐 {a.openingHours}</p>}
                                                        {a.address && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>📍 {a.address}</p>}
                                                        {a.bestTime && <p style={{ fontSize: '0.8rem', color: 'var(--color-warning)' }}>⭐ Best time: {a.bestTime}</p>}
                                                        {a.tips && <p style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>💡 Tip: {a.tips}</p>}
                                                    </div>
                                                )}
                                                <p style={{ color: 'var(--color-primary)', fontSize: '0.75rem', marginTop: '10px', textAlign: 'center', fontWeight: 600 }}>
                                                    {selectedAttr?.name === a.name ? '▲ Collapse' : '▼ See details'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <style jsx>{`
                                .masonry-grid {
                                    column-count: 1;
                                    column-gap: 16px;
                                }
                                @media (min-width: 768px) {
                                    .masonry-grid {
                                        column-count: 2;
                                    }
                                }
                            `}</style>
                        </div>
                    )}

                    {/* SUB-TAB 2: HIDDEN GEMS */}
                    {resultsSubTab === 'gems' && (
                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '16px', color: 'var(--color-warning)', fontFamily: 'var(--font-display)' }}>💎 Hidden Gems — Off the Beaten Path</h3>
                            {data.hiddenGems?.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                                    {data.hiddenGems.map((g, i) => (
                                        <div key={i} style={{ background: 'rgba(253,203,110,0.04)', border: '1px solid rgba(253,203,110,0.15)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                                            <h4 style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px', fontSize: 'var(--text-sm)' }}>{g.name}</h4>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '10px', lineHeight: 1.5 }}>{g.description}</p>
                                            <p style={{ color: 'var(--color-warning)', fontSize: '0.78rem', fontStyle: 'italic', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                <span>✨</span> {g.why}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)' }}>No secret sights suggested for this destination.</p>
                            )}
                        </div>
                    )}

                    {/* SUB-TAB 3: NEIGHBOURHOODS */}
                    {resultsSubTab === 'neighbourhoods' && (
                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>🗺️ Best Neighbourhoods</h3>
                            {data.bestNeighborhoods?.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                                    {data.bestNeighborhoods.map((n, i) => (
                                        <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                                            <h4 style={{ fontWeight: 700, color: 'var(--color-primary-light)', marginBottom: '6px', fontSize: 'var(--text-sm)' }}>🏘️ {n.name}</h4>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '10px', lineHeight: 1.4 }}>{n.vibe}</p>
                                            <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>Best for: {n.bestFor}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)' }}>No specific neighbourhoods mapped.</p>
                            )}
                        </div>
                    )}

                    {/* SUB-TAB 4: DAY TRIPS */}
                    {resultsSubTab === 'trips' && (
                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>🚌 Day Trips from {data.destination}</h3>
                            {data.dayTrips?.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {data.dayTrips.map((d, i) => (
                                        <button key={i} onClick={() => { setDestination(d); search(d); }} className="btn-secondary" style={{ padding: '8px 18px', borderRadius: '100px', fontSize: 'var(--text-xs)' }}>
                                            {d} →
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)' }}>No day trips advised.</p>
                            )}
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
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'bounce 3s infinite' }}>
                        <path d="M3 21h18" />
                        <path d="M5 21V10a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11" />
                        <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
                        <path d="M12 2v6" />
                        <path d="M9 5h6" />
                    </svg>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--color-text)' }}>AI-Powered Attraction Discovery</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', maxWidth: '450px' }}>Enter any destination to get curated attractions, hidden gems, neighbourhoods, and day trips.</p>
                </div>
            )}
        </div>
    );
}
