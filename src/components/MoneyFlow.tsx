import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface MoneyFlowData {
  earned: { value: number; label: string };
  recovered: { value: number; label: string };
  pending: { value: number; label: string; items: number };
  atRisk: { value: number; label: string; items: number };
}

interface MoneyFlowProps {
  data?: MoneyFlowData;
}

const defaultData: MoneyFlowData = {
  earned: { value: 12400, label: "This month" },
  recovered: { value: 1890, label: "From automations" },
  pending: { value: 4200, label: "Awaiting payment", items: 3 },
  atRisk: { value: 850, label: "Overdue invoices", items: 1 },
};

export function MoneyFlow({ data = defaultData }: MoneyFlowProps) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-foreground">Money Flow</h2>
        <p className="text-sm text-muted-foreground">Earned, pending, and protected.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Earned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4 h-full">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl bg-secondary/20">
                <DollarSign className="h-5 w-5 text-secondary" />
              </div>
              <CheckCircle2 className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Earned</p>
            <p className="text-2xl font-display font-bold text-foreground">
              ${data.earned.value.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{data.earned.label}</p>
          </GlassCard>
        </motion.div>

        {/* Recovered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-4 h-full">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-secondary font-medium">+${data.recovered.value}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Recovered</p>
            <p className="text-2xl font-display font-bold text-foreground">
              ${data.recovered.value.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{data.recovered.label}</p>
          </GlassCard>
        </motion.div>

        {/* Pending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-4 h-full group cursor-pointer hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl bg-accent/20">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <span className="text-xs text-muted-foreground">{data.pending.items} invoices</span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-display font-bold text-foreground">
              ${data.pending.value.toLocaleString()}
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">{data.pending.label}</p>
              <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </GlassCard>
        </motion.div>

        {/* At Risk */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className={`p-4 h-full group cursor-pointer transition-colors ${
            data.atRisk.items > 0 ? "border-destructive/30 hover:border-destructive/50" : "hover:border-primary/30"
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${data.atRisk.items > 0 ? "bg-destructive/20" : "bg-foreground/10"}`}>
                <AlertTriangle className={`h-5 w-5 ${data.atRisk.items > 0 ? "text-destructive" : "text-muted-foreground"}`} />
              </div>
              {data.atRisk.items > 0 && (
                <span className="text-xs text-destructive font-medium">{data.atRisk.items} overdue</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-1">At Risk</p>
            <p className={`text-2xl font-display font-bold ${data.atRisk.items > 0 ? "text-destructive" : "text-foreground"}`}>
              ${data.atRisk.value.toLocaleString()}
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">{data.atRisk.label}</p>
              <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Quick action for at-risk items */}
      {data.atRisk.items > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-4 border-l-4 border-l-destructive bg-destructive/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-foreground">Escalation is armed</p>
                  <p className="text-xs text-muted-foreground">No action required unless you choose to intervene.</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm font-medium text-foreground">
                Review
              </button>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
