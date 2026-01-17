import { useContext } from "react";
import { useCognitiveSafe } from "@/contexts/CognitiveContext";
import { CognitiveState } from "@/lib/cognitiveEngine";
import { AdaptiveTokens } from "@/lib/adaptiveTokens";

interface CognitiveStateHook {
  // Current state
  state: CognitiveState;
  confidence: number;
  
  // Core metrics
  stressIndex: number;
  focusLevel: number;
  cognitiveBudget: number;
  
  // Predictions
  predictedNextState: CognitiveState | null;
  timeToNextState: number | null;
  
  // Adaptive tokens for styling
  tokens: AdaptiveTokens;
  
  // Control
  isAdapting: boolean;
  adaptationMode: "invisible" | "subtle" | "visible";
  letMeStruggle: boolean;
  
  // Explanation
  explanation: string;
}

const defaultTokens: AdaptiveTokens = {
  animationDuration: "300ms",
  animationEase: "cubic-bezier(0.16, 1, 0.3, 1)",
  uiOpacity: 1,
  glowIntensity: 1,
  fontScale: 1,
  lineHeightScale: 1,
  densityScale: 1,
  touchTargetScale: 1,
  accentSaturation: 1,
  contrastBoost: 0,
  notificationFrequency: "all",
  autoHideChrome: false,
  simplifyLayout: false,
  suggestBreak: false,
};

/**
 * Hook to access current cognitive state and adaptive UI tokens.
 * Safe to use outside of CognitiveProvider - returns defaults.
 */
export function useCognitiveState(): CognitiveStateHook {
  const context = useCognitiveSafe();
  
  if (!context) {
    return {
      state: "neutral",
      confidence: 0,
      stressIndex: 0,
      focusLevel: 0.5,
      cognitiveBudget: 1,
      predictedNextState: null,
      timeToNextState: null,
      tokens: defaultTokens,
      isAdapting: false,
      adaptationMode: "subtle",
      letMeStruggle: false,
      explanation: "Cognitive system not initialized.",
    };
  }
  
  return {
    state: context.currentState,
    confidence: context.confidence,
    stressIndex: context.stateResult?.stressIndex ?? 0,
    focusLevel: context.stateResult?.focusLevel ?? 0.5,
    cognitiveBudget: context.stateResult?.cognitiveBudget ?? 1,
    predictedNextState: context.prediction?.nextState ?? null,
    timeToNextState: context.prediction?.timeToOnsetMinutes ?? null,
    tokens: context.adaptiveTokens,
    isAdapting: context.adaptationMode !== "invisible" && !context.letMeStruggle,
    adaptationMode: context.adaptationMode,
    letMeStruggle: context.letMeStruggle,
    explanation: context.explainWhy(),
  };
}

/**
 * Get CSS class names based on cognitive state
 */
export function getCognitiveClasses(state: CognitiveState): string {
  const classes: Record<CognitiveState, string> = {
    neutral: "",
    flow: "cognitive-flow",
    distracted: "cognitive-distracted",
    overload: "cognitive-overload",
    fatigued: "cognitive-fatigued",
    hyperfocus: "cognitive-hyperfocus",
    recovery: "cognitive-recovery",
  };
  
  return classes[state];
}

/**
 * Check if notifications should be shown based on cognitive state
 */
export function shouldShowNotification(
  tokens: AdaptiveTokens,
  priority: "critical" | "important" | "normal" | "low"
): boolean {
  const frequencyPriorities: Record<typeof tokens.notificationFrequency, number> = {
    none: 0,
    critical: 1,
    important: 2,
    all: 3,
  };
  
  const priorityLevels: Record<typeof priority, number> = {
    critical: 1,
    important: 2,
    normal: 3,
    low: 3,
  };
  
  return frequencyPriorities[tokens.notificationFrequency] >= priorityLevels[priority];
}
