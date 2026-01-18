import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";

interface WakeWordIndicatorProps {
  isListening: boolean;
  isAwake: boolean;
  lastHeard?: string;
  onToggle?: () => void;
}

export function WakeWordIndicator({ 
  isListening, 
  isAwake, 
  lastHeard,
  onToggle 
}: WakeWordIndicatorProps) {
  return (
    <motion.div
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Status indicator */}
      <AnimatePresence mode="wait">
        {isAwake ? (
          <motion.div
            key="awake"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Volume2 className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-xs text-primary font-medium">SITA is listening...</span>
          </motion.div>
        ) : isListening ? (
          <motion.div
            key="listening"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-muted-foreground/20 backdrop-blur-sm"
          >
            <motion.div
              className="flex gap-0.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-muted-foreground/60 rounded-full"
                  animate={{
                    height: [3, 8, 3],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
            <span className="text-xs text-muted-foreground">Say "Hey SITA"</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={onToggle}
        className={`p-2.5 rounded-full transition-all ${
          isListening 
            ? isAwake
              ? "bg-primary/20 border-primary/40 text-primary"
              : "bg-secondary/20 border-secondary/40 text-secondary"
            : "bg-muted/30 border-muted-foreground/20 text-muted-foreground"
        } border backdrop-blur-sm`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isListening ? "Disable wake word" : "Enable 'Hey SITA' wake word"}
      >
        {isListening ? (
          <motion.div
            animate={isAwake ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Mic className="w-4 h-4" />
          </motion.div>
        ) : (
          <MicOff className="w-4 h-4" />
        )}
        
        {/* Pulse effect when listening */}
        {isListening && !isAwake && (
          <motion.div
            className="absolute inset-0 rounded-full bg-secondary/20"
            animate={{
              scale: [1, 1.5],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
        
        {/* Active pulse when awake */}
        {isAwake && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{
              scale: [1, 1.8],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>
    </motion.div>
  );
}
