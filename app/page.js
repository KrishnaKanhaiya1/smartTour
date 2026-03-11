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

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'attractions', label: 'Attractions', icon: '🏛️' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'hotels', label: 'Hotels', icon: '🏨' },
  { id: 'guides', label: 'Guides', icon: '👨‍🏫' },
  { id: 'safety', label: 'Safety', icon: '🛡️' },
  { id: 'translate', label: 'Translate', icon: '🌐' },
  { id: 'map', label: 'Map', icon: '🗺️' },
  { id: 'directions', label: 'Directions', icon: '🧭' },
];

const AGENT_CARDS = [
  { icon: '🤖', title: 'User Context Agent', desc: 'Builds a traveler profile from your preferences, budget, and travel style to personalize every recommendation.', gradient: 'linear-gradient(135deg, #6C5CE7, #a29bfe)' },
  { icon: '📅', title: 'Itinerary Planner', desc: 'Creates optimized day-by-day travel schedules with real activities, meals, and time management.', gradient: 'linear-gradient(135deg, #0984e3, #74b9ff)' },
  { icon: '🍽️', title: 'Food Expert', desc: 'Discovers must-try dishes, top restaurants, and street food for any destination worldwide.', gradient: 'linear-gradient(135deg, #e17055, #fdcb6e)' },
  { icon: '🌐', title: 'Translation Agent', desc: 'Real-time AI translation with phonetic guides and cultural context for 16+ languages.', gradient: 'linear-gradient(135deg, #00cec9, #55efc4)' },
  { icon: '👨‍🏫', title: 'Guide Matcher', desc: 'AI-matches you with local expert guides based on language, interests, and compatibility.', gradient: 'linear-gradient(135deg, #fd79a8, #e84393)' },
  { icon: '🛡️', title: 'Safety Advisor', desc: 'Comprehensive safety reports with emergency contacts, scam alerts, and health information.', gradient: 'linear-gradient(135deg, #d63031, #e17055)' },
];

const STATS = [
  { value: '6', label: 'AI Agents', suffix: '' },
  { value: '16+', label: 'Languages', suffix: '' },
  { value: '195', label: 'Countries', suffix: '' },
  { value: '24/7', label: 'Availability', suffix: '' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* === Header === */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,11,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              background: 'var(--grad-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', boxShadow: '0 4px 15px rgba(108,92,231,0.3)',
            }}>🌍</div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>SmartTour</h1>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.5px' }}>AGENTIC AI TRAVEL COMPANION</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="pulse-dot" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>6 Agents Online</span>
          </div>
        </div>
      </header>

      {/* === Tab Navigation === */}
      <nav style={{
        position: 'sticky', top: '69px', zIndex: 90,
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
            <div className="glass-card" style={{
              padding: '60px 48px',
              background: 'linear-gradient(135deg, rgba(108,92,231,0.15), rgba(0,204,203,0.08))',
              borderColor: 'rgba(108,92,231,0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🌍</div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, var(--text-primary), var(--clr-primary-light))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '16px',
                  lineHeight: 1.1,
                }}>
                  Your AI-Powered Travel Companion
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                  Six intelligent agents working together to plan your perfect journey — from itineraries and local food to real-time translation and safety intelligence.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-primary" onClick={() => setActiveTab('attractions')} style={{ padding: '14px 32px', fontSize: '1rem' }}>
                    🏛️ Explore Attractions
                  </button>
                  <button className="btn-secondary" onClick={() => setActiveTab('food')} style={{ padding: '14px 32px', fontSize: '1rem' }}>
                    🍽️ Discover Food
                  </button>
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

            {/* Quick Start */}
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center', background: 'rgba(0,204,203,0.04)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '12px' }}>
                Ready to Explore? 🚀
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
                Select any tab above to start using our AI agents. Each agent provides real-time, accurate data for any destination worldwide.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {TABS.filter(t => t.id !== 'dashboard').map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                    {t.icon} {t.label}
                  </button>
                ))}
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
                {['Itinerary Planner', 'Food Expert', 'Translation', 'Guide Matcher', 'Safety Advisor', 'Attractions'].map(f => (
                  <span key={f} style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{f}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Services</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['Weather Forecast', 'Smart Routing', 'Hotel Search', 'Place Discovery', 'Emergency SOS', 'Live Chat'].map(f => (
                  <span key={f} style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{f}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Technology</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['Gemini 2.0 Flash', 'Next.js 16', 'OpenStreetMap', 'OSRM Routing', 'Open-Meteo Weather', 'Agentic Architecture'].map(f => (
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

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
