import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export function CursorTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const idCounter = useRef(0);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number>();

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Only add point if cursor moved enough
      const dx = clientX - lastPosition.current.x;
      const dy = clientY - lastPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 8) {
        lastPosition.current = { x: clientX, y: clientY };
        
        const newPoint: TrailPoint = {
          id: idCounter.current++,
          x: clientX,
          y: clientY,
          timestamp: Date.now(),
        };

        setTrail((prev) => [...prev.slice(-15), newPoint]);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Cleanup old trail points
    const cleanup = () => {
      const now = Date.now();
      setTrail((prev) => prev.filter((point) => now - point.timestamp < 500));
      animationFrame.current = requestAnimationFrame(cleanup);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animationFrame.current = requestAnimationFrame(cleanup);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {trail.map((point, index) => {
          const age = (Date.now() - point.timestamp) / 500;
          const opacity = Math.max(0, 1 - age);
          const scale = 1 - age * 0.5;
          
          return (
            <motion.div
              key={point.id}
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity, scale }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute rounded-full"
              style={{
                left: point.x - 6,
                top: point.y - 6,
                width: 12,
                height: 12,
                background: `radial-gradient(circle, hsl(var(--brand-gold) / ${0.6 * opacity}), hsl(var(--brand-purple) / ${0.3 * opacity}), transparent)`,
                boxShadow: `0 0 ${20 * opacity}px hsl(var(--brand-gold) / ${0.4 * opacity})`,
                filter: `blur(${index * 0.3}px)`,
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
