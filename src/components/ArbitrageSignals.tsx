import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  Zap, 
  TrendingUp, 
  DollarSign,
  Clock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Check
} from "lucide-react";

interface ArbitrageSignal {
  id: string;
  type: "price" | "demand" | "inventory" | "timing";
  title: string;
  description: string;
  potentialValue: number;
  confidence: number;
  timeWindow: string;
  status: "actionable" | "monitoring" | "expired";
}

interface ArbitrageSignalsProps {
  signals?: ArbitrageSignal[];
  onActionSignal?: (signalId: string) => void;
}

const defaultSignals: ArbitrageSignal[] = [
  {
    id: "arb1",
    type: "price",
    title: "Competitor Price Gap",
    description: "Detected 15% price advantage opportunity in skincare segment",
    potentialValue: 2400,
    confidence: 0.82,
    timeWindow: "48h",
    status: "actionable"
  },
  {
    id: "arb2",
    type: "demand",
    title: "Search Volume Spike",
    description: "Emerging demand for vitamin C products in target demographic",
    potentialValue: 1800,
    confidence: 0.71,
    timeWindow: "7d",
    status: "actionable"
  },
  {
    id: "arb3",
    type: "inventory",
    title: "Supply Constraint Signal",
    description: "Competitor low stock detected - market share opportunity",
    potentialValue: 3200,
    confidence: 0.65,
    timeWindow: "14d",
    status: "monitoring"
  }
];

export function ArbitrageSignals({ 
  signals = defaultSignals,
  onActionSignal 
}: ArbitrageSignalsProps) {
  const getTypeIcon = (type: ArbitrageSignal["type"]) => {
    switch (type) {
      case "price": return DollarSign;
      case "demand": return TrendingUp;
      case "inventory": return Sparkles;
      case "timing": return Clock;
      default: return Zap;
    }
  };

  const getStatusBadge = (status: ArbitrageSignal["status"]) => {
    switch (status) {
      case "actionable":
        return (
          <span className="flex items-center gap-1 text-xs text-secondary bg-secondary/20 px-2 py-0.5 rounded-full">
            <Zap className="h-3 w-3" />
            Actionable
          </span>
        );
      case "monitoring":
        return (
          <span className="flex items-center gap-1 text-xs text-primary bg-primary/20 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" />
            Monitoring
          </span>
        );
      case "expired":
        return (
          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-foreground/10 px-2 py-0.5 rounded-full">
            <Check className="h-3 w-3" />
            Expired
          </span>
        );
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Arbitrage Signals</h3>
            <p className="text-xs text-muted-foreground">Market opportunities detected</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
          {signals.filter(s => s.status === "actionable").length} Active
        </span>
      </div>

      <div className="space-y-3">
        {signals.map((signal, index) => {
          const IconComponent = getTypeIcon(signal.type);
          
          return (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                signal.status === "actionable"
                  ? "bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 hover:border-primary/40"
                  : "bg-foreground/5 border-transparent hover:bg-foreground/10"
              }`}
              onClick={() => onActionSignal?.(signal.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${
                    signal.status === "actionable" ? "bg-primary/20" : "bg-foreground/10"
                  }`}>
                    <IconComponent className={`h-4 w-4 ${
                      signal.status === "actionable" ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-foreground">{signal.title}</p>
                      {getStatusBadge(signal.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{signal.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">
                        Window: <span className="text-foreground">{signal.timeWindow}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Confidence: <span className="text-foreground">{Math.round(signal.confidence * 100)}%</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-lg font-display font-bold text-secondary">
                    +${signal.potentialValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Potential</p>
                  {signal.status === "actionable" && (
                    <ArrowRight className="h-4 w-4 text-primary mt-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {signals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-3">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No active signals</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Market opportunities will appear here</p>
        </div>
      )}
    </GlassCard>
  );
}