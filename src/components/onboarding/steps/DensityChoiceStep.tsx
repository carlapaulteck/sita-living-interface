import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Square, Layers } from "lucide-react";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";

type DensityPreference = "dense" | "focused" | "adaptive";

interface DensityOption {
  id: DensityPreference;
  icon: typeof LayoutGrid;
  label: string;
  description: string;
  preview: React.ReactNode;
}

const densityOptions: DensityOption[] = [
  {
    id: "dense",
    icon: LayoutGrid,
    label: "Everything at once",
    description: "I like seeing all my options",
    preview: (
      <div className="grid grid-cols-3 gap-1 p-2">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="aspect-square bg-primary/30 rounded-sm" />
        ))}
      </div>
    ),
  },
  {
    id: "focused",
    icon: Square,
    label: "One thing at a time",
    description: "I prefer focused attention",
    preview: (
      <div className="p-4 flex items-center justify-center">
        <div className="w-12 h-12 bg-primary/50 rounded-lg" />
      </div>
    ),
  },
  {
    id: "adaptive",
    icon: Layers,
    label: "Let the system decide",
    description: "Adjust based on context",
    preview: (
      <div className="p-2 space-y-1">
        <div className="h-3 bg-primary/40 rounded-full w-full" />
        <div className="h-3 bg-primary/30 rounded-full w-3/4" />
        <div className="h-3 bg-primary/20 rounded-full w-1/2" />
      </div>
    ),
  },
];

export function DensityChoiceStep() {
  const { nextStep, updateNestedData } = useOnboarding();
  const [selected, setSelected] = useState<DensityPreference | null>(null);
  const [startTime] = useState(Date.now());
  
  const handleSelect = (option: DensityPreference) => {
    const choiceTime = Date.now() - startTime;
    setSelected(option);
    
    // Store both the choice and the time taken
    updateNestedData("cognitiveDiscovery" as any, "densityPreference", option);
    updateNestedData("cognitiveDiscovery" as any, "densityChoiceTime", choiceTime);
  };
  
  const handleContinue = () => {
    if (selected) {
      nextStep();
    }
  };
  
  const handleSkip = () => {
    updateNestedData("cognitiveDiscovery" as any, "densityPreference", "adaptive");
    updateNestedData("cognitiveDiscovery" as any, "densityChoiceTime", Date.now() - startTime);
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
          How do you prefer to see information?
        </h2>
        <p className="text-muted-foreground">
          Choose what feels most comfortable
        </p>
      </motion.div>
      
      <div className="grid gap-4 max-w-lg mx-auto">
        {densityOptions.map((option, index) => {
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
                  <div className={`w-16 h-16 rounded-xl overflow-hidden ${
                    isSelected ? "bg-primary/20" : "bg-foreground/10"
                  }`}>
                    {option.preview}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-medium text-foreground">{option.label}</span>
                    </div>
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
