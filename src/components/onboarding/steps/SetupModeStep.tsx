import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { Zap, Compass, Crown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetupMode } from "@/types/onboarding";

const SETUP_MODES = [
  {
    id: "quick" as SetupMode,
    label: "Quick Setup",
    time: "90 seconds",
    icon: Zap,
    desc: "Core preferences + connect 1-2 sources",
    color: "text-secondary",
  },
  {
    id: "guided" as SetupMode,
    label: "Guided Setup",
    time: "7 minutes",
    icon: Compass,
    desc: "Full setup with automations",
    color: "text-primary",
    recommended: true,
  },
  {
    id: "deep" as SetupMode,
    label: "Deep Setup",
    time: "15-25 minutes",
    icon: Crown,
    desc: "For power users — Sovereignty + custom agents",
    color: "text-primary",
  },
];

export function SetupModeStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  return (
    <motion.div
      className="flex flex-col items-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        How would you like to set up SITA?
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        Every moment spent here makes SITA smarter for you
      </p>

      <div className="flex flex-col gap-4 w-full mb-8">
        {SETUP_MODES.map((mode) => {
          const isSelected = data.setupMode === mode.id;
          const Icon = mode.icon;
          
          return (
            <GlassCard
              key={mode.id}
              className={`p-6 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "ring-2 ring-primary shadow-glow-gold"
                  : "hover:border-primary/30"
              }`}
              onClick={() => updateData("setupMode", mode.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-foreground/5 ${mode.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{mode.label}</span>
                    {mode.recommended && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{mode.desc}</p>
                </div>
                <span className="text-sm text-muted-foreground">{mode.time}</span>
              </div>
            </GlassCard>
          );
        })}
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
