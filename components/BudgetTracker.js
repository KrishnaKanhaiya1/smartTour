'use client';

import { useMemo, useState } from 'react';

const CATEGORIES = [
  { name: 'Accommodation', icon: '🏨', color: 'var(--color-primary-light)' },
  { name: 'Transport', icon: '🚇', color: '#74b9ff' },
  { name: 'Food', icon: '🍔', color: '#fdcb6e' },
  { name: 'Attractions', icon: '🎟️', color: 'var(--color-success)' },
  { name: 'Shopping', icon: '🛍️', color: '#fd79a8' },
  { name: 'Others', icon: '🏷️', color: 'var(--color-text-muted)' },
];

function inferCategory(raw) {
  const val = String(raw || '').toLowerCase();
  if (val.includes('food') || val.includes('meal') || val.includes('restaurant')) return 'Food';
  if (val.includes('hotel') || val.includes('stay') || val.includes('accommodation')) return 'Accommodation';
  if (val.includes('transport') || val.includes('taxi') || val.includes('bus') || val.includes('train')) return 'Transport';
  if (val.includes('ticket') || val.includes('museum') || val.includes('attraction') || val.includes('cultural')) return 'Attractions';
  if (val.includes('shop')) return 'Shopping';
  return 'Others';
}

function parseCostToNumber(cost) {
  if (typeof cost === 'number' && Number.isFinite(cost)) return cost;
  const text = String(cost || '').replace(/,/g, '');
  const match = text.match(/(\d+(\.\d+)?)/);
  if (!match) return 0;
  return Number(match[1]);
}

function normalizeTripExpenses(tripExpenses = []) {
  return (tripExpenses || [])
    .map((exp, i) => ({
      id: `trip-${i}-${Date.now()}`,
      amount: parseCostToNumber(exp.amount || exp.cost),
      category: inferCategory(exp.category || exp.type || exp.name),
      description: exp.description || exp.name || 'Planned itinerary expense',
      date: new Date().toLocaleDateString(),
      planned: true,
    }))
    .filter((exp) => exp.amount > 0);
}

