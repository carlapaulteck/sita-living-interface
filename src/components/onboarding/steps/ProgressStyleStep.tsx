import { useState } from "react";
import { motion } from "framer-motion";
import { Timer, BarChart3, Layers, EyeOff } from "lucide-react";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";

type ProgressVisualization = "timer" | "progress" | "both" | "none";

interface ProgressOption {
  id: ProgressVisualization;
  icon: typeof Timer;
  label: string;
  description: string;
}

const progressOptions: ProgressOption[] = [
  {
    id: "timer",
    icon: Timer,
    label: "Time-based",
    description: "Countdown timers and deadlines",
  },
  {
    id: "progress",
    icon: BarChart3,
    label: "Progress-based",
    description: "Completion bars and percentages",
  },
  {
    id: "both",
    icon: Layers,
    label: "Show both",
    description: "Time and progress together",
  },
  {
    id: "none",
    icon: EyeOff,
    label: "Minimal tracking",
    description: "Just let me work without pressure",
  },
];

export function ProgressStyleStep() {
  const { nextStep, updateNestedData } = useOnboarding();
  const [selected, setSelected] = useState<ProgressVisualization | null>(null);
  const [startTime] = useState(Date.now());
  
  const handleSelect = (option: ProgressVisualization) => {
    const choiceTime = Date.now() - startTime;
    setSelected(option);
    updateNestedData("cognitiveDiscovery" as any, "progressVisualization", option);
    updateNestedData("cognitiveDiscovery" as any, "progressVisualizationTime", choiceTime);
  };
  
  const handleContinue = () => {
    if (selected) {
      nextStep();
    }
  };
  
  const handleSkip = () => {
    updateNestedData("cognitiveDiscovery" as any, "progressVisualization", "progress");
    nextStep();
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-display font-medium text-foreground mb-2">
          How do you like to track progress?
        </h2>
        <p className="text-muted-foreground">
          This affects how we show your accomplishments
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        {progressOptions.map((option, index) => {
          const Icon = option.icon;
          const isSelected = selected === option.id;
          
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(option.id)}
              className="text-left"
            >
              <GlassCard 
                className={`p-4 h-full transition-all ${
                  isSelected 
                    ? "ring-2 ring-primary bg-primary/10" 
                    : "hover:bg-foreground/5"
                }`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-primary/20" : "bg-foreground/10"
                  }`}>
                    <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  
                  <div>
                    <span className="font-medium text-foreground block">{option.label}</span>
                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.button>
          );
        })}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 max-w-lg mx-auto"
      >
        <Button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full"
          size="lg"
        >
          Continue
        </Button>
        
        <button
          onClick={handleSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip this question
        </button>
      </motion.div>
    </div>
  );
}
