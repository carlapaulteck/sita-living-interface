import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, useAnimationControls, AnimationControls } from 'framer-motion';
import { cn } from '@/lib/utils';

// Breathing rate: 6 breaths per minute = 10 seconds per breath cycle
const BREATH_DURATION = 10;

interface BreathingContextType {
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  intensity: number;
  setIntensity: (intensity: number) => void;
  breathPhase: 'inhale' | 'exhale';
}

const BreathingContext = createContext<BreathingContextType | null>(null);

export function BreathingProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setEnabled] = useState(true);
  const [intensity, setIntensity] = useState(0.5); // 0-1 scale
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setEnabled(false);
    }
  }, []);

  // Breathing cycle
  useEffect(() => {
    if (!isEnabled) return;

    const halfCycle = (BREATH_DURATION / 2) * 1000;
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'));
    }, halfCycle);

    return () => clearInterval(interval);
  }, [isEnabled]);

  return (
    <BreathingContext.Provider
      value={{ isEnabled, setEnabled, intensity, setIntensity, breathPhase }}
    >
      {children}
    </BreathingContext.Provider>
  );
}

export function useBreathing() {
  const context = useContext(BreathingContext);
  if (!context) {
    throw new Error('useBreathing must be used within a BreathingProvider');
  }
  return context;
}

interface BreathingElementProps {
  children: ReactNode;
  className?: string;
  scaleRange?: [number, number]; // [min, max] scale values
  opacityRange?: [number, number]; // [min, max] opacity values
  disabled?: boolean;
}

export function BreathingElement({
  children,
  className,
  scaleRange = [1, 1.02],
  opacityRange = [0.95, 1],
  disabled = false,
}: BreathingElementProps) {
  const { isEnabled, intensity, breathPhase } = useBreathing();

  if (!isEnabled || disabled) {
    return <div className={className}>{children}</div>;
  }

  const scaleValue =
    breathPhase === 'inhale'
      ? scaleRange[0] + (scaleRange[1] - scaleRange[0]) * intensity
      : scaleRange[0];

  const opacityValue =
    breathPhase === 'inhale'
      ? opacityRange[1]
      : opacityRange[0] + (opacityRange[1] - opacityRange[0]) * (1 - intensity);

  return (
    <motion.div
      animate={{
        scale: scaleValue,
        opacity: opacityValue,
      }}
      transition={{
        duration: BREATH_DURATION / 2,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Breathing glow effect
interface BreathingGlowProps {
  color?: string;
  intensity?: number;
  className?: string;
}

export function BreathingGlow({
  color = 'hsl(var(--primary))',
  intensity = 0.3,
  className,
}: BreathingGlowProps) {
  const { isEnabled, breathPhase } = useBreathing();

  if (!isEnabled) return null;

  return (
    <motion.div
      animate={{
        boxShadow:
          breathPhase === 'inhale'
            ? `0 0 60px ${color.replace(')', ` / ${intensity})`).replace('hsl(', 'hsla(')}, 0 0 100px ${color.replace(')', ` / ${intensity * 0.5})`).replace('hsl(', 'hsla(')}`
            : `0 0 30px ${color.replace(')', ` / ${intensity * 0.3})`).replace('hsl(', 'hsla(')}`,
      }}
      transition={{
        duration: BREATH_DURATION / 2,
        ease: 'easeInOut',
      }}
      className={cn('absolute inset-0 rounded-inherit pointer-events-none', className)}
    />
  );
}

// Breathing background opacity wave
export function BreathingBackground({ className }: { className?: string }) {
  const { isEnabled, breathPhase, intensity } = useBreathing();

  if (!isEnabled) return null;

  return (
    <motion.div
      animate={{
        opacity: breathPhase === 'inhale' ? 0.06 * intensity : 0.03 * intensity,
      }}
      transition={{
        duration: BREATH_DURATION / 2,
        ease: 'easeInOut',
      }}
      className={cn(
        'fixed inset-0 pointer-events-none z-0',
        'bg-gradient-radial from-primary/10 via-transparent to-transparent',
        className
      )}
    />
  );
}

// Breathing border pulse
interface BreathingBorderProps {
  children: ReactNode;
  className?: string;
}

export function BreathingBorder({ children, className }: BreathingBorderProps) {
  const { isEnabled, breathPhase, intensity } = useBreathing();

  return (
    <motion.div
      animate={
        isEnabled
          ? {
              borderColor:
                breathPhase === 'inhale'
                  ? `hsl(var(--primary) / ${0.2 + 0.3 * intensity})`
                  : `hsl(var(--border) / ${0.5 + 0.2 * intensity})`,
            }
          : {}
      }
      transition={{
        duration: BREATH_DURATION / 2,
        ease: 'easeInOut',
      }}
      className={cn('border rounded-xl transition-colors', className)}
    >
      {children}
    </motion.div>
  );
}

// Breathing indicator - shows the current breath phase
export function BreathingIndicator({ className }: { className?: string }) {
  const { isEnabled, breathPhase, setEnabled } = useBreathing();

  return (
    <motion.button
      onClick={() => setEnabled(!isEnabled)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative w-8 h-8 rounded-full',
        'bg-card border border-border/50',
        'flex items-center justify-center',
        'cursor-pointer',
        className
      )}
      title={isEnabled ? 'Disable breathing UI' : 'Enable breathing UI'}
    >
      <motion.div
        animate={
          isEnabled
            ? {
                scale: breathPhase === 'inhale' ? 1.3 : 0.8,
                opacity: breathPhase === 'inhale' ? 1 : 0.5,
              }
            : { scale: 1, opacity: 0.3 }
        }
        transition={{
          duration: BREATH_DURATION / 2,
          ease: 'easeInOut',
        }}
        className={cn(
          'w-3 h-3 rounded-full',
          isEnabled ? 'bg-primary' : 'bg-muted-foreground'
        )}
      />
    </motion.button>
  );
}

export default BreathingProvider;
