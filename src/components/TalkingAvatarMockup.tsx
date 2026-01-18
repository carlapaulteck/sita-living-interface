import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import avatarImage from "@/assets/avatar.jpg";
import { HaloRings } from "./HaloRings";
import { AvatarLipSync, AvatarEyeBlink } from "./AvatarLipSync";
import { MoodAura } from "./MoodAura";
import { useAvatarStateSafe, AvatarState } from "@/contexts/AvatarStateContext";

interface TalkingAvatarMockupProps {
  onAvatarClick?: () => void;
  externalState?: AvatarState;
  externalAudioLevel?: number;
}

export function TalkingAvatarMockup({ 
  onAvatarClick, 
  externalState,
  externalAudioLevel 
}: TalkingAvatarMockupProps) {
  const avatarContext = useAvatarStateSafe();
  
  // Use external state if provided, otherwise use context, fallback to idle
  const state = externalState ?? avatarContext?.state ?? "idle";
  const audioLevel = externalAudioLevel ?? avatarContext?.audioLevel ?? 0;

  const [hasGreeted, setHasGreeted] = useState(false);
  const [showGreetingText, setShowGreetingText] = useState(false);
  const [simulatedAudioLevel, setSimulatedAudioLevel] = useState(0);

  // Simulate audio levels when speaking for visual effect
  useEffect(() => {
    if (state === "speaking" || state === "greeting") {
      const interval = setInterval(() => {
        setSimulatedAudioLevel(Math.random() * 0.7 + 0.3);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setSimulatedAudioLevel(0);
    }
  }, [state]);

  // Trigger greeting animation on first load
  useEffect(() => {
    if (!hasGreeted) {
      const timer = setTimeout(() => {
        if (avatarContext?.triggerGreeting) {
          avatarContext.triggerGreeting();
        }
        setShowGreetingText(true);
        setHasGreeted(true);
        
        // Hide greeting text after a few seconds
        setTimeout(() => setShowGreetingText(false), 3000);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasGreeted, avatarContext]);

  const effectiveAudioLevel = audioLevel || simulatedAudioLevel;

  // Breathing animation scale
  const breathingScale = state === "idle" ? [1, 1.02, 1] : 1;

  return (
    <div className="relative flex items-center justify-center">
      {/* Mood-based Aura from cognitive state */}
      <MoodAura />
      
      {/* Halo Rings System */}
      <HaloRings state={state} audioLevel={effectiveAudioLevel} />

      {/* Avatar Container with breathing animation */}
      <motion.div
        className="relative z-10 cursor-pointer"
        onClick={onAvatarClick}
        animate={{
          scale: breathingScale,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Outer glow based on state */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{
            background: state === "speaking" || state === "greeting"
              ? "radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)"
              : state === "listening"
              ? "radial-gradient(circle, rgba(147, 112, 219, 0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%)",
          }}
          animate={{
            opacity: state !== "idle" ? [0.5, 1, 0.5] : 0.3,
            scale: state !== "idle" ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Avatar image container */}
        <div className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-accent/30">
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 z-20 pointer-events-none" />
          
          {/* State-based color overlay */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: state === "speaking" || state === "greeting"
                ? "linear-gradient(180deg, transparent 50%, rgba(255, 215, 0, 0.1) 100%)"
                : state === "listening"
                ? "linear-gradient(180deg, transparent 50%, rgba(147, 112, 219, 0.1) 100%)"
                : "transparent",
            }}
            animate={{
              opacity: state !== "idle" ? [0.3, 0.6, 0.3] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Avatar Image */}
          <img 
            src={avatarImage} 
            alt="AI Avatar" 
            className="w-full h-full object-cover object-top scale-110"
          />

          {/* Lip sync overlay */}
          <AvatarLipSync state={state} audioLevel={effectiveAudioLevel} />
          
          {/* Eye blink overlay */}
          <AvatarEyeBlink state={state} />
        </div>

        {/* Status indicator ring */}
        <motion.div
          className="absolute -inset-1 rounded-full border-2"
          style={{
            borderColor: state === "speaking" || state === "greeting"
              ? "rgba(255, 215, 0, 0.6)"
              : state === "listening"
              ? "rgba(147, 112, 219, 0.6)"
              : "rgba(0, 255, 255, 0.3)",
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: state !== "idle" ? 1 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Greeting text bubble */}
      <AnimatePresence>
        {showGreetingText && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="px-4 py-2 rounded-2xl bg-card/80 backdrop-blur-sm border border-primary/20 shadow-lg">
              <p className="text-sm text-foreground">
                <span className="text-primary">Hello</span>, ready when you are.
              </p>
            </div>
            {/* Speech bubble pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-card/80 border-l border-t border-primary/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* State indicator label */}
      <AnimatePresence>
        {state === "listening" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30">
              <motion.div
                className="w-2 h-2 rounded-full bg-secondary"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs text-secondary">Listening...</span>
            </div>
          </motion.div>
        )}
        {(state === "speaking" || state === "greeting") && !showGreetingText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
              <motion.div
                className="flex gap-0.5"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{
                      height: [4, 12, 4],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
              <span className="text-xs text-primary">Speaking...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkle effects */}
      <motion.div
        className="absolute -top-2 right-8 w-2 h-2 rounded-full bg-primary"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute top-12 -left-4 w-1.5 h-1.5 rounded-full bg-secondary"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-8 -right-2 w-1 h-1 rounded-full bg-accent"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 1.5,
        }}
      />
    </div>
  );
}
