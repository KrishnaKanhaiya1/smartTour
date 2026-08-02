'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Demo credentials for project evaluators
const DEFAULT_DEMO_USERS = [
  { email: 'demo@smarttour.com', password: 'demo123', name: 'Demo User', avatar: '🧑‍💻' },
  { email: 'admin@smarttour.com', password: 'admin123', name: 'Admin', avatar: '👨‍💼' },
];

function getRegisteredUsers() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('smarttour_registered_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('smarttour_registered_users', JSON.stringify(users));
  } catch {}
}

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
    await new Promise(r => setTimeout(r, 600));

    const normalizedEmail = email.trim().toLowerCase();
    const allUsers = [...DEFAULT_DEMO_USERS, ...getRegisteredUsers()];
    const match = allUsers.find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (match) {
      const session = {
        email: match.email,
        name: match.name,
        avatar: match.avatar || '👤',
        loginAt: new Date().toISOString(),
      };
      setUser(session);
      sessionStorage.setItem('smarttour_user', JSON.stringify(session));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password. Try demo@smarttour.com / demo123 or Register a new account.' };
  };

  const register = async (name, email, password) => {
    await new Promise(r => setTimeout(r, 600));

    const normalizedEmail = email.trim().toLowerCase();
    const allUsers = [...DEFAULT_DEMO_USERS, ...getRegisteredUsers()];
    
    const exists = allUsers.some(u => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      avatar: '✈️',
      createdAt: new Date().toISOString(),
    };

    const registered = getRegisteredUsers();
    registered.push(newUser);
    saveRegisteredUsers(registered);

    // Auto-login newly registered user
    const session = {
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
      loginAt: new Date().toISOString(),
    };
    setUser(session);
    sessionStorage.setItem('smarttour_user', JSON.stringify(session));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('smarttour_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
