import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { OnboardingData, defaultOnboardingData } from "@/types/onboarding";
import { saveUserPreferences, saveUserProfile } from "@/lib/userPreferences";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingContextType {
  step: number;
  totalSteps: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
  updateNestedData: <K extends keyof OnboardingData>(
    key: K,
    nestedKey: string,
    value: unknown
  ) => void;
  complete: () => void;
  isQuickMode: boolean;
  isDeepMode: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}

interface OnboardingProviderProps {
  children: ReactNode;
  onComplete: (data: OnboardingData) => void;
  totalSteps: number;
}

export function OnboardingProvider({ children, onComplete, totalSteps }: OnboardingProviderProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);

  const updateData = useCallback(<K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K]
  ) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNestedData = useCallback(<K extends keyof OnboardingData>(
    key: K,
    nestedKey: string,
    value: unknown
  ) => {
    setData(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] as object),
        [nestedKey]: value,
      },
    }));
  }, []);

  const nextStep = useCallback(() => {
    setStep(prev => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 0));
  }, []);

  const complete = useCallback(async () => {
    const finalData = {
      ...data,
      completedAt: new Date().toISOString(),
    };
    
    // Save to localStorage for quick access
    localStorage.setItem("sita_onboarded", "true");
    localStorage.setItem("sita_user_name", data.name);
    localStorage.setItem("sita_onboarding_data", JSON.stringify(finalData));
    
    // Try to save to database if user is authenticated
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user) {
        const userId = sessionData.session.user.id;
        await Promise.all([
          saveUserPreferences(userId, finalData),
          saveUserProfile(userId, data.name)
        ]);
        console.log("Onboarding data saved to database");
      }
    } catch (error) {
      console.error("Failed to save onboarding data to database:", error);
      // Continue anyway - localStorage backup exists
    }
    
    onComplete(finalData);
  }, [data, onComplete]);

  const isQuickMode = data.setupMode === "quick";
  const isDeepMode = data.setupMode === "deep";

  return (
    <OnboardingContext.Provider
      value={{
        step,
        totalSteps,
        setStep,
        nextStep,
        prevStep,
        data,
        updateData,
        updateNestedData,
        complete,
        isQuickMode,
        isDeepMode,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
