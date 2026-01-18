import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Pause, Shield } from "lucide-react";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";

type ChangeTolerance = "low" | "medium" | "high";

interface ToleranceOption {
  id: ChangeTolerance;
  icon: typeof Zap;
  label: string;
  description: string;
}

const toleranceOptions: ToleranceOption[] = [
  {
    id: "high",
    icon: Zap,
    label: "Embrace change",
    description: "I adapt quickly to new things",
  },
  {
    id: "medium",
    icon: Pause,
    label: "Gradual changes",
    description: "Give me time to adjust",
  },
  {
    id: "low",
    icon: Shield,
    label: "Prefer stability",
    description: "Keep things predictable",
  },
];

export function ChangeToleranceStep() {
  const { nextStep, updateNestedData } = useOnboarding();
  const [selected, setSelected] = useState<ChangeTolerance | null>(null);
  const [startTime] = useState(Date.now());
  
  const handleSelect = (option: ChangeTolerance) => {
    const choiceTime = Date.now() - startTime;
    setSelected(option);
    updateNestedData("cognitiveDiscovery" as any, "changeTolerance", option);
    updateNestedData("cognitiveDiscovery" as any, "changeToleranceTime", choiceTime);
  };
  
  const handleContinue = () => {
    if (selected) {
      nextStep();
    }
  };
  
  const handleSkip = () => {
    updateNestedData("cognitiveDiscovery" as any, "changeTolerance", "medium");
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
          How do you respond to change?
        </h2>
        <p className="text-muted-foreground">
          This helps us pace UI updates and transitions
        </p>
      </motion.div>
      
      <div className="grid gap-4 max-w-lg mx-auto">
        {toleranceOptions.map((option, index) => {
          const Icon = option.icon;
          const isSelected = selected === option.id;
          
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(option.id)}
              className="w-full text-left"
            >
              <GlassCard 
                className={`p-4 transition-all ${
                  isSelected 
                    ? "ring-2 ring-primary bg-primary/10" 
                    : "hover:bg-foreground/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-primary/20" : "bg-foreground/10"
                  }`}>
                    <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  
                  <div className="flex-1">
                    <span className="font-medium text-foreground block">{option.label}</span>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected 
                      ? "border-primary bg-primary" 
                      : "border-muted-foreground"
                  }`}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-primary-foreground"
                      />
                    )}
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
        transition={{ delay: 0.4 }}
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
