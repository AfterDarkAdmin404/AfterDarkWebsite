'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase-client';

interface CustomUser {
  id: string;
  email: string;
  username: string;
  user_role: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  customUser: CustomUser | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  clearSession: () => void;
  fixUsername: (username: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Global error handler for auth errors
    const handleAuthError = (error: any) => {
      if (error?.message?.includes('Refresh Token') || error?.message?.includes('Invalid Refresh Token')) {
        console.log('Clearing invalid session due to refresh token error');
        clearSession();
      }
    };

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          handleAuthError(error);
          // Clear any invalid session data
          setSession(null);
          setUser(null);
          setCustomUser(null);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user is authenticated, fetch custom user data
        if (session?.user?.email) {
          try {
            const response = await fetch('/api/auth/supabase-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                email: session.user.email
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              setCustomUser(data.user);
            }
          } catch (error) {
            console.error('Error fetching custom user:', error);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        // Clear any invalid session data
        setSession(null);
        setUser(null);
        setCustomUser(null);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
          setSession(null);
          setUser(null);
          setCustomUser(null);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Debug: Log user metadata in auth state change
        if (session?.user) {
          console.log('Auth state change - User metadata:', session.user.user_metadata);
          console.log('Auth state change - Username from metadata:', session.user.user_metadata?.username);
        }
        
        // If user is authenticated, fetch custom user data
        if (session?.user?.email) {
          try {
            const response = await fetch('/api/auth/supabase-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                email: session.user.email
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              setCustomUser(data.user);
            } else {
              console.error('Failed to fetch custom user:', response.status);
            }
          } catch (error) {
            console.error('Error fetching custom user:', error);
          }
        } else {
          setCustomUser(null);
        }
        
        setLoading(false);
        } catch (error) {
          console.error('Error in auth state change:', error);
          handleAuthError(error);
          clearSession();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    console.log('Signing up with username:', username);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (!error) {
      console.log('Signup successful, username should be stored in metadata');
      
      // Try to update the user metadata immediately if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('Current user metadata after signup:', session.user.user_metadata);
        
        // Update the user metadata to ensure username is saved
        const { error: updateError } = await supabase.auth.updateUser({
          data: { username: username }
        });
        
        if (updateError) {
          console.error('Error updating user metadata:', updateError);
        } else {
          console.log('User metadata updated successfully');
        }
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear custom user state immediately
      setCustomUser(null);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error during sign out:', error);
      // Force clear state even if signOut fails
      setCustomUser(null);
      setUser(null);
      setSession(null);
    }
  };

  const clearSession = () => {
    setCustomUser(null);
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    return { error };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    return { error };
  };

  const fixUsername = async (username: string) => {
    if (!user?.email) {
      return { error: { message: 'No user logged in' } };
    }

    try {
      const response = await fetch('/api/auth/fix-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: user.email,
          username: username 
        }),
      });

      if (response.ok) {
        // Refresh the session to get updated metadata
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setUser(session.user);
        }
        return { error: null };
      } else {
        const data = await response.json();
        return { error: data.error };
      }
    } catch (error) {
      console.error('Error fixing username:', error);
      return { error: { message: 'Failed to fix username' } };
    }
  };

  const value = {
    user,
    session,
    customUser,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    clearSession,
    fixUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 