import { motion, AnimatePresence } from "framer-motion";
import { FastForward, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";

interface SkipToEndModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SkipToEndModal({ isOpen, onConfirm, onCancel }: SkipToEndModalProps) {
  if (!isOpen) return null;

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
                className="w-16 h-16 mx-auto rounded-full bg-secondary/20 flex items-center justify-center"
              >
                <FastForward className="h-8 w-8 text-secondary" />
              </motion.div>
              
              <h2 className="text-xl font-display font-medium text-foreground">
                Skip to the end?
              </h2>
              <p className="text-muted-foreground text-sm">
                We'll use smart defaults to get you started quickly
              </p>
            </div>

            {/* What you'll get */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                What happens when you skip
              </p>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">
                    Dashboard ready to use immediately
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">
                    Balanced defaults for all cognitive settings
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">
                    Standard automations enabled
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">
                    Customize anytime in Settings
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={onConfirm} 
                className="w-full"
                size="lg"
              >
                <FastForward className="h-4 w-4 mr-2" />
                Skip to dashboard
              </Button>
              
              <Button 
                onClick={onCancel}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <X className="h-4 w-4 mr-2" />
                Continue setup
              </Button>
            </div>

            {/* Reassurance */}
            <p className="text-xs text-muted-foreground text-center">
              You can always re-run the full setup from Settings → Preferences
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
