'use client';

import { useState, useEffect } from 'react';

export default function SafetyTab({ initialData, defaultDestination }) {
    const [destination, setDestination] = useState(defaultDestination || '');
    const [safetyData, setSafetyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (defaultDestination) {
            setDestination(defaultDestination);
        }
        if (initialData && initialData.destination?.toLowerCase() === (defaultDestination || '').toLowerCase()) {
            setSafetyData(initialData);
        } else {
            setSafetyData(null);
        }
    }, [initialData, defaultDestination]);

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
        } catch (e) { 
            console.error(e); 
            setError('Network error or service unavailable.'); 
        }
        setLoading(false);
    };

    const tierColor = (tier) => {
        if (!tier) return 'var(--color-text-muted)';
        const t = tier.toLowerCase();
        if (t.includes('very safe')) return 'var(--color-success)';
        if (t.includes('safe')) return 'var(--color-primary-light)';
        if (t.includes('caution')) return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    const ratingBg = (rating) => {
        if (!rating) return 'var(--color-surface)';
        if (rating >= 8) return 'rgba(0,184,148,0.04)';
        if (rating >= 6) return 'rgba(12, 171, 168, 0.04)';
        if (rating >= 4) return 'rgba(253,203,110,0.04)';
        return 'rgba(239, 68, 68, 0.04)';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="page-enter-active">
            {/* Header */}
            <div className="page-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.15)' }}>
                <div>
                    <span className="label" style={{ color: 'var(--color-error)' }}>SAFETY INTELLIGENCE</span>
                    <h2 className="section-title">🛡️ Safety & SOS Agent</h2>
                    <p className="section-subtitle">AI-powered safety intelligence for any destination</p>
                </div>
            </div>

            {/* Alert bar below header */}
            <div style={{
                background: 'var(--color-error-subtle)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
            }}>
                <span style={{ fontSize: '1.6rem', animation: 'pulse-glow 1.5s infinite', display: 'inline-block' }}>🚨</span>
                <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--color-error)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>Emergency Assistance Hub Active</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                        If you are facing an immediate threat, medical crisis, or localized hazard, please consult local emergency numbers or click the SOS widget.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="card" style={{ padding: '24px', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" style={{ position: 'absolute', left: '14px', top: '14px' }}>
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <input className="input-field" placeholder="Bangkok, Mexico City, Rio, Paris..."
                            value={destination} onChange={e => setDestination(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && getSafety()}
                            style={{ paddingLeft: '42px', height: '46px' }} />
                    </div>
                    <button className="btn-danger" onClick={getSafety} disabled={loading || !destination.trim()} style={{ height: '46px' }}>
                        {loading ? <><span className="spinner" /> Analyzing...</> : 'Get Safety Report'}
                    </button>
                </div>
            </div>

            {safetyData && (
                <div className="card-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Bento Grid Row 1 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                        {/* Overall Safety Rating Card */}
                        <div className="card" style={{ padding: '28px', background: ratingBg(safetyData.overallSafetyRating), borderColor: 'rgba(239, 68, 68, 0.15)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '24px' }}>
                                <div>
                                    <span className="badge badge-danger" style={{ marginBottom: '12px' }}>Report Core</span>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text)' }}>{safetyData.destination}</h3>
                                    <p style={{ color: tierColor(safetyData.safetyTier), fontWeight: 700, fontSize: '1.10rem', marginTop: '6px' }}>● {safetyData.safetyTier}</p>
                                    {safetyData.travelAdvisory && (
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: '8px', lineHeight: 1.5 }}>
                                            Advisory Level {safetyData.travelAdvisory.level}: {safetyData.travelAdvisory.message}
                                        </p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', padding: '16px 24px', border: '1px solid var(--border-subtle)' }}>
                                    <div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: tierColor(safetyData.safetyTier), fontFamily: 'var(--font-display)' }}>{safetyData.overallSafetyRating}/10</div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Overall safety score</div>
                                    </div>
                                    <span style={{ fontSize: '2rem' }}>📊</span>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact List Card */}
                        {safetyData.emergencyNumbers?.length > 0 && (
                            <div className="card" style={{ padding: '24px', borderColor: 'rgba(239, 68, 68, 0.15)' }}>
                                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '16px', color: 'var(--color-error)', fontFamily: 'var(--font-display)' }}>🚨 Emergency Hotlines</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {safetyData.emergencyNumbers.map((c, i) => (
                                        <div key={i} style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
                                            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{c.service}</p>
                                            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-error)', fontFamily: 'var(--font-display)', margin: '4px 0' }}>{c.number}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-faint)' }}>{c.available}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bento Grid Row 2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                        {/* Common Scams */}
                        {safetyData.commonScams?.length > 0 && (
                            <div className="card" style={{ padding: '24px' }}>
                                <h4 style={{ fontWeight: 800, marginBottom: '16px', color: 'var(--color-warning)', fontFamily: 'var(--font-display)' }}>⚠️ Tourist Scams to Avoid</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {safetyData.commonScams.map((s, i) => (
                                        <div key={i} style={{ background: 'rgba(253,203,110,0.03)', border: '1px solid rgba(253,203,110,0.1)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                                            <p style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.88rem' }}>{s.scam}</p>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.4 }}>🛡️ Avoid: {s.howToAvoid}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Health Advisory */}
                        {safetyData.healthInfo && (
                            <div className="card" style={{ padding: '24px', borderColor: 'rgba(0,184,148,0.15)' }}>
                                <h4 style={{ fontWeight: 800, marginBottom: '16px', color: 'var(--color-success)', fontFamily: 'var(--font-display)' }}>🏥 Health & Medical Services</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>💧 Drinking Water Safety</span>
                                        <span style={{ color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 600 }}>{safetyData.healthInfo.waterSafety}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>🏥 Local Medical Quality</span>
                                        <span style={{ color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 600 }}>{safetyData.healthInfo.medicalStandard}</span>
                                    </div>
                                    {safetyData.healthInfo.recommendedVaccines?.length > 0 && (
                                        <div style={{ marginTop: '6px' }}>
                                            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-faint)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Recommended Vaccines</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {safetyData.healthInfo.recommendedVaccines.map((v, i) => (
                                                    <span key={i} className="badge badge-success" style={{ fontSize: '0.72rem' }}>{v}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Safety Tips */}
                    {safetyData.safetyTips && (
                        <div className="card" style={{ padding: '24px' }}>
                            <h4 style={{ fontWeight: 800, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>💡 Safety & Precaution Guidelines</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                                {safetyData.safetyTips.general?.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-primary-light)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>General Guidelines</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {safetyData.safetyTips.general.map((t, i) => <p key={i} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', paddingLeft: '12px', borderLeft: '2px solid var(--color-primary)', lineHeight: 1.4 }}>{t}</p>)}
                                        </div>
                                    </div>
                                )}
                                {safetyData.safetyTips.nightSafety?.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-error)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Night Safety</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {safetyData.safetyTips.nightSafety.map((t, i) => <p key={i} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', paddingLeft: '12px', borderLeft: '2px solid var(--color-error)', lineHeight: 1.4 }}>{t}</p>)}
                                        </div>
                                    </div>
                                )}
                                {safetyData.safetyTips.forWomen?.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-primary-light)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Solo & Women Travelers</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {safetyData.safetyTips.forWomen.map((t, i) => <p key={i} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', paddingLeft: '12px', borderLeft: '2px solid var(--color-primary-light)', lineHeight: 1.4 }}>{t}</p>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cultural Dos/Donts */}
                    {(safetyData.culturalDos?.length > 0 || safetyData.culturalDonts?.length > 0) && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                            {safetyData.culturalDos?.length > 0 && (
                                <div className="card" style={{ padding: '20px', borderColor: 'rgba(0,184,148,0.15)' }}>
                                    <h4 style={{ fontWeight: 800, marginBottom: '12px', color: 'var(--color-success)', fontFamily: 'var(--font-display)' }}>✅ Cultural Do's</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {safetyData.culturalDos.map((d, i) => <p key={i} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.4 }}>• {d}</p>)}
                                    </div>
                                </div>
                            )}
                            {safetyData.culturalDonts?.length > 0 && (
                                <div className="card" style={{ padding: '20px', borderColor: 'rgba(239, 68, 68, 0.15)' }}>
                                    <h4 style={{ fontWeight: 800, marginBottom: '12px', color: 'var(--color-error)', fontFamily: 'var(--font-display)' }}>❌ Cultural Don'ts</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {safetyData.culturalDonts.map((d, i) => <p key={i} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.4 }}>• {d}</p>)}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {error && !safetyData && (
                <div className="card" style={{ padding: '24px', background: 'var(--color-error-subtle)', border: '1px solid var(--color-error)' }}>
                    <p style={{ color: 'var(--color-error)', fontWeight: 600, textAlign: 'center' }}>⚠️ {error}</p>
                </div>
            )}

            {!safetyData && !loading && !error && (
                <div className="card" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                    <style>{`
                        @keyframes breatheScale {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.05); }
                        }
                        @keyframes drawCheck {
                            to { stroke-dashoffset: 0; }
                        }
                        .breathe-shield {
                            animation: breatheScale 3s infinite ease-in-out;
                        }
                        .checkmark-path {
                            stroke-dasharray: 20;
                            stroke-dashoffset: 20;
                            animation: drawCheck 1.2s forwards ease-in-out 0.5s;
                        }
                    `}</style>
                    <svg className="breathe-shield" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(239, 68, 68, 0.08)" />
                        <polyline className="checkmark-path" points="9 11 11 13 15 9" stroke="var(--color-error)" strokeWidth="2" />
                    </svg>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--color-text)' }}>AI Safety Advisor</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', maxWidth: '400px' }}>Generate a real-time safety assessment, emergency numbers, scam advice, and cultural etiquette warnings.</p>
                </div>
            )}
        </div>
    );
}
