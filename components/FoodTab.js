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
        } catch (e) { console.error(e); setError('Network error or service unavailable.'); }
        setLoading(false);
    };

    const spiceColor = { mild: '#74b9ff', medium: '#fdcb6e', spicy: '#e17055', 'very spicy': '#d63031' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
                <h2 className="section-title">🍽️ Food Recommendation Agent</h2>
                <p className="section-subtitle">AI-curated local cuisine and restaurant guide</p>
            </div>

            {/* Search Form */}
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 2, minWidth: '200px' }}>
                            <label className="label">Destination</label>
                            <input className="input-field" placeholder="Tokyo, Rome, Bangkok, Mumbai..."
                                value={destination} onChange={e => setDestination(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && getFood()} />
                        </div>
                        <div style={{ flex: 1, minWidth: '140px' }}>
                            <label className="label">Budget</label>
                            <select className="input-field" value={budget} onChange={e => setBudget(e.target.value)}>
                                <option value="budget">💰 Budget</option>
                                <option value="moderate">💳 Moderate</option>
                                <option value="premium">💎 Premium</option>
                                <option value="luxury">👑 Luxury</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="label">Dietary Restrictions</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {DIETARY_OPTIONS.map(opt => (
                                <button key={opt} onClick={() => toggleDietary(opt)}
                                    style={{
                                        padding: '6px 14px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                                        border: dietary.includes(opt) ? '1px solid var(--clr-primary)' : '1px solid var(--border-medium)',
                                        background: dietary.includes(opt) ? 'rgba(108,92,231,0.2)' : 'transparent',
                                        color: dietary.includes(opt) ? '#a29bfe' : 'var(--text-secondary)',
                                        transition: 'all 0.2s'
                                    }}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="btn-primary" onClick={getFood} disabled={loading || !destination.trim()}
                        style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
                        {loading ? <><span className="spinner" /> Discovering food...</> : '🔍 Find Local Food'}
                    </button>
                </div>
            </div>

            {foodData && (
                <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Cuisine Overview */}
                    <div className="glass-card" style={{ padding: '24px', background: 'rgba(108,92,231,0.05)' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>{foodData.destination} Food Scene</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{foodData.cuisineOverview}</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                            {foodData.vegetarianFriendly && <span className="badge badge-success">🥗 Veg Friendly</span>}
                            {foodData.halalFriendly && <span className="badge badge-warning">🌙 Halal Friendly</span>}
                            {foodData.drinkingWaterSafety && <span className="badge badge-cyan">💧 {foodData.drinkingWaterSafety}</span>}
                        </div>
                    </div>

                    {/* Must Try Dishes */}
                    {foodData.mustTryDishes?.length > 0 && (
                        <div>
                            <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '16px' }}>⭐ Must-Try Dishes</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '14px' }}>
                                {foodData.mustTryDishes.map((dish, i) => (
                                    <div key={i} className="glass-card" style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                                            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{dish.name}</h4>
                                            <span style={{ fontWeight: 700, color: 'var(--clr-gold)' }}>~${dish.averagePriceUSD}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '10px' }}>{dish.description}</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                                            {dish.isVegetarian && <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>🌿 Veg</span>}
                                            {dish.isVegan && <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>🌱 Vegan</span>}
                                            {dish.isHalal && <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>🌙 Halal</span>}
                                            {dish.isGlutenFree && <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>⚡ GF</span>}
                                            {dish.spiceLevel && <span style={{ padding: '3px 8px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600, background: `${spiceColor[dish.spiceLevel?.toLowerCase()] || '#74b9ff'}20`, color: spiceColor[dish.spiceLevel?.toLowerCase()] || '#74b9ff', border: `1px solid ${spiceColor[dish.spiceLevel?.toLowerCase()] || '#74b9ff'}40` }}>🌶️ {dish.spiceLevel}</span>}
                                        </div>
                                        {dish.localTip && <p style={{ color: 'var(--clr-gold)', fontSize: '0.78rem', fontStyle: 'italic' }}>💡 {dish.localTip}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top Restaurants */}
                    {foodData.topRestaurants?.length > 0 && (
                        <div>
                            <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '16px' }}>🍴 Top Restaurants</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {foodData.topRestaurants.map((r, i) => (
                                    <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'rgba(108,92,231,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>🍽️</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                                <h4 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.name}</h4>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span className="star">★</span>
                                                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{r.rating?.toFixed(1)}</span>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({r.type})</span>
                                                </div>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>{r.cuisine} · {r.neighborhood} · {r.priceRange}</p>
                                            {r.mustOrder && <p style={{ color: 'var(--clr-secondary)', fontSize: '0.82rem', marginTop: '4px' }}>⭐ Try: {r.mustOrder}</p>}
                                        </div>
                                        {r.localFavorite && <span className="badge badge-primary" style={{ whiteSpace: 'nowrap' }}>❤️ Local Fav</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Budget Tips */}
                    {foodData.foodBudgetTips?.length > 0 && (
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <h4 style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--clr-gold)' }}>💰 Food Budget Tips</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
                                {foodData.foodBudgetTips.map((tip, i) => (
                                    <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingLeft: '12px', borderLeft: '2px solid var(--clr-gold)' }}>{tip}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && !foodData && (
                <div className="glass-card" style={{ padding: '24px', background: 'rgba(214,48,49,0.06)', border: '1px solid rgba(214,48,49,0.3)' }}>
                    <p style={{ color: 'var(--clr-danger)', fontWeight: 600, textAlign: 'center' }}>⚠️ {error}</p>
                </div>
            )}

            {!foodData && !loading && !error && (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🍜</p>
                    <p style={{ color: 'var(--text-secondary)' }}>Enter a destination to discover authentic local food recommendations</p>
                </div>
            )}
        </div>
    );
}
