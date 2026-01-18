import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Shield } from "lucide-react";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { HelpHint } from "@/components/HelpHint";

interface RecognitionTag {
  id: string;
  label: string;
}

const recognitionTags: RecognitionTag[] = [
  { id: "lose_track_of_time", label: "I lose track of time easily" },
  { id: "too_many_options", label: "Too many options overwhelm me" },
  { id: "predictability_helps", label: "Predictability helps me relax" },
  { id: "starting_is_hard", label: "Starting is harder than finishing" },
  { id: "notice_small_details", label: "I notice small details others miss" },
  { id: "background_noise_helps", label: "Background noise helps me focus" },
  { id: "need_deadlines", label: "I work best with deadlines" },
  { id: "visual_learner", label: "I prefer visual information" },
];

export function SelfRecognitionStep() {
  const { nextStep, updateNestedData } = useOnboarding();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId];
      updateNestedData("cognitiveDiscovery" as any, "selfRecognitionTags", newTags);
      return newTags;
    });
  };
  
  const handleContinue = () => {
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
          <Sparkles className="h-4 w-4 text-secondary" />
          <span className="text-xs text-secondary font-medium uppercase tracking-wider">
            Optional Self-Recognition
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-foreground">
            Anything feel familiar?
          </h2>
          <HelpHint 
            hint="This is entirely optional. These are common patterns - not diagnoses. Selecting any helps us fine-tune support without labels."
            variant="info"
          />
        </div>
        <p className="text-muted-foreground">
          Select any that resonate with you - this is completely optional
        </p>
        
        {/* Privacy reassurance */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground/60"
        >
          <Shield className="h-3 w-3" />
          <span>Private to you - never shared or analyzed externally</span>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg mx-auto"
      >
        <GlassCard className="p-4">
          <div className="flex flex-wrap gap-2">
            {recognitionTags.map((tag, index) => {
              const isSelected = selectedTags.includes(tag.id);
              
              return (
                <motion.button
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-2 rounded-full text-sm transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/10 text-muted-foreground hover:bg-foreground/20"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                  {tag.label}
                </motion.button>
              );
            })}
          </div>
        </GlassCard>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          These help personalize your experience but won't be shared or analyzed
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-3 max-w-lg mx-auto"
      >
        <Button
          onClick={handleContinue}
          className="w-full"
          size="lg"
        >
          {selectedTags.length > 0 ? "Continue" : "Skip this step"}
        </Button>
      </motion.div>
    </div>
  );
}
