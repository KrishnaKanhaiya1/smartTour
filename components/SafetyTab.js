'use client';
import { useState } from 'react';

export default function SafetyTab() {
    const [destination, setDestination] = useState('');
    const [safetyData, setSafetyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getSafety = async () => {
        if (!destination.trim()) return;
        setLoading(true); setSafetyData(null); setError(null);
        try {
            const r = await fetch('/api/agent/safety', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination })
            });
            const d = await r.json();
            if (d.success) setSafetyData(d.data);
            else setError(d.error || 'Failed to fetch safety data.');
        } catch (e) { console.error(e); setError('Network error or service unavailable.'); }
        setLoading(false);
    };

    const tierColor = (tier) => {
        if (!tier) return 'var(--text-secondary)';
        const t = tier.toLowerCase();
        if (t.includes('very safe')) return 'var(--clr-success)';
        if (t.includes('safe')) return '#74b9ff';
        if (t.includes('caution')) return 'var(--clr-warning)';
        return 'var(--clr-danger)';
    };

    const ratingBg = (rating) => {
        if (!rating) return 'var(--bg-card)';
        if (rating >= 8) return 'rgba(0,184,148,0.1)';
        if (rating >= 6) return 'rgba(116,185,255,0.1)';
        if (rating >= 4) return 'rgba(253,203,110,0.1)';
        return 'rgba(225,112,85,0.1)';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
                <h2 className="section-title">🛡️ Safety & SOS Agent</h2>
                <p className="section-subtitle">AI-powered safety intelligence for any destination</p>
            </div>

            {/* Search */}
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input className="input-field" style={{ flex: 1, minWidth: '200px' }}
                        placeholder="Enter destination (e.g. Bangkok, Mexico City, Paris...)"
                        value={destination} onChange={e => setDestination(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && getSafety()} />
                    <button className="btn-danger" onClick={getSafety} disabled={loading || !destination.trim()}>
                        {loading ? <><span className="spinner" /> Analyzing...</> : '🔍 Get Safety Report'}
                    </button>
                </div>
            </div>

            {safetyData && (
                <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Overview */}
                    <div className="glass-card" style={{ padding: '28px', background: ratingBg(safetyData.overallSafetyRating) }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>{safetyData.destination}</h3>
                                <p style={{ color: tierColor(safetyData.safetyTier), fontWeight: 700, fontSize: '1.1rem' }}>● {safetyData.safetyTier}</p>
                                {safetyData.travelAdvisory && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>⚠️ Advisory Level {safetyData.travelAdvisory.level}: {safetyData.travelAdvisory.message}</p>}
                            </div>
                            <div style={{ textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', padding: '20px 30px', border: '1px solid var(--border-medium)' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, color: tierColor(safetyData.safetyTier) }}>{safetyData.overallSafetyRating}/10</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Safety Score</div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Numbers */}
                    {safetyData.emergencyNumbers?.length > 0 && (
                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px', color: 'var(--clr-danger)' }}>🚨 Emergency Numbers</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                                {safetyData.emergencyNumbers.map((c, i) => (
                                    <div key={i} style={{ background: 'rgba(225,112,85,0.08)', border: '1px solid rgba(225,112,85,0.2)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{c.service}</p>
                                        <p style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--clr-danger)', fontFamily: 'var(--font-display)', margin: '6px 0' }}>{c.number}</p>
                                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.available}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Scams + Health */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {safetyData.commonScams?.length > 0 && (
                            <div className="glass-card" style={{ padding: '24px' }}>
                                <h4 style={{ fontWeight: 700, marginBottom: '14px', color: 'var(--clr-warning)' }}>⚡ Common Scams</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {safetyData.commonScams.map((s, i) => (
                                        <div key={i} style={{ background: 'rgba(253,203,110,0.07)', borderRadius: '10px', padding: '12px' }}>
                                            <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{s.scam}</p>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '4px' }}>✓ {s.howToAvoid}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {safetyData.healthInfo && (
                            <div className="glass-card" style={{ padding: '24px' }}>
                                <h4 style={{ fontWeight: 700, marginBottom: '14px', color: 'var(--clr-success)' }}>🏥 Health & Medical</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>💧 Water Safety</span>
                                        <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>{safetyData.healthInfo.waterSafety}</span>
                                    </div>
                                    <div className="divider" style={{ margin: '4px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>🏥 Medical Standard</span>
                                        <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>{safetyData.healthInfo.medicalStandard}</span>
                                    </div>
                                    {safetyData.healthInfo.recommendedVaccines?.length > 0 && (
                                        <>
                                            <div className="divider" style={{ margin: '4px 0' }} />
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>VACCINES RECOMMENDED</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {safetyData.healthInfo.recommendedVaccines.map((v, i) => <span key={i} className="badge badge-success" style={{ fontSize: '0.75rem' }}>{v}</span>)}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Safety Tips */}
                    {safetyData.safetyTips && (
                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h4 style={{ fontWeight: 700, marginBottom: '16px' }}>💡 Safety Tips</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
                                {safetyData.safetyTips.general?.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>General</p>
                                        {safetyData.safetyTips.general.map((t, i) => <p key={i} style={{ color: 'var(--text-primary)', fontSize: '0.85rem', paddingLeft: '12px', borderLeft: '2px solid var(--clr-primary)', marginBottom: '6px' }}>{t}</p>)}
                                    </div>
                                )}
                                {safetyData.safetyTips.nightSafety?.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Night Safety</p>
                                        {safetyData.safetyTips.nightSafety.map((t, i) => <p key={i} style={{ color: 'var(--text-primary)', fontSize: '0.85rem', paddingLeft: '12px', borderLeft: '2px solid var(--clr-danger)', marginBottom: '6px' }}>{t}</p>)}
                                    </div>
                                )}
                                {safetyData.safetyTips.forWomen?.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>For Women</p>
                                        {safetyData.safetyTips.forWomen.map((t, i) => <p key={i} style={{ color: 'var(--text-primary)', fontSize: '0.85rem', paddingLeft: '12px', borderLeft: '2px solid var(--clr-accent)', marginBottom: '6px' }}>{t}</p>)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cultural Dos/Donts */}
                    {(safetyData.culturalDos?.length > 0 || safetyData.culturalDonts?.length > 0) && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {safetyData.culturalDos?.length > 0 && (
                                <div className="glass-card" style={{ padding: '20px' }}>
                                    <h4 style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--clr-success)' }}>✅ Cultural Do's</h4>
                                    {safetyData.culturalDos.map((d, i) => <p key={i} style={{ color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '6px' }}>• {d}</p>)}
                                </div>
                            )}
                            {safetyData.culturalDonts?.length > 0 && (
                                <div className="glass-card" style={{ padding: '20px' }}>
                                    <h4 style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--clr-danger)' }}>❌ Cultural Don'ts</h4>
                                    {safetyData.culturalDonts.map((d, i) => <p key={i} style={{ color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '6px' }}>• {d}</p>)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {error && !safetyData && (
                <div className="glass-card" style={{ padding: '24px', background: 'rgba(214,48,49,0.06)', border: '1px solid rgba(214,48,49,0.3)' }}>
                    <p style={{ color: 'var(--clr-danger)', fontWeight: 600, textAlign: 'center' }}>⚠️ {error}</p>
                </div>
            )}

            {!safetyData && !loading && !error && (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Enter any destination to get a comprehensive AI safety report</p>
                </div>
            )}
        </div>
    );
}
