import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, Settings } from "lucide-react";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { buildCognitiveProfile, generateAdaptationPreview, CognitiveDiscoverySignals } from "@/lib/cognitiveProfileBuilder";

export function AdaptationPreviewStep() {
  const { nextStep, data } = useOnboarding();
  
  // Build cognitive profile from discovery data
  const adaptations = useMemo(() => {
    // Extract cognitive discovery data
    const discovery = (data as any).cognitiveDiscovery || {};
    
    const signals: CognitiveDiscoverySignals = {
      densityChoice: discovery.densityPreference || "adaptive",
      densityChoiceTime: discovery.densityChoiceTime || 3000,
      taskOrganization: discovery.taskOrganization || "hybrid",
      taskOrganizationTime: discovery.taskOrganizationTime || 3000,
      changeTolerance: discovery.changeTolerance || "medium",
      changeToleranceTime: discovery.changeToleranceTime || 3000,
      progressVisualization: discovery.progressVisualization || "progress",
      progressVisualizationTime: discovery.progressVisualizationTime || 3000,
      pileUpResponse: discovery.pileUpResponse || "clearer_steps",
      reminderFeeling: discovery.reminderFeeling || "depends",
      autoChangePreference: discovery.autoChangePreference || "ask_first",
      selfRecognitionTags: discovery.selfRecognitionTags || [],
      skippedSteps: 0,
      totalTimeMs: Date.now(),
      hesitationPatterns: [],
    };
    
    const profile = buildCognitiveProfile(signals);
    return generateAdaptationPreview(profile);
  }, [data]);
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-secondary" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-display font-medium text-foreground mb-2">
          Here's how I'll adapt for you
        </h2>
        <p className="text-muted-foreground">
          Based on your preferences, I'll start with these adaptations
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg mx-auto"
      >
        <GlassCard className="p-6">
          <div className="space-y-4">
            {adaptations.map((adaptation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-foreground">{adaptation}</span>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 pt-4 border-t border-border"
          >
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Settings className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>You can change any of these in Settings at any time</p>
            </div>
          </motion.div>
        </GlassCard>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col gap-3 max-w-lg mx-auto"
      >
        <Button
          onClick={nextStep}
          className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90"
          size="lg"
        >
          Looks good - continue
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          The system will learn and refine over time
        </p>
      </motion.div>
    </div>
  );
}
