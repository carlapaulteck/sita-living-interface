import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { HelpHint } from "@/components/HelpHint";
import { 
  TrendingUp, 
  Moon, 
  Brain, 
  Zap, 
  Shield, 
  User,
  ChevronRight,
  Check,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrimaryIntent } from "@/types/onboarding";

const INTENT_OPTIONS: { id: PrimaryIntent; label: string; icon: typeof TrendingUp; desc: string }[] = [
  {
    id: "increase-income",
    label: "Increase Income",
    icon: TrendingUp,
    desc: "Optimize revenue & grow wealth",
  },
  {
    id: "improve-sleep",
    label: "Improve Sleep & Recovery",
    icon: Moon,
    desc: "Better rest, more energy",
  },
  {
    id: "build-focus",
    label: "Build Focus & Learning",
    icon: Brain,
    desc: "Deep work & skill development",
  },
  {
    id: "automate-life",
    label: "Automate My Life",
    icon: Zap,
    desc: "Less manual work, more living",
  },
  {
    id: "track-privately",
    label: "Track Everything Privately",
    icon: Shield,
    desc: "Own your data, stay sovereign",
  },
  {
    id: "digital-twin",
    label: "Build My Digital Twin",
    icon: User,
    desc: "AI that truly knows you",
  },
];

export function GoalsStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const selectedIntents = data.primaryIntents;

  const toggleIntent = (id: PrimaryIntent) => {
    if (selectedIntents.includes(id)) {
      updateData("primaryIntents", selectedIntents.filter(i => i !== id));
    } else {
      updateData("primaryIntents", [...selectedIntents, id]);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-3xl font-display font-medium text-foreground text-center">
          What brings you here?
        </h2>
        <HelpHint 
          hint="You can change these priorities anytime in Settings. Your selections help SITA understand what matters most to you."
          variant="info"
        />
      </div>
      <p className="text-muted-foreground mb-4 text-center">
        Select all that apply — we'll personalize everything
      </p>
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles className="h-3 w-3 text-primary" />
        <span className="text-xs text-muted-foreground">Most users select 2-3 priorities</span>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        {INTENT_OPTIONS.map((option) => {
          const isSelected = selectedIntents.includes(option.id);
          const Icon = option.icon;
          
          return (
            <GlassCard
              key={option.id}
              className={`p-5 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "ring-2 ring-secondary shadow-glow-cyan"
                  : "hover:border-secondary/30"
              }`}
              onClick={() => toggleIntent(option.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${isSelected ? "bg-secondary/20" : "bg-foreground/5"}`}>
                  <Icon className={`h-5 w-5 ${isSelected ? "text-secondary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-foreground text-sm">{option.label}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-secondary mt-1" />
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button 
          onClick={nextStep} 
          className="gap-2"
          disabled={selectedIntents.length === 0}
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
