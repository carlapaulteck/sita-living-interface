import { useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ROUTES = [
  "/",
  "/business-growth",
  "/life-health",
  "/mind-growth",
  "/sovereignty",
];

const SWIPE_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 0.3;

interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
}

export function useSwipeNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const swipeState = useRef<SwipeState | null>(null);

  const getCurrentIndex = useCallback(() => {
    return ROUTES.indexOf(location.pathname);
  }, [location.pathname]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    swipeState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swipeState.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeState.current.startX;
    const deltaY = touch.clientY - swipeState.current.startY;
    const deltaTime = Date.now() - swipeState.current.startTime;
    
    // Calculate velocity
    const velocity = Math.abs(deltaX) / deltaTime;
    
    // Check if horizontal swipe (not vertical scroll)
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      swipeState.current = null;
      return;
    }

    // Check if swipe meets threshold
    if (Math.abs(deltaX) < SWIPE_THRESHOLD && velocity < VELOCITY_THRESHOLD) {
      swipeState.current = null;
      return;
    }

    const currentIndex = getCurrentIndex();
    
    if (deltaX > 0 && currentIndex > 0) {
      // Swipe right - go to previous
      if (navigator.vibrate) navigator.vibrate(15);
      navigate(ROUTES[currentIndex - 1]);
    } else if (deltaX < 0 && currentIndex < ROUTES.length - 1) {
      // Swipe left - go to next
      if (navigator.vibrate) navigator.vibrate(15);
      navigate(ROUTES[currentIndex + 1]);
    }

    swipeState.current = null;
  }, [getCurrentIndex, navigate]);

  const canSwipeLeft = getCurrentIndex() < ROUTES.length - 1;
  const canSwipeRight = getCurrentIndex() > 0;

  return {
    handleTouchStart,
    handleTouchEnd,
    canSwipeLeft,
    canSwipeRight,
    currentIndex: getCurrentIndex(),
    totalRoutes: ROUTES.length,
  };
}
