import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Check, Clock, Sparkles } from "lucide-react";
import { useOnboarding } from "./OnboardingContext";

export interface OnboardingProgressProps {
  mode: "quick" | "guided" | "deep";
  currentStep?: number;
}

const MODE_STEPS = {
  quick: [
    { name: "Welcome", description: "Introduction to SITA" },
    { name: "Safety", description: "Psychological safety" },
    { name: "Mode", description: "Choose your setup path" },
    { name: "Name", description: "Personalize your experience" },
    { name: "Goals", description: "Set your priorities" },
    { name: "Devices", description: "Connect your data" },
    { name: "Complete", description: "Review & launch" },
  ],
  guided: [
    { name: "Welcome", description: "Introduction" },
    { name: "Safety", description: "Psychological safety" },
    { name: "Mode", description: "Setup path" },
    { name: "Name", description: "Personalization" },
    { name: "Density", description: "Information style" },
    { name: "Tasks", description: "Work preferences" },
    { name: "Emotions", description: "Calibration" },
    { name: "Goals", description: "Priorities" },
    { name: "Wins", description: "Celebrations" },
    { name: "Style", description: "Assistant tone" },
    { name: "Tone", description: "Communication" },
    { name: "Rhythm", description: "Daily patterns" },
    { name: "Devices", description: "Connections" },
    { name: "Autonomy", description: "Control level" },
    { name: "Automations", description: "Auto-actions" },
    { name: "Preview", description: "See adaptations" },
    { name: "Avatar", description: "SITA presence" },
    { name: "Complete", description: "Launch" },
  ],
  deep: [
    { name: "Welcome", description: "Introduction" },
    { name: "Safety", description: "Psychological safety" },
    { name: "Mode", description: "Setup path" },
    { name: "Name", description: "Personalization" },
    { name: "Density", description: "Information style" },
    { name: "Tasks", description: "Work preferences" },
    { name: "Change", description: "Tolerance" },
    { name: "Progress", description: "Visualization" },
    { name: "Emotions", description: "Calibration" },
    { name: "Self", description: "Recognition" },
    { name: "Goals", description: "Priorities" },
    { name: "Wins", description: "Celebrations" },
    { name: "Style", description: "Tone" },
    { name: "Tone", description: "Communication" },
    { name: "Voice", description: "Audio settings" },
    { name: "Rhythm", description: "Daily patterns" },
    { name: "Devices", description: "Connections" },
    { name: "Wealth", description: "Financial goals" },
    { name: "Health", description: "Wellness" },
    { name: "Focus", description: "Productivity" },
    { name: "Autonomy", description: "Control" },
    { name: "Automations", description: "Actions" },
    { name: "Sovereignty", description: "Boundaries" },
    { name: "Preview", description: "Adaptations" },
    { name: "Avatar", description: "Presence" },
    { name: "Complete", description: "Launch" },
  ],
};

const MODE_TIMES = {
  quick: "~90 seconds",
  guided: "~7 minutes",
  deep: "~15 minutes",
};

export function OnboardingProgress({ mode, currentStep: propStep }: OnboardingProgressProps) {
  const { step: contextStep } = useOnboarding();
  const [isExpanded, setIsExpanded] = useState(false);
  const steps = MODE_STEPS[mode];
  // Use prop if provided, otherwise fall back to context
  const currentStepIndex = propStep !== undefined ? propStep : contextStep;

  // Estimate remaining time
  const remainingSteps = steps.length - currentStepIndex;
  const secondsPerStep = mode === "quick" ? 15 : mode === "guided" ? 25 : 35;
  const remainingSeconds = remainingSteps * secondsPerStep;
  const remainingTime =
    remainingSeconds < 60
      ? `${remainingSeconds}s`
      : `${Math.ceil(remainingSeconds / 60)} min`;

  const completedPercentage = Math.round((currentStepIndex / (steps.length - 1)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      <div
        className={`w-56 rounded-2xl bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg transition-all ${
          isExpanded ? "py-4" : "py-3"
        }`}
      >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{completedPercentage}%</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Progress Bar */}
        <div className="px-4 mt-3">
          <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completedPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Time Remaining */}
        <div className="px-4 mt-2 flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            ~{remainingTime} remaining
          </span>
        </div>

        {/* Expanded Steps List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 mt-4 pt-4 border-t border-border/50">
                <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">
                  Steps
                </p>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {steps.slice(0, currentStepIndex + 5).map((s, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 py-1 ${
                        i === currentStepIndex
                          ? "text-primary"
                          : i < currentStepIndex
                          ? "text-muted-foreground"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          i === currentStepIndex
                            ? "bg-primary"
                            : i < currentStepIndex
                            ? "bg-primary/30"
                            : "bg-foreground/10"
                        }`}
                      >
                        {i < currentStepIndex ? (
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        ) : i === currentStepIndex ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                        ) : (
                          <span className="text-[8px]">{i + 1}</span>
                        )}
                      </div>
                      <span className="text-[11px] truncate">{s.name}</span>
                    </div>
                  ))}
                  {currentStepIndex + 5 < steps.length && (
                    <p className="text-[10px] text-muted-foreground/50 pl-6">
                      +{steps.length - currentStepIndex - 5} more steps
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
