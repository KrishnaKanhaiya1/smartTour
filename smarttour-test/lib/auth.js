'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Demo credentials for project evaluators
const DEMO_USERS = [
  { email: 'demo@smarttour.com', password: 'demo123', name: 'Demo User', avatar: '🧑‍💻' },
  { email: 'admin@smarttour.com', password: 'admin123', name: 'Admin', avatar: '👨‍💼' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('smarttour_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate network delay for realism
    await new Promise(r => setTimeout(r, 800));

    const normalizedEmail = email.trim().toLowerCase();
    const match = DEMO_USERS.find(
      u => u.email === normalizedEmail && u.password === password
    );

    if (match) {
      const session = {
        email: match.email,
        name: match.name,
        avatar: match.avatar,
        loginAt: new Date().toISOString(),
      };
      setUser(session);
      sessionStorage.setItem('smarttour_user', JSON.stringify(session));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password. Try demo@smarttour.com / demo123' };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('smarttour_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
