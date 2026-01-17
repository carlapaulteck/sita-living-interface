import { CognitiveState } from "./cognitiveEngine";

export interface AdaptiveTokens {
  // Animation
  animationDuration: string;
  animationEase: string;
  
  // Visual intensity
  uiOpacity: number;
  glowIntensity: number;
  
  // Typography
  fontScale: number;
  lineHeightScale: number;
  
  // Spacing
  densityScale: number;
  touchTargetScale: number;
  
  // Colors
  accentSaturation: number;
  contrastBoost: number;
  
  // Behavior
  notificationFrequency: "none" | "critical" | "important" | "all";
  autoHideChrome: boolean;
  simplifyLayout: boolean;
  suggestBreak: boolean;
}

// Base tokens (neutral state)
const BASE_TOKENS: AdaptiveTokens = {
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

// State-specific token overrides
const STATE_TOKENS: Record<CognitiveState, Partial<AdaptiveTokens>> = {
  neutral: {},
  
  flow: {
    animationDuration: "150ms",
    animationEase: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    uiOpacity: 1,
    glowIntensity: 0.8,
    densityScale: 1.1, // Slightly denser, more info visible
    autoHideChrome: true, // Hide non-essential UI
    notificationFrequency: "critical", // Minimal interruptions
  },
  
  distracted: {
    animationDuration: "400ms",
    uiOpacity: 0.95,
    glowIntensity: 0.6,
    densityScale: 0.85, // Less dense, reduce overwhelm
    notificationFrequency: "critical", // Pause non-critical
    simplifyLayout: true,
  },
  
  overload: {
    animationDuration: "600ms",
    animationEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    uiOpacity: 0.7, // Dim the UI
    glowIntensity: 0.3, // Reduce visual stimulation
    fontScale: 1.1, // Larger, easier to read
    lineHeightScale: 1.2,
    densityScale: 0.7, // Much less dense
    touchTargetScale: 1.25, // Larger touch targets
    accentSaturation: 0.7, // Desaturate colors
    contrastBoost: 0.1,
    notificationFrequency: "none", // No notifications
    simplifyLayout: true,
    suggestBreak: true,
  },
  
  fatigued: {
    animationDuration: "500ms",
    uiOpacity: 0.9,
    glowIntensity: 0.5,
    fontScale: 1.15, // Even larger text
    lineHeightScale: 1.25,
    densityScale: 0.8,
    touchTargetScale: 1.2,
    contrastBoost: 0.15, // Higher contrast for tired eyes
    notificationFrequency: "important",
    suggestBreak: true,
  },
  
  hyperfocus: {
    animationDuration: "100ms", // Snappy responses
    animationEase: "cubic-bezier(0, 0, 0.2, 1)",
    uiOpacity: 1,
    glowIntensity: 0.6, // Reduce distraction
    densityScale: 1.15, // High density is fine
    autoHideChrome: true, // Hide everything non-essential
    notificationFrequency: "none", // Complete silence
  },
  
  recovery: {
    animationDuration: "800ms", // Slow, calming
    animationEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    uiOpacity: 0.85,
    glowIntensity: 0.4,
    fontScale: 1.05,
    densityScale: 0.9,
    accentSaturation: 0.8,
    notificationFrequency: "none",
    simplifyLayout: true,
  },
};

// Get adaptive tokens for a given cognitive state
export function getAdaptiveTokens(
  state: CognitiveState,
  adaptationMode: "invisible" | "subtle" | "visible" = "subtle"
): AdaptiveTokens {
  const stateOverrides = STATE_TOKENS[state];
  
  // Apply adaptation intensity based on mode
  const intensity = adaptationMode === "invisible" ? 0 : adaptationMode === "subtle" ? 0.6 : 1;
  
  const result: AdaptiveTokens = { ...BASE_TOKENS };
  
  if (intensity > 0.5 && stateOverrides.animationDuration) {
    result.animationDuration = stateOverrides.animationDuration;
  }
  if (intensity > 0.5 && stateOverrides.animationEase) {
    result.animationEase = stateOverrides.animationEase;
  }
  if (stateOverrides.uiOpacity !== undefined) {
    result.uiOpacity = BASE_TOKENS.uiOpacity + (stateOverrides.uiOpacity - BASE_TOKENS.uiOpacity) * intensity;
  }
  if (stateOverrides.glowIntensity !== undefined) {
    result.glowIntensity = BASE_TOKENS.glowIntensity + (stateOverrides.glowIntensity - BASE_TOKENS.glowIntensity) * intensity;
  }
  if (stateOverrides.fontScale !== undefined) {
    result.fontScale = BASE_TOKENS.fontScale + (stateOverrides.fontScale - BASE_TOKENS.fontScale) * intensity;
  }
  if (stateOverrides.densityScale !== undefined) {
    result.densityScale = BASE_TOKENS.densityScale + (stateOverrides.densityScale - BASE_TOKENS.densityScale) * intensity;
  }
  if (stateOverrides.touchTargetScale !== undefined) {
    result.touchTargetScale = BASE_TOKENS.touchTargetScale + (stateOverrides.touchTargetScale - BASE_TOKENS.touchTargetScale) * intensity;
  }
  if (intensity > 0.5 && stateOverrides.notificationFrequency) {
    result.notificationFrequency = stateOverrides.notificationFrequency;
  }
  if (intensity > 0.5 && stateOverrides.autoHideChrome !== undefined) {
    result.autoHideChrome = stateOverrides.autoHideChrome;
  }
  if (intensity > 0.5 && stateOverrides.simplifyLayout !== undefined) {
    result.simplifyLayout = stateOverrides.simplifyLayout;
  }
  if (intensity > 0.5 && stateOverrides.suggestBreak !== undefined) {
    result.suggestBreak = stateOverrides.suggestBreak;
  }
  
  return result;
}

// Convert tokens to CSS custom properties
export function tokensToCSSVariables(tokens: AdaptiveTokens): Record<string, string> {
  return {
    "--adaptive-animation-duration": tokens.animationDuration,
    "--adaptive-animation-ease": tokens.animationEase,
    "--adaptive-ui-opacity": tokens.uiOpacity.toString(),
    "--adaptive-glow-intensity": tokens.glowIntensity.toString(),
    "--adaptive-font-scale": tokens.fontScale.toString(),
    "--adaptive-line-height-scale": tokens.lineHeightScale.toString(),
    "--adaptive-density-scale": tokens.densityScale.toString(),
    "--adaptive-touch-target-scale": tokens.touchTargetScale.toString(),
    "--adaptive-accent-saturation": tokens.accentSaturation.toString(),
    "--adaptive-contrast-boost": tokens.contrastBoost.toString(),
  };
}

// Get human-readable explanation for adaptations
export function explainAdaptation(state: CognitiveState, tokens: AdaptiveTokens): string {
  const explanations: Record<CognitiveState, string> = {
    neutral: "Operating in standard mode.",
    flow: "You're in a focused flow state. I've minimized distractions and speeded up responses.",
    distracted: "I've noticed some scattered attention. I've simplified the layout to help you refocus.",
    overload: "You seem overwhelmed. I've dimmed the interface, enlarged touch targets, and paused notifications. Consider a short break.",
    fatigued: "Signs of fatigue detected. I've made text larger and increased contrast for easier reading.",
    hyperfocus: "Deep focus mode. All non-essential UI is hidden. I won't interrupt unless critical.",
    recovery: "Recovery mode active. Slow, calming animations. Take your time.",
  };
  
  let explanation = explanations[state];
  
  if (tokens.suggestBreak) {
    explanation += " A 5-minute break might help.";
  }
  
  return explanation;
}