export default function BudgetTracker({ tripBudget = null, tripExpenses = [] }) {
  const [totalBudget, setTotalBudget] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedBudget = localStorage.getItem('st_total_budget');
      if (savedBudget) return Number(savedBudget);
    }
    return tripBudget ? Number(tripBudget) : 30000;
  });

  const [expenses, setExpenses] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedExpenses = localStorage.getItem('st_expenses');
      if (savedExpenses) return JSON.parse(savedExpenses);
    }

    const normalized = normalizeTripExpenses(tripExpenses);
    return normalized.length > 0 ? normalized : [];
  });

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');

  const saveBudget = (val) => {
    setTotalBudget(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('st_total_budget', String(val));
    }
  };

  const saveExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    if (typeof window !== 'undefined') {
      localStorage.setItem('st_expenses', JSON.stringify(newExpenses));
    }
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const newExpense = {
      id: Date.now().toString(),
      amount: Number(amount),
      category,
      description: description.trim() || category,
      date: new Date().toLocaleDateString(),
      planned: false,
    };

    const updated = [newExpense, ...expenses];
    saveExpenses(updated);
    setAmount('');
    setDescription('');
  };

  const handleDeleteExpense = (id) => {
    const updated = expenses.filter((exp) => exp.id !== id);
    saveExpenses(updated);
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to reset the budget and clear all expenses?')) {
      saveExpenses([]);
      saveBudget(30000);
    }
  };

  const totalSpent = useMemo(() => expenses.reduce((acc, exp) => acc + exp.amount, 0), [expenses]);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const aiTip = useMemo(() => {
    if (expenses.length === 0) {
      return 'Welcome! Add your expenses to see live financial tips and category breakdowns.';
    }

    const categorySums = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    let highCategory = '';
    let highVal = 0;
    Object.entries(categorySums).forEach(([cat, sum]) => {
      if (sum > highVal) {
        highVal = sum;
        highCategory = cat;
      }
    });

    if (spentPercentage >= 95) {
      return 'Critical warning: your travel budget is almost exhausted. Prioritize free attractions and essential spending only.';
    }
    if (spentPercentage >= 75) {
      return `Budget alert: ${spentPercentage.toFixed(0)}% spent. Highest category is ${highCategory} (₹${highVal.toLocaleString('en-IN')}).`;
    }
    if (highCategory === 'Food' && totalSpent > 0 && highVal / totalSpent > 0.4) {
      return 'Tip: food dominates your budget. Consider local lunch homes and street food to reduce costs.';
    }
    if (highCategory === 'Transport') {
      return 'Tip: transport costs are high. Check if a city transit pass is available for your destination.';
    }
    return 'Safe budget status: spending is under control. Continue logging daily expenses.';
  }, [expenses, spentPercentage, totalSpent]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="page-enter-active">
      <div className="page-header">
        <div>
          <span className="label" style={{ color: 'var(--color-primary-light)' }}>FINANCIAL CO-PILOT</span>
          <h2 className="section-title">💰 Smart Budget & Expenses</h2>
          <p className="section-subtitle">Auto-filled from itinerary and editable in real time</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <span className="label">Total Budget</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)' }}>₹</span>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => saveBudget(Number(e.target.value))}
              style={{ background: 'transparent', border: 'none', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', width: '100%', outline: 'none' }}
            />
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-faint)', marginTop: '4px' }}>Editable planned budget</p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span className="label">Total Spent</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-error)', marginTop: '8px' }}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-faint)', marginTop: '4px' }}>Across {expenses.length} records</p>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span className="label">Remaining</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: remaining < 0 ? 'var(--color-error)' : 'var(--color-success)', marginTop: '8px' }}>
            ₹{remaining.toLocaleString('en-IN')}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-faint)', marginTop: '4px' }}>
            {remaining < 0 ? 'Over budget' : 'Within limit'}
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Budget Usage</span>
          <span style={{ color: spentPercentage > 90 ? 'var(--color-error)' : spentPercentage > 70 ? 'var(--color-warning)' : 'var(--color-success)' }}>
            {spentPercentage.toFixed(1)}% Spent
          </span>
        </div>
        <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(100, spentPercentage)}%`, background: spentPercentage > 90 ? 'var(--color-error)' : spentPercentage > 70 ? 'var(--color-warning)' : 'var(--color-success)', borderRadius: '9999px' }} />
        </div>
      </div>

      <div className="card" style={{ padding: '20px', background: spentPercentage > 90 ? 'var(--color-error-subtle)' : 'rgba(0,184,148,0.04)', borderLeft: `4px solid ${spentPercentage > 90 ? 'var(--color-error)' : 'var(--color-success)'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>💡</span>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>AI Travel Budget Co-Pilot</span>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{aiTip}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }} className="grid-responsive-layout">
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '18px' }}>➕ Record Expense</h3>
          <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="label">Amount (₹)</label>
              <input type="number" className="input-field" placeholder="e.g. 750" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>

            <div>
              <label className="label">Category</label>
              <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} style={{ height: '46px' }}>
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Description</label>
              <input type="text" className="input-field" placeholder="e.g. Metro pass, museum tickets" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '8px', height: '46px' }}>Save Expense</button>
          </form>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>📋 Expense Log ({expenses.length})</h3>
            {expenses.length > 0 && (
              <button onClick={clearAll} className="btn-ghost" style={{ padding: '4px 10px', fontSize: '0.72rem', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)' }}>
                Reset All
              </button>
            )}
          </div>

          <div style={{ flex: 1, maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {expenses.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-faint)', fontSize: '0.85rem' }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🧾</p>
                <p>No expenses recorded yet</p>
              </div>
            ) : (
              expenses.map((exp) => {
                const catData = CATEGORIES.find((c) => c.name === exp.category) || CATEGORIES[5];
                return (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', color: catData.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                        {catData.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {exp.description}
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          {exp.date} · {exp.category} {exp.planned ? '· Planned' : '· Actual'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-error)' }}>₹{exp.amount}</span>
                      <button onClick={() => handleDeleteExpense(exp.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-faint)', cursor: 'pointer', fontSize: '0.9rem', padding: '4px' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .grid-responsive-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
