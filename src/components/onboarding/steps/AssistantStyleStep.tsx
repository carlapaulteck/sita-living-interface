import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight, Briefcase, Heart, Lightbulb, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssistantStyle } from "@/types/onboarding";

const ASSISTANT_STYLES: {
  id: AssistantStyle;
  label: string;
  icon: typeof Briefcase;
  desc: string;
  example: string;
}[] = [
  {
    id: "executive",
    label: "Executive",
    icon: Briefcase,
    desc: "Concise directives, no fluff",
    example: '"Revenue up 12%. Scale the winner."',
  },
  {
    id: "coach",
    label: "Coach",
    icon: Heart,
    desc: "Encouragement + routines",
    example: '"Great progress! Let\'s lock in that habit."',
  },
  {
    id: "muse",
    label: "Muse",
    icon: Lightbulb,
    desc: "Creative + explorative",
    example: '"What if we tried a different angle here?"',
  },
  {
    id: "analyst",
    label: "Analyst",
    icon: BarChart3,
    desc: "Deep explanations + charts",
    example: '"Based on 30-day trends, here\'s the breakdown..."',
  },
];

export function AssistantStyleStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  return (
    <motion.div
      className="flex flex-col items-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        Choose Your SITA Mode
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        How should I communicate with you? (Always changeable)
      </p>

      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        {ASSISTANT_STYLES.map((style) => {
          const isSelected = data.assistantStyle === style.id;
          const Icon = style.icon;
          
          return (
            <GlassCard
              key={style.id}
              className={`p-5 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "ring-2 ring-primary shadow-glow-gold"
                  : "hover:border-primary/30"
              }`}
              onClick={() => updateData("assistantStyle", style.id)}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isSelected ? "bg-primary/20" : "bg-foreground/5"}`}>
                    <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{style.label}</span>
                    <p className="text-xs text-muted-foreground">{style.desc}</p>
                  </div>
                </div>
                <p className="text-xs italic text-muted-foreground/80 pl-11">
                  {style.example}
                </p>
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
