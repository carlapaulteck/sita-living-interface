import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useOnboarding } from "../OnboardingContext";
import { SitaOrb3D } from "@/components/SitaOrb3D";

export function CinematicEntry() {
  const { nextStep } = useOnboarding();
  const [phase, setPhase] = useState<"assembling" | "ready">("assembling");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("ready");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center min-h-[80vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-80 h-80 mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <SitaOrb3D state={phase === "assembling" ? "listening" : "idle"} />
      </motion.div>

      <motion.p
        className="text-2xl font-display text-foreground/80 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase === "ready" ? 1 : 0, y: phase === "ready" ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        One touch to connect your world.
      </motion.p>

      <motion.button
        onClick={nextStep}
        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium text-lg transition-all hover:scale-105 hover:shadow-glow-gold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase === "ready" ? 1 : 0, y: phase === "ready" ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}
