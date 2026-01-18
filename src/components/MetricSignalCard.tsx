import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";

export interface MetricSignalCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  status: "healthy" | "warning" | "critical" | "neutral";
  trend?: "up" | "down" | "stable";
  className?: string;
}

export function MetricSignalCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  status, 
  trend,
  className = "" 
}: MetricSignalCardProps) {
  const statusColors = {
    healthy: "text-secondary bg-secondary/10 border-secondary/20",
    warning: "text-primary bg-primary/10 border-primary/20",
    critical: "text-destructive bg-destructive/10 border-destructive/20",
    neutral: "text-muted-foreground bg-muted/30 border-muted/20",
  };

  const statusDots = {
    healthy: "bg-secondary",
    warning: "bg-primary",
    critical: "bg-destructive",
    neutral: "bg-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <GlassCard className="p-4 h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-xl ${statusColors[status]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`h-2 w-2 rounded-full ${statusDots[status]}`} />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{title}</p>
            <p className="text-xl font-semibold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className={`text-xs ${trend === 'up' ? 'text-secondary' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
