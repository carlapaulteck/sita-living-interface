import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OnboardingProvider, useOnboarding } from "./onboarding/OnboardingContext";
import { OnboardingProgress } from "./onboarding/OnboardingProgress";
import { OnboardingData } from "@/types/onboarding";
import logoImage from "@/assets/logo.jpg";

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
import { WealthPersonalizationStep } from "./onboarding/steps/WealthPersonalizationStep";
import { HealthPersonalizationStep } from "./onboarding/steps/HealthPersonalizationStep";
import { FocusPersonalizationStep } from "./onboarding/steps/FocusPersonalizationStep";
import { AutonomyStep } from "./onboarding/steps/AutonomyStep";
import { AutomationsStep } from "./onboarding/steps/AutomationsStep";
import { SovereigntyStep } from "./onboarding/steps/SovereigntyStep";
import { AvatarIdentityStep } from "./onboarding/steps/AvatarIdentityStep";
import { NameStep } from "./onboarding/steps/NameStep";
import { ImprintStep } from "./onboarding/steps/ImprintStep";

// Import neurodivergent-safe steps
import { SafetyIntroStep } from "./onboarding/steps/SafetyIntroStep";
import { DensityChoiceStep } from "./onboarding/steps/DensityChoiceStep";
import { TaskStyleStep } from "./onboarding/steps/TaskStyleStep";
import { ChangeToleranceStep } from "./onboarding/steps/ChangeToleranceStep";
import { ProgressStyleStep } from "./onboarding/steps/ProgressStyleStep";
import { EmotionalCalibrationStep } from "./onboarding/steps/EmotionalCalibrationStep";
import { SelfRecognitionStep } from "./onboarding/steps/SelfRecognitionStep";
import { AdaptationPreviewStep } from "./onboarding/steps/AdaptationPreviewStep";

// Steps for QUICK mode (90 seconds) - minimal with psychological safety
const QUICK_STEPS = [
  CinematicEntry,        // 0
  SafetyIntroStep,       // 1 - Psychological safety first
  SetupModeStep,         // 2
  NameStep,              // 3
  GoalsStep,             // 4
  DevicesStep,           // 5
  ImprintStep,           // 6
];

// Steps for GUIDED mode (7 minutes) - includes cognitive discovery
const GUIDED_STEPS = [
  CinematicEntry,        // 0
  SafetyIntroStep,       // 1 - Psychological safety first
  SetupModeStep,         // 2
  NameStep,              // 3
  DensityChoiceStep,     // 4 - Cognitive discovery
  TaskStyleStep,         // 5 - Cognitive discovery
  EmotionalCalibrationStep, // 6 - Emotional calibration
  GoalsStep,             // 7
  WinsStep,              // 8
  AssistantStyleStep,    // 9
  TonePreferencesStep,   // 10
  RhythmStep,            // 11
  DevicesStep,           // 12
  AutonomyStep,          // 13
  AutomationsStep,       // 14
  AdaptationPreviewStep, // 15 - Show personalization
  AvatarIdentityStep,    // 16
  ImprintStep,           // 17
];

// Steps for DEEP mode (15-25 minutes) - full neurodivergent-safe flow
const DEEP_STEPS = [
  CinematicEntry,             // 0
  SafetyIntroStep,            // 1 - Psychological safety first
  SetupModeStep,              // 2
  NameStep,                   // 3
  // Phase 1: Cognitive Style Discovery
  DensityChoiceStep,          // 4
  TaskStyleStep,              // 5
  ChangeToleranceStep,        // 6
  ProgressStyleStep,          // 7
  // Phase 2: Emotional Calibration
  EmotionalCalibrationStep,   // 8
  // Phase 3: Optional Self-Recognition
  SelfRecognitionStep,        // 9
  // Core setup
  GoalsStep,                  // 10
  WinsStep,                   // 11
  AssistantStyleStep,         // 12
  TonePreferencesStep,        // 13
  VoiceSettingsStep,          // 14
  RhythmStep,                 // 15
  DevicesStep,                // 16
  WealthPersonalizationStep,  // 17
  HealthPersonalizationStep,  // 18
  FocusPersonalizationStep,   // 19
  AutonomyStep,               // 20
  AutomationsStep,            // 21
  SovereigntyStep,            // 22
  // Phase 4: Personalization Preview
  AdaptationPreviewStep,      // 23
  AvatarIdentityStep,         // 24
  ImprintStep,                // 25
];

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupMode, setSetupMode] = useState<'quick' | 'guided' | 'deep'>('guided');

  const getSteps = () => {
    switch (setupMode) {
      case 'quick': return QUICK_STEPS;
      case 'deep': return DEEP_STEPS;
      default: return GUIDED_STEPS;
    }
  };

  const STEPS = getSteps();
  const CurrentStepComponent = STEPS[currentStep];

  // Save progress to localStorage for recovery
  useEffect(() => {
    if (currentStep > 0) {
      localStorage.setItem("sita_onboarding_progress", JSON.stringify({
        step: currentStep,
        mode: setupMode,
        timestamp: Date.now()
      }));
    }
  }, [currentStep, setupMode]);

  return (
    <OnboardingProvider 
      onComplete={onComplete} 
      totalSteps={STEPS.length}
    >
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-background to-primary/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        {/* Logo watermark */}
        <div className="absolute top-6 left-6 flex items-center gap-2 z-50">
          <div className="w-8 h-8 rounded-lg overflow-hidden opacity-60">
            <img src={logoImage} alt="Alpha Vision" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-display text-muted-foreground hidden sm:block">Alpha Vision Method</span>
        </div>

        {/* Progress dots */}
        {currentStep > 0 && currentStep < STEPS.length - 1 && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 flex gap-1.5 z-50">
            {STEPS.slice(1, -1).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 === currentStep
                    ? "bg-gradient-to-r from-secondary to-primary w-6"
                    : i + 1 < currentStep
                      ? "bg-primary/50 w-1.5"
                      : "bg-foreground/20 w-1.5"
                }`}
              />
            ))}
          </div>
        )}

        {/* Onboarding Progress Side Panel */}
        <OnboardingProgress 
          currentStep={currentStep} 
          mode={setupMode}
        />

        <OnboardingStepRenderer 
          step={currentStep} 
          onStepChange={setCurrentStep}
          onModeChange={setSetupMode}
          mode={setupMode}
        />
      </div>
    </OnboardingProvider>
  );
}

function OnboardingStepRenderer({ 
  step, 
  onStepChange,
  onModeChange,
  mode
}: { 
  step: number; 
  onStepChange: (step: number) => void;
  onModeChange: (mode: 'quick' | 'guided' | 'deep') => void;
  mode: 'quick' | 'guided' | 'deep';
}) {
  const getSteps = () => {
    switch (mode) {
      case 'quick': return QUICK_STEPS;
      case 'deep': return DEEP_STEPS;
      default: return GUIDED_STEPS;
    }
  };

  const STEPS = getSteps();
  const CurrentStep = STEPS[step];

  return (
    <div className="w-full max-w-2xl relative z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <StepWrapper step={step} onStepChange={onStepChange} mode={mode}>
            <CurrentStep />
          </StepWrapper>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}



function StepWrapper({ 
  children, 
  step, 
  onStepChange,
  mode
}: { 
  children: React.ReactNode; 
  step: number;
  onStepChange: (step: number) => void;
  mode: 'quick' | 'guided' | 'deep';
}) {
  const { step: contextStep } = useOnboarding();

  useEffect(() => {
    if (contextStep !== step) {
      onStepChange(contextStep);
    }
  }, [contextStep, step, onStepChange]);

  return <>{children}</>;
}
