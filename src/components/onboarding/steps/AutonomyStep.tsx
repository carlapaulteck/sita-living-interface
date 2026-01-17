import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight, Eye, MessageSquare, Zap, Rocket, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutonomyLevel } from "@/types/onboarding";

const AUTONOMY_LEVELS: {
  id: AutonomyLevel;
  label: string;
  icon: typeof Eye;
  desc: string;
  color: string;
}[] = [
  {
    id: "observe",
    label: "Observe",
    icon: Eye,
    desc: "SITA only watches and reports",
    color: "text-blue-400",
  },
  {
    id: "suggest",
    label: "Suggest",
    icon: MessageSquare,
    desc: "SITA proposes actions for approval",
    color: "text-secondary",
  },
  {
    id: "act",
    label: "Act",
    icon: Zap,
    desc: "SITA executes safe actions automatically",
    color: "text-primary",
  },
  {
    id: "autopilot",
    label: "Autopilot",
    icon: Rocket,
    desc: "SITA executes + self-optimizes with guardrails",
    color: "text-purple-400",
  },
];

export function AutonomyStep() {
  const { data, updateData, updateNestedData, nextStep, prevStep } = useOnboarding();

  const currentLevelIndex = AUTONOMY_LEVELS.findIndex(l => l.id === data.autonomyLevel);

  return (
    <motion.div
      className="flex flex-col items-center max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        Autonomy Level
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        How much should SITA do on its own?
      </p>

      {/* Autonomy Slider Visual */}
      <div className="w-full mb-6">
        <div className="relative">
          <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-secondary to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentLevelIndex + 1) / AUTONOMY_LEVELS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {AUTONOMY_LEVELS.map((level, i) => {
              const isActive = i <= currentLevelIndex;
              const Icon = level.icon;
              return (
                <button
                  key={level.id}
                  onClick={() => updateData("autonomyLevel", level.id)}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    isActive ? level.color : "text-muted-foreground/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{level.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Level Description */}
      <GlassCard className="w-full p-4 mb-6">
        <div className="flex items-center gap-3">
          {(() => {
            const current = AUTONOMY_LEVELS[currentLevelIndex];
            const Icon = current.icon;
            return (
              <>
                <Icon className={`h-6 w-6 ${current.color}`} />
                <div>
                  <span className="font-medium text-foreground">{current.label}</span>
                  <p className="text-sm text-muted-foreground">{current.desc}</p>
                </div>
              </>
            );
          })()}
        </div>
      </GlassCard>

      {/* Guardrails */}
      <div className="w-full mb-8">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Safety Guardrails</span>
        </div>
        <GlassCard className="p-4">
          <div className="flex flex-col gap-3">
            {[
              { key: "neverSpendWithoutApproval", label: "Never spend money without approval", locked: true },
              { key: "neverMessageWithoutApproval", label: "Never message people without approval", locked: true },
              { key: "canAdjustCalendar", label: "Can adjust calendar automatically" },
              { key: "canEnableFocusMode", label: "Can enable focus mode automatically" },
            ].map((guardrail) => {
              const value = data.guardrails[guardrail.key as keyof typeof data.guardrails];
              return (
                <div key={guardrail.key} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    {guardrail.label}
                    {guardrail.locked && (
                      <span className="ml-2 text-xs text-muted-foreground">(required)</span>
                    )}
                  </span>
                  <button
                    onClick={() => {
                      if (!guardrail.locked) {
                        updateNestedData("guardrails", guardrail.key, !value);
                      }
                    }}
                    disabled={guardrail.locked}
                    className={`w-10 h-5 rounded-full transition-all duration-300 ${
                      value ? "bg-primary" : "bg-foreground/20"
                    } ${guardrail.locked ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-foreground transition-transform duration-300 ${
                        value ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>
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
