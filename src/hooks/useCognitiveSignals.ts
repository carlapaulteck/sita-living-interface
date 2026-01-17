import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type SignalType = 
  | "keystroke_latency"
  | "scroll_velocity"
  | "mouse_entropy"
  | "click_hesitation"
  | "focus_duration"
  | "idle_time"
  | "tab_switches";

interface SignalBuffer {
  type: SignalType;
  value: number;
  context: Record<string, unknown>;
  timestamp: number;
}

interface CognitiveSignalsConfig {
  enabled?: boolean;
  bufferSize?: number;
  flushIntervalMs?: number;
  captureKeystrokes?: boolean;
  captureScroll?: boolean;
  captureMouse?: boolean;
  captureClicks?: boolean;
  captureFocus?: boolean;
}

const DEFAULT_CONFIG: CognitiveSignalsConfig = {
  enabled: true,
  bufferSize: 50,
  flushIntervalMs: 30000, // Flush every 30 seconds
  captureKeystrokes: true,
  captureScroll: true,
  captureMouse: false, // High frequency, opt-in
  captureClicks: true,
  captureFocus: true,
};

export function useCognitiveSignals(config: CognitiveSignalsConfig = {}) {
  const { user } = useAuth();
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [isCapturing, setIsCapturing] = useState(mergedConfig.enabled);
  const [signalCount, setSignalCount] = useState(0);
  
  const bufferRef = useRef<SignalBuffer[]>([]);
  const lastKeystrokeRef = useRef<number>(0);
  const lastScrollRef = useRef<{ time: number; position: number }>({ time: 0, position: 0 });
  const lastClickRef = useRef<number>(0);
  const focusStartRef = useRef<number>(Date.now());
  const mousePositionsRef = useRef<{ x: number; y: number; time: number }[]>([]);

  // Add signal to buffer
  const addSignal = useCallback((type: SignalType, value: number, context: Record<string, unknown> = {}) => {
    if (!isCapturing || !user) return;

    const signal: SignalBuffer = {
      type,
      value,
      context: {
        ...context,
        url: window.location.pathname,
        viewport: { width: window.innerWidth, height: window.innerHeight },
      },
      timestamp: Date.now(),
    };

    bufferRef.current.push(signal);
    setSignalCount(prev => prev + 1);

    // Auto-flush if buffer is full
    if (bufferRef.current.length >= (mergedConfig.bufferSize || 50)) {
      flushBuffer();
    }
  }, [isCapturing, user, mergedConfig.bufferSize]);

  // Flush buffer to database
  const flushBuffer = useCallback(async () => {
    if (!user || bufferRef.current.length === 0) return;

    const signals = [...bufferRef.current];
    bufferRef.current = [];

    try {
      const insertData = signals.map(signal => ({
        user_id: user.id,
        signal_type: signal.type,
        value: signal.value,
        context: JSON.parse(JSON.stringify(signal.context)),
      }));

      await supabase.from("cognitive_signals").insert(insertData);
    } catch (error) {
      console.error("Failed to flush cognitive signals:", error);
      // Re-add signals to buffer on failure
      bufferRef.current = [...signals, ...bufferRef.current];
    }
  }, [user]);

  // Keystroke latency tracking
  useEffect(() => {
    if (!isCapturing || !mergedConfig.captureKeystrokes) return;

    const handleKeydown = () => {
      const now = Date.now();
      if (lastKeystrokeRef.current > 0) {
        const latency = now - lastKeystrokeRef.current;
        // Only track reasonable latencies (20ms - 2000ms)
        if (latency >= 20 && latency <= 2000) {
          addSignal("keystroke_latency", latency);
        }
      }
      lastKeystrokeRef.current = now;
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isCapturing, mergedConfig.captureKeystrokes, addSignal]);

  // Scroll velocity tracking
  useEffect(() => {
    if (!isCapturing || !mergedConfig.captureScroll) return;

    const handleScroll = () => {
      const now = Date.now();
      const currentPosition = window.scrollY;
      
      if (lastScrollRef.current.time > 0) {
        const timeDelta = now - lastScrollRef.current.time;
        const positionDelta = Math.abs(currentPosition - lastScrollRef.current.position);
        
        if (timeDelta > 0 && timeDelta < 500) {
          const velocity = positionDelta / timeDelta; // pixels per ms
          addSignal("scroll_velocity", velocity, { direction: currentPosition > lastScrollRef.current.position ? "down" : "up" });
        }
      }
      
      lastScrollRef.current = { time: now, position: currentPosition };
    };

    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [isCapturing, mergedConfig.captureScroll, addSignal]);

  // Click hesitation tracking
  useEffect(() => {
    if (!isCapturing || !mergedConfig.captureClicks) return;

    let hoverStartTime = 0;

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.tagName === "A" || target.closest("button") || target.closest("a")) {
        hoverStartTime = Date.now();
      }
    };

    const handleClick = () => {
      const now = Date.now();
      if (hoverStartTime > 0) {
        const hesitation = now - hoverStartTime;
        if (hesitation > 0 && hesitation < 10000) {
          addSignal("click_hesitation", hesitation);
        }
      }
      lastClickRef.current = now;
      hoverStartTime = 0;
    };

    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [isCapturing, mergedConfig.captureClicks, addSignal]);

  // Mouse entropy tracking (opt-in, high frequency)
  useEffect(() => {
    if (!isCapturing || !mergedConfig.captureMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      mousePositionsRef.current.push({ x: e.clientX, y: e.clientY, time: now });

      // Keep only last 20 positions
      if (mousePositionsRef.current.length > 20) {
        mousePositionsRef.current.shift();
      }

      // Calculate entropy every 10 positions
      if (mousePositionsRef.current.length === 20) {
        const positions = mousePositionsRef.current;
        let totalVariance = 0;

        for (let i = 1; i < positions.length; i++) {
          const dx = positions[i].x - positions[i - 1].x;
          const dy = positions[i].y - positions[i - 1].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          totalVariance += distance;
        }

        const entropy = totalVariance / positions.length;
        addSignal("mouse_entropy", entropy);
        mousePositionsRef.current = [];
      }
    };

    const throttledMouseMove = throttle(handleMouseMove, 50);
    window.addEventListener("mousemove", throttledMouseMove);
    return () => window.removeEventListener("mousemove", throttledMouseMove);
  }, [isCapturing, mergedConfig.captureMouse, addSignal]);

  // Focus/blur tracking
  useEffect(() => {
    if (!isCapturing || !mergedConfig.captureFocus) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab lost focus
        const focusDuration = Date.now() - focusStartRef.current;
        addSignal("focus_duration", focusDuration);
        addSignal("tab_switches", 1);
      } else {
        // Tab gained focus
        focusStartRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isCapturing, mergedConfig.captureFocus, addSignal]);

  // Idle time tracking
  useEffect(() => {
    if (!isCapturing) return;

    let lastActivity = Date.now();
    let idleTimeout: NodeJS.Timeout;

    const resetIdle = () => {
      const idleTime = Date.now() - lastActivity;
      if (idleTime > 30000) { // Only track if idle > 30 seconds
        addSignal("idle_time", idleTime);
      }
      lastActivity = Date.now();
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        addSignal("idle_time", Date.now() - lastActivity);
      }, 60000); // Check after 1 minute of inactivity
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach(event => window.addEventListener(event, resetIdle, { passive: true }));
    
    return () => {
      events.forEach(event => window.removeEventListener(event, resetIdle));
      clearTimeout(idleTimeout);
    };
  }, [isCapturing, addSignal]);

  // Periodic buffer flush
  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(flushBuffer, mergedConfig.flushIntervalMs || 30000);
    return () => clearInterval(interval);
  }, [isCapturing, flushBuffer, mergedConfig.flushIntervalMs]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      flushBuffer();
    };
  }, [flushBuffer]);

  // Control functions
  const pauseCapture = useCallback(() => {
    setIsCapturing(false);
    flushBuffer();
  }, [flushBuffer]);

  const resumeCapture = useCallback(() => {
    setIsCapturing(true);
  }, []);

  const clearBuffer = useCallback(() => {
    bufferRef.current = [];
    setSignalCount(0);
  }, []);

  const deleteAllSignals = useCallback(async () => {
    if (!user) return;
    
    try {
      await supabase.from("cognitive_signals").delete().eq("user_id", user.id);
      clearBuffer();
    } catch (error) {
      console.error("Failed to delete signals:", error);
    }
  }, [user, clearBuffer]);

  return {
    isCapturing,
    signalCount,
    pauseCapture,
    resumeCapture,
    clearBuffer,
    deleteAllSignals,
    flushBuffer,
  };
}

// Utility function
function throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): T {
  let inThrottle = false;
  return ((...args: unknown[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}
