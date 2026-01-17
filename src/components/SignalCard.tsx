import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { CheckCircle2, AlertCircle, Info, TrendingUp } from "lucide-react";

interface SignalCardProps {
  type: "success" | "warning" | "info" | "insight";
  message: string;
  time?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function SignalCard({ type, message, time, action, className = "" }: SignalCardProps) {
  const icons = {
    success: CheckCircle2,
    warning: AlertCircle,
    info: Info,
    insight: TrendingUp,
  };

  const colors = {
    success: "text-secondary bg-secondary/10",
    warning: "text-primary bg-primary/10",
    info: "text-muted-foreground bg-muted/30",
    insight: "text-cyan-400 bg-cyan-400/10",
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <GlassCard className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl ${colors[type]}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground leading-relaxed">{message}</p>
            {time && (
              <p className="text-xs text-muted-foreground mt-1">{time}</p>
            )}
          </div>
          {action && (
            <button
              onClick={action.onClick}
              className="px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-xs font-medium text-foreground shrink-0"
            >
              {action.label}
            </button>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
