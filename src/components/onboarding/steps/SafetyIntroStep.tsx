import { motion } from "framer-motion";
import { Shield, Heart, Sparkles } from "lucide-react";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";

export function SafetyIntroStep() {
  const { nextStep } = useOnboarding();
  
  return (
    <div className="text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center">
          <Shield className="h-10 w-10 text-secondary" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-display font-medium text-foreground mb-4">
          You're in control here
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          This system adapts to how you think and feel, not how you "should" work.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <GlassCard className="p-6 max-w-md mx-auto">
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-left">
              <Heart className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Nothing here is graded</p>
                <p className="text-xs text-muted-foreground">There are no wrong answers, only preferences</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-left">
              <Sparkles className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Skip anything</p>
                <p className="text-xs text-muted-foreground">Every question is optional - move at your pace</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-left">
              <Shield className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Change anytime</p>
                <p className="text-xs text-muted-foreground">Nothing is permanent - adjust as you grow</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 max-w-md mx-auto"
      >
        <Button
          onClick={nextStep}
          className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90"
          size="lg"
        >
          Let's begin
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Takes about 5-10 minutes • Skip anything
        </p>
      </motion.div>
    </div>
  );
}
