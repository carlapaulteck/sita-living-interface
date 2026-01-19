import React, { useState, useRef, ReactNode, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MorphingCardProps {
  id: string;
  children: ReactNode;
  expandedContent?: ReactNode;
  className?: string;
  expandedClassName?: string;
  onExpand?: () => void;
  onCollapse?: () => void;
}

export function MorphingCard({
  id,
  children,
  expandedContent,
  className,
  expandedClassName,
  onExpand,
  onCollapse,
}: MorphingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [originalRect, setOriginalRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (cardRef.current && !isExpanded) {
      setOriginalRect(cardRef.current.getBoundingClientRect());
    }
  }, [isExpanded]);

  const handleExpand = () => {
    if (cardRef.current) {
      setOriginalRect(cardRef.current.getBoundingClientRect());
    }
    setIsExpanded(true);
    onExpand?.();
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    onCollapse?.();
  };

  return (
    <>
      {/* Placeholder to maintain layout */}
      <div
        ref={cardRef}
        className={cn(
          "transition-opacity duration-300",
          isExpanded && "opacity-0 pointer-events-none",
          className
        )}
        onClick={handleExpand}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </div>

      {/* Expanded overlay */}
      <AnimatePresence>
        {isExpanded && originalRect && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-lg z-50"
              onClick={handleCollapse}
            />

            {/* Morphing card */}
            <motion.div
              layoutId={`morphing-card-${id}`}
              initial={{
                position: 'fixed',
                left: originalRect.left,
                top: originalRect.top,
                width: originalRect.width,
                height: originalRect.height,
                borderRadius: 'var(--radius)',
              }}
              animate={{
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
                width: 'min(90vw, 800px)',
                height: 'auto',
                maxHeight: '85vh',
                borderRadius: '1.5rem',
              }}
              exit={{
                left: originalRect.left,
                top: originalRect.top,
                x: 0,
                y: 0,
                width: originalRect.width,
                height: originalRect.height,
                borderRadius: 'var(--radius)',
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className={cn(
                "z-50 overflow-hidden",
                "bg-card border border-border",
                "shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]",
                expandedClassName
              )}
            >
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCollapse();
                }}
                className={cn(
                  "absolute top-4 right-4 z-10 p-2",
                  "bg-muted/50 hover:bg-muted rounded-full",
                  "transition-colors duration-200"
                )}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15 }}
                className="p-6 overflow-auto max-h-[85vh]"
              >
                {expandedContent || children}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Shared element transition wrapper
interface SharedElementProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SharedElement({ id, children, className }: SharedElementProps) {
  return (
    <motion.div
      layoutId={`shared-${id}`}
      className={className}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

export default MorphingCard;
