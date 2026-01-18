import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { MetricRing } from "./MetricRing";
import { 
  Target, 
  TrendingUp, 
  DollarSign,
  Calendar,
  AlertCircle,
  Check,
  Clock,
  Sparkles
} from "lucide-react";

interface ExitMetrics {
  overallScore: number;
  revenueMultiple: number;
  growthRate: number;
  profitMargin: number;
  recurringRevenue: number;
  customerConcentration: number;
  operationalMaturity: number;
}

interface ExitReadinessProps {
  metrics?: ExitMetrics;
  estimatedValuation?: { low: number; mid: number; high: number };
  exitWindow?: "approaching" | "open" | "not_yet";
}

const defaultMetrics: ExitMetrics = {
  overallScore: 72,
  revenueMultiple: 3.2,
  growthRate: 24,
  profitMargin: 18,
  recurringRevenue: 65,
  customerConcentration: 15,
  operationalMaturity: 78
};

export function ExitReadiness({ 
  metrics = defaultMetrics,
  estimatedValuation = { low: 450000, mid: 620000, high: 850000 },
  exitWindow = "approaching"
}: ExitReadinessProps) {
  const getWindowStatus = () => {
    switch (exitWindow) {
      case "open":
        return {
          color: "text-secondary",
          bg: "bg-secondary/20",
          icon: Check,
          text: "Exit window open"
        };
      case "approaching":
        return {
          color: "text-primary",
          bg: "bg-primary/20",
          icon: Clock,
          text: "Exit window approaching"
        };
      case "not_yet":
        return {
          color: "text-muted-foreground",
          bg: "bg-foreground/10",
          icon: Calendar,
          text: "Not yet ready"
        };
    }
  };

  const windowStatus = getWindowStatus();
  const WindowIcon = windowStatus.icon;

  const checklistItems = [
    { label: "Revenue Stability", completed: metrics.recurringRevenue > 50, value: `${metrics.recurringRevenue}% recurring` },
    { label: "Growth Trajectory", completed: metrics.growthRate > 20, value: `${metrics.growthRate}% YoY` },
    { label: "Profit Margins", completed: metrics.profitMargin > 15, value: `${metrics.profitMargin}%` },
    { label: "Customer Diversification", completed: metrics.customerConcentration < 20, value: `Top client: ${metrics.customerConcentration}%` },
    { label: "Operational Systems", completed: metrics.operationalMaturity > 70, value: `${metrics.operationalMaturity}% automated` },
  ];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Exit Readiness</h3>
            <p className="text-xs text-muted-foreground">Valuation optimization tracking</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${windowStatus.bg}`}>
          <WindowIcon className={`h-4 w-4 ${windowStatus.color}`} />
          <span className={`text-xs font-medium ${windowStatus.color}`}>{windowStatus.text}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Overall Score Ring */}
        <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-center">
          <MetricRing
            label="Exit Score"
            value={`${metrics.overallScore}%`}
            percentage={metrics.overallScore}
            color={metrics.overallScore > 70 ? "cyan" : metrics.overallScore > 50 ? "gold" : "purple"}
            size={120}
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {metrics.overallScore > 70 ? "Strong position" : metrics.overallScore > 50 ? "Building value" : "Focus on fundamentals"}
          </p>
        </div>

        {/* Valuation Estimate */}
        <div className="col-span-12 md:col-span-8">
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 mb-4">
            <p className="text-xs text-muted-foreground mb-2">Estimated Valuation Range</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                ${(estimatedValuation.mid / 1000).toFixed(0)}K
              </span>
              <span className="text-sm text-muted-foreground">
                (${(estimatedValuation.low / 1000).toFixed(0)}K - ${(estimatedValuation.high / 1000).toFixed(0)}K)
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-secondary" />
              <span className="text-xs text-secondary">{metrics.revenueMultiple}x revenue multiple</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-foreground/5 text-center">
              <p className="text-lg font-display font-bold text-foreground">{metrics.growthRate}%</p>
              <p className="text-xs text-muted-foreground">Growth</p>
            </div>
            <div className="p-3 rounded-xl bg-foreground/5 text-center">
              <p className="text-lg font-display font-bold text-foreground">{metrics.profitMargin}%</p>
              <p className="text-xs text-muted-foreground">Margin</p>
            </div>
            <div className="p-3 rounded-xl bg-foreground/5 text-center">
              <p className="text-lg font-display font-bold text-foreground">{metrics.recurringRevenue}%</p>
              <p className="text-xs text-muted-foreground">Recurring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Value Drivers
        </h4>
        <div className="space-y-2">
          {checklistItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-foreground/5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  item.completed ? "bg-secondary/20" : "bg-foreground/10"
                }`}>
                  {item.completed ? (
                    <Check className="h-3 w-3 text-secondary" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <span className={`text-sm ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </div>
              <span className={`text-xs ${item.completed ? "text-secondary" : "text-muted-foreground"}`}>
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}