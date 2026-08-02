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
  const { login, register, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState('signin'); // 'signin' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
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

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signin') {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      setLoading(true);
      const result = await login(email, password);
      setLoading(false);

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error);
      }
    } else {
      // Register mode validation
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setLoading(true);
      const result = await register(name, email, password);
      setLoading(false);

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error);
      }
    }
  };

  const fillDemo = async () => {
    if (mode !== 'signin') {
      setMode('signin');
    }
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

        {/* Right panel — Auth Form */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            
            {/* Mode Switcher Tabs */}
            <div className="login-tabs">
              <button
                type="button"
                className={`login-tab ${mode === 'signin' ? 'login-tab--active' : ''}`}
                onClick={() => handleModeSwitch('signin')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`login-tab ${mode === 'register' ? 'login-tab--active' : ''}`}
                onClick={() => handleModeSwitch('register')}
              >
                Create Account
              </button>
            </div>

            <div className="login-form-header">
              <h2 className="login-form-title">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="login-form-subtitle">
                {mode === 'signin' 
                  ? 'Sign in to access your AI itineraries' 
                  : 'Start planning personalized trips with AI'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
              {mode === 'register' && (
                <div className="login-field">
                  <label htmlFor="reg-name" className="login-label">Full Name</label>
                  <div className="login-input-wrap">
                    <span className="login-input-icon">👤</span>
                    <input
                      id="reg-name"
                      type="text"
                      className="login-input"
                      placeholder="John Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={loading || demoFilling}
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

              <div className="login-field">
                <label htmlFor="login-email" className="login-label">Email Address</label>
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
                    placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
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

              {mode === 'register' && (
                <div className="login-field">
                  <label htmlFor="reg-confirm-password" className="login-label">Confirm Password</label>
                  <div className="login-input-wrap">
                    <span className="login-input-icon">🔒</span>
                    <input
                      id="reg-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      className="login-input"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      disabled={loading || demoFilling}
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

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
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <span className="login-btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials Section */}
            <div className="login-demo-section">
              <div className="login-divider">
                <span>or evaluate instantly</span>
              </div>

              <button
                type="button"
                className="login-demo-btn"
                onClick={fillDemo}
                disabled={loading || demoFilling}
              >
                <span className="login-demo-icon">🧑‍💻</span>
                <div className="login-demo-text">
                  <span className="login-demo-label">Use Demo Evaluator Credentials</span>
                  <span className="login-demo-creds">demo@smarttour.com / demo123</span>
                </div>
                <span className="login-demo-arrow">→</span>
              </button>

              <div className="login-toggle-mode-footer">
                {mode === 'signin' ? (
                  <p>
                    First time visiting?{' '}
                    <button type="button" className="login-link-btn" onClick={() => handleModeSwitch('register')}>
                      Register an Account
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button type="button" className="login-link-btn" onClick={() => handleModeSwitch('signin')}>
                      Sign In here
                    </button>
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
