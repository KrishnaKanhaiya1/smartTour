'use client';

import React, { useState } from 'react';
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

const AGENT_CARDS = [
  { icon: '🤖', title: 'User Context Agent', desc: 'Builds a traveler profile from preferences, budget, and travel style to personalize recommendations.', gradient: 'linear-gradient(135deg, #6C5CE7, #a29bfe)' },
  { icon: '📅', title: 'Itinerary Planner', desc: 'Creates optimized day-by-day travel schedules with real activities, meals, and logistics.', gradient: 'linear-gradient(135deg, #0984e3, #74b9ff)' },
  { icon: '🍽️', title: 'Food Expert', desc: 'Discovers must-try dishes, top restaurants, and safety details for any destination worldwide.', gradient: 'linear-gradient(135deg, #e17055, #fdcb6e)' },
  { icon: '🌐', title: 'Translation Agent', desc: 'Real-time AI translation with phonetic guides and cultural context for 16+ languages.', gradient: 'linear-gradient(135deg, #00cec9, #55efc4)' },
  { icon: '👨‍🏫', title: 'Guide Matcher', desc: 'AI-matches you with local expert guides based on language, interests, and budget.', gradient: 'linear-gradient(135deg, #fd79a8, #e84393)' },
  { icon: '🛡️', title: 'Safety Advisor', desc: 'Comprehensive safety reports with emergency contacts, scam alerts, and health warnings.', gradient: 'linear-gradient(135deg, #d63031, #e17055)' },
];

