import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export interface WakeWordOption {
  id: string;
  phrase: string;
  displayName: string;
  variations: string[];
}

export const DEFAULT_WAKE_WORDS: WakeWordOption[] = [
  {
    id: "hey-sita",
    phrase: "hey sita",
    displayName: "Hey SITA",
    variations: ["hey sita", "hey cita", "hey seeta", "a sita", "hey cedar", "hey seda", "hay sita", "heysita"]
  },
  {
    id: "ok-sita",
    phrase: "ok sita",
    displayName: "OK SITA",
    variations: ["ok sita", "okay sita", "o k sita", "okay cedar"]
  },
  {
    id: "sita",
    phrase: "sita",
    displayName: "SITA",
    variations: ["sita", "cita", "seeta", "cedar", "seda"]
  },
  {
    id: "computer",
    phrase: "computer",
    displayName: "Computer",
    variations: ["computer", "compooter", "compooder"]
  },
  {
    id: "jarvis",
    phrase: "jarvis",
    displayName: "Jarvis",
    variations: ["jarvis", "jarves", "jarvas"]
  },
  {
    id: "assistant",
    phrase: "assistant",
    displayName: "Assistant",
    variations: ["assistant", "assistance", "hey assistant"]
  }
];

interface WakeWordContextType {
  currentWakeWord: WakeWordOption;
  customWakeWord: string | null;
  availableWakeWords: WakeWordOption[];
  setWakeWord: (wordId: string) => void;
  setCustomWakeWord: (phrase: string) => void;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  sensitivity: number;
  setSensitivity: (sensitivity: number) => void;
}

const WakeWordContext = createContext<WakeWordContextType | undefined>(undefined);

interface WakeWordProviderProps {
  children: ReactNode;
}

export function WakeWordProvider({ children }: WakeWordProviderProps) {
  const [currentWordId, setCurrentWordId] = useState<string>(() => {
    return localStorage.getItem("sita_wake_word_id") || "hey-sita";
  });
  
  const [customWakeWord, setCustomWakeWordState] = useState<string | null>(() => {
    return localStorage.getItem("sita_custom_wake_word");
  });
  
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("sita_wake_word_enabled");
    return saved !== "false";
  });
  
  const [sensitivity, setSensitivityState] = useState<number>(() => {
    const saved = localStorage.getItem("sita_wake_word_sensitivity");
    return saved ? parseFloat(saved) : 0.6;
  });

  const currentWakeWord = DEFAULT_WAKE_WORDS.find(w => w.id === currentWordId) || DEFAULT_WAKE_WORDS[0];

  const setWakeWord = useCallback((wordId: string) => {
    setCurrentWordId(wordId);
    localStorage.setItem("sita_wake_word_id", wordId);
  }, []);

  const setCustomWakeWord = useCallback((phrase: string) => {
    const normalized = phrase.toLowerCase().trim();
    setCustomWakeWordState(normalized);
    localStorage.setItem("sita_custom_wake_word", normalized);
    setCurrentWordId("custom");
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
    localStorage.setItem("sita_wake_word_enabled", String(enabled));
  }, []);

  const setSensitivity = useCallback((value: number) => {
    setSensitivityState(value);
    localStorage.setItem("sita_wake_word_sensitivity", String(value));
  }, []);

  // Create custom wake word option if exists
  const availableWakeWords: WakeWordOption[] = [
    ...DEFAULT_WAKE_WORDS,
    ...(customWakeWord ? [{
      id: "custom",
      phrase: customWakeWord,
      displayName: `"${customWakeWord}"`,
      variations: [customWakeWord]
    }] : [])
  ];

  const value: WakeWordContextType = {
    currentWakeWord: currentWordId === "custom" && customWakeWord 
      ? { id: "custom", phrase: customWakeWord, displayName: `"${customWakeWord}"`, variations: [customWakeWord] }
      : currentWakeWord,
    customWakeWord,
    availableWakeWords,
    setWakeWord,
    setCustomWakeWord,
    isEnabled,
    setEnabled,
    sensitivity,
    setSensitivity
  };

  return (
    <WakeWordContext.Provider value={value}>
      {children}
    </WakeWordContext.Provider>
  );
}

export function useWakeWordSettings() {
  const context = useContext(WakeWordContext);
  if (context === undefined) {
    throw new Error("useWakeWordSettings must be used within a WakeWordProvider");
  }
  return context;
}

export function useWakeWordSettingsSafe() {
  return useContext(WakeWordContext);
}
