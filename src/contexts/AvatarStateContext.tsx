import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type AvatarState = "idle" | "listening" | "speaking" | "thinking" | "greeting";

interface AvatarStateContextType {
  state: AvatarState;
  audioLevel: number;
  setState: (state: AvatarState) => void;
  setAudioLevel: (level: number) => void;
  triggerGreeting: () => void;
}

const AvatarStateContext = createContext<AvatarStateContextType | undefined>(undefined);

interface AvatarStateProviderProps {
  children: ReactNode;
}

export function AvatarStateProvider({ children }: AvatarStateProviderProps) {
  const [state, setState] = useState<AvatarState>("idle");
  const [audioLevel, setAudioLevel] = useState(0);

  const triggerGreeting = useCallback(() => {
    setState("greeting");
    setTimeout(() => setState("idle"), 2500);
  }, []);

  return (
    <AvatarStateContext.Provider
      value={{
        state,
        audioLevel,
        setState,
        setAudioLevel,
        triggerGreeting,
      }}
    >
      {children}
    </AvatarStateContext.Provider>
  );
}

export function useAvatarState() {
  const context = useContext(AvatarStateContext);
  if (context === undefined) {
    throw new Error("useAvatarState must be used within an AvatarStateProvider");
  }
  return context;
}

export function useAvatarStateSafe() {
  const context = useContext(AvatarStateContext);
  return context;
}
