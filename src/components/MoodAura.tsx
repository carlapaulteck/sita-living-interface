import { motion } from "framer-motion";
import { CognitiveState } from "@/lib/cognitiveEngine";
import { useCognitiveState } from "@/hooks/useCognitiveState";

interface MoodAuraProps {
  /** Override cognitive state for external control */
  cognitiveState?: CognitiveState;
  /** Override stress index (0-1) */
  stressIndex?: number;
  /** Override focus level (0-1) */
  focusLevel?: number;
  /** Override cognitive budget (0-1) */
  cognitiveBudget?: number;
}

// Color palettes for different cognitive states
const MOOD_COLORS: Record<CognitiveState, { primary: string; secondary: string; glow: string }> = {
  neutral: {
    primary: "rgba(0, 255, 255, 0.2)",
    secondary: "rgba(147, 112, 219, 0.15)",
    glow: "rgba(0, 255, 255, 0.3)",
  },
  flow: {
    primary: "rgba(50, 205, 50, 0.25)",
    secondary: "rgba(0, 255, 127, 0.2)",
    glow: "rgba(50, 205, 50, 0.4)",
  },
  distracted: {
    primary: "rgba(255, 165, 0, 0.2)",
    secondary: "rgba(255, 140, 0, 0.15)",
    glow: "rgba(255, 165, 0, 0.3)",
  },
  overload: {
    primary: "rgba(255, 69, 0, 0.25)",
    secondary: "rgba(255, 99, 71, 0.2)",
    glow: "rgba(255, 69, 0, 0.4)",
  },
  fatigued: {
    primary: "rgba(100, 149, 237, 0.2)",
    secondary: "rgba(65, 105, 225, 0.15)",
    glow: "rgba(100, 149, 237, 0.3)",
  },
  hyperfocus: {
    primary: "rgba(255, 215, 0, 0.3)",
    secondary: "rgba(255, 193, 7, 0.25)",
    glow: "rgba(255, 215, 0, 0.5)",
  },
  recovery: {
    primary: "rgba(152, 251, 152, 0.2)",
    secondary: "rgba(144, 238, 144, 0.15)",
    glow: "rgba(152, 251, 152, 0.3)",
  },
};

// Animation speeds based on cognitive state
const MOOD_SPEEDS: Record<CognitiveState, { pulse: number; rotate: number }> = {
  neutral: { pulse: 4, rotate: 60 },
  flow: { pulse: 3, rotate: 45 },
  distracted: { pulse: 2, rotate: 20 },
  overload: { pulse: 1.5, rotate: 15 },
  fatigued: { pulse: 6, rotate: 90 },
  hyperfocus: { pulse: 2.5, rotate: 30 },
  recovery: { pulse: 8, rotate: 120 },
};

export function MoodAura({
  cognitiveState: externalState,
  stressIndex: externalStress,
  focusLevel: externalFocus,
  cognitiveBudget: externalBudget,
}: MoodAuraProps) {
  const cognitive = useCognitiveState();
  
  // Use external values if provided, otherwise use context
  const state = externalState ?? cognitive.state;
  const stressIndex = externalStress ?? cognitive.stressIndex;
  const focusLevel = externalFocus ?? cognitive.focusLevel;
  const cognitiveBudget = externalBudget ?? cognitive.cognitiveBudget;

  const colors = MOOD_COLORS[state];
  const speeds = MOOD_SPEEDS[state];

  // Intensity based on metrics
  const intensity = Math.max(0.3, Math.min(1, focusLevel + (1 - stressIndex) * 0.3));
  const budgetOpacity = 0.3 + cognitiveBudget * 0.7;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Outer mood glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
          opacity: budgetOpacity,
        }}
        animate={{
          scale: [1, 1.1 * intensity, 1],
          opacity: [budgetOpacity * 0.8, budgetOpacity, budgetOpacity * 0.8],
        }}
        transition={{
          duration: speeds.pulse,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary rotating aura */}
      <motion.div
        className="absolute w-80 h-80"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: speeds.rotate,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, 
              transparent, 
              ${colors.secondary}, 
              transparent, 
              ${colors.primary}, 
              transparent)`,
            opacity: intensity * 0.6,
          }}
        />
      </motion.div>

      {/* Stress indicator ring */}
      {stressIndex > 0.5 && (
        <motion.div
          className="absolute w-72 h-72 rounded-full border-2"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderColor: `rgba(255, ${Math.round(255 - stressIndex * 200)}, 0, ${stressIndex * 0.5})`,
            boxShadow: `0 0 ${20 + stressIndex * 30}px rgba(255, ${Math.round(255 - stressIndex * 200)}, 0, ${stressIndex * 0.3})`,
          }}
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2 - stressIndex,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Focus spotlight */}
      {focusLevel > 0.7 && (
        <motion.div
          className="absolute w-48 h-48 rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 60%)`,
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Low budget warning pulse */}
      {cognitiveBudget < 0.3 && (
        <motion.div
          className="absolute w-64 h-64 rounded-full border"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderColor: "rgba(255, 165, 0, 0.4)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* State-specific particle effects */}
      {state === "flow" && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`flow-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #32CD32, #00FF7F)",
                boxShadow: "0 0 6px rgba(50, 205, 50, 0.8)",
                top: `${40 + Math.sin(i * 60) * 15}%`,
                left: `${40 + Math.cos(i * 60) * 15}%`,
              }}
              animate={{
                y: [-30, 30],
                x: [-15, 15],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      {state === "hyperfocus" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            className="w-32 h-32 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </motion.div>
      )}

      {state === "overload" && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`overload-${i}`}
              className="absolute w-full h-full"
              style={{
                background: `linear-gradient(${45 + i * 90}deg, transparent 45%, rgba(255, 69, 0, 0.1) 50%, transparent 55%)`,
              }}
              animate={{
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      {state === "recovery" && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(152, 251, 152, 0.1) 0%, transparent 50%)",
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}
