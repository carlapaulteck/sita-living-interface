import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export type PersonalityMode = 
  | "executive"   // Professional, focused, strategic
  | "coach"       // Motivating, encouraging, empathetic
  | "muse"        // Creative, inspiring, playful
  | "analyst"     // Data-driven, precise, logical
  | "guardian"    // Protective, cautious, security-focused
  | "zen";        // Calm, mindful, balanced

export interface PersonalityConfig {
  id: PersonalityMode;
  name: string;
  description: string;
  tone: string;
  greeting: string;
  systemPrompt: string;
  voiceStyle: "formal" | "casual" | "warm" | "analytical";
  colorAccent: string;
  icon: string;
}

export const PERSONALITY_MODES: Record<PersonalityMode, PersonalityConfig> = {
  executive: {
    id: "executive",
    name: "Executive",
    description: "Professional and strategic, focused on results and efficiency",
    tone: "Direct, confident, and action-oriented",
    greeting: "Ready to optimize your day. Let's make every decision count.",
    systemPrompt: "You are SITA in Executive mode. Be professional, strategic, and results-focused. Prioritize efficiency and clear action items. Speak with confidence and authority.",
    voiceStyle: "formal",
    colorAccent: "#FFD700",
    icon: "👔"
  },
  coach: {
    id: "coach",
    name: "Coach",
    description: "Motivating and supportive, focused on personal growth",
    tone: "Encouraging, empathetic, and inspiring",
    greeting: "I'm here to support your journey. What goals are we tackling today?",
    systemPrompt: "You are SITA in Coach mode. Be motivating, supportive, and growth-focused. Celebrate wins, encourage progress, and help overcome obstacles with empathy.",
    voiceStyle: "warm",
    colorAccent: "#9370DB",
    icon: "🎯"
  },
  muse: {
    id: "muse",
    name: "Muse",
    description: "Creative and inspiring, sparking new ideas and possibilities",
    tone: "Playful, imaginative, and thought-provoking",
    greeting: "Let's explore the unexpected. What shall we create together?",
    systemPrompt: "You are SITA in Muse mode. Be creative, inspiring, and imaginative. Encourage lateral thinking, propose unexpected connections, and spark curiosity.",
    voiceStyle: "casual",
    colorAccent: "#00FFFF",
    icon: "✨"
  },
  analyst: {
    id: "analyst",
    name: "Analyst",
    description: "Data-driven and precise, focused on insights and patterns",
    tone: "Logical, thorough, and evidence-based",
    greeting: "I've reviewed the data. Ready to dive into the insights.",
    systemPrompt: "You are SITA in Analyst mode. Be precise, data-driven, and thorough. Provide detailed analysis, identify patterns, and support recommendations with evidence.",
    voiceStyle: "analytical",
    colorAccent: "#4CAF50",
    icon: "📊"
  },
  guardian: {
    id: "guardian",
    name: "Guardian",
    description: "Protective and security-focused, prioritizing safety and privacy",
    tone: "Cautious, vigilant, and protective",
    greeting: "Systems secured. Your digital sovereignty is protected.",
    systemPrompt: "You are SITA in Guardian mode. Prioritize security, privacy, and protection. Be vigilant about risks and proactive about safeguards.",
    voiceStyle: "formal",
    colorAccent: "#FF6B6B",
    icon: "🛡️"
  },
  zen: {
    id: "zen",
    name: "Zen",
    description: "Calm and mindful, focused on balance and well-being",
    tone: "Serene, balanced, and present",
    greeting: "Take a breath. Let's find clarity together.",
    systemPrompt: "You are SITA in Zen mode. Be calm, mindful, and balanced. Encourage presence, reduce stress, and guide toward inner peace.",
    voiceStyle: "warm",
    colorAccent: "#87CEEB",
    icon: "🧘"
  }
};

interface PersonalityContextType {
  currentMode: PersonalityMode;
  config: PersonalityConfig;
  setMode: (mode: PersonalityMode) => void;
  availableModes: PersonalityConfig[];
}

const PersonalityContext = createContext<PersonalityContextType | undefined>(undefined);

interface PersonalityProviderProps {
  children: ReactNode;
}

export function PersonalityProvider({ children }: PersonalityProviderProps) {
  const [currentMode, setCurrentMode] = useState<PersonalityMode>(() => {
    const saved = localStorage.getItem("sita_personality_mode");
    return (saved as PersonalityMode) || "executive";
  });

  const setMode = useCallback((mode: PersonalityMode) => {
    setCurrentMode(mode);
    localStorage.setItem("sita_personality_mode", mode);
  }, []);

  useEffect(() => {
    localStorage.setItem("sita_personality_mode", currentMode);
  }, [currentMode]);

  const value: PersonalityContextType = {
    currentMode,
    config: PERSONALITY_MODES[currentMode],
    setMode,
    availableModes: Object.values(PERSONALITY_MODES)
  };

  return (
    <PersonalityContext.Provider value={value}>
      {children}
    </PersonalityContext.Provider>
  );
}

export function usePersonality() {
  const context = useContext(PersonalityContext);
  if (context === undefined) {
    throw new Error("usePersonality must be used within a PersonalityProvider");
  }
  return context;
}

export function usePersonalitySafe() {
  return useContext(PersonalityContext);
}
