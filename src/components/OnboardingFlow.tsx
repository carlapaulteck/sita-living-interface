import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { OnboardingProvider } from "./onboarding/OnboardingContext";
import { OnboardingData } from "@/types/onboarding";

// Import all steps
import { CinematicEntry } from "./onboarding/steps/CinematicEntry";
import { SetupModeStep } from "./onboarding/steps/SetupModeStep";
import { GoalsStep } from "./onboarding/steps/GoalsStep";
import { WinsStep } from "./onboarding/steps/WinsStep";
import { AssistantStyleStep } from "./onboarding/steps/AssistantStyleStep";
import { TonePreferencesStep } from "./onboarding/steps/TonePreferencesStep";
import { VoiceSettingsStep } from "./onboarding/steps/VoiceSettingsStep";
import { RhythmStep } from "./onboarding/steps/RhythmStep";
import { DevicesStep } from "./onboarding/steps/DevicesStep";
import { AutonomyStep } from "./onboarding/steps/AutonomyStep";
import { AutomationsStep } from "./onboarding/steps/AutomationsStep";
import { SovereigntyStep } from "./onboarding/steps/SovereigntyStep";
import { AvatarIdentityStep } from "./onboarding/steps/AvatarIdentityStep";
import { NameStep } from "./onboarding/steps/NameStep";
import { ImprintStep } from "./onboarding/steps/ImprintStep";

const STEPS = [
  CinematicEntry,        // 0
  SetupModeStep,         // 1
  NameStep,              // 2
  GoalsStep,             // 3
  WinsStep,              // 4
  AssistantStyleStep,    // 5
  TonePreferencesStep,   // 6
  VoiceSettingsStep,     // 7
  RhythmStep,            // 8
  DevicesStep,           // 9
  AutonomyStep,          // 10
  AutomationsStep,       // 11
  SovereigntyStep,       // 12
  AvatarIdentityStep,    // 13
  ImprintStep,           // 14
];

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const CurrentStepComponent = STEPS[currentStep];

  return (
    <OnboardingProvider onComplete={onComplete} totalSteps={STEPS.length}>
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        {/* Progress dots */}
        {currentStep > 0 && currentStep < STEPS.length - 1 && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 flex gap-1.5 z-50">
            {STEPS.slice(1, -1).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 === currentStep
                    ? "bg-primary w-6"
                    : i + 1 < currentStep
                      ? "bg-primary/50 w-1.5"
                      : "bg-foreground/20 w-1.5"
                }`}
              />
            ))}
          </div>
        )}

        <OnboardingStepRenderer 
          step={currentStep} 
          onStepChange={setCurrentStep}
        />
      </div>
    </OnboardingProvider>
  );
}

function OnboardingStepRenderer({ 
  step, 
  onStepChange 
}: { 
  step: number; 
  onStepChange: (step: number) => void;
}) {
  const CurrentStep = STEPS[step];

  // Override context navigation to update local state
  return (
    <div className="w-full max-w-2xl">
      <AnimatePresence mode="wait">
        <StepWrapper key={step} step={step} onStepChange={onStepChange}>
          <CurrentStep />
        </StepWrapper>
      </AnimatePresence>
    </div>
  );
}

import { useOnboarding } from "./onboarding/OnboardingContext";
import { useEffect } from "react";

function StepWrapper({ 
  children, 
  step, 
  onStepChange 
}: { 
  children: React.ReactNode; 
  step: number;
  onStepChange: (step: number) => void;
}) {
  const { step: contextStep } = useOnboarding();

  useEffect(() => {
    if (contextStep !== step) {
      onStepChange(contextStep);
    }
  }, [contextStep, step, onStepChange]);

  return <>{children}</>;
}
