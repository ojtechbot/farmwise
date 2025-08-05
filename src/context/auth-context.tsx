'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from '@/lib/types';
import { Preloader } from '@/components/preloader';
import { authenticateUser, createUser as createUserAction } from '@/lib/actions';

type UserSession = Omit<User, 'password' | 'progress'>;

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  signUp: (userData: any) => Promise<{ success: boolean; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('farmwise_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from local storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await authenticateUser(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('farmwise_user', JSON.stringify(result.user));
    }
    setLoading(false);
    return { success: result.success, message: result.message };
  };

  const signUp = async (userData: any) => {
    setLoading(true);
    const result = await createUserAction(userData);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('farmwise_user', JSON.stringify(result.user));
    }
    setLoading(false);
    return { success: result.success, message: result.message };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('farmwise_user');
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
