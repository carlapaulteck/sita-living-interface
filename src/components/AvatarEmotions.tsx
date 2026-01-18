import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export type EmotionType = "neutral" | "happy" | "concerned" | "thinking" | "excited" | "calm" | "alert";

interface AvatarEmotionsProps {
  emotion: EmotionType;
  intensity?: number; // 0-1
}

// Emotion configurations with visual properties
const emotionConfigs: Record<EmotionType, {
  eyeScale: number;
  eyebrowOffset: number;
  mouthCurve: number;
  glowColor: string;
  overlayGradient: string;
}> = {
  neutral: {
    eyeScale: 1,
    eyebrowOffset: 0,
    mouthCurve: 0,
    glowColor: "rgba(0, 255, 255, 0.2)",
    overlayGradient: "transparent",
  },
  happy: {
    eyeScale: 0.9,
    eyebrowOffset: -2,
    mouthCurve: 8,
    glowColor: "rgba(255, 215, 0, 0.3)",
    overlayGradient: "linear-gradient(180deg, transparent 60%, rgba(255, 215, 0, 0.08) 100%)",
  },
  concerned: {
    eyeScale: 1.1,
    eyebrowOffset: 3,
    mouthCurve: -3,
    glowColor: "rgba(255, 140, 0, 0.25)",
    overlayGradient: "linear-gradient(180deg, rgba(255, 140, 0, 0.05) 0%, transparent 40%)",
  },
  thinking: {
    eyeScale: 1.05,
    eyebrowOffset: 2,
    mouthCurve: -1,
    glowColor: "rgba(147, 112, 219, 0.3)",
    overlayGradient: "linear-gradient(135deg, rgba(147, 112, 219, 0.05) 0%, transparent 50%)",
  },
  excited: {
    eyeScale: 1.15,
    eyebrowOffset: -3,
    mouthCurve: 10,
    glowColor: "rgba(255, 100, 150, 0.3)",
    overlayGradient: "radial-gradient(circle at 50% 40%, rgba(255, 100, 150, 0.1) 0%, transparent 60%)",
  },
  calm: {
    eyeScale: 0.95,
    eyebrowOffset: 0,
    mouthCurve: 2,
    glowColor: "rgba(100, 200, 255, 0.25)",
    overlayGradient: "linear-gradient(180deg, transparent 50%, rgba(100, 200, 255, 0.05) 100%)",
  },
  alert: {
    eyeScale: 1.2,
    eyebrowOffset: -1,
    mouthCurve: 0,
    glowColor: "rgba(255, 80, 80, 0.3)",
    overlayGradient: "radial-gradient(circle at 50% 30%, rgba(255, 80, 80, 0.1) 0%, transparent 50%)",
  },
};

export function AvatarEmotions({ emotion, intensity = 1 }: AvatarEmotionsProps) {
  const config = emotionConfigs[emotion];
  const [prevEmotion, setPrevEmotion] = useState(emotion);

  useEffect(() => {
    if (emotion !== prevEmotion) {
      setPrevEmotion(emotion);
    }
  }, [emotion, prevEmotion]);

  return (
    <>
      {/* Emotion overlay gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-15 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: intensity,
          background: config.overlayGradient,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Eye expression overlay - subtle highlights */}
      <motion.div
        className="absolute pointer-events-none z-16"
        style={{
          top: "28%",
          left: "25%",
          right: "25%",
          height: "15%",
        }}
        animate={{
          scaleY: config.eyeScale,
          y: config.eyebrowOffset * intensity,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Left eye highlight */}
        <motion.div
          className="absolute left-[15%] w-3 h-3 rounded-full"
          style={{
            background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Right eye highlight */}
        <motion.div
          className="absolute right-[15%] w-3 h-3 rounded-full"
          style={{
            background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>

      {/* Mouth curve indicator */}
      <motion.div
        className="absolute pointer-events-none z-16"
        style={{
          bottom: "26%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <motion.div
          className="w-8 h-4 overflow-hidden"
          animate={{
            scaleY: 1 + config.mouthCurve * 0.02 * intensity,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {emotion === "happy" || emotion === "excited" ? (
            <motion.div
              className="w-full h-full rounded-b-full"
              style={{
                background: "rgba(255, 200, 180, 0.15)",
                boxShadow: "inset 0 -2px 4px rgba(255, 180, 150, 0.2)",
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ) : null}
        </motion.div>
      </motion.div>

      {/* Emotion-specific particles/effects */}
      <AnimatePresence>
        {emotion === "excited" && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 rounded-full bg-primary"
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: [0, (i - 1) * 30],
                  y: [0, -20 - i * 10],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
                style={{
                  top: "30%",
                  left: "50%",
                }}
              />
            ))}
          </>
        )}
        
        {emotion === "thinking" && (
          <motion.div
            className="absolute -right-2 top-[20%] flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`dot-${i}`}
                className="w-1.5 h-1.5 rounded-full bg-secondary/60"
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        )}
        
        {emotion === "alert" && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              boxShadow: [
                "inset 0 0 20px rgba(255, 80, 80, 0.2)",
                "inset 0 0 40px rgba(255, 80, 80, 0.3)",
                "inset 0 0 20px rgba(255, 80, 80, 0.2)",
              ],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>

      {/* Ambient emotion glow */}
      <motion.div
        className="absolute -inset-2 rounded-full pointer-events-none"
        animate={{
          boxShadow: `0 0 30px ${config.glowColor}`,
          opacity: 0.5 * intensity,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </>
  );
}

/**
 * Analyze text sentiment to determine emotion
 */
export function analyzeSentiment(text: string): EmotionType {
  const lowerText = text.toLowerCase();
  
  // Check for excitement/positive
  if (/(!{2,}|amazing|excellent|fantastic|great news|congratulations|wonderful)/i.test(lowerText)) {
    return "excited";
  }
  
  // Check for happiness
  if (/happy|glad|pleased|good|nice|well done|success|achieved/i.test(lowerText)) {
    return "happy";
  }
  
  // Check for concern/warning
  if (/concern|warning|careful|issue|problem|risk|attention|alert|urgent/i.test(lowerText)) {
    return "concerned";
  }
  
  // Check for alertness
  if (/immediately|critical|emergency|now|important|asap/i.test(lowerText)) {
    return "alert";
  }
  
  // Check for thinking/processing
  if (/think|consider|analyze|processing|calculating|evaluating|let me/i.test(lowerText)) {
    return "thinking";
  }
  
  // Check for calm/reassurance
  if (/calm|relax|steady|stable|normal|routine|fine|okay/i.test(lowerText)) {
    return "calm";
  }
  
  return "neutral";
}

/**
 * Hook to track and analyze conversation sentiment
 */
export function useEmotionFromSentiment(lastMessage: string | null) {
  const [emotion, setEmotion] = useState<EmotionType>("neutral");
  const [intensity, setIntensity] = useState(0.7);

  useEffect(() => {
    if (lastMessage) {
      const newEmotion = analyzeSentiment(lastMessage);
      setEmotion(newEmotion);
      
      // Vary intensity based on message characteristics
      const exclamationCount = (lastMessage.match(/!/g) || []).length;
      const capsRatio = (lastMessage.match(/[A-Z]/g) || []).length / lastMessage.length;
      setIntensity(Math.min(0.5 + exclamationCount * 0.1 + capsRatio, 1));
    }
  }, [lastMessage]);

  return { emotion, intensity };
}
