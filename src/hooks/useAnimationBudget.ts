import { useState, useEffect, useCallback, useMemo } from 'react';

interface AnimationBudgetConfig {
  maxConcurrentAnimations: number;
  reduceOnLowBattery: boolean;
  reduceOnSlowConnection: boolean;
  respectReducedMotion: boolean;
  performanceThreshold: number; // FPS threshold
}

interface AnimationBudgetState {
  isReduced: boolean;
  level: 'full' | 'medium' | 'minimal' | 'none';
  allowParticles: boolean;
  allow3D: boolean;
  allowComplexTransitions: boolean;
  maxParticleCount: number;
  transitionDuration: number;
}

const DEFAULT_CONFIG: AnimationBudgetConfig = {
  maxConcurrentAnimations: 8,
  reduceOnLowBattery: true,
  reduceOnSlowConnection: true,
  respectReducedMotion: true,
  performanceThreshold: 30,
};

export function useAnimationBudget(config: Partial<AnimationBudgetConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [state, setState] = useState<AnimationBudgetState>({
    isReduced: false,
    level: 'full',
    allowParticles: true,
    allow3D: true,
    allowComplexTransitions: true,
    maxParticleCount: 50,
    transitionDuration: 0.3,
  });

  // Check for reduced motion preference
  useEffect(() => {
    if (!finalConfig.respectReducedMotion) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setState({
          isReduced: true,
          level: 'none',
          allowParticles: false,
          allow3D: false,
          allowComplexTransitions: false,
          maxParticleCount: 0,
          transitionDuration: 0,
        });
      }
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [finalConfig.respectReducedMotion]);

  // Check battery status
  useEffect(() => {
    if (!finalConfig.reduceOnLowBattery || !('getBattery' in navigator)) return;

    const checkBattery = async () => {
      try {
        // @ts-ignore - getBattery is not in the standard types
        const battery = await navigator.getBattery();
        
        const updateBatteryState = () => {
          if (battery.level < 0.2 && !battery.charging) {
            setState((prev) => ({
              ...prev,
              isReduced: true,
              level: 'minimal',
              allowParticles: false,
              allow3D: false,
              maxParticleCount: 10,
              transitionDuration: 0.15,
            }));
          }
        };

        updateBatteryState();
        battery.addEventListener('levelchange', updateBatteryState);
        battery.addEventListener('chargingchange', updateBatteryState);
      } catch {
        // Battery API not supported
      }
    };

    checkBattery();
  }, [finalConfig.reduceOnLowBattery]);

  // Check connection speed
  useEffect(() => {
    if (!finalConfig.reduceOnSlowConnection) return;

    const connection = (navigator as any).connection;
    if (!connection) return;

    const updateConnectionState = () => {
      const isSlowConnection = 
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' ||
        connection.saveData;

      if (isSlowConnection) {
        setState((prev) => ({
          ...prev,
          isReduced: true,
          level: prev.level === 'none' ? 'none' : 'medium',
          allowParticles: false,
          maxParticleCount: 15,
          transitionDuration: 0.2,
        }));
      }
    };

    updateConnectionState();
    connection.addEventListener('change', updateConnectionState);
    return () => connection.removeEventListener('change', updateConnectionState);
  }, [finalConfig.reduceOnSlowConnection]);

  // Monitor frame rate and adjust dynamically
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;
    let lowFpsCount = 0;

    const measureFps = () => {
      frameCount++;
      const now = performance.now();
      
      if (now - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = now;

        if (fps < finalConfig.performanceThreshold) {
          lowFpsCount++;
          if (lowFpsCount >= 3) {
            // Consistently low FPS, reduce animations
            setState((prev) => {
              if (prev.level === 'full') {
                return {
                  ...prev,
                  level: 'medium',
                  maxParticleCount: 25,
                  transitionDuration: 0.2,
                };
              } else if (prev.level === 'medium') {
                return {
                  ...prev,
                  level: 'minimal',
                  allowParticles: false,
                  allow3D: false,
                  maxParticleCount: 10,
                  transitionDuration: 0.15,
                };
              }
              return prev;
            });
          }
        } else {
          lowFpsCount = Math.max(0, lowFpsCount - 1);
        }
      }

      rafId = requestAnimationFrame(measureFps);
    };

    rafId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(rafId);
  }, [finalConfig.performanceThreshold]);

  // Get animation props based on budget
  const getAnimationProps = useCallback((complexity: 'simple' | 'medium' | 'complex') => {
    if (state.level === 'none') {
      return { animate: false, transition: { duration: 0 } };
    }

    if (state.level === 'minimal') {
      if (complexity === 'complex') return { animate: false };
      return { transition: { duration: state.transitionDuration } };
    }

    if (state.level === 'medium') {
      if (complexity === 'complex') {
        return { transition: { duration: state.transitionDuration } };
      }
      return { transition: { duration: state.transitionDuration } };
    }

    // Full animations
    return {
      transition: { 
        duration: complexity === 'complex' ? 0.5 : state.transitionDuration,
        type: complexity === 'simple' ? 'tween' : 'spring',
      },
    };
  }, [state]);

  // Memoized return value
  return useMemo(() => ({
    ...state,
    getAnimationProps,
    shouldAnimate: state.level !== 'none',
    particleCount: state.maxParticleCount,
  }), [state, getAnimationProps]);
}

// Simple hook for checking reduced motion
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
