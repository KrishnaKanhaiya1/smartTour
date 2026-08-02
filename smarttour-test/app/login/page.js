'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}

function LoginForm() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [demoFilling, setDemoFilling] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error);
    }
  };

  const fillDemo = async () => {
    setDemoFilling(true);
    setError('');
    const demoEmail = 'demo@smarttour.com';
    const demoPass = 'demo123';
    setEmail('');
    setPassword('');

    for (let i = 0; i <= demoEmail.length; i++) {
      await new Promise(r => setTimeout(r, 35));
      setEmail(demoEmail.slice(0, i));
    }
    for (let i = 0; i <= demoPass.length; i++) {
      await new Promise(r => setTimeout(r, 50));
      setPassword(demoPass.slice(0, i));
    }
    setDemoFilling(false);
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div className="login-spinner" style={{ width: 32, height: 32, borderWidth: 3, borderColor: 'var(--color-surface-3)', borderTopColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb--1" />
        <div className="login-bg-orb login-bg-orb--2" />
        <div className="login-bg-orb login-bg-orb--3" />
        <div className="login-bg-grid" />
      </div>

      <div className="login-container">
        {/* Left panel — Branding */}
        <div className="login-brand-panel">
          <div className="login-brand-content">
            <div className="login-logo">
              <span className="login-logo-icon">✈</span>
              <span className="login-logo-text">SmartTour</span>
            </div>
            <h1 className="login-brand-title">
              Your AI-Powered<br />Travel Companion
            </h1>
            <p className="login-brand-subtitle">
              Plan trips with 6 specialized AI agents. Get real itineraries, 
              authentic food recommendations, safety advisories, and local guide matches — all powered by Google Gemini.
            </p>
            <div className="login-features">
              <div className="login-feature">
                <span className="login-feature-icon">🗺️</span>
                <span>AI Itinerary Planner</span>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">🍽️</span>
                <span>Food Recommendations</span>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">🛡️</span>
                <span>Safety Advisories</span>
              </div>
              <div className="login-feature">
                <span className="login-feature-icon">🌐</span>
                <span>16+ Language Translator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — Login form */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h2 className="login-form-title">Welcome back</h2>
              <p className="login-form-subtitle">Sign in to continue your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
              <div className="login-field">
                <label htmlFor="login-email" className="login-label">Email</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">✉</span>
                  <input
                    id="login-email"
                    type="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading || demoFilling}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="login-password" className="login-label">Password</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">🔒</span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading || demoFilling}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="login-toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error">
                  <span>⚠</span> {error}
                </div>
              )}

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading || demoFilling}
              >
                {loading ? (
                  <span className="login-spinner" />
                ) : (
                  <>Sign In<span className="login-btn-arrow">→</span></>
                )}
              </button>
            </form>

            {/* Demo Credentials Section */}
            <div className="login-demo-section">
              <div className="login-divider">
                <span>or try with demo account</span>
              </div>

              <button
                type="button"
                className="login-demo-btn"
                onClick={fillDemo}
                disabled={loading || demoFilling}
              >
                <span className="login-demo-icon">🧑‍💻</span>
                <div className="login-demo-text">
                  <span className="login-demo-label">Use Demo Credentials</span>
                  <span className="login-demo-creds">demo@smarttour.com / demo123</span>
                </div>
                <span className="login-demo-arrow">→</span>
              </button>

              <p className="login-demo-note">
                <span>ℹ</span> For project evaluators — no sign-up required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
