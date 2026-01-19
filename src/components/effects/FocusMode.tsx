import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusContextType {
  focusedId: string | null;
  setFocus: (id: string | null) => void;
  isFocused: (id: string) => boolean;
  isAnyFocused: boolean;
}

const FocusContext = createContext<FocusContextType | null>(null);

export function FocusProvider({ children }: { children: ReactNode }) {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const setFocus = useCallback((id: string | null) => {
    setFocusedId(id);
  }, []);

  const isFocused = useCallback((id: string) => focusedId === id, [focusedId]);
  const isAnyFocused = focusedId !== null;

  return (
    <FocusContext.Provider value={{ focusedId, setFocus, isFocused, isAnyFocused }}>
      {children}
      
      {/* Global overlay when focused */}
      <AnimatePresence>
        {isAnyFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-40"
            onClick={() => setFocus(null)}
          />
        )}
      </AnimatePresence>
    </FocusContext.Provider>
  );
}

export function useFocusMode() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocusMode must be used within a FocusProvider');
  }
  return context;
}

interface FocusableProps {
  id: string;
  children: ReactNode;
  expandedContent?: ReactNode;
  className?: string;
  focusedClassName?: string;
}

export function Focusable({
  id,
  children,
  expandedContent,
  className,
  focusedClassName,
}: FocusableProps) {
  const { setFocus, isFocused, isAnyFocused } = useFocusMode();
  const focused = isFocused(id);

  return (
    <>
      {/* Regular state */}
      <motion.div
        layout
        layoutId={`focusable-${id}`}
        onClick={() => !focused && setFocus(id)}
        className={cn(
          "cursor-pointer transition-opacity duration-300",
          className,
          isAnyFocused && !focused && "opacity-20 pointer-events-none"
        )}
        whileHover={!isAnyFocused ? { scale: 1.02 } : undefined}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>

      {/* Focused state overlay */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2 }}
              onClick={() => setFocus(null)}
              className={cn(
                "absolute top-6 right-6 p-3",
                "bg-card/80 backdrop-blur-sm rounded-full",
                "border border-border/50",
                "hover:bg-card transition-colors"
              )}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Expanded card */}
            <motion.div
              layoutId={`focusable-${id}`}
              className={cn(
                "w-full max-w-4xl max-h-[90vh] overflow-auto",
                "bg-card border border-border rounded-2xl",
                "shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]",
                focusedClassName
              )}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {expandedContent || children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Peripheral blur effect for non-focused items
export function PeripheralBlur({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isAnyFocused } = useFocusMode();

  return (
    <div
      className={cn(
        "transition-all duration-500",
        isAnyFocused && "blur-sm opacity-50 pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
}

export default FocusProvider;
