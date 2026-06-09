'use client';

import React, { useState, useEffect, useRef } from 'react';
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

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'journey', label: 'Journey', icon: '✈️' },
  { id: 'attractions', label: 'Attractions', icon: '🏛️' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'hotels', label: 'Hotels', icon: '🏨' },
  { id: 'guides', label: 'Guides', icon: '👨‍🏫' },
  { id: 'safety', label: 'Safety', icon: '🛡️' },
  { id: 'translate', label: 'Translate', icon: '🌐' },
  { id: 'budget', label: 'Budget', icon: '💰' },
  { id: 'map', label: 'Map', icon: '🗺️' },
  { id: 'directions', label: 'Directions', icon: '🧭' },
];

const STATS = [
  { value: '6', label: 'AI Agents' },
  { value: '16+', label: 'Languages' },
  { value: '195', label: 'Countries' },
  { value: '24/7', label: 'Availability' },
];

const INTEREST_OPTIONS = ['Adventure', 'Food', 'Nature', 'History', 'Nightlife', 'Shopping', 'Culture', 'Wellness'];

const TRAVEL_TYPES = [
  { id: 'Solo', label: 'Solo 🧍', desc: 'Independent travel' },
  { id: 'Couple', label: 'Couple 💑', desc: 'Romance & sharing' },
  { id: 'Family', label: 'Family 👨‍👩‍👧‍👦', desc: 'Kid-friendly pace' },
  { id: 'Group', label: 'Group 👥', desc: 'Shared budget & fun' }
];

const MOOD_OPTIONS = [
  { id: 'Relaxed', label: 'Relaxed 😌', desc: 'Leisurely pace' },
  { id: 'Adventure', label: 'Adventure 🤠', desc: 'Thrilling & active' },
  { id: 'Luxury', label: 'Luxury 💎', desc: 'Premium style' },
  { id: 'Spiritual', label: 'Spiritual 🙏', desc: 'Calming & cultural' },
  { id: 'Party', label: 'Party 🎉', desc: 'Social & nightlife' }
];

