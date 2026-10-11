// LOGIC FILE: do not change when restyling

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, type Profile, type ProfileUpdate } from '../lib/supabase';
import { getProfile, updateProfile as updateProfileApi } from '../lib/api/profiles';
import { flushQueue, LocalCache } from '../lib/queue';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ user: User | null; session: Session | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
  updateProfileState: (updates: ProfileUpdate) => Promise<Profile>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Maps Supabase auth error to friendly human-readable text
 */
export function mapAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  if (!navigator.onLine) {
    return 'You appear to be offline. Check your connection.';
  }

  const msg = String(error.message || '').toLowerCase();
  const status = error.status;

  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) {
    return 'You appear to be offline. Check your connection.';
  }
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials') || msg.includes('invalid_grant')) {
    return "That email and password don't match. Try again.";
  }
  if (msg.includes('email not confirmed') || msg.includes('not verified')) {
    return 'Check your email to confirm your account.';
  }
  if (msg.includes('password') && (msg.includes('weak') || msg.includes('least') || msg.includes('short'))) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (msg.includes('already registered') || msg.includes('user already exists') || msg.includes('already taken')) {
    return 'An account with this email already exists.';
  }
  if (status === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Too many attempts. Please wait a few seconds and try again.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  const loadUserProfile = useCallback(async (userId: string) => {
    // Optimistic / fast paint from local cache
    const cached = LocalCache.getProfile(userId);
    if (cached) {
      setProfile(cached);
    }

    setProfileLoading(true);
    try {
      const liveProfile = await getProfile(userId);
      if (liveProfile) {
        setProfile(liveProfile);
        LocalCache.setProfile(userId, liveProfile);
      }
      return liveProfile;
    } catch (err) {
      console.warn('Could not load remote profile, using cached if available', err);
      return cached;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
        flushQueue().catch(() => {});
      }
      setLoading(false);
    });

    // 2. Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserProfile(session.user.id);
        flushQueue().catch(() => {});
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      return { user: data.user, session: data.session };
    } catch (err) {
      throw new Error(mapAuthError(err));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      return { user: data.user, session: data.session };
    } catch (err) {
      throw new Error(mapAuthError(err));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      throw new Error(mapAuthError(err));
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
      setSession(null);
      setUser(null);
    } catch (err) {
      throw new Error(mapAuthError(err));
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset`,
      });
      if (error) throw error;
    } catch (err) {
      throw new Error(mapAuthError(err));
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    } catch (err) {
      throw new Error(mapAuthError(err));
    }
  };

  const refreshProfile = async (): Promise<Profile | null> => {
    if (!user) return null;
    return loadUserProfile(user.id);
  };

  const updateProfileState = async (updates: ProfileUpdate): Promise<Profile> => {
    if (!user) throw new Error('Not authenticated.');
    // Optimistic update
    if (profile) {
      const optimistic = { ...profile, ...updates };
      setProfile(optimistic);
      LocalCache.setProfile(user.id, optimistic);
    }
    const updated = await updateProfileApi(user.id, updates);
    setProfile(updated);
    LocalCache.setProfile(user.id, updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        profileLoading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        requestPasswordReset,
        updatePassword,
        refreshProfile,
        updateProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
