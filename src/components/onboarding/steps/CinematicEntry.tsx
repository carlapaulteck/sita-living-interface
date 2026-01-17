import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useOnboarding } from "../OnboardingContext";
import { SitaOrb3D } from "@/components/SitaOrb3D";
import logoImage from "@/assets/logo.jpg";

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
      {/* Logo with glow */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow effect behind logo */}
        <div className="absolute inset-0 w-64 h-64 bg-gradient-to-b from-secondary/40 via-primary/30 to-transparent rounded-full blur-3xl scale-150" />
        
        {/* Logo or Orb */}
        <div className="relative w-64 h-64">
          <SitaOrb3D state={phase === "assembling" ? "listening" : "idle"} />
        </div>
      </motion.div>

      {/* Brand text */}
      <motion.h1
        className="text-3xl sm:text-4xl font-display font-semibold mb-3 bg-gradient-to-b from-secondary via-primary/80 to-primary bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase === "ready" ? 1 : 0, y: phase === "ready" ? 0 : 20 }}
        transition={{ duration: 0.6 }}
      >
        Alpha Vision Method
      </motion.h1>

      <motion.p
        className="text-xl sm:text-2xl font-display text-foreground/70 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase === "ready" ? 1 : 0, y: phase === "ready" ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        One touch to connect your world.
      </motion.p>

      <motion.button
        onClick={nextStep}
        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-secondary via-primary/80 to-primary text-primary-foreground font-medium text-lg transition-all hover:shadow-lg hover:shadow-primary/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase === "ready" ? 1 : 0, y: phase === "ready" ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        Begin Your Journey
      </motion.button>
    </motion.div>
  );
}
