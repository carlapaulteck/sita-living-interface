import { useCallback, useRef, useEffect } from 'react';

interface HapticOptions {
  duration?: number;
  pattern?: number[];
}

export function useHaptics() {
  const isSupported = useRef(false);

  useEffect(() => {
    isSupported.current = 'vibrate' in navigator;
  }, []);

  const vibrate = useCallback((options: HapticOptions = {}) => {
    if (!isSupported.current) return;

    const { duration = 50, pattern } = options;
    
    try {
      if (pattern) {
        navigator.vibrate(pattern);
      } else {
        navigator.vibrate(duration);
      }
    } catch (error) {
      // Silently fail if vibration isn't allowed
      console.debug('Haptic feedback not available');
    }
  }, []);

  // Preset haptic patterns
  const light = useCallback(() => vibrate({ duration: 10 }), [vibrate]);
  const medium = useCallback(() => vibrate({ duration: 25 }), [vibrate]);
  const heavy = useCallback(() => vibrate({ duration: 50 }), [vibrate]);
  const success = useCallback(() => vibrate({ pattern: [10, 50, 10] }), [vibrate]);
  const error = useCallback(() => vibrate({ pattern: [50, 100, 50] }), [vibrate]);
  const warning = useCallback(() => vibrate({ pattern: [25, 50, 25] }), [vibrate]);
  const selection = useCallback(() => vibrate({ duration: 5 }), [vibrate]);
  const impact = useCallback(() => vibrate({ pattern: [0, 30] }), [vibrate]);

  return {
    isSupported: isSupported.current,
    vibrate,
    light,
    medium,
    heavy,
    success,
    error,
    warning,
    selection,
    impact,
  };
}
