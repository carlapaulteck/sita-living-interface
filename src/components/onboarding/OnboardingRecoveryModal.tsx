import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";

interface SavedProgress {
  step: number;
  mode: 'quick' | 'guided' | 'deep';
  timestamp: number;
}

interface OnboardingRecoveryModalProps {
  savedProgress: SavedProgress | null;
  onContinue: () => void;
  onStartFresh: () => void;
}

export function OnboardingRecoveryModal({ 
  savedProgress, 
  onContinue, 
  onStartFresh 
}: OnboardingRecoveryModalProps) {
  if (!savedProgress) return null;

  const timeAgo = getTimeAgo(savedProgress.timestamp);
  const modeLabels = {
    quick: 'Quick Setup',
    guided: 'Guided Journey',
    deep: 'Deep Configuration'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center"
              >
                <RotateCcw className="h-8 w-8 text-primary" />
              </motion.div>
              
              <h2 className="text-xl font-display font-medium text-foreground">
                Welcome back!
              </h2>
              <p className="text-muted-foreground text-sm">
                You have an unfinished setup session
              </p>
            </div>

            {/* Progress Info */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Started {timeAgo}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-foreground">
                  Step {savedProgress.step} of {modeLabels[savedProgress.mode]}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={onContinue} 
                className="w-full"
                size="lg"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Continue where you left off
              </Button>
              
              <Button 
                onClick={onStartFresh}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <X className="h-4 w-4 mr-2" />
                Start fresh
              </Button>
            </div>

            {/* Reassurance */}
            <p className="text-xs text-muted-foreground text-center">
              Your previous answers have been saved. You can change them anytime.
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return new Date(timestamp).toLocaleDateString();
}
