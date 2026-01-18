import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  rotationSpeed: number;
  shape: "square" | "circle" | "star";
}

interface ConfettiCelebrationProps {
  isActive: boolean;
  duration?: number;
  onComplete?: () => void;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(45, 100%, 60%)",  // Gold
  "hsl(280, 80%, 65%)",  // Purple
  "hsl(170, 70%, 50%)",  // Teal
  "hsl(340, 85%, 60%)",  // Pink
];

export function ConfettiCelebration({ 
  isActive, 
  duration = 4000,
  onComplete 
}: ConfettiCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const velocity = 8 + Math.random() * 12;
      
      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20, // Start near center
        y: 40 + (Math.random() - 0.5) * 10,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 8,
        velocity: {
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity - 5, // Slight upward bias
        },
        rotationSpeed: (Math.random() - 0.5) * 20,
        shape: ["square", "circle", "star"][Math.floor(Math.random() * 3)] as Particle["shape"],
      });
    }

    return newParticles;
  }, []);

  useEffect(() => {
    if (isActive) {
      setParticles(createParticles());
      setShowMessage(true);

      const messageTimer = setTimeout(() => {
        setShowMessage(false);
      }, duration - 1000);

      const completeTimer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => {
        clearTimeout(messageTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isActive, createParticles, duration, onComplete]);

  if (!isActive && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Confetti particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              rotate: particle.rotation,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              left: `${particle.x + particle.velocity.x * 8}%`,
              top: `${particle.y + particle.velocity.y * 8 + 60}%`, // Gravity effect
              rotate: particle.rotation + particle.rotationSpeed * 20,
              scale: 1,
              opacity: 0,
            }}
            transition={{
              duration: 3 + Math.random(),
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute"
            style={{
              width: particle.size,
              height: particle.size,
            }}
          >
            {particle.shape === "circle" ? (
              <div 
                className="w-full h-full rounded-full"
                style={{ backgroundColor: particle.color }}
              />
            ) : particle.shape === "star" ? (
              <svg 
                viewBox="0 0 24 24" 
                className="w-full h-full"
                style={{ fill: particle.color }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ) : (
              <div 
                className="w-full h-full rounded-sm"
                style={{ backgroundColor: particle.color }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Celebration message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15 
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-6xl sm:text-8xl mb-4"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-4xl font-display font-bold bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent"
              >
                Welcome to Alpha Vision!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground mt-2 text-sm sm:text-base"
              >
                Your personalized experience is ready
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Radial glow effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.3, 0], scale: [0.5, 1.5, 2] }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"
        style={{
          background: "radial-gradient(circle at 50% 40%, hsl(var(--primary) / 0.2) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