function StatCard({ value, label }) {
  const [count, setCount] = useState('0');
  const elementRef = useRef(null);
  
  useEffect(() => {
    let observer;
    let frameId;
    
    const numericPart = parseInt(value, 10);
    const hasPlus = value.includes('+');
    const isSpecial = value.includes('/'); // e.g. 24/7
    
    if (isNaN(numericPart) || isSpecial) {
      setCount(value);
      return;
    }
    
    const duration = 1500; // 1.5s
    let startTime = null;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (observer) observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [value]);
  
  return (
    <div ref={elementRef} style={{ padding: '24px 20px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
        {count}
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px', fontFamily: 'var(--font-body)' }}>
        {label}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Tab sliding indicator refs and style
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

  useEffect(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeTab]);

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerateJourney = async () => {
    if (!destination.trim()) return;
    setJourneyLoading(true);
    setJourneyError(null);
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

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* === Header === */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,11,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="var(--color-primary-glow)" />
            </svg>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.1 }}>SmartTour</h1>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-faint)', fontWeight: 500, letterSpacing: '0.5px' }}>AGENTIC AI TRAVEL OPERATING SYSTEM</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>6 AGENTS ONLINE</span>
          </div>
        </div>
      </header>

      {/* === Tab Navigation === */}
      <nav style={{
        position: 'sticky',
        top: '69px',
        zIndex: 90,
        background: 'rgba(10,11,15,0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', overflowX: 'auto', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '2px', minWidth: 'max-content', position: 'relative' }}>
            {TABS.map(tab => (
              <button 
                key={tab.id} 
                ref={el => { tabRefs.current[tab.id] = el; }}
                onClick={() => setActiveTab(tab.id)} 
                style={{
                  padding: '16px 20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  border: 'none',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: activeTab === tab.id ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            {/* Sliding Underline Indicator */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
              background: 'var(--color-primary)',
              width: `${indicatorStyle.width}px`,
              transform: `translateX(${indicatorStyle.left}px)`,
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 1,
            }} />
          </div>
        </div>
      </nav>

      {/* === Main Content === */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', minHeight: 'calc(100vh - 200px)' }}>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div key={`tab-content-${activeTab}`} className="page-enter-active" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Hero */}
            <div className="glass-card" style={{
              padding: '80px 48px',
              background: 'radial-gradient(circle at center, rgba(12, 171, 168, 0.1) 0%, rgba(24, 25, 36, 0.7) 100%)',
              borderColor: 'var(--color-primary-glow)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
                {/* Orbital Rotating SVG Compass */}
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
                  <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', top: 0, left: 0, animation: 'spin 12s linear infinite' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.6" />
                    <circle cx="60" cy="10" r="4" fill="var(--color-primary-light)" />
                  </svg>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '30px', left: '30px', animation: 'spin 60s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="var(--color-primary)" opacity="0.1" />
                    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
                  </svg>
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text)',
                  marginBottom: '16px',
                  lineHeight: 1.1,
                }}>
                  Explore Without Limits
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-lg)', maxWidth: '52ch', margin: '0 auto 32px', lineHeight: 1.7 }}>
                  An AI-powered smart travel operating system helping tourists plan itineraries, navigate routes, find street food, translate on the fly, and stay secure.
                </p>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-primary" onClick={() => setActiveTab('journey')} style={{ padding: '14px 28px' }}>
                    Explore Attractions
                  </button>
                  <button className="btn-ghost" onClick={() => setActiveTab('food')} style={{ padding: '14px 28px' }}>
                    Discover Food
                  </button>
                </div>

                {/* Animated Chevron Down Bounce */}
                <style>{`
                  @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                  }
                `}</style>
                <div style={{ marginTop: '48px', animation: 'bounce 2s infinite', display: 'inline-block' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }} onClick={() => setActiveTab('journey')}>
                <div style={{ fontSize: '2rem' }}>🗺️</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>Smart Planner</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Generate customized plans</p>
                </div>
              </div>
              <div className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }} onClick={() => setActiveTab('food')}>
                <div style={{ fontSize: '2rem' }}>🍜</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>Food Expert</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Explore local cuisine</p>
                </div>
              </div>
              <div className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }} onClick={() => setActiveTab('translate')}>
                <div style={{ fontSize: '2rem' }}>🌐</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>Real-time Translator</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Translate in 16+ languages</p>
                </div>
              </div>
              <div className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', padding: '20px', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClick={() => setActiveTab('safety')}>
                <div style={{ fontSize: '2rem' }}>🚨</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ff7675' }}>Emergency Hub</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Stay safe and call SOS</p>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="reveal" style={{
              background: 'var(--color-surface)',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              margin: '20px 0',
            }}>
              <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
              }} className="stats-grid">
                {STATS.map((s, i) => (
                  <StatCard key={i} value={s.value} label={s.label} />
                ))}
              </div>
              <style dangerouslySetInnerHTML={{ __html: `
                .stats-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                }
                .stats-grid > div {
                  border-bottom: 1px solid var(--border-subtle);
                }
                .stats-grid > div:nth-child(even) {
                  border-left: 1px solid var(--border-subtle);
                }
                .stats-grid > div:nth-child(3), .stats-grid > div:nth-child(4) {
                  border-bottom: none;
                }
                @media (min-width: 768px) {
                  .stats-grid {
                    grid-template-columns: repeat(4, 1fr);
                  }
                  .stats-grid > div {
                    border-bottom: none !important;
                    border-left: none !important;
                  }
                  .stats-grid > div:not(:first-child) {
                    border-left: 1px solid var(--border-subtle) !important;
                  }
                }
              `}} />
            </div>

            {/* Agent Cards (Bento Grid) */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: 'var(--color-text)' }}>
                Powered by 6 Specialized AI Agents
              </h3>
              <div className="card-stagger bento-grid">
                {/* Card 1: User Context Agent (2 cols) */}
                <div className="card bento-col-2" style={{ background: 'radial-gradient(circle at 10% 10%, rgba(12, 171, 168, 0.08) 0%, rgba(24, 25, 36, 0.7) 70%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      <h4 style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>User Context Agent</h4>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      Builds a traveler profile from preferences, budget, and travel style to personalize recommendations.
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                </div>

                {/* Card 2: Itinerary Planner (1 col) */}
                <div className="card bento-col-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      <h4 style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>Itinerary Planner</h4>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      Creates optimized day-by-day travel schedules with real activities, meals, and logistics.
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                </div>

                {/* Card 3: Food Expert (1 col) */}
                <div className="card bento-col-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                      <h4 style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>Food Expert</h4>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      Discovers must-try dishes, top restaurants, and safety details for any destination worldwide.
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                </div>

                {/* Card 4: Translation Agent (1 col) */}
                <div className="card bento-col-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                      <h4 style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>Translation Agent</h4>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      Real-time AI translation with phonetic guides and cultural context for 16+ languages.
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                </div>

                {/* Card 5: Guide Matcher (1 col) */}
                <div className="card bento-col-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                      <h4 style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>Guide Matcher</h4>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      AI-matches you with local expert guides based on language, interests, and budget.
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                </div>

                {/* Card 6: Safety Advisor (2 cols) */}
                <div className="card bento-col-2" style={{ background: 'radial-gradient(circle at 10% 10%, rgba(12, 171, 168, 0.08) 0%, rgba(24, 25, 36, 0.7) 70%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      <h4 style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>Safety Advisor</h4>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      Comprehensive safety reports with emergency contacts, scam alerts, and health warnings.
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                </div>

                {/* Inline Styles for Bento Grid */}
                <style dangerouslySetInnerHTML={{ __html: `
                  .bento-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                  }
                  @media (min-width: 768px) {
                    .bento-grid {
                      grid-template-columns: repeat(4, 1fr);
                    }
                    .bento-col-2 {
                      grid-column: span 2;
                    }
                    .bento-col-1 {
                      grid-column: span 1;
                    }
                  }
                `}} />
              </div>
            </div>

            {/* Ready to Explore CTA Block */}
            <div className="reveal" style={{
              background: 'linear-gradient(135deg, rgba(12, 171, 168, 0.1) 0%, rgba(24, 25, 36, 0.7) 100%)',
              border: '1px solid var(--color-primary-glow)',
              borderRadius: 'var(--radius-2xl)',
              padding: '48px 32px',
              textAlign: 'center',
              marginTop: '40px',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-xl)',
                fontWeight: 800,
                marginBottom: '12px',
                color: 'var(--color-text)',
              }}>
                Ready to Explore?
              </h3>
              <p style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)',
                maxWidth: '500px',
                margin: '0 auto 24px',
                lineHeight: 1.6,
              }}>
                Activate specialized AI sub-agents to assist you with every aspect of your journey.
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
                maxWidth: '800px',
                margin: '0 auto',
              }}>
                {[
                  { label: 'Build Itinerary', tab: 'journey' },
                  { label: 'Street Food Finder', tab: 'food' },
                  { label: 'Hotel Matcher', tab: 'hotels' },
                  { label: 'Find Local Guide', tab: 'guides' },
                  { label: 'Safety Check', tab: 'safety' },
                  { label: 'Translate Phrase', tab: 'translate' },
                  { label: 'Track Budget', tab: 'budget' },
                  { label: 'Explore Map', tab: 'map' },
                ].map((pill, idx) => (
                  <button
                    key={idx}
                    className="pill-toggle"
                    onClick={() => setActiveTab(pill.tab)}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* JOURNEY PLANNER TAB */}
        {activeTab === 'journey' && (
          <div key={`tab-content-${activeTab}`} className="page-enter-active" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <h2 className="section-title">✈️ AI Smart Itinerary Planner</h2>
              <p className="section-subtitle">Plan a custom trip optimized with attractions, local food, and safety parameters</p>
            </div>

            {/* Main Journey Layout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Form Input Card */}
              <div className="card" style={{ padding: '24px', height: 'fit-content' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '18px' }}>
                  Trip Configuration
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                      <label className="label">Trip Budget (₹)</label>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                        ₹{budgetVal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="5000" 
                      max="100000" 
                      step="5000"
                      value={budgetVal}
                      onChange={e => setBudgetVal(Number(e.target.value))}
                      className="custom-slider"
                      style={{
                        width: '100%',
                        backgroundSize: `${((budgetVal - 5000) / 95000) * 100}% 100%`
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-faint)' }}>
                      <span>₹5,000</span>
                      <span>₹50,000</span>
                      <span>₹1,00,000</span>
                    </div>
                  </div>

                  {/* Days Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label className="label">Duration (Days)</label>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                        {daysVal} {daysVal === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="7" 
                      value={daysVal}
                      onChange={e => setDaysVal(Number(e.target.value))}
                      className="custom-slider"
                      style={{
                        width: '100%',
                        backgroundSize: `${((daysVal - 1) / 6) * 100}% 100%`
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-faint)' }}>
                      <span>1 Day</span>
                      <span>3 Days</span>
                      <span>5 Days</span>
                      <span>7 Days</span>
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="label">Interests (Multi-Select)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {INTEREST_OPTIONS.map(interest => {
                        const active = selectedInterests.includes(interest);
                        return (
                          <button 
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`pill-toggle ${active ? 'active' : ''}`}
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Travel Type Cards */}
                  <div>
                    <label className="label">Travel Companion</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {TRAVEL_TYPES.map(t => {
                        const active = selectedTravelType === t.id;
                        return (
                          <div 
                            key={t.id}
                            onClick={() => setSelectedTravelType(t.id)}
                            style={{
                              background: active ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                              border: active ? '1px solid var(--color-primary)' : '1px solid var(--border-medium)',
                              borderRadius: 'var(--radius-md)',
                              padding: '10px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{t.label}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-faint)', marginTop: '2px' }}>{t.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mood Selector Cards */}
                  <div>
                    <label className="label">Travel Mood</label>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '4px', scrollbarWidth: 'thin' }}>
                      {MOOD_OPTIONS.map(m => {
                        const active = selectedMood === m.id;
                        return (
                          <div 
                            key={m.id}
                            onClick={() => setSelectedMood(m.id)}
                            style={{
                              background: active ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                              border: active ? '1px solid var(--color-primary)' : '1px solid var(--border-medium)',
                              borderRadius: 'var(--radius-md)',
                              padding: '8px 12px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}
                          >
                            <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{m.label}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-faint)' }}>{m.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button 
                    className="btn-primary" 
                    onClick={handleGenerateJourney}
                    disabled={journeyLoading || !destination.trim()}
                    style={{ padding: '14px', justifyContent: 'center', marginTop: '10px' }}
                  >
                    {journeyLoading ? (
                      <><span className="spinner" /> Operating AI Agents...</>
                    ) : (
                      '✈️ Generate AI Journey Plan'
                    )}
                  </button>
                </div>
              </div>

              {/* Journey Results Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {journeyLoading && (
                  <div className="card" style={{ padding: '60px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', color: 'var(--color-primary)' }} />
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '6px' }}>Orchestrating AI Agents...</h4>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto', lineHeight: 1.5 }}>
                        Analyzing user profile, planning itinerary, fetching safety briefings, and compiling local food options in parallel.
                      </p>
                    </div>
                  </div>
                )}

                {journeyError && (
                  <div className="card" style={{ padding: '24px', background: 'var(--color-error-subtle)', border: '1px solid var(--color-error)', color: 'var(--color-error)' }}>
                    <p style={{ fontWeight: 600, textAlign: 'center' }}>⚠️ {journeyError}</p>
                  </div>
                )}

                {/* Empty State */}
                {!journeyResult && !journeyLoading && !journeyError && (
                  <div className="card" style={{ padding: '60px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontSize: '4.5rem', marginBottom: '16px' }}>🗺️</p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '8px' }}>Your AI Journey Dashboard</h3>
                    <p style={{ color: 'var(--color-text-muted)', maxWidth: '300px', fontSize: '0.85rem' }}>Configure your travel preferences and generate a personalized smart plan.</p>
                  </div>
                )}

                {/* Journey Data Rendered */}
                {journeyResult && (
                  <div className="card-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Destination Banner */}
                    <div className="card" style={{ padding: '24px', background: 'radial-gradient(circle at 10% 10%, rgba(12, 171, 168, 0.08) 0%, rgba(24, 25, 36, 0.7) 100%)' }}>
                      <span className="badge badge-primary" style={{ marginBottom: '8px' }}>✓ Journey Generated</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900 }}>
                        {journeyResult.itinerary?.destination || destination}
                      </h3>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '6px', lineHeight: 1.6 }}>
                        A {journeyResult.itinerary?.duration || daysVal}-day {selectedMood.toLowerCase()} trip planned for a {selectedTravelType.toLowerCase()} profile.
                      </p>
                      
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                        <span className="badge badge-cyan">💰 {journeyResult.itinerary?.totalEstimatedCost || `Budget Tier: ${journeyResult.userProfile?.budget?.tier}`}</span>
                        {journeyResult.userProfile?.adventureScore && <span className="badge badge-success">🧗 Adventure: {journeyResult.userProfile.adventureScore}/100</span>}
                        {journeyResult.userProfile?.comfortScore && <span className="badge badge-warning">💎 Comfort: {journeyResult.userProfile.comfortScore}/100</span>}
                      </div>
                    </div>

                    {/* Results Sub-Tabs */}
                    <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
                      {[
                        { id: 'itinerary', label: '📅 Itinerary' },
                        { id: 'food', label: '🍽️ Food & Dine' },
                        { id: 'safety', label: '🛡️ Safety & SOS' },
                        { id: 'tips', label: '🧳 Pack & Transport' },
                      ].map(tab => (
                        <button 
                          key={tab.id}
                          onClick={() => setJourneySubTab(tab.id)}
                          style={{
                            padding: '10px 14px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            background: journeySubTab === tab.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                            color: journeySubTab === tab.id ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                            borderBottom: journeySubTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                            transition: 'all 0.2s'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* SUBTAB CONTENT: ITINERARY */}
                    {journeySubTab === 'itinerary' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {journeyResult.itinerary?.days?.map((day, idx) => {
                          const isExpanded = expandedDay === idx;
                          return (
                            <div key={idx} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                              {/* Day Header Accordion Toggle */}
                              <div 
                                onClick={() => setExpandedDay(isExpanded ? -1 : idx)}
                                style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary-subtle)', border: '1px solid var(--color-primary)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                                    {day.day}
                                  </div>
                                  <div>
                                    <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                                      {day.theme || `Day ${day.day} Plan`}
                                    </h4>
                                    {day.duration && <span style={{ fontSize: '0.72rem', color: 'var(--color-text-faint)' }}>Duration: {day.duration}</span>}
                                  </div>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                  {isExpanded ? '▲' : '▼'}
                                </span>
                              </div>

                              {/* Day Activities List */}
                              {isExpanded && (
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.1)' }}>
                                  {/* Activities Timeline */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '2px solid var(--color-primary-glow-strong)', paddingLeft: '14px', marginLeft: '12px' }}>
                                    {day.activities?.map((act, actIdx) => (
                                      <div key={actIdx} style={{ position: 'relative' }}>
                                        {/* Dot anchor on timeline */}
                                        <div style={{
                                          position: 'absolute',
                                          left: '-20px',
                                          top: '4px',
                                          width: '10px',
                                          height: '10px',
                                          borderRadius: '50%',
                                          background: 'var(--color-primary)',
                                          border: '2px solid var(--color-bg)'
                                        }} />
                                        
                                        <div>
                                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-light)', background: 'var(--color-primary-subtle)', padding: '2px 8px', borderRadius: '4px' }}>
                                              {act.time}
                                            </span>
                                            <h5 style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text)' }}>{act.name}</h5>
                                            {act.cost && (
                                              <span className="badge" style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-muted)', padding: '1px 6px' }}>
                                                {act.cost}
                                              </span>
                                            )}
                                          </div>
                                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '4px', lineHeight: 1.5 }}>
                                            {act.description}
                                          </p>
                                          {act.location?.name && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', marginTop: '2px' }}>
                                              📍 {act.location.name} {act.location.address ? `(${act.location.address})` : ''}
                                            </p>
                                          )}
                                          {act.tips && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontStyle: 'italic', marginTop: '2px' }}>
                                              💡 Local tip: {act.tips}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Meals Card */}
                                  {day.meals && (
                                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: '8px' }}>
                                      <h5 style={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                        🍴 Suggested Meals
                                      </h5>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                                        {Object.entries(day.meals).map(([mealType, mealDesc]) => (
                                          <div key={mealType} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                                            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary-light)' }}>
                                              {mealType}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text)', marginTop: '2px' }}>
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

                    {/* SUBTAB CONTENT: FOOD RECOMMEDATIONS */}
                    {journeySubTab === 'food' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {journeyResult.foodRecommendations ? (
                          <>
                            <div className="card" style={{ padding: '20px', background: 'rgba(0,184,148,0.04)', borderColor: 'rgba(0,184,148,0.1)' }}>
                              <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-success)', marginBottom: '6px' }}>Cuisine Overview</h4>
                              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                {journeyResult.foodRecommendations.cuisineOverview || 'AI Food expert analysis loaded successfully.'}
                              </p>
                              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {journeyResult.foodRecommendations.vegetarianFriendly && <span className="badge badge-success">🥗 Veg Friendly</span>}
                                {journeyResult.foodRecommendations.drinkingWaterSafety && <span className="badge badge-cyan">💧 Water: {journeyResult.foodRecommendations.drinkingWaterSafety}</span>}
                              </div>
                            </div>

                            {/* Must Try List */}
                            {journeyResult.foodRecommendations.mustTryDishes && (
                              <div>
                                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: '10px' }}>Must-Try Traditional Dishes</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                                  {journeyResult.foodRecommendations.mustTryDishes.slice(0, 3).map((dish, dIdx) => (
                                    <div key={dIdx} className="card" style={{ padding: '12px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                        <h5 style={{ fontWeight: 700, fontSize: '0.85rem' }}>{dish.name}</h5>
                                        {dish.averagePriceUSD && <span style={{ fontSize: '0.78rem', color: 'var(--color-warning)' }}>~${dish.averagePriceUSD}</span>}
                                      </div>
                                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', lineHeight: 1.4 }}>{dish.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>No food recommendation sub-data processed.</p>
                        )}
                      </div>
                    )}

                    {/* SUBTAB CONTENT: SAFETY & SOS */}
                    {journeySubTab === 'safety' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {journeyResult.safetyInformation ? (
                          <>
                            <div className="card" style={{ padding: '20px', background: 'var(--color-error-subtle)', borderLeft: '4px solid var(--color-error)' }}>
                              <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#ff7675', marginBottom: '6px' }}>Safety Assessment</h4>
                              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                {journeyResult.safetyInformation.safetyAssessment || journeyResult.safetyInformation.assessment || 'Destination specific safety report.'}
                              </p>
                            </div>

                            {/* Scams */}
                            {(journeyResult.safetyInformation.commonScams || journeyResult.safetyInformation.scams) && (
                              <div className="card" style={{ padding: '18px' }}>
                                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-warning)', marginBottom: '10px' }}>⚠️ Common Scams & Risks</h4>
                                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {(journeyResult.safetyInformation.commonScams || journeyResult.safetyInformation.scams).map((scam, sIdx) => (
                                    <li key={sIdx} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                      {typeof scam === 'string' ? scam : (<strong>{scam.name}: </strong> + scam.description)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>No safety recommendation sub-data processed.</p>
                        )}
                      </div>
                    )}

                    {/* SUBTAB CONTENT: TIPS */}
                    {journeySubTab === 'tips' && (
                      <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {journeyResult.itinerary?.packingTips && (
                          <div>
                            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>💼 Recommended Packing List</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {journeyResult.itinerary.packingTips.map((tip, tIdx) => (
                                <span key={tIdx} className="badge badge-primary" style={{ fontSize: '0.78rem' }}>
                                  🧳 {tip}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {journeyResult.itinerary?.transportTips && (
                          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>🚇 Transport & Transit Advice</h4>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>
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

        {/* ATTRACTIONS */}
        {activeTab === 'attractions' && <AttractionsTab key={`tab-content-${activeTab}`} defaultDestination={destination} />}

        {/* FOOD */}
        {activeTab === 'food' && <FoodTab key={`tab-content-${activeTab}`} defaultDestination={destination} initialData={journeyResult?.foodRecommendations} />}

        {/* HOTELS */}
        {activeTab === 'hotels' && <HotelsTab key={`tab-content-${activeTab}`} defaultDestination={destination} />}

        {/* GUIDES */}
        {activeTab === 'guides' && <GuidesTab key={`tab-content-${activeTab}`} destination={destination} userProfile={journeyResult?.userProfile} />}

        {/* SAFETY */}
        {activeTab === 'safety' && <SafetyTab key={`tab-content-${activeTab}`} defaultDestination={destination} initialData={journeyResult?.safetyInformation} />}

        {/* TRANSLATE */}
        {activeTab === 'translate' && <TranslateTab key={`tab-content-${activeTab}`} />}

        {/* BUDGET TAB */}
        {activeTab === 'budget' && <BudgetTracker key={`tab-content-${activeTab}`} />}

        {/* MAP */}
        {activeTab === 'map' && (
          <div key={`tab-content-${activeTab}`} className="page-enter-active">
            <div style={{ marginBottom: '20px' }}>
              <h2 className="section-title">🗺️ Explore Places</h2>
              <p className="section-subtitle">Find nearby hotels, restaurants, and attractions using OpenStreetMap</p>
            </div>
            <div className="card" style={{ overflow: 'hidden', height: '600px', padding: '0' }}>
              <Map />
            </div>
          </div>
        )}

        {/* DIRECTIONS */}
        {activeTab === 'directions' && (
          <div key={`tab-content-${activeTab}`} className="page-enter-active">
            <div style={{ marginBottom: '20px' }}>
              <h2 className="section-title">🧭 Route Directions</h2>
              <p className="section-subtitle">Get optimized routes with turn-by-turn instructions powered by OSRM</p>
            </div>
            <div className="card" style={{ overflow: 'hidden', padding: '0' }}>
              <DirectionsPanel />
            </div>
          </div>
        )}
      </main>

      {/* === Footer === */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(10,11,15,0.9)',
        padding: '60px 24px 40px',
        marginTop: '80px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="var(--color-primary-glow)" />
                </svg>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-text)' }}>SmartTour</span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                AI-powered travel companion with 6 specialized agents for the modern traveler.
              </p>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>AI Agents</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Itinerary Planner', 'Food Expert', 'Translation Agent', 'Guide Matcher', 'Safety Advisor', 'User Context Agent'].map(f => (
                  <span key={f} style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'color var(--transition-fast)' }} className="footer-link" onClick={() => setActiveTab('journey')}>{f}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>Services</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Itinerary Planning', 'Local Cuisine', 'Real-time Translation', 'Guide Matching', 'Emergency SOS', 'Budget Tracker'].map(f => (
                  <span key={f} style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'color var(--transition-fast)' }} className="footer-link" onClick={() => {
                    if (f === 'Emergency SOS') setActiveTab('safety');
                    else if (f === 'Budget Tracker') setActiveTab('budget');
                    else if (f === 'Local Cuisine') setActiveTab('food');
                    else setActiveTab('journey');
                  }}>{f}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>Technology</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Gemini 2.0 Flash', 'Next.js 16', 'OpenStreetMap', 'OSRM Routing', 'Open-Meteo Weather', 'Local Storage'].map(f => (
                  <span key={f} style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }} key={f}>{f}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-body)' }}>© 2026 SmartTour — Built with Agentic AI Architecture · 6 Specialized Agents · Powered by Gemini 2.0</p>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .footer-link:hover {
            color: var(--color-primary-light) !important;
          }
        `}} />
      </footer>

      {/* Floating emergency SOS Hub (bottom-left) */}
      <SOSButton />

      {/* Chat Widget (bottom-right) */}
      <ChatWidget />
    </div>
  );
}
