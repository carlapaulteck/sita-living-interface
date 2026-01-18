import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Minus, List, VolumeX, Sparkles, Shield } from "lucide-react";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { HelpHint } from "@/components/HelpHint";

type PileUpResponse = "fewer_choices" | "clearer_steps" | "reassurance" | "silence";
type ReminderFeeling = "helpful" | "stressful" | "depends";
type AutoChangePreference = "automatic" | "ask_first" | "never";

interface QuestionOption {
  value: string;
  label: string;
  icon?: typeof Heart;
}

const questionHints = [
  "Understanding your stress response helps us support you during overwhelm, not add to it.",
  "Reminder tone makes a big difference. We'll adjust notification style based on this.",
  "Some prefer predictable systems, others like adaptive ones. Both are valid."
];

export function EmotionalCalibrationStep() {
  const { nextStep, updateNestedData } = useOnboarding();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [pileUpResponse, setPileUpResponse] = useState<PileUpResponse | null>(null);
  const [reminderFeeling, setReminderFeeling] = useState<ReminderFeeling | null>(null);
  const [autoChangePreference, setAutoChangePreference] = useState<AutoChangePreference | null>(null);
  
  const questions = [
    {
      question: "When things pile up, what helps most?",
      options: [
        { value: "fewer_choices", label: "Fewer choices", icon: Minus },
        { value: "clearer_steps", label: "Clearer steps", icon: List },
        { value: "reassurance", label: "Reassurance", icon: Heart },
        { value: "silence", label: "Silence", icon: VolumeX },
      ],
      selected: pileUpResponse,
      onSelect: (value: string) => {
        setPileUpResponse(value as PileUpResponse);
        updateNestedData("cognitiveDiscovery" as any, "pileUpResponse", value);
        setTimeout(() => setCurrentQuestion(1), 300);
      },
    },
    {
      question: "Do reminders usually feel helpful or stressful?",
      options: [
        { value: "helpful", label: "Helpful - they keep me on track" },
        { value: "stressful", label: "Stressful - they add pressure" },
        { value: "depends", label: "Depends on timing and tone" },
      ],
      selected: reminderFeeling,
      onSelect: (value: string) => {
        setReminderFeeling(value as ReminderFeeling);
        updateNestedData("cognitiveDiscovery" as any, "reminderFeeling", value);
        setTimeout(() => setCurrentQuestion(2), 300);
      },
    },
    {
      question: "Do you like systems that change automatically?",
      options: [
        { value: "automatic", label: "Yes, adapt for me" },
        { value: "ask_first", label: "Ask me first" },
        { value: "never", label: "No, keep things predictable" },
      ],
      selected: autoChangePreference,
      onSelect: (value: string) => {
        setAutoChangePreference(value as AutoChangePreference);
        updateNestedData("cognitiveDiscovery" as any, "autoChangePreference", value);
      },
    },
  ];
  
  const currentQ = questions[currentQuestion];
  const isComplete = autoChangePreference !== null;
  
  const handleContinue = () => {
    nextStep();
  };
  
  const handleSkip = () => {
    updateNestedData("cognitiveDiscovery" as any, "pileUpResponse", "clearer_steps");
    updateNestedData("cognitiveDiscovery" as any, "reminderFeeling", "depends");
    updateNestedData("cognitiveDiscovery" as any, "autoChangePreference", "ask_first");
    nextStep();
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs text-primary font-medium uppercase tracking-wider">
            Emotional Calibration
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-foreground">
            {currentQ.question}
          </h2>
          <HelpHint 
            hint={questionHints[currentQuestion]}
            variant="tip"
          />
        </div>
        <p className="text-muted-foreground text-sm">
          This helps us communicate in a way that works for you
        </p>
        
        {/* Privacy reassurance */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-muted-foreground/60 mt-2 flex items-center justify-center gap-1"
        >
          <Sparkles className="h-3 w-3" />
          These answers shape your experience, not a profile others see
        </motion.p>
      </motion.div>
      
      {/* Progress indicators */}
      <div className="flex justify-center gap-2 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === currentQuestion
                ? "w-8 bg-primary"
                : i < currentQuestion
                  ? "w-4 bg-primary/50"
                  : "w-4 bg-foreground/20"
            }`}
          />
        ))}
      </div>
      
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="grid gap-3 max-w-lg mx-auto"
      >
        {currentQ.options.map((option, index) => {
          const isSelected = currentQ.selected === option.value;
          const Icon = option.icon;
          
          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => currentQ.onSelect(option.value)}
              className="w-full text-left"
            >
              <GlassCard 
                className={`p-4 transition-all ${
                  isSelected 
                    ? "ring-2 ring-primary bg-primary/10" 
                    : "hover:bg-foreground/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                  <span className={`flex-1 ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                    {option.label}
                  </span>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    isSelected 
                      ? "border-primary bg-primary" 
                      : "border-muted-foreground"
                  }`}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-full h-full rounded-full bg-primary flex items-center justify-center"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.button>
          );
        })}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-3 max-w-lg mx-auto"
      >
        {isComplete && (
          <Button
            onClick={handleContinue}
            className="w-full"
            size="lg"
          >
            Continue
          </Button>
        )}
        
        <button
          onClick={handleSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip these questions
        </button>
      </motion.div>
    </div>
  );
}
