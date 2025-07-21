import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Auto-logout timer refs
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-logout configuration (30 minutes = 30 * 60 * 1000 ms)
  const LOGOUT_TIME = 30 * 60 * 1000; // 30 minutes
  const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before logout
  
  // Reset the auto-logout timer
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    
    if (user) {
      // Set warning timer (25 minutes)
      warningTimeoutRef.current = setTimeout(() => {
        // You can add a warning notification here
        console.warn('Session will expire in 5 minutes due to inactivity');
        // Optional: dispatch a custom event for UI components to show warning
        window.dispatchEvent(new CustomEvent('sessionWarning', { 
          detail: { minutesLeft: 5 } 
        }));
      }, LOGOUT_TIME - WARNING_TIME);
      
      // Set logout timer (30 minutes)
      timeoutRef.current = setTimeout(async () => {
        console.log('Auto-logout due to inactivity');
        await signOut();
        // Optional: dispatch a custom event for UI feedback
        window.dispatchEvent(new CustomEvent('autoLogout', { 
          detail: { reason: 'inactivity' } 
        }));
      }, LOGOUT_TIME);
    }
  }, [user]);

  // Track user activity
  const handleUserActivity = useCallback(() => {
    if (user) {
      resetTimer();
    }
  }, [user, resetTimer]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Set up activity listeners and auto-logout timer
  useEffect(() => {
    if (user) {
      // Start the timer when user logs in
      resetTimer();
      
      // Activity events to track
      const events = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click'
      ];
      
      // Add event listeners
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, true);
      });
      
      // Cleanup function
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, true);
        });
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
        }
      };
    } else {
      // Clear timers when user logs out
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    }
  }, [user, resetTimer, handleUserActivity]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { error };
    }

    if (data.user && !error) {
      await supabase
        .from('profiles')
        .insert([
          {
            user_id: data.user.id,
            full_name: fullName,
          }
        ]);
    }

    return { error: null };
  };

  const signOut = async () => {
    // Clear timers before signing out
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    
    const { error } = await supabase.auth.signOut();
    setProfile(null);
    return { error };
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetTimer, // Expose this in case you need to manually reset the timer
  };
}