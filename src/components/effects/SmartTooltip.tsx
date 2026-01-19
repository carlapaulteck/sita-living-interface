import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendData {
  current: number;
  previous: number;
  label?: string;
  format?: (value: number) => string;
}

interface SuggestedAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

interface SmartTooltipProps {
  children: ReactNode;
  title?: string;
  description?: string;
  trend?: TrendData;
  sparklineData?: number[];
  suggestedActions?: SuggestedAction[];
  aiInsight?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function SmartTooltip({
  children,
  title,
  description,
  trend,
  sparklineData,
  suggestedActions,
  aiInsight,
  position = 'top',
  delay = 300,
  className,
}: SmartTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getTrendInfo = () => {
    if (!trend) return null;
    const change = ((trend.current - trend.previous) / trend.previous) * 100;
    const isPositive = change > 0;
    const isNeutral = Math.abs(change) < 0.5;
    
    return {
      change,
      isPositive,
      isNeutral,
      Icon: isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown,
      color: isNeutral ? 'text-muted-foreground' : isPositive ? 'text-emerald-400' : 'text-red-400',
      bgColor: isNeutral ? 'bg-muted/50' : isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10',
    };
  };

  const trendInfo = getTrendInfo();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: position === 'bottom' ? rect.bottom : rect.top,
        });
      }
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[hsl(var(--card))]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[hsl(var(--card))]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[hsl(var(--card))]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[hsl(var(--card))]',
  };

  // Mini sparkline component
  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const height = 24;
    const width = 60;
    const points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - ((v - min) / range) * height,
    }));
    const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--brand-gold))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--brand-gold))" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke="url(#sparklineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={points[points.length - 1]?.x}
          cy={points[points.length - 1]?.y}
          r="3"
          fill="hsl(var(--brand-gold))"
          className="animate-pulse"
        />
      </svg>
    );
  };

  return (
    <div 
      ref={triggerRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute z-50 w-64 p-4",
              "bg-card/95 backdrop-blur-xl",
              "border border-border/50 rounded-xl",
              "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]",
              positionStyles[position]
            )}
          >
            {/* Arrow */}
            <div 
              className={cn(
                "absolute w-0 h-0",
                "border-8 border-transparent",
                arrowStyles[position]
              )}
            />

            {/* Content */}
            <div className="space-y-3">
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{title}</span>
                  {sparklineData && sparklineData.length > 1 && (
                    <Sparkline data={sparklineData} />
                  )}
                </div>
              )}

              {/* Description */}
              {description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}

              {/* Trend */}
              {trendInfo && trend && (
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg",
                  trendInfo.bgColor
                )}>
                  <trendInfo.Icon className={cn("w-4 h-4", trendInfo.color)} />
                  <span className={cn("text-sm font-medium", trendInfo.color)}>
                    {trendInfo.isPositive ? '+' : ''}{trendInfo.change.toFixed(1)}%
                  </span>
                  {trend.label && (
                    <span className="text-xs text-muted-foreground">
                      {trend.label}
                    </span>
                  )}
                </div>
              )}

              {/* AI Insight */}
              {aiInsight && (
                <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {aiInsight}
                  </p>
                </div>
              )}

              {/* Suggested Actions */}
              {suggestedActions && suggestedActions.length > 0 && (
                <div className="pt-2 border-t border-border/30 space-y-1">
                  {suggestedActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg",
                        "text-sm text-muted-foreground",
                        "hover:bg-muted/50 hover:text-foreground",
                        "transition-colors duration-200"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {action.icon}
                        {action.label}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SmartTooltip;
