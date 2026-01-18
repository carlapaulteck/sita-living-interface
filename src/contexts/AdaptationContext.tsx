import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useCognitiveSafe } from "@/contexts/CognitiveContext";
import { useAuth } from "@/hooks/useAuth";
import { cognitiveBudgetLedger, CognitiveBudgetState, CognitiveDomain } from "@/lib/cognitiveBudgetLedger";
import { evolutionEngine } from "@/lib/evolutionEngine";
import { AdaptiveTokens, getAdaptiveTokens } from "@/lib/adaptiveTokens";
import { CognitiveState } from "@/lib/cognitiveEngine";

export type MomentState = "overload" | "distracted" | "flow" | "hyperfocus" | "fatigued" | "recovery" | "neutral";

export interface AdaptationState {
  momentState: MomentState;
  confidence: number;
  cognitiveBudgetRemaining: number;
  emotionalVolatility: number;
  
  // Tokens and overrides
  adaptationTokens: AdaptiveTokens;
  moduleOverrides: Record<string, Partial<AdaptiveTokens>>;
  
  // Budget state
  budgetState: CognitiveBudgetState | null;
  
  // Evolution insights
  evolutionInsights: string[];
}

interface AdaptationContextValue extends AdaptationState {
  // Actions
  setMomentState: (state: MomentState) => void;
  logActivity: (activity: string, domain?: CognitiveDomain, cost?: number) => Promise<void>;
  refreshBudget: () => Promise<void>;
  refreshInsights: () => Promise<void>;
  
  // Adaptation controls
  setModuleOverride: (module: string, tokens: Partial<AdaptiveTokens>) => void;
  clearModuleOverride: (module: string) => void;
  
  // Queries
  shouldProceed: (domain: CognitiveDomain) => { proceed: boolean; reason?: string };
  getRecommendations: () => string[];
}

const AdaptationContext = createContext<AdaptationContextValue | undefined>(undefined);

export function useAdaptation() {
  const context = useContext(AdaptationContext);
  if (!context) {
    throw new Error("useAdaptation must be used within AdaptationProvider");
  }
  return context;
}

// Safe version that doesn't throw
export function useAdaptationSafe() {
  return useContext(AdaptationContext);
}

interface AdaptationProviderProps {
  children: React.ReactNode;
}

export function AdaptationProvider({ children }: AdaptationProviderProps) {
  const { user } = useAuth();
  const cognitive = useCognitiveSafe();
  
  // State
  const [momentState, setMomentState] = useState<MomentState>("neutral");
  const [emotionalVolatility, setEmotionalVolatility] = useState(0);
  const [budgetState, setBudgetState] = useState<CognitiveBudgetState | null>(null);
  const [moduleOverrides, setModuleOverrides] = useState<Record<string, Partial<AdaptiveTokens>>>({});
  const [evolutionInsights, setEvolutionInsights] = useState<string[]>([]);
  
  // Initialize ledger and engine with user
  useEffect(() => {
    if (user) {
      cognitiveBudgetLedger.setUser(user.id);
      evolutionEngine.setUser(user.id);
    }
  }, [user]);
  
  // Sync moment state with cognitive context
  useEffect(() => {
    if (cognitive?.currentState) {
      // Map cognitive state to moment state
      const stateMap: Record<CognitiveState, MomentState> = {
        flow: "flow",
        hyperfocus: "hyperfocus",
        distracted: "distracted",
        overload: "overload",
        fatigued: "fatigued",
        recovery: "recovery",
        neutral: "neutral",
      };
      setMomentState(stateMap[cognitive.currentState] || "neutral");
    }
  }, [cognitive?.currentState]);
  
  // Refresh budget state periodically
  const refreshBudget = useCallback(async () => {
    const state = await cognitiveBudgetLedger.getBudgetState();
    setBudgetState(state);
  }, []);
  
  useEffect(() => {
    if (user) {
      refreshBudget();
      const interval = setInterval(refreshBudget, 5 * 60 * 1000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [user, refreshBudget]);
  
  // Refresh evolution insights
  const refreshInsights = useCallback(async () => {
    const insights = await evolutionEngine.generateInsights();
    setEvolutionInsights(insights);
  }, []);
  
  useEffect(() => {
    if (user) {
      refreshInsights();
    }
  }, [user, refreshInsights]);
  
  // Log activity to budget ledger
  const logActivity = useCallback(async (
    activity: string,
    domain?: CognitiveDomain,
    cost?: number
  ) => {
    await cognitiveBudgetLedger.logActivity(activity, domain, cost);
    await refreshBudget();
  }, [refreshBudget]);
  
  // Compute adaptation tokens
  const adaptationTokens = useMemo(() => {
    const cognitiveState = cognitive?.currentState || "neutral";
    const mode = cognitive?.adaptationMode || "subtle";
    return getAdaptiveTokens(cognitiveState, mode);
  }, [cognitive?.currentState, cognitive?.adaptationMode]);
  
  // Compute cognitive budget remaining
  const cognitiveBudgetRemaining = useMemo(() => {
    return budgetState?.total.remaining ?? 1;
  }, [budgetState]);
  
  // Module override controls
  const setModuleOverride = useCallback((module: string, tokens: Partial<AdaptiveTokens>) => {
    setModuleOverrides(prev => ({
      ...prev,
      [module]: tokens,
    }));
  }, []);
  
  const clearModuleOverride = useCallback((module: string) => {
    setModuleOverrides(prev => {
      const next = { ...prev };
      delete next[module];
      return next;
    });
  }, []);
  
  // Check if should proceed with activity
  const shouldProceed = useCallback((domain: CognitiveDomain): { proceed: boolean; reason?: string } => {
    if (!budgetState) return { proceed: true };
    return cognitiveBudgetLedger.getSuggestion(domain, budgetState);
  }, [budgetState]);
  
  // Get current recommendations
  const getRecommendations = useCallback((): string[] => {
    const recs: string[] = [];
    
    // Budget recommendations
    if (budgetState?.recommendations) {
      recs.push(...budgetState.recommendations);
    }
    
    // State-based recommendations
    if (momentState === "overload") {
      recs.push("Consider a short break to reduce cognitive load");
    } else if (momentState === "fatigued") {
      recs.push("Energy is low - protect remaining capacity");
    }
    
    return recs.slice(0, 5);
  }, [budgetState, momentState]);
  
  const value: AdaptationContextValue = {
    momentState,
    confidence: cognitive?.confidence ?? 0.5,
    cognitiveBudgetRemaining,
    emotionalVolatility,
    adaptationTokens,
    moduleOverrides,
    budgetState,
    evolutionInsights,
    
    setMomentState,
    logActivity,
    refreshBudget,
    refreshInsights,
    setModuleOverride,
    clearModuleOverride,
    shouldProceed,
    getRecommendations,
  };
  
  return (
    <AdaptationContext.Provider value={value}>
      {children}
    </AdaptationContext.Provider>
  );
}
