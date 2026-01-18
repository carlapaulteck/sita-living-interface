import { motion } from "framer-motion";
import { AvatarState } from "@/contexts/AvatarStateContext";

interface HaloRingsProps {
  state: AvatarState;
  audioLevel?: number;
}

export function HaloRings({ state, audioLevel = 0 }: HaloRingsProps) {
  const isActive = state === "speaking" || state === "listening" || state === "greeting";
  const isSpeaking = state === "speaking" || state === "greeting";
  const isListening = state === "listening";

  // Dynamic scale based on audio level for speaking
  const audioScale = isSpeaking ? 1 + audioLevel * 0.15 : 1;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outermost glow ring - slowest pulse */}
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background: `radial-gradient(circle, transparent 60%, ${
            isSpeaking ? "rgba(255, 215, 0, 0.15)" : 
            isListening ? "rgba(147, 112, 219, 0.15)" : 
            "rgba(0, 255, 255, 0.08)"
          } 100%)`,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary expanding ring */}
      <motion.div
        className="absolute w-72 h-72 rounded-full border"
        style={{
          borderColor: isSpeaking 
            ? "rgba(255, 215, 0, 0.25)" 
            : isListening 
            ? "rgba(147, 112, 219, 0.25)" 
            : "rgba(0, 255, 255, 0.15)",
          boxShadow: isSpeaking
            ? "0 0 40px rgba(255, 215, 0, 0.2), inset 0 0 30px rgba(255, 215, 0, 0.05)"
            : isListening
            ? "0 0 40px rgba(147, 112, 219, 0.2), inset 0 0 30px rgba(147, 112, 219, 0.05)"
            : "0 0 30px rgba(0, 255, 255, 0.1), inset 0 0 20px rgba(0, 255, 255, 0.03)",
        }}
        animate={{
          scale: isActive ? [1, 1.05 * audioScale, 1] : [1, 1.02, 1],
          opacity: isActive ? [0.6, 1, 0.6] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: isActive ? 2 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Primary halo ring - cyan glow */}
      <motion.div
        className="absolute w-60 h-60 rounded-full border-2"
        style={{
          borderColor: isSpeaking 
            ? "rgba(255, 215, 0, 0.5)" 
            : isListening 
            ? "rgba(147, 112, 219, 0.5)" 
            : "rgba(0, 255, 255, 0.4)",
          boxShadow: isSpeaking
            ? "0 0 50px rgba(255, 215, 0, 0.4), 0 0 100px rgba(255, 215, 0, 0.2), inset 0 0 40px rgba(255, 215, 0, 0.1)"
            : isListening
            ? "0 0 50px rgba(147, 112, 219, 0.4), 0 0 100px rgba(147, 112, 219, 0.2), inset 0 0 40px rgba(147, 112, 219, 0.1)"
            : "0 0 40px rgba(0, 255, 255, 0.3), 0 0 80px rgba(0, 255, 255, 0.15), inset 0 0 30px rgba(0, 255, 255, 0.05)",
        }}
        animate={{
          scale: isActive ? [1, 1.03 * audioScale, 1] : [1, 1.01, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: isActive ? 1.5 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner decorative ring */}
      <motion.div
        className="absolute w-52 h-52 rounded-full border"
        style={{
          borderColor: isSpeaking 
            ? "rgba(255, 215, 0, 0.2)" 
            : isListening 
            ? "rgba(147, 112, 219, 0.2)" 
            : "rgba(0, 255, 255, 0.15)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Holographic shimmer effect */}
      <motion.div
        className="absolute w-64 h-64 rounded-full overflow-hidden"
        style={{ opacity: 0.3 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 0deg, 
              transparent, 
              ${isSpeaking ? "rgba(255, 215, 0, 0.3)" : "rgba(0, 255, 255, 0.2)"}, 
              transparent, 
              ${isSpeaking ? "rgba(255, 215, 0, 0.3)" : "rgba(147, 112, 219, 0.2)"}, 
              transparent)`,
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Orbiting particle sparkles */}
      {[0, 72, 144, 216, 288].map((startAngle, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: i % 2 === 0 
              ? "linear-gradient(135deg, #FFD700, #FFA500)" 
              : "linear-gradient(135deg, #00FFFF, #4ADEDE)",
            boxShadow: i % 2 === 0 
              ? "0 0 8px rgba(255, 215, 0, 0.8)" 
              : "0 0 8px rgba(0, 255, 255, 0.8)",
          }}
          animate={{
            rotate: [startAngle, startAngle + 360],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
          initial={{ x: 0, y: 0 }}
          custom={i}
        >
          <motion.div
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              transform: `translateX(${110 + i * 8}px)`,
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}

      {/* Floating ambient particles */}
      {isActive && [...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: `${30 + Math.random() * 40}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
