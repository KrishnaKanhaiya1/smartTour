'use client';

import { useState } from 'react';

export default function FoodTab() {
    const [destination, setDestination] = useState('');
    const [dietary, setDietary] = useState([]);
    const [budget, setBudget] = useState('moderate');
    const [foodData, setFoodData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const DIETARY_OPTIONS = ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free', 'no nuts'];

    const toggleDietary = (opt) => {
        setDietary(prev => prev.includes(opt) ? prev.filter(d => d !== opt) : [...prev, opt]);
    };

    const getFood = async () => {
        if (!destination.trim()) return;
        setLoading(true); setFoodData(null); setError(null);
        try {
            const r = await fetch('/api/agent/food', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination, budget, dietaryRestrictions: dietary })
            });
            const d = await r.json();
            if (d.success) setFoodData(d.data);
            else setError(d.error || 'Failed to fetch food recommendations.');
        } catch (e) { 
            console.error(e); 
            setError('Network error or service unavailable.'); 
        }
        setLoading(false);
    };

    const spiceColor = { mild: '#74b9ff', medium: '#fdcb6e', spicy: '#e17055', 'very spicy': '#d63031' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="page-enter-active">
            {/* Header */}
            <div className="page-header">
                <div>
                    <span className="label" style={{ color: 'var(--color-primary-light)' }}>AI FOOD RECOMMENDATIONS</span>
                    <h2 className="section-title">🍽️ Food Recommendation Agent</h2>
                    <p className="section-subtitle">AI-curated local cuisine and restaurant guide</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignSelf: 'end' }}>
                    <span className="pill pill-green" style={{ animation: 'bounce 3s infinite' }}>🍜 Ramen</span>
                    <span className="pill pill-purple" style={{ animation: 'bounce 4s infinite 0.5s' }}>🍕 Pizza</span>
                    <span className="pill pill-blue" style={{ animation: 'bounce 5s infinite 1s' }}>🍣 Sushi</span>
                </div>
            </div>

            {/* Search Form */}
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="food-form-grid">
                        <div>
                            <label className="label">Destination</label>
                            <input className="input-field" placeholder="Tokyo, Rome, Bangkok, Mumbai..."
                                value={destination} onChange={e => setDestination(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && getFood()} />
                        </div>
                        <div>
                            <label className="label">Budget</label>
                            <select className="input-field" value={budget} onChange={e => setBudget(e.target.value)}>
                                <option value="budget">💰 Budget (Street Food)</option>
                                <option value="moderate">💳 Moderate (Casual Dine)</option>
                                <option value="premium">💎 Premium (Fine Dining)</option>
                                <option value="luxury">👑 Luxury (Michelin Star)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="label">Dietary Restrictions</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {DIETARY_OPTIONS.map(opt => {
                                const active = dietary.includes(opt);
                                return (
                                    <button key={opt} onClick={() => toggleDietary(opt)}
                                        className={`pill-toggle ${active ? 'active' : ''}`}>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <button className="btn-primary" onClick={getFood} disabled={loading || !destination.trim()}
                        style={{ width: '100%', justifyContent: 'center', height: '46px', marginTop: '8px' }}>
                        {loading ? <><span className="spinner" /> Discovering food...</> : 'Find Local Food'}
                    </button>
                </div>
                <style jsx global>{`
                    @media (min-width: 768px) {
                        .food-form-grid {
                            grid-template-columns: 2fr 1fr !important;
                        }
                    }
                `}</style>
            </div>

            {foodData && (
                <div className="card-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Cuisine Overview */}
                    <div className="card" style={{ padding: '24px', background: 'radial-gradient(circle at 10% 10%, rgba(12, 171, 168, 0.08) 0%, rgba(24, 25, 36, 0.7) 100%)' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>{foodData.destination} Food Scene</h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: 'var(--text-sm)' }}>{foodData.cuisineOverview}</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                            {foodData.vegetarianFriendly && <span className="badge badge-success">🥗 Veg Friendly</span>}
                            {foodData.halalFriendly && <span className="badge badge-warning">🌙 Halal Friendly</span>}
                            {foodData.drinkingWaterSafety && <span className="badge badge-cyan">💧 {foodData.drinkingWaterSafety}</span>}
                        </div>
                    </div>

                    {/* Must Try Dishes */}
                    {foodData.mustTryDishes?.length > 0 && (
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>⭐ Must-Try Dishes</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                                {foodData.mustTryDishes.map((dish, i) => (
                                    <div key={i} className="card" style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                                            <h4 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-sm)' }}>{dish.name}</h4>
                                            <span style={{ fontWeight: 700, color: 'var(--color-warning)', fontSize: 'var(--text-sm)' }}>~${dish.averagePriceUSD}</span>
                                        </div>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '10px' }}>{dish.description}</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                                            {dish.isVegetarian && <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>🌿 Veg</span>}
                                            {dish.isVegan && <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>🌱 Vegan</span>}
                                            {dish.isHalal && <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>🌙 Halal</span>}
                                            {dish.isGlutenFree && <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>⚡ GF</span>}
                                            {dish.spiceLevel && <span style={{ padding: '3px 8px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600, background: `${spiceColor[dish.spiceLevel?.toLowerCase()] || '#74b9ff'}20`, color: spiceColor[dish.spiceLevel?.toLowerCase()] || '#74b9ff', border: `1px solid ${spiceColor[dish.spiceLevel?.toLowerCase()] || '#74b9ff'}40` }}>🌶️ {dish.spiceLevel}</span>}
                                        </div>
                                        {dish.localTip && <p style={{ color: 'var(--color-warning)', fontSize: '0.78rem', fontStyle: 'italic' }}>💡 {dish.localTip}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top Restaurants */}
                    {foodData.topRestaurants?.length > 0 && (
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>🍴 Top Restaurants</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {foodData.topRestaurants.map((r, i) => (
                                    <div key={i} className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'var(--color-primary-subtle)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyActions: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>🍽️</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                                <h4 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-sm)' }}>{r.name}</h4>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span className="star">★</span>
                                                    <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9rem' }}>{r.rating?.toFixed(1)}</span>
                                                    <span style={{ color: 'var(--color-text-faint)', fontSize: '0.8rem' }}>({r.type})</span>
                                                </div>
                                            </div>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>{r.cuisine} · {r.neighborhood} · {r.priceRange}</p>
                                            {r.mustOrder && <p style={{ color: 'var(--color-primary-light)', fontSize: '0.82rem', marginTop: '4px' }}>⭐ Try: {r.mustOrder}</p>}
                                        </div>
                                        {r.localFavorite && <span className="badge badge-primary" style={{ whiteSpace: 'nowrap' }}>❤️ Local Fav</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Budget Tips */}
                    {foodData.foodBudgetTips?.length > 0 && (
                        <div className="card" style={{ padding: '20px' }}>
                            <h4 style={{ fontWeight: 800, marginBottom: '12px', color: 'var(--color-warning)', fontFamily: 'var(--font-display)' }}>💰 Food Budget Tips</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                                {foodData.foodBudgetTips.map((tip, i) => (
                                    <p key={i} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', paddingLeft: '12px', borderLeft: '2px solid var(--color-warning)' }}>{tip}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && !foodData && (
                <div className="card" style={{ padding: '24px', background: 'var(--color-error-subtle)', border: '1px solid var(--color-error)' }}>
                    <p style={{ color: 'var(--color-error)', fontWeight: 600, textAlign: 'center' }}>⚠️ {error}</p>
                </div>
            )}

            {!foodData && !loading && !error && (
                <div className="card" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                    <style>{`
                        @keyframes steam {
                            0% { transform: translateY(0) scaleX(1); opacity: 0.5; }
                            50% { transform: translateY(-5px) scaleX(1.1); opacity: 0.8; }
                            100% { transform: translateY(-10px) scaleX(1); opacity: 0; }
                        }
                        .steam-line {
                            animation: steam 2s infinite ease-out;
                            stroke: var(--color-primary-light);
                        }
                        .steam-2 {
                            animation-delay: 0.7s;
                        }
                        .steam-3 {
                            animation-delay: 1.4s;
                        }
                    `}</style>
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Steam Wisps */}
                        <path className="steam-line" d="M35 30 Q33 22 35 15 Q37 8 35 3" strokeWidth="2" strokeLinecap="round" />
                        <path className="steam-line steam-2" d="M50 30 Q48 20 50 15 Q52 10 50 3" strokeWidth="2" strokeLinecap="round" />
                        <path className="steam-line steam-3" d="M65 30 Q63 22 65 15 Q67 8 65 3" strokeWidth="2" strokeLinecap="round" />
                        {/* Ramen Bowl */}
                        <path d="M15 45 C15 70 30 85 50 85 C70 85 85 70 85 45 Z" fill="rgba(12, 171, 168, 0.08)" stroke="var(--color-primary)" strokeWidth="2.5" />
                        <path d="M10 45 H90" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M30 84.5 L35 93 H65 L70 84.5" stroke="var(--color-primary)" strokeWidth="2.5" />
                        {/* Chopsticks */}
                        <line x1="8" y1="35" x2="88" y2="28" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
                        <line x1="8" y1="39" x2="88" y2="30" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--color-text)' }}>AI-Powered Food Discovery</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', maxWidth: '400px' }}>Enter a destination to discover authentic local street food, signature dishes, and top-rated restaurants.</p>
                </div>
            )}
        </div>
    );
}
