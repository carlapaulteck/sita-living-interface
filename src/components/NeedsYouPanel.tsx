import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { CheckCircle2, AlertCircle, Clock, ArrowRight } from "lucide-react";

interface NeedsYouItem {
  id: string;
  type: "approval" | "review" | "decision";
  message: string;
  action: string;
  priority: "high" | "medium" | "low";
  time?: string;
}

interface NeedsYouPanelProps {
  items: NeedsYouItem[];
  onAction?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export function NeedsYouPanel({ items, onAction, onDismiss }: NeedsYouPanelProps) {
  if (items.length === 0) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-secondary/10">
            <CheckCircle2 className="h-5 w-5 text-secondary" />
          </div>
          <h3 className="font-medium text-foreground">Needs You</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nothing needs your attention.</p>
          <p className="text-xs text-muted-foreground mt-1">Everything important is handled.</p>
        </div>
      </GlassCard>
    );
  }

  const priorityColors = {
    high: "border-l-destructive bg-destructive/5",
    medium: "border-l-primary bg-primary/5",
    low: "border-l-secondary bg-secondary/5",
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <AlertCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-foreground">Needs You</h3>
        </div>
        <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-xl border-l-4 ${priorityColors[item.priority]}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-foreground mb-1">{item.message}</p>
                {item.time && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </div>
                )}
              </div>
              <button
                onClick={() => onAction?.(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-xs font-medium text-foreground shrink-0"
              >
                {item.action}
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
