import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight, BookOpen, Target, Repeat, Rocket, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FocusProfile, LearningStyle } from "@/types/onboarding";
import { Slider } from "@/components/ui/slider";

const FOCUS_OBJECTIVES = [
  { id: "learn-skill", label: "Learn a Skill", icon: BookOpen },
  { id: "build-habit", label: "Build Habits", icon: Repeat },
  { id: "read-more", label: "Read More", icon: BookOpen },
  { id: "ship-product", label: "Ship a Product", icon: Rocket },
];

const LEARNING_STYLES: { id: LearningStyle; label: string }[] = [
  { id: "visual", label: "Visual" },
  { id: "practice", label: "Hands-on" },
  { id: "reading", label: "Reading" },
  { id: "mentor", label: "Mentorship" },
];

const DISTRACTORS = [
  "Phone", "Social media", "Meetings", "Email", "Fatigue", "Noise"
];

export function FocusPersonalizationStep() {
  const { data, updateData, nextStep, prevStep, isQuickMode } = useOnboarding();

  if (isQuickMode) {
    nextStep();
    return null;
  }

  const focusProfile: FocusProfile = data.focusProfile || {
    objective: "learn-skill",
    learningStyle: "practice",
    dailyCapacity: 3,
    distractors: [],
    deepWorkWindows: [],
  };

  const updateFocusProfile = (updates: Partial<FocusProfile>) => {
    updateData("focusProfile", { ...focusProfile, ...updates });
  };

  const toggleDistractor = (distractor: string) => {
    const current = focusProfile.distractors;
    if (current.includes(distractor)) {
      updateFocusProfile({ distractors: current.filter(d => d !== distractor) });
    } else {
      updateFocusProfile({ distractors: [...current, distractor] });
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
        Focus Profile
      </h2>
      <p className="text-muted-foreground mb-6 text-center">
        Master your cognitive performance
      </p>

      {/* Focus Objective */}
      <div className="w-full mb-5">
        <span className="text-sm font-medium text-foreground mb-2 block">Primary Objective</span>
        <div className="grid grid-cols-2 gap-2">
          {FOCUS_OBJECTIVES.map((obj) => {
            const isSelected = focusProfile.objective === obj.id;
            const Icon = obj.icon;
            return (
              <GlassCard
                key={obj.id}
                onClick={() => updateFocusProfile({ objective: obj.id as any })}
                className={`p-3 cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-secondary shadow-glow-cyan"
                    : "hover:border-secondary/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${isSelected ? "text-secondary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium text-foreground">{obj.label}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Learning Style */}
      <GlassCard className="w-full p-4 mb-5">
        <span className="text-sm font-medium text-foreground mb-3 block">Learning Style</span>
        <div className="flex gap-2">
          {LEARNING_STYLES.map((style) => {
            const isSelected = focusProfile.learningStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => updateFocusProfile({ learningStyle: style.id })}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                {style.label}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Daily Capacity */}
      <GlassCard className="w-full p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Daily Focus Capacity</span>
          <span className="text-sm text-primary font-medium">
            {focusProfile.dailyCapacity} hour{focusProfile.dailyCapacity !== 1 ? "s" : ""}
          </span>
        </div>
        <Slider
          value={[focusProfile.dailyCapacity]}
          onValueChange={([value]) => updateFocusProfile({ dailyCapacity: value })}
          min={1}
          max={8}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Light</span>
          <span className="text-xs text-muted-foreground">Intense</span>
        </div>
      </GlassCard>

      {/* Distractors */}
      <div className="w-full mb-6">
        <span className="text-sm font-medium text-foreground mb-2 block">Your Distractors</span>
        <div className="flex flex-wrap gap-2">
          {DISTRACTORS.map((distractor) => {
            const isSelected = focusProfile.distractors.includes(distractor);
            return (
              <button
                key={distractor}
                onClick={() => toggleDistractor(distractor)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  isSelected
                    ? "bg-destructive/20 text-destructive border border-destructive/30"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                {isSelected && <Check className="h-3 w-3" />}
                {distractor}
              </button>
            );
          })}
        </div>
      </div>

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
