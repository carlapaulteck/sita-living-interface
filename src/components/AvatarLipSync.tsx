import { motion, AnimatePresence } from "framer-motion";
import { AvatarState } from "@/contexts/AvatarStateContext";

interface AvatarLipSyncProps {
  state: AvatarState;
  audioLevel?: number;
}

export function AvatarLipSync({ state, audioLevel = 0 }: AvatarLipSyncProps) {
  const isSpeaking = state === "speaking" || state === "greeting";
  
  // Generate mouth shapes based on audio level
  const mouthHeight = isSpeaking ? 4 + audioLevel * 12 : 2;
  const mouthWidth = isSpeaking ? 16 + audioLevel * 8 : 12;

  return (
    <AnimatePresence>
      {isSpeaking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {/* Mouth overlay container - positioned at lower third of avatar */}
          <div 
            className="absolute"
            style={{
              bottom: "28%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {/* Animated mouth shape */}
            <motion.div
              className="relative"
              animate={{
                scaleY: isSpeaking ? [1, 1.5, 0.8, 1.3, 1] : 1,
                scaleX: isSpeaking ? [1, 0.9, 1.1, 0.95, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                repeat: isSpeaking ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              {/* Inner mouth glow */}
              <motion.div
                className="rounded-full"
                style={{
                  width: `${mouthWidth}px`,
                  height: `${mouthHeight}px`,
                  background: "radial-gradient(ellipse, rgba(180, 100, 100, 0.6) 0%, rgba(120, 60, 60, 0.4) 100%)",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(255, 200, 200, 0.2)",
                }}
                animate={{
                  height: isSpeaking ? [mouthHeight, mouthHeight * 2, mouthHeight * 0.5, mouthHeight * 1.5, mouthHeight] : mouthHeight,
                }}
                transition={{
                  duration: 0.25,
                  repeat: isSpeaking ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>

          {/* Subtle speaking glow around mouth area */}
          <motion.div
            className="absolute rounded-full"
            style={{
              bottom: "25%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "40px",
              height: "20px",
              background: "radial-gradient(ellipse, rgba(255, 200, 180, 0.15) 0%, transparent 70%)",
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Eye blink component
export function AvatarEyeBlink({ state }: { state: AvatarState }) {
  const isActive = state !== "idle";

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1],
        repeatDelay: Math.random() * 3 + 2,
      }}
    >
      {/* Eyelid overlay - subtle darkening for blink effect */}
      <div 
        className="absolute bg-background/40"
        style={{
          top: "30%",
          left: "30%",
          right: "30%",
          height: "12%",
          borderRadius: "50%",
        }}
      />
    </motion.div>
  );
}
