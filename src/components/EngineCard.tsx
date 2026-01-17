import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface EngineCardProps {
  icon: LucideIcon;
  name: string;
  status: "healthy" | "watch" | "attention";
  message: string;
  onClick?: () => void;
  className?: string;
}

export function EngineCard({ 
  icon: Icon, 
  name, 
  status, 
  message, 
  onClick,
  className = "" 
}: EngineCardProps) {
  const statusConfig = {
    healthy: {
      icon: CheckCircle2,
      color: "text-secondary",
      bg: "bg-secondary/10",
      badge: "bg-secondary/20 text-secondary",
    },
    watch: {
      icon: AlertCircle,
      color: "text-primary",
      bg: "bg-primary/10",
      badge: "bg-primary/20 text-primary",
    },
    attention: {
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      badge: "bg-destructive/20 text-destructive",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <GlassCard 
        className={`p-5 cursor-pointer transition-all duration-200 hover:border-primary/30 ${onClick ? "hover:shadow-lg" : ""}`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl ${config.bg}`}>
            <Icon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badge}`}>
            <StatusIcon className="h-3 w-3" />
            {status === "healthy" ? "Healthy" : status === "watch" ? "Watch" : "Needs Attention"}
          </div>
        </div>
        <h3 className="text-base font-medium text-foreground mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
      </GlassCard>
    </motion.div>
  );
}
