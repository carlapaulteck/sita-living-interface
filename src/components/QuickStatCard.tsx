import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { LiveIndicator } from "./LiveIndicator";
import { useEffect, useState, useRef } from "react";

interface QuickStatCardProps {
  title?: string;
  label?: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  icon?: LucideIcon;
  graphic?: React.ReactNode;
  isLive?: boolean;
  isConnected?: boolean;
  className?: string;
  suffix?: string;
  prefix?: string;
  accentColor?: "gold" | "cyan" | "purple";
  delay?: number;
}

const accentStyles = {
  gold: {
    glow: "group-hover:shadow-[0_0_40px_rgba(255,215,0,0.2)]",
    text: "text-[#FFD700]",
    bg: "from-[#FFD700]/20 to-[#B8860B]/5",
    sparkline: "bg-[#FFD700]/50",
  },
  cyan: {
    glow: "group-hover:shadow-[0_0_40px_rgba(0,255,255,0.2)]",
    text: "text-[#00FFFF]",
    bg: "from-[#00FFFF]/20 to-[#008B8B]/5",
    sparkline: "bg-[#00FFFF]/50",
  },
  purple: {
    glow: "group-hover:shadow-[0_0_40px_rgba(147,112,219,0.2)]",
    text: "text-[#9370DB]",
    bg: "from-[#9370DB]/20 to-[#9370DB]/5",
    sparkline: "bg-[#9370DB]/50",
  },
};

export function QuickStatCard({
  title,
  label,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  graphic,
  isLive = false,
  isConnected = false,
  className,
  suffix = "",
  prefix = "",
  accentColor = "gold",
  delay = 0,
}: QuickStatCardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const accent = accentStyles[accentColor];
  const displayLabel = label || title || "";

  // Animate value changes
  useEffect(() => {
    if (value !== prevValueRef.current) {
      setIsAnimating(true);
      
      if (typeof value === 'number' && typeof prevValueRef.current === 'number') {
        const startValue = prevValueRef.current;
        const endValue = value;
        const duration = 500;
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = startValue + (endValue - startValue) * easeProgress;
          
          setDisplayValue(Math.round(currentValue * 100) / 100);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setDisplayValue(endValue);
            setIsAnimating(false);
          }
        };
        
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        setTimeout(() => setIsAnimating(false), 300);
      }
      
      prevValueRef.current = value;
    }
  }, [value]);

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5",
        "bg-gradient-to-br from-white/[0.05] to-white/[0.02]",
        "backdrop-blur-2xl",
        "border border-white/[0.08]",
        "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.5)]",
        "transition-all duration-500 group cursor-pointer",
        "hover:border-white/[0.15]",
        accent.glow,
        className
      )}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      {/* Top highlight */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      
      {/* Background glow on value change */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", accent.bg)}
          />
        )}
      </AnimatePresence>
      
      {/* Decorative graphic */}
      {graphic && (
        <div className="absolute top-2 right-2 w-16 h-16 opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          {graphic}
        </div>
      )}
      
      {/* Header with label and live indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br from-white/10 to-white/5",
              "border border-white/10",
              accent.text
            )}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{displayLabel}</span>
        </div>
        
        {isLive && <LiveIndicator isConnected={isConnected} showLabel size="sm" />}
      </div>
      
      {/* Value */}
      <div className="flex items-end justify-between mt-4">
        <motion.div
          key={String(displayValue)}
          initial={isAnimating ? { opacity: 0.5, scale: 0.95 } : false}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-baseline gap-1"
        >
          {prefix && <span className={cn("text-lg", accent.text)}>{prefix}</span>}
          <span className={cn(
            "text-3xl font-bold tracking-tight",
            accent.text,
            "font-['Playfair_Display']"
          )}>
            {typeof displayValue === 'number' 
              ? displayValue.toLocaleString(undefined, { maximumFractionDigits: 2 })
              : displayValue
            }
          </span>
          {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
        </motion.div>
        
        {/* Trend indicator */}
        {trend && (
          <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5", trendColor)}>
            <TrendIcon className="w-3.5 h-3.5" />
            {trendValue && (
              <span className="text-xs font-semibold">{trendValue}</span>
            )}
          </div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <span className="text-xs text-muted-foreground mt-1 block">{subtitle}</span>
      )}
      
      {/* Sparkline */}
      <div className="mt-4 h-10 flex items-end gap-0.5 opacity-40 group-hover:opacity-70 transition-opacity">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className={cn("flex-1 rounded-t-sm", accent.sparkline)}
            style={{ height: `${20 + Math.random() * 80}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: (delay / 1000) + (i * 0.03), duration: 0.4 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
