import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, Lightbulb, Info } from "lucide-react";

interface HelpHintProps {
  hint: string;
  title?: string;
  variant?: "default" | "tip" | "info";
  className?: string;
}

export function HelpHint({ hint, title, variant = "default", className = "" }: HelpHintProps) {
  const [isOpen, setIsOpen] = useState(false);

  const icons = {
    default: HelpCircle,
    tip: Lightbulb,
    info: Info,
  };

  const colors = {
    default: "text-muted-foreground hover:text-foreground",
    tip: "text-primary/70 hover:text-primary",
    info: "text-secondary/70 hover:text-secondary",
  };

  const bgColors = {
    default: "bg-foreground/5 border-border/50",
    tip: "bg-primary/10 border-primary/20",
    info: "bg-secondary/10 border-secondary/20",
  };

  const Icon = icons[variant];

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`p-0.5 rounded-full transition-colors ${colors[variant]}`}
        aria-label="Show help"
      >
        <Icon className="h-3.5 w-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-xl border ${bgColors[variant]} backdrop-blur-sm shadow-lg`}
          >
            {title && (
              <p className="text-xs font-medium text-foreground mb-1">{title}</p>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
            
            {/* Arrow */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${bgColors[variant]}`}
              style={{ marginTop: "-5px" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline help hint that shows in context
interface InlineHelpHintProps {
  children: React.ReactNode;
  hint: string;
  className?: string;
}

export function InlineHelpHint({ children, hint, className = "" }: InlineHelpHintProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {children}
      <HelpHint hint={hint} />
    </div>
  );
}
