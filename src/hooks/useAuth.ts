import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type DemoMode = 'admin' | 'client' | null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState<DemoMode>(null);

  useEffect(() => {
    // Check for demo mode first
    const storedDemoMode = localStorage.getItem('sita_demo_mode') as DemoMode;
    if (storedDemoMode) {
      setDemoMode(storedDemoMode);
      // Create a fake user for demo mode
      const fakeUser = {
        id: storedDemoMode === 'admin' ? 'demo-admin-user' : 'demo-client-user',
        email: storedDemoMode === 'admin' ? 'admin@demo.sita.ai' : 'client@demo.sita.ai',
        role: storedDemoMode,
      } as unknown as User;
      setUser(fakeUser);
      setLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Clear demo mode if active
    if (demoMode) {
      localStorage.removeItem('sita_demo_mode');
      setDemoMode(null);
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  const exitDemoMode = () => {
    localStorage.removeItem('sita_demo_mode');
    setDemoMode(null);
    setUser(null);
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!session || !!demoMode,
    demoMode,
    exitDemoMode,
    isDemoMode: !!demoMode,
  };
}
