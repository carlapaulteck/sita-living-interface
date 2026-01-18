import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { HelpHint } from "@/components/HelpHint";
import { Zap, Compass, Crown, ChevronRight, Info, X } from "lucide-react";
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
  const [showComparison, setShowComparison] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-3xl font-display font-medium text-foreground text-center">
          How would you like to set up SITA?
        </h2>
        <HelpHint 
          hint="Quick = essential settings only. Guided = recommended for most users. Deep = for power users who want full customization."
          variant="info"
        />
      </div>
      <p className="text-muted-foreground mb-4 text-center">
        Every moment spent here makes SITA smarter for you
      </p>
      
      <button
        onClick={() => setShowComparison(!showComparison)}
        className="text-xs text-secondary hover:underline mb-6 flex items-center gap-1"
      >
        <Info className="h-3 w-3" />
        What's the difference?
      </button>

      {/* Comparison Table */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mb-6 overflow-hidden"
          >
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Mode Comparison</span>
                <button onClick={() => setShowComparison(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-muted-foreground">Feature</div>
                <div className="text-secondary">Quick</div>
                <div className="text-primary">Guided</div>
                <div className="text-primary">Deep</div>
                
                <div className="text-muted-foreground">Goals</div>
                <div>✓</div>
                <div>✓</div>
                <div>✓</div>
                
                <div className="text-muted-foreground">Cognitive Discovery</div>
                <div className="text-muted-foreground/50">—</div>
                <div>✓</div>
                <div>✓</div>
                
                <div className="text-muted-foreground">Automations</div>
                <div className="text-muted-foreground/50">—</div>
                <div>✓</div>
                <div>✓</div>
                
                <div className="text-muted-foreground">Voice & Tone</div>
                <div className="text-muted-foreground/50">—</div>
                <div className="text-muted-foreground/50">—</div>
                <div>✓</div>
                
                <div className="text-muted-foreground">Sovereignty Controls</div>
                <div className="text-muted-foreground/50">—</div>
                <div className="text-muted-foreground/50">—</div>
                <div>✓</div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

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