const STATS = [
  { value: '6', label: 'AI Agents', suffix: '' },
  { value: '16+', label: 'Languages', suffix: '' },
  { value: '195', label: 'Countries', suffix: '' },
  { value: '24/7', label: 'Availability', suffix: '' },
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

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
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
  const [expandedDay, setExpandedDay] = useState(0); // Default first day open
  const [journeySubTab, setJourneySubTab] = useState('itinerary'); // itinerary, food, safety

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
        setExpandedDay(0); // Reset to first day
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyActions: 'space-between', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              boxShadow: '0 4px 15px rgba(108,92,231,0.3)',
            }}>🌍</div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>SmartTour</h1>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.5px' }}>AGENTIC AI TRAVEL OPERATING SYSTEM</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="pulse-dot" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>6 Agents Connected</span>
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '2px', minWidth: 'max-content' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '12px 16px',
                fontSize: '0.82rem',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === tab.id ? 'rgba(108,92,231,0.12)' : 'transparent',
                color: activeTab === tab.id ? 'var(--clr-primary-light)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--clr-primary)' : '2px solid transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* === Main Content === */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', minHeight: 'calc(100vh - 200px)' }}>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Hero */}
            <div className="glass-card animate-fade-in-up" style={{
              padding: '60px 48px',
              background: 'linear-gradient(135deg, rgba(108,92,231,0.15), rgba(0,204,203,0.08))',
              borderColor: 'rgba(108,92,231,0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '4.5rem', marginBottom: '16px' }}>✈️</div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, var(--text-primary), var(--clr-primary-light))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '16px',
                  lineHeight: 1.1,
                }}>
                  Explore Without Limits
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                  An AI-powered smart travel operating system helping tourists plan itineraries, navigate routes, find street food, translate on the fly, and stay secure.
                </p>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-primary" onClick={() => setActiveTab('journey')} style={{ padding: '16px 36px', fontSize: '1.02rem' }}>
                    ✈️ Build Smart Journey
                  </button>
                  <button className="btn-secondary" onClick={() => setActiveTab('budget')} style={{ padding: '16px 36px', fontSize: '1.02rem' }}>
                    💰 Track Expenses
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div className="glass-card" style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }} onClick={() => setActiveTab('journey')}>
                <div style={{ fontSize: '2rem' }}>🗺️</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem' }}>Smart Planner</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generate customized plans</p>
                </div>
              </div>
              <div className="glass-card" style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }} onClick={() => setActiveTab('food')}>
                <div style={{ fontSize: '2rem' }}>🍜</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem' }}>Food Expert</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explore local cuisine</p>
                </div>
              </div>
              <div className="glass-card" style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }} onClick={() => setActiveTab('translate')}>
                <div style={{ fontSize: '2rem' }}>🌐</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem' }}>Real-time Translator</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Translate in 16+ languages</p>
                </div>
              </div>
              <div className="glass-card" style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid rgba(214,48,49,0.3)' }} onClick={() => setActiveTab('safety')}>
                <div style={{ fontSize: '2rem' }}>🚨</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ff7675' }}>Emergency Hub</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stay safe and call SOS</p>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {STATS.map((s, i) => (
                <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--clr-primary-light)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Agent Cards */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-primary)' }}>
                Powered by 6 Specialized AI Agents
              </h3>
              <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {AGENT_CARDS.map((card, i) => (
                  <div key={i} className="glass-card" style={{ padding: '0', overflow: 'hidden', cursor: 'default' }}>
                    <div style={{ height: '3px', background: card.gradient }} />
                    <div style={{ padding: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '12px',
                          background: card.gradient,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.2rem', flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        }}>{card.icon}</div>
                        <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{card.title}</h4>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.6 }}>{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* JOURNEY PLANNER TAB */}
        {activeTab === 'journey' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <h2 className="section-title">✈️ AI Smart Itinerary Planner</h2>
              <p className="section-subtitle">Plan a custom trip optimized with attractions, local food, and safety parameters</p>
            </div>

            {/* Main Journey Layout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Form Input Card */}
              <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
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
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-primary-light)' }}>
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
                      style={{ width: '100%', accentColor: 'var(--clr-primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>₹5,000</span>
                      <span>₹50,000</span>
                      <span>₹1,00,000</span>
                    </div>
                  </div>

                  {/* Days Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label className="label">Duration (Days)</label>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-primary-light)' }}>
                        {daysVal} {daysVal === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="7" 
                      value={daysVal}
                      onChange={e => setDaysVal(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--clr-primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
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
                            style={{
                              padding: '5px 12px',
                              borderRadius: '100px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: active ? '1px solid var(--clr-primary)' : '1px solid var(--border-medium)',
                              background: active ? 'rgba(108,92,231,0.2)' : 'transparent',
                              color: active ? '#a29bfe' : 'var(--text-secondary)',
                              transition: 'all 0.2s'
                            }}
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
                              background: active ? 'rgba(108,92,231,0.1)' : 'var(--bg-card)',
                              border: active ? '1px solid var(--clr-primary)' : '1px solid var(--border-medium)',
                              borderRadius: '12px',
                              padding: '10px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{t.label}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{t.desc}</div>
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
                              background: active ? 'rgba(108,92,231,0.1)' : 'var(--bg-card)',
                              border: active ? '1px solid var(--clr-primary)' : '1px solid var(--border-medium)',
                              borderRadius: '12px',
                              padding: '8px 12px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}
                          >
                            <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{m.label}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{m.desc}</div>
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
                  <div className="glass-card" style={{ padding: '60px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', borderTopColor: '#6C5CE7' }} />
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '6px' }}>Orchestrating AI Agents...</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto', lineHeight: 1.5 }}>
                        Analyzing user profile, planning itinerary, fetching safety briefings, and compiling local food options in parallel.
                      </p>
                    </div>
                  </div>
                )}

                {journeyError && (
                  <div className="glass-card" style={{ padding: '24px', background: 'rgba(214,48,49,0.06)', border: '1px solid rgba(214,48,49,0.3)', color: '#ff7675' }}>
                    <p style={{ fontWeight: 600, textAlign: 'center' }}>⚠️ {journeyError}</p>
                  </div>
                )}

                {/* Empty State */}
                {!journeyResult && !journeyLoading && !journeyError && (
                  <div className="glass-card" style={{ padding: '60px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontSize: '4.5rem', marginBottom: '16px' }}>🗺️</p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '8px' }}>Your AI Journey Dashboard</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', fontSize: '0.85rem' }}>Configure your travel preferences and generate a personalized smart plan.</p>
                  </div>
                )}

                {/* Journey Data Rendered */}
                {journeyResult && (
                  <div className="stagger animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Destination Banner */}
                    <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(108,92,231,0.1), rgba(0,204,203,0.05))' }}>
                      <span className="badge badge-primary" style={{ marginBottom: '8px' }}>✓ Journey Generated</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900 }}>
                        {journeyResult.itinerary?.destination || destination}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px', lineHeight: 1.6 }}>
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
                        { id: 'itinerary', label: '📅 Itinerary', icon: '' },
                        { id: 'food', label: '🍽️ Food & Dine', icon: '' },
                        { id: 'safety', label: '🛡️ Safety & SOS', icon: '' },
                        { id: 'tips', label: '🧳 Pack & Transport', icon: '' },
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
                            color: journeySubTab === tab.id ? 'var(--clr-primary-light)' : 'var(--text-secondary)',
                            borderBottom: journeySubTab === tab.id ? '2px solid var(--clr-primary)' : '2px solid transparent',
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
                            <div key={idx} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                              {/* Day Header Accordion Toggle */}
                              <div 
                                onClick={() => setExpandedDay(isExpanded ? -1 : idx)}
                                style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--grad-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                                    {day.day}
                                  </div>
                                  <div>
                                    <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                      {day.theme || `Day ${day.day} Plan`}
                                    </h4>
                                    {day.duration && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Duration: {day.duration}</span>}
                                  </div>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                  {isExpanded ? '▲' : '▼'}
                                </span>
                              </div>

                              {/* Day Activities List */}
                              {isExpanded && (
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.1)' }}>
                                  {/* Activities Timeline */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '2px solid rgba(108,92,231,0.2)', paddingLeft: '14px', marginLeft: '12px' }}>
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
                                          background: 'var(--clr-primary)',
                                          border: '2px solid var(--bg-base)'
                                        }} />
                                        
                                        <div>
                                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clr-primary-light)', background: 'rgba(108,92,231,0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                                              {act.time}
                                            </span>
                                            <h5 style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{act.name}</h5>
                                            {act.cost && (
                                              <span className="badge" style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', padding: '1px 6px' }}>
                                                {act.cost}
                                              </span>
                                            )}
                                          </div>
                                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px', lineHeight: 1.5 }}>
                                            {act.description}
                                          </p>
                                          {act.location?.name && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                              📍 {act.location.name} {act.location.address ? `(${act.location.address})` : ''}
                                            </p>
                                          )}
                                          {act.tips && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--clr-gold)', fontStyle: 'italic', marginTop: '2px' }}>
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
                                      <h5 style={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                        🍴 Suggested Meals
                                      </h5>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                                        {Object.entries(day.meals).map(([mealType, mealDesc]) => (
                                          <div key={mealType} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                                            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--clr-primary-light)' }}>
                                              {mealType}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                                              {typeof mealDesc === 'string' ? mealDesc : (mealDesc.name || mealDesc. cuisine || 'Local restaurant')}
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
                            <div className="glass-card" style={{ padding: '20px', background: 'rgba(0,184,148,0.04)' }}>
                              <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--clr-success)', marginBottom: '6px' }}>Cuisine Overview</h4>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
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
                                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '10px' }}>Must-Try Traditional Dishes</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                                  {journeyResult.foodRecommendations.mustTryDishes.slice(0, 3).map((dish, dIdx) => (
                                    <div key={dIdx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                        <h5 style={{ fontWeight: 700, fontSize: '0.85rem' }}>{dish.name}</h5>
                                        {dish.averagePriceUSD && <span style={{ fontSize: '0.78rem', color: 'var(--clr-gold)' }}>~${dish.averagePriceUSD}</span>}
                                      </div>
                                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.4 }}>{dish.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>No food recommendation sub-data processed.</p>
                        )}
                      </div>
                    )}

                    {/* SUBTAB CONTENT: SAFETY & SOS */}
                    {journeySubTab === 'safety' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {journeyResult.safetyInformation ? (
                          <>
                            <div className="glass-card" style={{ padding: '20px', background: 'rgba(214,48,49,0.04)', borderLeft: '4px solid var(--clr-danger)' }}>
                              <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#ff7675', marginBottom: '6px' }}>Safety Assessment</h4>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                {journeyResult.safetyInformation.safetyAssessment || journeyResult.safetyInformation.assessment || 'Destination specific safety report.'}
                              </p>
                            </div>

                            {/* Scams */}
                            {(journeyResult.safetyInformation.commonScams || journeyResult.safetyInformation.scams) && (
                              <div className="glass-card" style={{ padding: '18px' }}>
                                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--clr-gold)', marginBottom: '10px' }}>⚠️ Common Scams & Risks</h4>
                                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {(journeyResult.safetyInformation.commonScams || journeyResult.safetyInformation.scams).map((scam, sIdx) => (
                                    <li key={sIdx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                      {typeof scam === 'string' ? scam : (<strong>{scam.name}: </strong> + scam.description)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : (
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>No safety recommendation sub-data processed.</p>
                        )}
                      </div>
                    )}

                    {/* SUBTAB CONTENT: TIPS */}
                    {journeySubTab === 'tips' && (
                      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
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
        {activeTab === 'attractions' && <AttractionsTab />}

        {/* FOOD */}
        {activeTab === 'food' && <FoodTab />}

        {/* HOTELS */}
        {activeTab === 'hotels' && <HotelsTab />}

        {/* GUIDES */}
        {activeTab === 'guides' && <GuidesTab />}

        {/* SAFETY */}
        {activeTab === 'safety' && <SafetyTab />}

        {/* TRANSLATE */}
        {activeTab === 'translate' && <TranslateTab />}

        {/* BUDGET TAB */}
        {activeTab === 'budget' && <BudgetTracker />}

        {/* MAP */}
        {activeTab === 'map' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 className="section-title">🗺️ Explore Places</h2>
              <p className="section-subtitle">Find nearby hotels, restaurants, and attractions using OpenStreetMap</p>
            </div>
            <div className="glass-card" style={{ overflow: 'hidden', height: '600px' }}>
              <Map />
            </div>
          </div>
        )}

        {/* DIRECTIONS */}
        {activeTab === 'directions' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 className="section-title">🧭 Route Directions</h2>
              <p className="section-subtitle">Get optimized routes with turn-by-turn instructions powered by OSRM</p>
            </div>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <DirectionsPanel />
            </div>
          </div>
        )}
      </main>

      {/* === Footer === */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(10,11,15,0.9)',
        padding: '40px 24px',
        marginTop: '60px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>🌍</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>SmartTour</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>AI-powered travel companion with 6 specialized agents for the modern traveler.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>AI Agents</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['Itinerary Planner', 'Food Expert', 'Translation', 'Guide Matcher', 'Safety Advisor', 'User Context'].map(f => (
                  <span key={f} style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{f}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Services</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['Itinerary Planning', 'Local Cuisine', 'Real-time Translation', 'Guide Matching', 'Emergency SOS', 'Budget Tracker'].map(f => (
                  <span key={f} style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{f}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Technology</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['Gemini 2.0 Flash', 'Next.js 16', 'OpenStreetMap', 'OSRM Routing', 'Open-Meteo Weather', 'Local Storage'].map(f => (
                  <span key={f} style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>© 2026 SmartTour — Built with Agentic AI Architecture · 6 Specialized Agents · Powered by Gemini 2.0</p>
          </div>
        </div>
      </footer>

      {/* Floating emergency SOS Hub (bottom-left) */}
      <SOSButton />

      {/* Chat Widget (bottom-right) */}
      <ChatWidget />
    </div>
  );
}
