'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signOutUser } from '@/lib/firebase';
import { syncUserToDatabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  logout: () => Promise<void>;
  syncProfileToDb: (extraMeta?: Record<string, any>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Persist/Sync user profile to Supabase database
        await syncUserToDatabase(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const syncProfileToDb = useCallback(async (extraMeta?: Record<string, any>) => {
    if (user) {
      await syncUserToDatabase(user, extraMeta);
    }
  }, [user]);

  const logout = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest: Boolean(user?.isAnonymous),
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        logout,
        syncProfileToDb,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
