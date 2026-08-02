'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AttractionsTab from '@/components/AttractionsTab';
import FoodTab from '@/components/FoodTab';
import SafetyTab from '@/components/SafetyTab';
import TranslateTab from '@/components/TranslateTab';
import GuidesTab from '@/components/GuidesTab';
import HotelsTab from '@/components/HotelsTab';
import Map from '@/components/Map';
import DirectionsPanel from '@/components/DirectionsPanel';
import ChatWidget from '@/components/ChatWidget';
import BudgetTracker from '@/components/BudgetTracker';
import SOSButton from '@/components/SOSButton';
import { db } from '@/lib/db';
import { AuthProvider, useAuth } from '@/lib/auth';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⌘' },
  { id: 'journey', label: 'Journey', icon: '✈' },
  { id: 'attractions', label: 'Attractions', icon: '◈' },
  { id: 'food', label: 'Food', icon: '◉' },
  { id: 'hotels', label: 'Hotels', icon: '⊞' },
  { id: 'guides', label: 'Guides', icon: '◎' },
  { id: 'safety', label: 'Safety', icon: '◇' },
  { id: 'translate', label: 'Translate', icon: '⟐' },
  { id: 'budget', label: 'Budget', icon: '◆' },
  { id: 'map', label: 'Map', icon: '⊕' },
  { id: 'directions', label: 'Directions', icon: '→' },
];

const STATS = [
  { value: '6', label: 'AI Agents' },
  { value: '16+', label: 'Languages' },
  { value: '195', label: 'Countries' },
  { value: '24/7', label: 'Availability' },
];

const INTEREST_OPTIONS = ['Adventure', 'Food', 'Nature', 'History', 'Nightlife', 'Shopping', 'Culture', 'Wellness'];

const TRAVEL_TYPES = [
  { id: 'Solo', label: 'Solo', desc: 'Independent travel' },
  { id: 'Couple', label: 'Couple', desc: 'Romance & sharing' },
  { id: 'Family', label: 'Family', desc: 'Kid-friendly pace' },
  { id: 'Group', label: 'Group', desc: 'Shared budget & fun' },
];

const MOOD_OPTIONS = [
  { id: 'Relaxed', label: 'Relaxed', desc: 'Leisurely pace' },
  { id: 'Adventure', label: 'Adventure', desc: 'Thrilling & active' },
  { id: 'Luxury', label: 'Luxury', desc: 'Premium style' },
  { id: 'Spiritual', label: 'Spiritual', desc: 'Calming & cultural' },
  { id: 'Party', label: 'Party', desc: 'Social & nightlife' },
];

