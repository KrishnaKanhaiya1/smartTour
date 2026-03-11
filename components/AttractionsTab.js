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

    const search = async () => {
        if (!destination.trim()) return;
        setLoading(true); setData(null); setSelectedAttr(null); setError(null);
        try {
            const r = await fetch('/api/agent/attractions', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination })
            });
            const d = await r.json();
            if (d.success) setData(d.data);
            else setError(d.error || 'Failed to fetch attractions.');
        } catch (e) { console.error(e); setError('Network error or service unavailable.'); }
        setLoading(false);
    };

    const categories = data ? ['all', ...new Set(data.attractions?.map(a => a.category) || [])] : [];
    const filtered = data?.attractions?.filter(a => selectedCat === 'all' || a.category === selectedCat) || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
                <h2 className="section-title">🏛️ Attractions & Experiences</h2>
                <p className="section-subtitle">AI-curated sights, landmarks, and hidden gems</p>
            </div>

            {/* Search */}
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input className="input-field" style={{ flex: 1, minWidth: '200px' }}
                        placeholder="Paris, Kyoto, Cairo, New York, Dubai..."
                        value={destination} onChange={e => setDestination(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && search()} />
                    <button className="btn-primary" onClick={search} disabled={loading || !destination.trim()} style={{ padding: '12px 28px' }}>
                        {loading ? <><span className="spinner" /> Discovering...</> : '🔍 Discover Attractions'}
                    </button>
                </div>
            </div>

            {data && (
                <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Overview */}
                    <div className="glass-card" style={{ padding: '28px', background: 'rgba(108,92,231,0.06)' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>{data.destination}</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>{data.highlights}</p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <span className="badge badge-primary">🏛️ {data.totalAttractions} Attractions</span>
                            {data.hiddenGems?.length > 0 && <span className="badge badge-warning">💎 {data.hiddenGems.length} Hidden Gems</span>}
                            {data.bestNeighborhoods?.length > 0 && <span className="badge badge-cyan">🗺️ {data.bestNeighborhoods.length} Neighbourhoods</span>}
                        </div>
                    </div>

                    {/* Category Filter */}
                    {categories.length > 1 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setSelectedCat(cat)}
                                    style={{
                                        padding: '7px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                                        border: selectedCat === cat ? `1px solid ${CATEGORY_COLORS[cat] || 'var(--clr-primary)'}` : '1px solid var(--border-medium)',
                                        background: selectedCat === cat ? `${CATEGORY_COLORS[cat] || 'var(--clr-primary)'}20` : 'transparent',
                                        color: selectedCat === cat ? (CATEGORY_COLORS[cat] || 'var(--text-primary)') : 'var(--text-secondary)',
                                        transition: 'all 0.2s'
                                    }}>
                                    {cat === 'all' ? '✨ All' : `${CATEGORY_ICONS[cat] || '📍'} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Attractions Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                        {filtered.map((a, i) => (
                            <div key={i} className="glass-card" style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
                                onClick={() => setSelectedAttr(selectedAttr?.name === a.name ? null : a)}>
                                {/* Card Top Color Bar */}
                                <div style={{ height: '4px', background: CATEGORY_COLORS[a.category] || 'var(--clr-primary)' }} />
                                <div style={{ padding: '18px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.3rem' }}>{CATEGORY_ICONS[a.category] || '📍'}</span>
                                            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.3 }}>{a.name}</h4>
                                        </div>
                                        {a.mustSee && <span className="badge badge-warning" style={{ fontSize: '0.68rem', flexShrink: 0 }}>⭐ MUST</span>}
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {a.description}
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ color: 'var(--clr-gold)', fontSize: '0.85rem' }}>★</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{a.rating?.toFixed(1)}</span>
                                            {a.totalReviews && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({(a.totalReviews / 1000).toFixed(0)}k)</span>}
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: a.entryFeeUSD === 0 ? 'var(--clr-success)' : 'var(--clr-gold)' }}>
                                                {a.entryFeeUSD === 0 ? '🆓 Free' : `$${a.entryFeeUSD}`}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        <span className="badge" style={{ fontSize: '0.7rem', background: `${CATEGORY_COLORS[a.category] || 'var(--clr-primary)'}18`, color: CATEGORY_COLORS[a.category] || 'var(--clr-primary)', border: `1px solid ${CATEGORY_COLORS[a.category] || 'var(--clr-primary)'}30` }}>
                                            {a.category}
                                        </span>
                                        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>⏱ {a.timeNeeded}</span>
                                        {a.familyFriendly && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>👨‍👩‍👧</span>}
                                    </div>

                                    {/* Expanded Details */}
                                    {selectedAttr?.name === a.name && (
                                        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {a.openingHours && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🕐 {a.openingHours}</p>}
                                            {a.address && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 {a.address}</p>}
                                            {a.bestTime && <p style={{ fontSize: '0.8rem', color: 'var(--clr-gold)' }}>⭐ Best time: {a.bestTime}</p>}
                                            {a.tips && <p style={{ fontSize: '0.8rem', color: 'var(--clr-success)' }}>💡 Tip: {a.tips}</p>}
                                        </div>
                                    )}
                                    <p style={{ color: 'var(--clr-primary)', fontSize: '0.75rem', marginTop: '10px', textAlign: 'center', fontWeight: 600 }}>
                                        {selectedAttr?.name === a.name ? '▲ Collapse' : '▼ See details'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Hidden Gems */}
                    {data.hiddenGems?.length > 0 && (
                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px', color: 'var(--clr-gold)' }}>💎 Hidden Gems — Off the Beaten Path</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                                {data.hiddenGems.map((g, i) => (
                                    <div key={i} style={{ background: 'rgba(253,203,110,0.06)', border: '1px solid rgba(253,203,110,0.2)', borderRadius: '12px', padding: '16px' }}>
                                        <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{g.name}</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '8px', lineHeight: 1.5 }}>{g.description}</p>
                                        <p style={{ color: 'var(--clr-gold)', fontSize: '0.78rem', fontStyle: 'italic' }}>✨ {g.why}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Best Neighbourhoods */}
                    {data.bestNeighborhoods?.length > 0 && (
                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px' }}>🗺️ Best Neighbourhoods</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                                {data.bestNeighborhoods.map((n, i) => (
                                    <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px' }}>
                                        <h4 style={{ fontWeight: 700, color: 'var(--clr-primary)', marginBottom: '4px', fontSize: '0.95rem' }}>🏘️ {n.name}</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '6px' }}>{n.vibe}</p>
                                        <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>Best for: {n.bestFor}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Day Trips */}
                    {data.dayTrips?.length > 0 && (
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>🚌 Day Trips from {data.destination}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {data.dayTrips.map((d, i) => (
                                    <button key={i} onClick={() => { setDestination(d); search(); }} style={{ padding: '8px 18px', borderRadius: '100px', background: 'rgba(0,204,203,0.1)', border: '1px solid rgba(0,204,203,0.3)', color: 'var(--clr-secondary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseEnter={e => e.target.style.background = 'rgba(0,204,203,0.2)'}
                                        onMouseLeave={e => e.target.style.background = 'rgba(0,204,203,0.1)'}>
                                        {d} →
                                    </button>
                                ))}
                            </div>
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
                    <p style={{ fontSize: '4rem', marginBottom: '16px' }}>🏛️</p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '8px' }}>AI-Powered Attraction Discovery</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Enter any destination to get curated attractions, hidden gems, neighbourhoods, and day trips</p>
                </div>
            )}
        </div>
    );
}
