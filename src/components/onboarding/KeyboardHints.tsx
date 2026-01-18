import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CornerDownLeft } from "lucide-react";

interface KeyboardHintsProps {
  show: boolean;
  canGoBack?: boolean;
  canGoNext?: boolean;
}

export function KeyboardHints({ 
  show, 
  canGoBack = true, 
  canGoNext = true 
}: KeyboardHintsProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 2, duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs text-muted-foreground/60 z-40"
        >
          {canGoBack && (
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-foreground/5 border border-border/50 font-mono text-[10px]">
                <ArrowLeft className="h-2.5 w-2.5" />
              </kbd>
              <span>Back</span>
            </div>
          )}
          
          {canGoNext && (
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-foreground/5 border border-border/50 font-mono text-[10px]">
                <ArrowRight className="h-2.5 w-2.5" />
              </kbd>
              <span>Next</span>
            </div>
          )}

          {canGoNext && (
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-foreground/5 border border-border/50 font-mono text-[10px]">
                <CornerDownLeft className="h-2.5 w-2.5" />
              </kbd>
              <span>Confirm</span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
