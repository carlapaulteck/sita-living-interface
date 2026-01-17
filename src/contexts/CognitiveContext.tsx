import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  CognitiveState, 
  CognitiveStateResult, 
  inferCognitiveState, 
  aggregateSignals 
} from "@/lib/cognitiveEngine";
import { 
  AdaptiveTokens, 
  getAdaptiveTokens, 
  tokensToCSSVariables,
  explainAdaptation 
} from "@/lib/adaptiveTokens";

interface CognitiveContextValue {
  // Current state
  currentState: CognitiveState;
  stateResult: CognitiveStateResult | null;
  confidence: number;
  
  // Adaptive UI
  adaptiveTokens: AdaptiveTokens;
  cssVariables: Record<string, string>;
  
  // Settings
  adaptationMode: "invisible" | "subtle" | "visible";
  setAdaptationMode: (mode: "invisible" | "subtle" | "visible") => void;
  letMeStruggle: boolean;
  setLetMeStruggle: (value: boolean) => void;
  
  // Utilities
  explainWhy: () => string;
  refreshState: () => Promise<void>;
  
  // Predictions
  prediction: CognitiveStateResult["prediction"] | null;
}

const CognitiveContext = createContext<CognitiveContextValue | undefined>(undefined);

export function useCognitive() {
  const context = useContext(CognitiveContext);
  if (!context) {
    throw new Error("useCognitive must be used within a CognitiveProvider");
  }
  return context;
}

// Safe version that doesn't throw
export function useCognitiveSafe() {
  return useContext(CognitiveContext);
}

interface CognitiveProviderProps {
  children: React.ReactNode;
}

export function CognitiveProvider({ children }: CognitiveProviderProps) {
  const { user } = useAuth();
  
  // State
  const [currentState, setCurrentState] = useState<CognitiveState>("neutral");
  const [stateResult, setStateResult] = useState<CognitiveStateResult | null>(null);
  const [adaptationMode, setAdaptationMode] = useState<"invisible" | "subtle" | "visible">("subtle");
  const [letMeStruggle, setLetMeStruggle] = useState(false);
  
  // Load user preferences
  useEffect(() => {
    if (!user) return;
    
    const loadProfile = async () => {
      const { data } = await supabase
        .from("cognitive_profiles")
        .select("adaptation_mode, let_me_struggle")
        .eq("user_id", user.id)
        .single();
      
      if (data) {
        setAdaptationMode(data.adaptation_mode as "invisible" | "subtle" | "visible");
        setLetMeStruggle(data.let_me_struggle || false);
      }
    };
    
    loadProfile();
  }, [user]);
  
  // Refresh cognitive state from signals
  const refreshState = useCallback(async () => {
    if (!user || letMeStruggle) return;
    
    try {
      // Fetch recent signals (last 30 minutes)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      
      const { data: signals } = await supabase
        .from("cognitive_signals")
        .select("signal_type, value, created_at")
        .eq("user_id", user.id)
        .gte("created_at", thirtyMinutesAgo)
        .order("created_at", { ascending: true });
      
      if (!signals || signals.length < 5) {
        // Not enough data, stay neutral
        setCurrentState("neutral");
        return;
      }
      
      // Aggregate signals
      const aggregates = aggregateSignals(signals);
      
      // TODO: Fetch historical baseline for comparison
      // For now, infer without baseline
      const result = inferCognitiveState(aggregates);
      
      setStateResult(result);
      setCurrentState(result.state);
      
      // Save state to database
      await supabase.from("cognitive_states").insert({
        user_id: user.id,
        state: result.state,
        confidence: result.confidence,
        stress_index: result.stressIndex,
        focus_level: result.focusLevel,
        cognitive_budget: result.cognitiveBudget,
        predicted_next_state: result.prediction?.nextState,
        time_to_onset_minutes: result.prediction?.timeToOnsetMinutes,
      });
    } catch (error) {
      console.error("Failed to refresh cognitive state:", error);
    }
  }, [user, letMeStruggle]);
  
  // Periodic state refresh
  useEffect(() => {
    if (!user || letMeStruggle) return;
    
    // Initial refresh
    refreshState();
    
    // Refresh every 2 minutes
    const interval = setInterval(refreshState, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, refreshState, letMeStruggle]);
  
  // Compute adaptive tokens
  const adaptiveTokens = useMemo(() => {
    if (letMeStruggle) {
      return getAdaptiveTokens("neutral", "invisible");
    }
    return getAdaptiveTokens(currentState, adaptationMode);
  }, [currentState, adaptationMode, letMeStruggle]);
  
  const cssVariables = useMemo(() => tokensToCSSVariables(adaptiveTokens), [adaptiveTokens]);
  
  // Apply CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(cssVariables)) {
      root.style.setProperty(key, value);
    }
    
    return () => {
      for (const key of Object.keys(cssVariables)) {
        root.style.removeProperty(key);
      }
    };
  }, [cssVariables]);
  
  // Explain why current adaptations are active
  const explainWhy = useCallback(() => {
    if (letMeStruggle) {
      return "Let Me Struggle mode is active. All adaptations are disabled.";
    }
    return explainAdaptation(currentState, adaptiveTokens);
  }, [currentState, adaptiveTokens, letMeStruggle]);
  
  // Save settings to database
  useEffect(() => {
    if (!user) return;
    
    const saveSettings = async () => {
      await supabase
        .from("cognitive_profiles")
        .upsert({
          user_id: user.id,
          adaptation_mode: adaptationMode,
          let_me_struggle: letMeStruggle,
        }, { onConflict: "user_id" });
    };
    
    saveSettings();
  }, [user, adaptationMode, letMeStruggle]);
  
  const value: CognitiveContextValue = {
    currentState,
    stateResult,
    confidence: stateResult?.confidence ?? 0,
    adaptiveTokens,
    cssVariables,
    adaptationMode,
    setAdaptationMode,
    letMeStruggle,
    setLetMeStruggle,
    explainWhy,
    refreshState,
    prediction: stateResult?.prediction ?? null,
  };
  
  return (
    <CognitiveContext.Provider value={value}>
      {children}
    </CognitiveContext.Provider>
  );
}
