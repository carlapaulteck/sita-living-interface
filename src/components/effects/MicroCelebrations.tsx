import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

// Confetti burst celebration
export function ConfettiBurst({ 
  trigger, 
  duration = 3000,
  colors = ['#E8C27B', '#9370DB', '#64D2E6', '#FFD700', '#FF6B6B']
}: { 
  trigger: boolean; 
  duration?: number;
  colors?: string[];
}) {
  const [isActive, setIsActive] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  if (!isActive) return null;

  return (
    <Confetti
      width={windowSize.width}
      height={windowSize.height}
      colors={colors}
      recycle={false}
      numberOfPieces={200}
      gravity={0.3}
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  );
}

// Sparkle effect for achievements
export function SparkleEffect({ 
  trigger,
  x = '50%',
  y = '50%',
}: { 
  trigger: boolean;
  x?: string | number;
  y?: string | number;
}) {
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; distance: number }>>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i * 30) + Math.random() * 15,
        distance: 30 + Math.random() * 40,
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 pointer-events-none"
          style={{ left: x, top: y }}
          initial={{ 
            scale: 0, 
            opacity: 1,
            x: 0,
            y: 0,
          }}
          animate={{ 
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            x: Math.cos(particle.angle * Math.PI / 180) * particle.distance,
            y: Math.sin(particle.angle * Math.PI / 180) * particle.distance,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full fill-primary">
            <polygon points="12,2 15,10 24,10 17,15 19,24 12,19 5,24 7,15 0,10 9,10" />
          </svg>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

// Streak flame animation
export function StreakFlame({ 
  streakCount,
  size = 'md',
}: { 
  streakCount: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  if (streakCount < 1) return null;

  return (
    <motion.div 
      className={`relative ${sizeClasses[size]}`}
      animate={{ 
        scale: [1, 1.1, 1],
      }}
      transition={{ 
        duration: 0.8, 
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Flame SVG */}
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <defs>
          <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--destructive))" />
            <stop offset="50%" stopColor="hsl(var(--brand-gold))" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold-light))" />
          </linearGradient>
        </defs>
        <motion.path
          d="M12 2C12 2 7 8 7 12C7 15 9 18 12 18C15 18 17 15 17 12C17 8 12 2 12 2Z"
          fill="url(#flameGradient)"
          animate={{
            d: [
              "M12 2C12 2 7 8 7 12C7 15 9 18 12 18C15 18 17 15 17 12C17 8 12 2 12 2Z",
              "M12 2C12 2 6 9 6 13C6 16 9 19 12 19C15 19 18 16 18 13C18 9 12 2 12 2Z",
              "M12 2C12 2 7 8 7 12C7 15 9 18 12 18C15 18 17 15 17 12C17 8 12 2 12 2Z",
            ],
          }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      </svg>
      
      {/* Streak count badge */}
      <motion.div
        className="absolute -bottom-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        {streakCount}
      </motion.div>
    </motion.div>
  );
}

// Level up cinematic
export function LevelUpCinematic({ 
  trigger,
  level,
  onComplete,
}: { 
  trigger: boolean;
  level: number;
  onComplete?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Radial glow backdrop */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 3, times: [0, 0.3, 1] }}
            style={{
              background: 'radial-gradient(circle, hsl(var(--brand-gold) / 0.3), transparent 70%)',
            }}
          />
          
          {/* Level badge */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ 
              scale: [0, 1.5, 1],
              rotateY: [180, 0, 0],
            }}
            transition={{ 
              duration: 1,
              times: [0, 0.6, 1],
              ease: 'easeOut',
            }}
          >
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1">
              <div className="w-full h-full rounded-full bg-background flex flex-col items-center justify-center">
                <motion.span
                  className="text-sm text-muted-foreground uppercase tracking-wider"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Level
                </motion.span>
                <motion.span
                  className="text-4xl font-bold gradient-text-gold"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                >
                  {level}
                </motion.span>
              </div>
            </div>
            
            {/* Orbiting particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-primary"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, Math.cos((i * 45) * Math.PI / 180) * 80],
                  y: [0, Math.sin((i * 45) * Math.PI / 180) * 80],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3 + i * 0.05,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
          
          {/* "LEVEL UP!" text */}
          <motion.div
            className="absolute bottom-1/3 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h2 className="text-2xl font-display font-bold gradient-text-gold">
              LEVEL UP!
            </h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
