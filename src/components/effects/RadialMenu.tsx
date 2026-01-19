import React, { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Home, Settings, Search, Bell, Zap, 
  BarChart3, Wallet, Heart, Brain, Shield 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface RadialMenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  color?: string;
  action?: () => void;
  route?: string;
}

interface RadialMenuProps {
  items?: RadialMenuItem[];
  onSelect?: (item: RadialMenuItem) => void;
  triggerDelay?: number;
  children?: ReactNode;
}

const defaultItems: RadialMenuItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" />, route: '/', color: 'hsl(var(--brand-gold))' },
  { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" />, color: 'hsl(var(--accent-cyan))' },
  { id: 'business', label: 'Business', icon: <BarChart3 className="w-5 h-5" />, route: '/business', color: 'hsl(var(--brand-purple))' },
  { id: 'finance', label: 'Finance', icon: <Wallet className="w-5 h-5" />, route: '/finance', color: 'hsl(40 85% 55%)' },
  { id: 'health', label: 'Health', icon: <Heart className="w-5 h-5" />, route: '/bio-os', color: 'hsl(0 70% 55%)' },
  { id: 'mind', label: 'Mind', icon: <Brain className="w-5 h-5" />, route: '/mind', color: 'hsl(280 70% 60%)' },
  { id: 'sovereignty', label: 'Sovereignty', icon: <Shield className="w-5 h-5" />, route: '/sovereignty', color: 'hsl(220 70% 55%)' },
  { id: 'automations', label: 'Automations', icon: <Zap className="w-5 h-5" />, route: '/automations', color: 'hsl(50 90% 50%)' },
];

export function RadialMenu({
  items = defaultItems,
  onSelect,
  triggerDelay = 500,
  children,
}: RadialMenuProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = 120;
  const itemCount = items.length;

  const handlePressStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    pressTimerRef.current = setTimeout(() => {
      setPosition({ x: clientX, y: clientY });
      setIsOpen(true);
      
      // Haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, triggerDelay);
  }, [triggerDelay]);

  const handlePressEnd = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
  }, []);

  const handleClose = useCallback(() => {
    if (selectedIndex !== null) {
      const item = items[selectedIndex];
      if (item.action) {
        item.action();
      } else if (item.route) {
        navigate(item.route);
      }
      onSelect?.(item);
    }
    setIsOpen(false);
    setHoveredIndex(null);
    setSelectedIndex(null);
  }, [selectedIndex, items, navigate, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isOpen) return;

    const dx = e.clientX - position.x;
    const dy = e.clientY - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 40 && distance < 180) {
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;
      
      const segmentAngle = (2 * Math.PI) / itemCount;
      const offset = -Math.PI / 2; // Start from top
      let adjustedAngle = angle - offset;
      if (adjustedAngle < 0) adjustedAngle += 2 * Math.PI;
      
      const index = Math.floor(adjustedAngle / segmentAngle);
      setHoveredIndex(index % itemCount);
      setSelectedIndex(index % itemCount);
    } else if (distance <= 40) {
      setHoveredIndex(null);
      setSelectedIndex(null);
    }
  }, [isOpen, position, itemCount]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleClose);
      window.addEventListener('touchend', handleClose);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleClose);
      window.removeEventListener('touchend', handleClose);
    };
  }, [isOpen, handleMouseMove, handleClose]);

  const getItemPosition = (index: number) => {
    const angle = (index / itemCount) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        className="select-none"
      >
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
            />

            {/* Radial Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed z-[101]"
              style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Center circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className={cn(
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                  "w-16 h-16 rounded-full",
                  "bg-card/80 backdrop-blur-md border border-border/50",
                  "flex items-center justify-center",
                  "shadow-[0_0_40px_rgba(0,0,0,0.4)]"
                )}
              >
                <Plus className="w-6 h-6 text-muted-foreground" />
              </motion.div>

              {/* Menu items */}
              {items.map((item, index) => {
                const pos = getItemPosition(index);
                const isHovered = hoveredIndex === index;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      scale: isHovered ? 1.2 : 1,
                      x: pos.x,
                      y: pos.y,
                    }}
                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    transition={{
                      delay: index * 0.03,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={cn(
                      "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                      "w-14 h-14 rounded-full",
                      "flex items-center justify-center",
                      "bg-card/90 backdrop-blur-md border",
                      "transition-all duration-200",
                      isHovered
                        ? "border-primary shadow-[0_0_30px_rgba(232,194,123,0.4)]"
                        : "border-border/50 shadow-lg"
                    )}
                    style={{
                      boxShadow: isHovered
                        ? `0 0 30px ${item.color || 'hsl(var(--primary))'}40`
                        : undefined,
                    }}
                  >
                    <div
                      className={cn(
                        "transition-colors duration-200",
                        isHovered ? "text-primary" : "text-muted-foreground"
                      )}
                      style={{
                        color: isHovered ? item.color : undefined,
                      }}
                    >
                      {item.icon}
                    </div>
                  </motion.div>
                );
              })}

              {/* Label for hovered item */}
              <AnimatePresence>
                {hoveredIndex !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2",
                      "px-4 py-2 rounded-full",
                      "bg-card/90 backdrop-blur-md border border-border/50",
                      "text-sm font-medium text-foreground",
                      "whitespace-nowrap"
                    )}
                    style={{ top: radius + 50 }}
                  >
                    {items[hoveredIndex]?.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default RadialMenu;
