import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight, Check, Sparkles, Moon, Focus, TrendingUp, Heart, Wifi, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUTOMATION_TEMPLATES } from "@/types/onboarding";

const AUTOMATION_ICONS: Record<string, typeof Moon> = {
  "sleep-low-adjust": Moon,
  "focus-window-silence": Focus,
  "revenue-spike-alert": TrendingUp,
  "stress-high-protocol": Heart,
  "device-disconnect": Wifi,
  "morning-briefing": Sun,
};

export function AutomationsStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  const toggleAutomation = (id: string) => {
    const current = data.automations;
    const existing = current.find(a => a.id === id);
    
    if (existing) {
      updateData("automations", current.filter(a => a.id !== id));
    } else {
      const template = AUTOMATION_TEMPLATES.find(t => t.id === id);
      if (template) {
        updateData("automations", [...current, { ...template, enabled: true }]);
      }
    }
  };

  const isEnabled = (id: string) => data.automations.some(a => a.id === id);
  const enabledCount = data.automations.length;

  return (
    <motion.div
      className="flex flex-col items-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        Create Your First Automations
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        Pick up to 3 templates to start with
      </p>

      <div className="flex flex-col gap-3 w-full mb-6">
        {AUTOMATION_TEMPLATES.map((template) => {
          const enabled = isEnabled(template.id);
          const isDisabled = !enabled && enabledCount >= 3;
          const Icon = AUTOMATION_ICONS[template.id] || Sparkles;
          
          return (
            <GlassCard
              key={template.id}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                enabled
                  ? "ring-2 ring-secondary shadow-glow-cyan"
                  : isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-secondary/30"
              }`}
              onClick={() => !isDisabled && toggleAutomation(template.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${enabled ? "bg-secondary/20" : "bg-foreground/5"}`}>
                  <Icon className={`h-5 w-5 ${enabled ? "text-secondary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-foreground text-sm">{template.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">When:</span>
                    <span className="text-xs text-foreground/80">{template.trigger}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">Then:</span>
                    <span className="text-xs text-secondary">{template.action}</span>
                  </div>
                </div>
                {enabled && (
                  <Check className="h-5 w-5 text-secondary" />
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Preview */}
      {enabledCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-8"
        >
          <GlassCard className="p-4 border-secondary/30">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <span className="text-sm font-medium text-foreground">How it works tomorrow</span>
                <p className="text-xs text-muted-foreground mt-1">
                  SITA will monitor your signals and trigger these automations when conditions are met.
                  You'll always see what happened in your morning briefing.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground mb-6 text-center">
        You can create custom automations later
      </p>

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
