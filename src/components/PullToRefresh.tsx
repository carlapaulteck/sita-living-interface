import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  disabled = false,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const TRIGGER_THRESHOLD = 80;
  const MAX_PULL = 120;

  const handlePan = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled || isRefreshing) return;
    
    // Only allow pull down when at top of scroll
    const container = containerRef.current;
    if (container && container.scrollTop > 0) return;
    
    // Only respond to downward pulls
    if (info.delta.y > 0) {
      const newDistance = Math.min(pullDistance + info.delta.y * 0.5, MAX_PULL);
      setPullDistance(newDistance);
    }
  }, [disabled, isRefreshing, pullDistance]);

  const handlePanEnd = useCallback(async () => {
    if (disabled || isRefreshing) return;
    
    if (pullDistance >= TRIGGER_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(60); // Keep indicator visible during refresh
      
      try {
        await onRefresh();
        // Trigger haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [disabled, isRefreshing, pullDistance, onRefresh, TRIGGER_THRESHOLD]);

  const progress = Math.min(pullDistance / TRIGGER_THRESHOLD, 1);
  const shouldTrigger = pullDistance >= TRIGGER_THRESHOLD;

  return (
    <div ref={containerRef} className="relative overflow-auto">
      {/* Pull indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ 
              opacity: 1, 
              y: Math.min(pullDistance - 40, 20),
            }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
          >
            <div 
              className={`p-3 rounded-full backdrop-blur-xl transition-colors ${
                shouldTrigger || isRefreshing
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: progress * 180 }}
                transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
              >
                <RefreshCw 
                  className={`w-5 h-5 transition-transform ${
                    shouldTrigger ? 'scale-110' : ''
                  }`} 
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content with pan gesture */}
      <motion.div
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        animate={{ y: isRefreshing ? 60 : pullDistance > 0 ? pullDistance * 0.3 : 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ touchAction: 'pan-x pan-y' }}
      >
        {children}
      </motion.div>
    </div>
  );
};
