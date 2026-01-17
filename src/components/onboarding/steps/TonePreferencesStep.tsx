import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PREFERENCE_OPTIONS = [
  {
    key: "pushIntensity" as const,
    label: "Motivation Style",
    options: [
      { value: "hard", label: "Push me hard" },
      { value: "gentle", label: "Be gentle" },
    ],
  },
  {
    key: "actionMode" as const,
    label: "Action Mode",
    options: [
      { value: "ask-first", label: "Ask before acting" },
      { value: "act-automatically", label: "Act automatically" },
    ],
  },
  {
    key: "verbosity" as const,
    label: "Detail Level",
    options: [
      { value: "minimal", label: "Minimal text" },
      { value: "detailed", label: "Detailed breakdowns" },
    ],
  },
  {
    key: "alertFrequency" as const,
    label: "Alert Frequency",
    options: [
      { value: "daily-summary", label: "Daily summary" },
      { value: "critical-only", label: "Only critical alerts" },
    ],
  },
];

export function TonePreferencesStep() {
  const { data, updateNestedData, nextStep, prevStep } = useOnboarding();

  return (
    <motion.div
      className="flex flex-col items-center max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        Tone & Preferences
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        How should SITA interact with you?
      </p>

      <div className="flex flex-col gap-5 w-full mb-8">
        {PREFERENCE_OPTIONS.map((pref) => (
          <GlassCard key={pref.key} className="p-4">
            <span className="text-sm font-medium text-foreground mb-3 block">
              {pref.label}
            </span>
            <div className="flex gap-2">
              {pref.options.map((option) => {
                const isSelected = data.frictionProfile[pref.key] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => updateNestedData("frictionProfile", pref.key, option.value)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} className="gap-2">
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
