import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  Settings, 
  CheckCircle2,
  Zap,
  Brain,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface ProfileCompletionPromptProps {
  onDismiss?: () => void;
  onStartSetup?: () => void;
}

export function ProfileCompletionPrompt({ 
  onDismiss,
  onStartSetup 
}: ProfileCompletionPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user skipped onboarding
    const skippedOnboarding = localStorage.getItem("sita_skipped_onboarding") === "true";
    const dismissedPrompt = localStorage.getItem("sita_profile_prompt_dismissed");
    
    // Don't show if dismissed in the last 24 hours
    if (dismissedPrompt) {
      const dismissedTime = parseInt(dismissedPrompt);
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        return;
      }
    }

    if (skippedOnboarding && !isDismissed) {
      // Show after a short delay to not overwhelm the user
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("sita_profile_prompt_dismissed", Date.now().toString());
    onDismiss?.();
  };

  const handleStartSetup = () => {
    setIsVisible(false);
    localStorage.removeItem("sita_skipped_onboarding");
    if (onStartSetup) {
      onStartSetup();
    } else {
      navigate("/settings?tab=preferences");
    }
  };

  const completionItems = [
    { icon: Brain, label: "Cognitive preferences", description: "How you process information" },
    { icon: Palette, label: "Interface customization", description: "Density and visual style" },
    { icon: Zap, label: "Automation settings", description: "What SITA can do for you" },
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-40"
      >
        <GlassCard className="p-5 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <motion.div
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"
          />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground z-10"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="relative z-10 space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0"
              >
                <Sparkles className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Complete your profile
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Personalize SITA to work better for you
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Profile completion</span>
                <span className="text-primary font-medium">30%</span>
              </div>
              <Progress value={30} className="h-1.5" />
            </div>

            {/* What's missing */}
            <div className="space-y-2">
              {completionItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-2.5 text-xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-foreground/5 flex items-center justify-center">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <span className="text-foreground">{item.label}</span>
                    <span className="text-muted-foreground/70 ml-1.5">
                      · {item.description}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleStartSetup}
                size="sm"
                className="flex-1 group"
              >
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                Complete Setup
                <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Later
              </Button>
            </div>

            {/* Benefit hint */}
            <p className="text-[10px] text-muted-foreground/60 text-center flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Takes about 2 minutes
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}
