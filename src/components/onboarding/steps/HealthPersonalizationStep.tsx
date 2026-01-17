import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight, Moon, Heart, Brain, Dumbbell, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthProfile, TrainingType } from "@/types/onboarding";

const HEALTH_GOALS = [
  { id: "sleep", label: "Better Sleep", icon: Moon },
  { id: "recovery", label: "Recovery", icon: Heart },
  { id: "stress", label: "Stress Management", icon: Brain },
  { id: "training", label: "Training Performance", icon: Dumbbell },
  { id: "longevity", label: "Longevity", icon: Sparkles },
];

const TRAINING_TYPES: { id: TrainingType; label: string }[] = [
  { id: "strength", label: "Strength" },
  { id: "cardio", label: "Cardio" },
  { id: "mixed", label: "Mixed" },
  { id: "none", label: "None" },
];

const INTERVENTIONS = [
  "Sauna", "Cold exposure", "Breathwork", "Meditation", 
  "Walks", "Supplements", "Massage", "Stretching"
];

export function HealthPersonalizationStep() {
  const { data, updateData, nextStep, prevStep, isQuickMode } = useOnboarding();

  if (isQuickMode) {
    nextStep();
    return null;
  }

  const healthProfile: HealthProfile = data.healthProfile || {
    topGoal: "sleep",
    constraints: [],
    trainingType: "mixed",
    interventions: [],
  };

  const updateHealthProfile = (updates: Partial<HealthProfile>) => {
    updateData("healthProfile", { ...healthProfile, ...updates });
  };

  const toggleIntervention = (intervention: string) => {
    const current = healthProfile.interventions;
    if (current.includes(intervention)) {
      updateHealthProfile({ interventions: current.filter(i => i !== intervention) });
    } else {
      updateHealthProfile({ interventions: [...current, intervention] });
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        Health Profile
      </h2>
      <p className="text-muted-foreground mb-6 text-center">
        Optimize your physical foundation
      </p>

      {/* Top Goal */}
      <div className="w-full mb-5">
        <span className="text-sm font-medium text-foreground mb-2 block">Primary Health Goal</span>
        <div className="flex flex-wrap gap-2">
          {HEALTH_GOALS.map((goal) => {
            const isSelected = healthProfile.topGoal === goal.id;
            const Icon = goal.icon;
            return (
              <button
                key={goal.id}
                onClick={() => updateHealthProfile({ topGoal: goal.id as any })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-green-500 text-white"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {goal.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Training Type */}
      <GlassCard className="w-full p-4 mb-5">
        <span className="text-sm font-medium text-foreground mb-3 block">Training Style</span>
        <div className="flex gap-2">
          {TRAINING_TYPES.map((type) => {
            const isSelected = healthProfile.trainingType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => updateHealthProfile({ trainingType: type.id })}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Interventions */}
      <div className="w-full mb-5">
        <span className="text-sm font-medium text-foreground mb-2 block">Recovery Interventions</span>
        <div className="flex flex-wrap gap-2">
          {INTERVENTIONS.map((intervention) => {
            const isSelected = healthProfile.interventions.includes(intervention);
            return (
              <button
                key={intervention}
                onClick={() => toggleIntervention(intervention)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  isSelected
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                {isSelected && <Check className="h-3 w-3" />}
                {intervention}
              </button>
            );
          })}
        </div>
      </div>

      {/* Constraints */}
      <GlassCard className="w-full p-4 mb-6">
        <span className="text-sm font-medium text-foreground mb-2 block">Any constraints?</span>
        <p className="text-xs text-muted-foreground mb-3">Injuries, medical conditions (optional)</p>
        <input
          type="text"
          value={healthProfile.constraints.join(", ")}
          onChange={(e) => updateHealthProfile({ 
            constraints: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
          })}
          placeholder="e.g., knee injury, avoid high impact"
          className="w-full px-3 py-2 rounded-lg bg-foreground/5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/50"
        />
      </GlassCard>

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} className="gap-2">
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