const AGENTS = [
  { title: 'User Context Agent', desc: 'Builds a traveler profile from preferences, budget, and travel style to personalize recommendations.', wide: true, icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
  { title: 'Itinerary Planner', desc: 'Creates optimized day-by-day travel schedules with real activities, meals, and logistics.', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
  { title: 'Food Expert', desc: 'Discovers must-try dishes, top restaurants, and safety details for any destination.', icon: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3' },
  { title: 'Translation Agent', desc: 'Real-time AI translation with phonetic guides and cultural context for 16+ languages.', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' },
  { title: 'Guide Matcher', desc: 'AI-matches you with local expert guides based on language, interests, and budget.', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { title: 'Safety Advisor', desc: 'Comprehensive safety reports with verified emergency contacts, scam alerts, and health warnings.', wide: true, icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
];

const QUICK_ACTIONS = [
  { label: 'Smart Planner', desc: 'Generate customized plans', tab: 'journey', icon: 'M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7' },
  { label: 'Food Expert', desc: 'Explore local cuisine', tab: 'food', icon: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z' },
  { label: 'Translator', desc: 'Translate in 16+ languages', tab: 'translate', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20' },
  { label: 'Emergency Hub', desc: 'Stay safe and call SOS', tab: 'safety', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', danger: true },
];

/* ── Helpers ──────────────────────────────────── */

function parseCostToNumber(costValue) {
  if (typeof costValue === 'number' && Number.isFinite(costValue)) return costValue;
  const raw = String(costValue || '').replace(/,/g, '');
  const match = raw.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function deriveTripExpenses(journey) {
  if (!journey?.itinerary?.days) return [];
  const expenses = [];
  journey.itinerary.days.forEach((day) => {
    (day.activities || []).forEach((activity) => {
      const parsed = parseCostToNumber(activity.cost);
      if (parsed > 0) {
        expenses.push({
          name: activity.name,
          amount: parsed,
          category: activity.category,
          description: `Day ${day.day}: ${activity.name}`,
        });
      }
    });
  });
  return expenses;
}

function SvgIcon({ d, size = 20, stroke = 'currentColor', fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/* ── StatCard ─────────────────────────────────── */

function StatCard({ value, label }) {
  const numericPart = parseInt(value, 10);
  const hasPlus = value.includes('+');
  const isSpecial = value.includes('/');
  const [count, setCount] = useState(() => {
    if (isNaN(numericPart) || isSpecial) return value;
    return '0';
  });
  const elementRef = useRef(null);

  useEffect(() => {
    if (isNaN(numericPart) || isSpecial) return;
    const duration = 1500;
    let startTime = null;
    let frameId = null;
    let observer = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * numericPart);
      setCount(hasPlus ? `${currentVal}+` : `${currentVal}`);
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        frameId = requestAnimationFrame(animate);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) observer.observe(elementRef.current);

    return () => {
      if (observer) observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [numericPart, hasPlus, isSpecial, value]);

  return (
    <div ref={elementRef} className="stats-strip__item">
      <div className="stats-strip__value">{count}</div>
      <div className="stats-strip__label">{label}</div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────── */

export default function Home() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

function AuthGate() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div className="login-spinner" style={{ width: 32, height: 32, borderWidth: 3, borderColor: 'var(--color-surface-3)', borderTopColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <Dashboard />;
}

function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Tab sliding indicator
  const tabRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Journey state
  const [destination, setDestination] = useState('');
  const [budgetVal, setBudgetVal] = useState(30000);
  const [daysVal, setDaysVal] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState(['Food', 'Culture']);
  const [selectedTravelType, setSelectedTravelType] = useState('Couple');
  const [selectedMood, setSelectedMood] = useState('Relaxed');

  const [journeyLoading, setJourneyLoading] = useState(false);
  const [journeyError, setJourneyError] = useState(null);
  const [journeyResult, setJourneyResult] = useState(null);
  const [expandedDay, setExpandedDay] = useState(0);
  const [journeySubTab, setJourneySubTab] = useState('itinerary');
  const [activeMapDay, setActiveMapDay] = useState(1);
  const [tripHydrated, setTripHydrated] = useState(false);

  useEffect(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl) {
      setIndicatorStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
    }
  }, [activeTab]);

  useEffect(() => {
    const hydrateTrip = async () => {
      try {
        const latestTrip = await db.trips.orderBy('savedAt').last();
        if (!latestTrip?.payload) { setTripHydrated(true); return; }
        setDestination(latestTrip.destination || '');
        setBudgetVal(Number(latestTrip.budget || 30000));
        setDaysVal(Number(latestTrip.tripDuration || 3));
        setSelectedInterests(latestTrip.selectedInterests || ['Food', 'Culture']);
        setSelectedTravelType(latestTrip.selectedTravelType || 'Couple');
        setSelectedMood(latestTrip.selectedMood || 'Relaxed');
        setJourneyResult(latestTrip.payload);
        setExpandedDay(0);
        setActiveMapDay(1);
      } catch (error) {
        console.error('Trip hydrate error:', error);
      } finally {
        setTripHydrated(true);
      }
    };
    hydrateTrip();
  }, []);

  useEffect(() => {
    if (!tripHydrated || !journeyResult || !destination) return;
    const saveTrip = async () => {
      try {
        const start = new Date();
        const end = new Date(start);
        end.setDate(start.getDate() + Number(daysVal || 1) - 1);
        await db.trips.add({
          destination,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          savedAt: new Date().toISOString(),
          budget: budgetVal,
          tripDuration: daysVal,
          selectedInterests,
          selectedTravelType,
          selectedMood,
          payload: journeyResult,
        });
      } catch (error) {
        console.error('Trip save error:', error);
      }
    };
    saveTrip();
  }, [tripHydrated, journeyResult, destination, budgetVal, daysVal, selectedInterests, selectedTravelType, selectedMood]);

  const itineraryDays = useMemo(() => journeyResult?.itinerary?.days || [], [journeyResult]);
  const itineraryLocations = useMemo(() => {
    if (journeyResult?.locations?.length) return journeyResult.locations;
    return itineraryDays.flatMap((day) => (
      (day.activities || [])
        .filter((act) => act?.location?.lat && act?.location?.lng)
        .map((act) => ({
          name: act.location.name || act.name,
          lat: act.location.lat,
          lng: act.location.lng,
          day: day.day,
          category: act.category,
          verified: Boolean(act.verified),
          mapUrl: act.mapUrl,
          osmId: act.osmId,
        }))
    ));
  }, [journeyResult, itineraryDays]);

  const budgetSeedExpenses = useMemo(() => deriveTripExpenses(journeyResult), [journeyResult]);
  const budgetSeedAmount = useMemo(
    () => parseCostToNumber(journeyResult?.itinerary?.totalEstimatedCost) || budgetVal,
    [journeyResult, budgetVal]
  );

  const handlePrintTrip = () => window.print();

  const handleCopyTripForWhatsApp = async () => {
    if (!journeyResult?.itinerary?.days?.length) return;
    const summary = [
      `SmartTour itinerary for ${destination}`,
      `Duration: ${daysVal} day(s)`,
      `Estimated cost: ${journeyResult?.itinerary?.totalEstimatedCost || 'N/A'}`,
      ...(journeyResult?.itinerary?.days || []).map((day) => `Day ${day.day}: ${(day.activities || []).map((a) => a.name).join(', ')}`),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(summary);
      const link = `https://wa.me/?text=${encodeURIComponent(summary)}`;
      window.open(link, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('WhatsApp copy failed:', error);
    }
  };

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerateJourney = async () => {
    if (!destination.trim()) return;
    setJourneyLoading(true);
    setJourneyError(null);
    // A request is for the currently configured trip. Do not keep displaying a
    // previously generated destination while the new one is loading or failed.
    setJourneyResult(null);

    try {
      const payload = {
        destination,
        budget: budgetVal,
        tripDuration: daysVal,
        interests: selectedInterests,
        travelStyle: selectedTravelType,
        mood: selectedMood,
      };

      const response = await fetch('/api/agent/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const d = await response.json();
      if (d.success) {
        setJourneyResult(d.data);
        setExpandedDay(0);
        setActiveMapDay(1);
      } else {
        setJourneyError(d.error || 'Failed to generate travel plan.');
      }
    } catch (e) {
      console.error(e);
      setJourneyError('Connection failed. Make sure server is running and try again.');
    } finally {
      setJourneyLoading(false);
    }
  };

  /* ── Render ────────────────────────────────── */

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* ═══ Header ═══ */}
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <div className="app-header__logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="var(--color-primary-glow)" />
              </svg>
            </div>
            <div>
              <h1 className="app-header__title">SmartTour</h1>
              <p className="app-header__tagline">Agentic AI Travel System</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div className="app-header__status">
              <span className="pulse-dot" />
              <span>6 Agents Online</span>
            </div>
            {user && (
              <div className="user-badge">
                <span>{user.avatar}</span>
                <span className="user-badge-name">{user.name}</span>
                <button className="user-badge-logout" onClick={() => { logout(); router.replace('/login'); }}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══ Navigation ═══ */}
      <nav className="app-nav">
        <div className="app-nav__inner">
          <div className="app-nav__tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                ref={el => { tabRefs.current[tab.id] = el; }}
                onClick={() => setActiveTab(tab.id)}
                className={`app-nav__tab ${activeTab === tab.id ? 'app-nav__tab--active' : ''}`}
              >
                <span className="app-nav__tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <div
              className="app-nav__indicator"
              style={{
                width: `${indicatorStyle.width}px`,
                transform: `translateX(${indicatorStyle.left}px)`,
              }}
            />
          </div>
        </div>
      </nav>

      {/* ═══ Main ═══ */}
      <main className="app-main">

        {/* ──── DASHBOARD ──── */}
        {activeTab === 'dashboard' && (
          <div key="tab-dashboard" className="page-enter-active" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Hero */}
            <div className="hero">
              <div className="hero__content">
                <div className="hero__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
                  </svg>
                </div>
                <h2 className="hero__title">Explore Without Limits</h2>
                <p className="hero__subtitle">
                  An AI-powered smart travel system helping tourists plan itineraries, navigate routes, find street food, translate on the fly, and stay secure.
                </p>
                <div className="hero__actions">
                  <button className="btn-primary" onClick={() => setActiveTab('journey')} style={{ padding: '14px 28px', fontSize: 'var(--text-base)' }}>
                    Plan Your Journey
                  </button>
                  <button className="btn-secondary" onClick={() => setActiveTab('food')} style={{ padding: '14px 28px' }}>
                    Discover Food
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              {QUICK_ACTIONS.map((qa, i) => (
                <div key={i} className={`card card--interactive ${qa.danger ? 'card--glow' : ''}`} onClick={() => setActiveTab(qa.tab)}>
                  <div className="quick-action-card">
                    <div className="quick-action-card__icon" style={qa.danger ? { background: 'var(--color-error-subtle)', color: 'var(--color-error)' } : {}}>
                      <SvgIcon d={qa.icon} size={20} />
                    </div>
                    <div>
                      <div className="quick-action-card__title">{qa.label}</div>
                      <div className="quick-action-card__desc">{qa.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="stats-strip reveal">
              {STATS.map((s, i) => (
                <StatCard key={i} value={s.value} label={s.label} />
              ))}
            </div>

            {/* Agent Feature Cards */}
            <div>
              <h3 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>Powered by 6 Specialized AI Agents</h3>
              <div className="features-grid card-stagger">
                {AGENTS.map((agent, i) => (
                  <div key={i} className={`card feature-card ${agent.wide ? 'feature-card--wide' : ''}`}>
                    <div className="feature-card__icon">
                      <SvgIcon d={agent.icon} size={20} />
                    </div>
                    <div className="feature-card__title">{agent.title}</div>
                    <div className="feature-card__desc">{agent.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Block */}
            <div className="cta-block reveal">
              <h3 className="cta-block__title">Ready to Explore?</h3>
              <p className="cta-block__desc">
                Activate specialized AI sub-agents to assist you with every aspect of your journey.
              </p>
              <div className="cta-block__pills">
                {[
                  { label: 'Build Itinerary', tab: 'journey' },
                  { label: 'Street Food', tab: 'food' },
                  { label: 'Hotels', tab: 'hotels' },
                  { label: 'Find Guide', tab: 'guides' },
                  { label: 'Safety Check', tab: 'safety' },
                  { label: 'Translate', tab: 'translate' },
                  { label: 'Budget', tab: 'budget' },
                  { label: 'Map', tab: 'map' },
                ].map((pill, idx) => (
                  <button key={idx} className="pill-toggle" onClick={() => setActiveTab(pill.tab)}>
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ──── JOURNEY PLANNER ──── */}
        {activeTab === 'journey' && (
          <div key="tab-journey" className="page-enter-active" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div className="page-header">
              <h2 className="section-title">AI Smart Itinerary Planner</h2>
              <p className="section-subtitle">Plan a custom trip optimized with attractions, local food, and safety parameters</p>
            </div>

            <div className="journey-layout">
              {/* Config Panel */}
              <div className="journey-config">
                <div className="card" style={{ padding: 'var(--space-6)' }}>
                  <h3 className="journey-config__title">Trip Configuration</h3>
                  <div className="journey-config__form">
                    {/* Destination */}
                    <div>
                      <label className="label">Destination</label>
                      <input
                        className="input-field"
                        placeholder="e.g. Kyoto, Rome, Kerala, London..."
                        value={destination}
                        onChange={e => setDestination(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleGenerateJourney()}
                      />
                    </div>

                    {/* Budget Slider */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label className="label" style={{ marginBottom: 0 }}>Trip Budget (₹)</label>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary-light)', fontVariantNumeric: 'tabular-nums' }}>
                          ₹{budgetVal.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <input
                        type="range" min="5000" max="100000" step="5000"
                        value={budgetVal}
                        onChange={e => setBudgetVal(Number(e.target.value))}
                        className="custom-slider"
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: '4px' }}>
                        <span>₹5,000</span><span>₹50,000</span><span>₹1,00,000</span>
                      </div>
                    </div>

                    {/* Days Slider */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label className="label" style={{ marginBottom: 0 }}>Duration</label>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                          {daysVal} {daysVal === 1 ? 'Day' : 'Days'}
                        </span>
                      </div>
                      <input
                        type="range" min="1" max="7"
                        value={daysVal}
                        onChange={e => setDaysVal(Number(e.target.value))}
                        className="custom-slider"
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: '4px' }}>
                        <span>1 Day</span><span>3 Days</span><span>5 Days</span><span>7 Days</span>
                      </div>
                    </div>

                    {/* Interests */}
                    <div>
                      <label className="label">Interests</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {INTEREST_OPTIONS.map(interest => (
                          <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`pill-toggle ${selectedInterests.includes(interest) ? 'active' : ''}`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Travel Type */}
                    <div>
                      <label className="label">Travel Companion</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {TRAVEL_TYPES.map(t => (
                          <div
                            key={t.id}
                            onClick={() => setSelectedTravelType(t.id)}
                            className={`card card--flat card--interactive`}
                            style={{
                              textAlign: 'center',
                              padding: 'var(--space-3)',
                              background: selectedTravelType === t.id ? 'var(--color-primary-subtle)' : 'var(--color-surface-0)',
                              boxShadow: selectedTravelType === t.id ? '0 0 0 1px var(--color-primary)' : 'var(--border-hairline)',
                            }}
                          >
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{t.label}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: '2px' }}>{t.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mood */}
                    <div>
                      <label className="label">Travel Mood</label>
                      <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                        {MOOD_OPTIONS.map(m => (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMood(m.id)}
                            className="card card--flat card--interactive"
                            style={{
                              textAlign: 'center',
                              padding: 'var(--space-2) var(--space-3)',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                              background: selectedMood === m.id ? 'var(--color-primary-subtle)' : 'var(--color-surface-0)',
                              boxShadow: selectedMood === m.id ? '0 0 0 1px var(--color-primary)' : 'var(--border-hairline)',
                            }}
                          >
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{m.label}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-faint)' }}>{m.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <button
                      className="btn-primary"
                      onClick={handleGenerateJourney}
                      disabled={journeyLoading || !destination.trim()}
                      style={{ padding: '14px', marginTop: 'var(--space-2)' }}
                    >
                      {journeyLoading ? (
                        <><span className="spinner" /> Operating AI Agents...</>
                      ) : (
                        'Generate AI Journey Plan'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Panel */}
              <div className="journey-result">
                {/* Loading */}
                {journeyLoading && (
                  <div className="card loading-state">
                    <div className="spinner loading-state__spinner" />
                    <div>
                      <h4 className="loading-state__title">Orchestrating AI Agents...</h4>
                      <p className="loading-state__desc">
                        Analyzing user profile, planning itinerary, fetching safety briefings, and compiling local food options in parallel.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {journeyError && (
                  <div className="error-banner">⚠️ {journeyError}</div>
                )}

                {/* Empty State */}
                {!journeyResult && !journeyLoading && !journeyError && (
                  <div className="card empty-state">
                    <div className="empty-state__icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="empty-state__title">Your AI Journey Dashboard</h3>
                    <p className="empty-state__desc">Configure your travel preferences and generate a personalized smart plan.</p>
                  </div>
                )}

                {/* Journey Data */}
                {journeyResult && journeyResult.itinerary && journeyResult.itinerary.days && (
                  <div className="card-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    {/* Banner */}
                    <div className="card journey-banner">
                      <span className="badge badge-primary" style={{ marginBottom: 'var(--space-2)', display: 'inline-flex' }}>✓ Journey Generated</span>
                      <h3 className="journey-banner__title">
                        {journeyResult.itinerary?.destination || destination}
                      </h3>
                      <p className="journey-banner__meta">
                        A {journeyResult.itinerary?.duration || daysVal}-day {selectedMood.toLowerCase()} trip planned for a {selectedTravelType.toLowerCase()} profile.
                      </p>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
                        <span className="badge badge-primary">💰 {journeyResult.itinerary?.totalEstimatedCost || `Budget Tier: ${journeyResult.userProfile?.budget?.tier}`}</span>
                        {journeyResult.userProfile?.adventureScore && <span className="badge badge-success">Adventure: {journeyResult.userProfile.adventureScore}/100</span>}
                        {journeyResult.userProfile?.comfortScore && <span className="badge badge-warning">Comfort: {journeyResult.userProfile.comfortScore}/100</span>}
                      </div>

                      <div className="no-print" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
                        <button className="btn-secondary" onClick={handlePrintTrip}>Export PDF</button>
                        <button className="btn-secondary" onClick={handleCopyTripForWhatsApp}>Share via WhatsApp</button>
                      </div>
                    </div>

                    {/* Sub-Tabs */}
                    <div className="journey-subtabs">
                      {[
                        { id: 'itinerary', label: 'Itinerary' },
                        { id: 'food', label: 'Food & Dine' },
                        { id: 'safety', label: 'Safety & SOS' },
                        { id: 'tips', label: 'Pack & Transport' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setJourneySubTab(tab.id)}
                          className={`journey-subtab ${journeySubTab === tab.id ? 'journey-subtab--active' : ''}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* ITINERARY SUB-TAB */}
                    {journeySubTab === 'itinerary' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {journeyResult.itinerary?.days?.map((day, idx) => {
                          const isExpanded = expandedDay === idx;
                          return (
                            <div key={idx} className="card day-accordion" style={{ padding: 0 }}>
                              <div
                                className="day-accordion__header"
                                onClick={() => {
                                  setExpandedDay(isExpanded ? -1 : idx);
                                  if (!isExpanded) setActiveMapDay(day.day || idx + 1);
                                }}
                              >
                                <div className="day-accordion__left">
                                  <div className="day-number">{day.day}</div>
                                  <div>
                                    <div className="day-accordion__title">{day.theme || `Day ${day.day} Plan`}</div>
                                    {day.duration && <div className="day-accordion__duration">Duration: {day.duration}</div>}
                                  </div>
                                </div>
                                <span className={`day-accordion__chevron ${isExpanded ? 'day-accordion__chevron--open' : ''}`}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9" />
                                  </svg>
                                </span>
                              </div>

                              {isExpanded && (
                                <div className="day-content">
                                  <div className="timeline">
                                    {day.activities?.map((act, actIdx) => (
                                      <div key={actIdx} className="activity">
                                        <div className="activity__dot" />
                                        <div className="activity__header">
                                          <span className="activity__time">{act.time}</span>
                                          <span className="activity__name">{act.name}</span>
                                          {act.verified && <span className="badge badge-success">Verified</span>}
                                          {act.cost && <span className="badge" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>{act.cost}</span>}
                                        </div>
                                        <p className="activity__desc">{act.description}</p>
                                        {act.location?.name && (
                                          <p className="activity__location">📍 {act.location.name} {act.location.address ? `(${act.location.address})` : ''}</p>
                                        )}
                                        {act.mapUrl && (
                                          <a href={act.mapUrl} target="_blank" rel="noreferrer" className="activity__map-link">
                                            Open in Google Maps →
                                          </a>
                                        )}
                                        {act.tips && <p className="activity__tip">💡 {act.tips}</p>}
                                      </div>
                                    ))}
                                  </div>

                                  {/* Meals */}
                                  {day.meals && (
                                    <div className="meals-section">
                                      <h5 className="meals-section__title">Suggested Meals</h5>
                                      <div className="meals-grid">
                                        {Object.entries(day.meals).map(([mealType, mealDesc]) => (
                                          <div key={mealType} className="meal-chip">
                                            <div className="meal-chip__type">{mealType}</div>
                                            <div className="meal-chip__name">
                                              {typeof mealDesc === 'string' ? mealDesc : (mealDesc.name || mealDesc.cuisine || 'Local restaurant')}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* FOOD SUB-TAB */}
                    {journeySubTab === 'food' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {journeyResult.foodRecommendations ? (
                          <>
                            <div className="card" style={{ background: 'var(--color-success-subtle)', boxShadow: 'inset 0 0 0 1px rgba(34, 197, 94, 0.15), var(--shadow-sm)' }}>
                              <h4 style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--color-success)', marginBottom: '6px' }}>Cuisine Overview</h4>
                              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                                {journeyResult.foodRecommendations.cuisineOverview || 'AI Food expert analysis loaded successfully.'}
                              </p>
                              <div style={{ display: 'flex', gap: '8px', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
                                {journeyResult.foodRecommendations.vegetarianFriendly && <span className="badge badge-success">Veg Friendly</span>}
                                {journeyResult.foodRecommendations.drinkingWaterSafety && <span className="badge badge-primary">Water: {journeyResult.foodRecommendations.drinkingWaterSafety}</span>}
                              </div>
                            </div>

                            {journeyResult.foodRecommendations.mustTryDishes && (
                              <div>
                                <h4 style={{ fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>Must-Try Traditional Dishes</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                                  {(journeyResult.foodRecommendations.mustTryDishes || []).slice(0, 3).map((dish, dIdx) => (
                                    <div key={dIdx} className="card card--flat" style={{ padding: 'var(--space-4)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <h5 style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{dish.name}</h5>
                                        {dish.averagePriceUSD && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning)' }}>~${dish.averagePriceUSD}</span>}
                                      </div>
                                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', lineHeight: 1.4 }}>{dish.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>No food recommendation data available.</p>
                        )}
                      </div>
                    )}

                    {/* SAFETY SUB-TAB */}
                    {journeySubTab === 'safety' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {journeyResult.safetyInformation ? (
                          <>
                            <div className="card" style={{ background: 'var(--color-error-subtle)', boxShadow: 'inset 3px 0 0 var(--color-error), var(--border-hairline)' }}>
                              <h4 style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--color-error)', marginBottom: '6px' }}>Safety Assessment</h4>
                              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                                {journeyResult.safetyInformation.safetyAssessment || journeyResult.safetyInformation.assessment || 'Destination specific safety report.'}
                              </p>
                            </div>

                            {(journeyResult.safetyInformation.commonScams || journeyResult.safetyInformation.scams) && (
                              <div className="card card--flat" style={{ padding: 'var(--space-5)' }}>
                                <h4 style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-warning)', marginBottom: 'var(--space-3)' }}>Common Scams & Risks</h4>
                                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {(journeyResult.safetyInformation.commonScams || journeyResult.safetyInformation.scams || []).map((scam, sIdx) => (
                                    <li key={sIdx} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                      {typeof scam === 'string' ? scam : (<><strong>{scam.name || scam.scam}:</strong> {scam.description || scam.howToAvoid}</>)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>No safety data available.</p>
                        )}
                      </div>
                    )}

                    {/* TIPS SUB-TAB */}
                    {journeySubTab === 'tips' && (
                      <div className="card card--flat" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {journeyResult.itinerary?.packingTips && (
                          <div>
                            <h4 style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>Recommended Packing List</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {(journeyResult.itinerary.packingTips || []).map((tip, tIdx) => (
                                <span key={tIdx} className="badge badge-primary">{tip}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {journeyResult.itinerary?.transportTips && (
                          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
                            <h4 style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: '6px' }}>Transport & Transit Advice</h4>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                              {journeyResult.itinerary.transportTips}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ──── Tab Components ──── */}
        {activeTab === 'attractions' && <AttractionsTab key="tab-attractions" defaultDestination={destination} />}
        {activeTab === 'food' && <FoodTab key="tab-food" defaultDestination={destination} initialData={journeyResult?.foodRecommendations} />}
        {activeTab === 'hotels' && <HotelsTab key="tab-hotels" defaultDestination={destination} />}
        {activeTab === 'guides' && <GuidesTab key="tab-guides" destination={destination} userProfile={journeyResult?.userProfile} />}
        {activeTab === 'safety' && <SafetyTab key="tab-safety" defaultDestination={destination} initialData={journeyResult?.safetyInformation} tripData={journeyResult} />}
        {activeTab === 'translate' && <TranslateTab key="tab-translate" />}
        {activeTab === 'budget' && <BudgetTracker key="tab-budget" tripBudget={budgetSeedAmount} tripExpenses={budgetSeedExpenses} />}

        {activeTab === 'map' && (
          <div key="tab-map" className="page-enter-active">
            <div className="page-header">
              <h2 className="section-title">Explore Places</h2>
              <p className="section-subtitle">Find nearby hotels, restaurants, and attractions using OpenStreetMap</p>
            </div>
            {itineraryDays.length > 0 && (
              <div className="card card--flat no-print" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Itinerary day on map</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {itineraryDays.map((day, idx) => (
                    <button
                      key={`map-day-${day.day || idx + 1}`}
                      className={`pill-toggle ${activeMapDay === (day.day || idx + 1) ? 'active' : ''}`}
                      onClick={() => setActiveMapDay(day.day || idx + 1)}
                    >
                      Day {day.day || idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="card map-container">
              <Map locations={itineraryLocations} activeDay={activeMapDay} defaultDestination={destination} />
            </div>
          </div>
        )}

        {activeTab === 'directions' && (
          <div key="tab-directions" className="page-enter-active">
            <div className="page-header">
              <h2 className="section-title">Route Directions</h2>
              <p className="section-subtitle">Get optimized routes with turn-by-turn instructions powered by OSRM</p>
            </div>
            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
              <DirectionsPanel />
            </div>
          </div>
        )}
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="app-footer">
        <div className="app-footer__inner">
          <div className="app-footer__grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="app-header__logo">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="var(--color-primary-glow)" />
                  </svg>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)' }}>SmartTour</span>
              </div>
              <p className="app-footer__brand-text">
                AI-powered travel companion with 6 specialized agents for the modern traveler.
              </p>
            </div>
            <div>
              <h4 className="app-footer__heading">AI Agents</h4>
              <div className="app-footer__links">
                {['Itinerary Planner', 'Food Expert', 'Translation Agent', 'Guide Matcher', 'Safety Advisor', 'User Context Agent'].map(f => (
                  <span key={f} className="app-footer__link" onClick={() => setActiveTab('journey')}>{f}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="app-footer__heading">Services</h4>
              <div className="app-footer__links">
                {[
                  { label: 'Itinerary Planning', tab: 'journey' },
                  { label: 'Local Cuisine', tab: 'food' },
                  { label: 'Real-time Translation', tab: 'translate' },
                  { label: 'Guide Matching', tab: 'guides' },
                  { label: 'Emergency SOS', tab: 'safety' },
                  { label: 'Budget Tracker', tab: 'budget' },
                ].map(f => (
                  <span key={f.label} className="app-footer__link" onClick={() => setActiveTab(f.tab)}>{f.label}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="app-footer__heading">Technology</h4>
              <div className="app-footer__links">
                {['Gemini 2.0 Flash', 'Next.js 16', 'OpenStreetMap', 'OSRM Routing', 'Open-Meteo Weather', 'IndexedDB'].map(f => (
                  <span key={f} style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="app-footer__bottom">
            <p>© 2026 SmartTour — Built with Agentic AI Architecture · 6 Specialized Agents · Powered by Gemini 2.0</p>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      <SOSButton />
      <ChatWidget />
    </div>
  );
}
