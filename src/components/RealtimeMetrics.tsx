import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity
} from "lucide-react";

interface RealtimeMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  format: "currency" | "percentage" | "number" | "time";
  trend: "up" | "down" | "stable";
}

interface RealtimeMetricsProviderProps {
  children: React.ReactNode;
}

// Simulated real-time data updates
const generateMetricUpdate = (metric: RealtimeMetric): RealtimeMetric => {
  const variance = 0.05; // 5% variance
  const change = (Math.random() - 0.5) * 2 * variance;
  const newValue = metric.value * (1 + change);
  
  return {
    ...metric,
    previousValue: metric.value,
    value: Math.round(newValue * 100) / 100,
    trend: newValue > metric.value ? "up" : newValue < metric.value ? "down" : "stable",
  };
};

// Format values based on type
export function formatMetricValue(value: number, format: "currency" | "percentage" | "number" | "time"): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case "percentage":
      return `${Math.round(value)}%`;
    case "time":
      const hours = Math.floor(value);
      const minutes = Math.round((value - hours) * 60);
      return `${hours}h ${minutes}m`;
    default:
      return value.toLocaleString();
  }
}

// Animated value display with trend indicator
export function AnimatedMetricValue({ 
  value, 
  previousValue, 
  format, 
  trend,
  size = "default"
}: { 
  value: number; 
  previousValue: number; 
  format: RealtimeMetric["format"]; 
  trend: RealtimeMetric["trend"];
  size?: "sm" | "default" | "lg";
}) {
  const [displayValue, setDisplayValue] = useState(previousValue);
  
  useEffect(() => {
    const duration = 500;
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      setDisplayValue(startValue + (value - startValue) * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  const sizeClasses = {
    sm: "text-lg",
    default: "text-2xl",
    lg: "text-4xl",
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-secondary" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="flex items-center gap-2">
      <motion.span
        key={value}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className={`font-display font-semibold text-foreground ${sizeClasses[size]}`}
      >
        {formatMetricValue(displayValue, format)}
      </motion.span>
      <AnimatePresence mode="wait">
        {trend !== "stable" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={trendColor}
          >
            <TrendIcon className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for real-time metrics
export function useRealtimeMetrics(initialMetrics: RealtimeMetric[], updateInterval = 5000) {
  const [metrics, setMetrics] = useState<RealtimeMetric[]>(initialMetrics);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMetrics((prev) => 
        prev.map((metric) => generateMetricUpdate(metric))
      );
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isLive, updateInterval]);

  const toggleLive = useCallback(() => setIsLive((prev) => !prev), []);
  const refresh = useCallback(() => {
    setMetrics((prev) => prev.map((metric) => generateMetricUpdate(metric)));
  }, []);

  return {
    metrics,
    isLive,
    toggleLive,
    refresh,
  };
}

// Live indicator component
export function LiveIndicator({ isLive }: { isLive: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${isLive ? "animate-pulse" : ""}`}>
        <div className={`w-2 h-2 rounded-full ${isLive ? "bg-secondary" : "bg-muted-foreground"}`} />
        {isLive && (
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-secondary animate-ping" />
        )}
      </div>
      <span className="text-xs text-muted-foreground">
        {isLive ? "Live" : "Paused"}
      </span>
    </div>
  );
}

// Pulse effect for updates
export function PulseEffect({ trigger }: { trigger: any }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timeout = setTimeout(() => setShow(false), 1000);
    return () => clearTimeout(timeout);
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-secondary/20 rounded-xl pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}

// Activity feed for real-time events
interface ActivityEvent {
  id: string;
  type: "revenue" | "lead" | "experiment" | "automation";
  message: string;
  timestamp: Date;
  value?: string;
}

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-secondary" />
        <span className="text-sm font-medium text-foreground">Live Activity</span>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {events.slice(0, 5).map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
              className="flex items-center justify-between p-2 rounded-lg bg-foreground/5 text-sm"
            >
              <span className="text-muted-foreground truncate">{event.message}</span>
              {event.value && (
                <span className="text-secondary font-medium shrink-0 ml-2">{event.value}</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
