import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  upgradeAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultAdmin: User = {
  id: 'admin',
  email: 'admin@ezybrowse.com',
  password: 'admin123', // In production, use proper password hashing
  role: 'admin',
  createdAt: new Date().toISOString()
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : { user: null, isAuthenticated: false };
  });

  useEffect(() => {
    // Initialize default admin user
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[defaultAdmin.id]) {
      users[defaultAdmin.id] = defaultAdmin;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = Object.values(users).find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const newState = { user, isAuthenticated: true };
    setAuthState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
  };

  const register = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (Object.values(users).some((u: any) => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      password,
      role: 'free',
      createdAt: new Date().toISOString()
    };

    users[newUser.id] = newUser;
    localStorage.setItem('users', JSON.stringify(users));

    const newState = { user: newUser, isAuthenticated: true };
    setAuthState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('auth');
  };

  const upgradeAccount = async () => {
    if (!authState.user) return;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const updatedUser = { ...authState.user, role: 'paid' };
    users[updatedUser.id] = updatedUser;
    
    localStorage.setItem('users', JSON.stringify(users));
    
    const newState = { user: updatedUser, isAuthenticated: true };
    setAuthState(newState);
    localStorage.setItem('auth', JSON.stringify(newState));
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, upgradeAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}