import { useState } from "react";
import { motion } from "framer-motion";
import { Shuffle, ListOrdered, GitMerge } from "lucide-react";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";

type TaskOrganization = "freeform" | "structured" | "hybrid";

interface TaskOption {
  id: TaskOrganization;
  icon: typeof Shuffle;
  label: string;
  description: string;
}

const taskOptions: TaskOption[] = [
  {
    id: "freeform",
    icon: Shuffle,
    label: "Freeform & flexible",
    description: "I jump between tasks naturally",
  },
  {
    id: "structured",
    icon: ListOrdered,
    label: "Step by step",
    description: "I prefer clear sequences",
  },
  {
    id: "hybrid",
    icon: GitMerge,
    label: "Depends on the task",
    description: "Different approaches for different work",
  },
];

export function TaskStyleStep() {
  const { nextStep, updateNestedData } = useOnboarding();
  const [selected, setSelected] = useState<TaskOrganization | null>(null);
  const [startTime] = useState(Date.now());
  
  const handleSelect = (option: TaskOrganization) => {
    const choiceTime = Date.now() - startTime;
    setSelected(option);
    updateNestedData("cognitiveDiscovery" as any, "taskOrganization", option);
    updateNestedData("cognitiveDiscovery" as any, "taskOrganizationTime", choiceTime);
  };
  
  const handleContinue = () => {
    if (selected) {
      nextStep();
    }
  };
  
  const handleSkip = () => {
    updateNestedData("cognitiveDiscovery" as any, "taskOrganization", "hybrid");
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
          How do you like to organize tasks?
        </h2>
        <p className="text-muted-foreground">
          There's no right answer - just what feels natural
        </p>
      </motion.div>
      
      <div className="grid gap-4 max-w-lg mx-auto">
        {taskOptions.map((option, index) => {
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
