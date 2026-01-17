import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  X, 
  LineChart, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Maximize2
} from "lucide-react";

interface AnalyticsData {
  label: string;
  value: number;
  change: number;
  changeLabel: string;
}

interface ChartData {
  name: string;
  value: number;
  previousValue?: number;
}

interface AdvancedAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
}

const revenueData: ChartData[] = [
  { name: "Mon", value: 4200, previousValue: 3800 },
  { name: "Tue", value: 3800, previousValue: 4100 },
  { name: "Wed", value: 5100, previousValue: 4600 },
  { name: "Thu", value: 4600, previousValue: 4200 },
  { name: "Fri", value: 5800, previousValue: 5200 },
  { name: "Sat", value: 3200, previousValue: 2800 },
  { name: "Sun", value: 2100, previousValue: 1900 },
];

const sourceData: ChartData[] = [
  { name: "Organic", value: 42 },
  { name: "Paid", value: 28 },
  { name: "Referral", value: 18 },
  { name: "Direct", value: 12 },
];

const kpis: AnalyticsData[] = [
  { label: "Total Revenue", value: 28800, change: 12.4, changeLabel: "vs last week" },
  { label: "Conversion Rate", value: 3.2, change: 0.4, changeLabel: "vs last week" },
  { label: "Avg. Order Value", value: 142, change: -2.1, changeLabel: "vs last week" },
  { label: "Customer LTV", value: 890, change: 8.2, changeLabel: "vs last month" },
];

export function AdvancedAnalytics({ isOpen, onClose }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  if (!isOpen) return null;

  const maxValue = Math.max(...revenueData.map(d => d.value));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 p-4 border-b border-border/50 bg-background/80 backdrop-blur-xl z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-display font-medium text-foreground">Advanced Analytics</h2>
            <p className="text-sm text-muted-foreground">Deep insights into your business performance</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Time range selector */}
            <div className="flex gap-1 p-1 rounded-lg bg-foreground/5">
              {(["7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button className="p-2 rounded-xl border border-border/50 hover:bg-foreground/5 transition-colors">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-xl border border-border/50 hover:bg-foreground/5 transition-colors">
              <Download className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-border/50 hover:bg-foreground/5 transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 pb-20">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-5">
                <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-display font-semibold text-foreground">
                    {kpi.label.includes("Rate") ? `${kpi.value}%` 
                      : kpi.label.includes("Revenue") || kpi.label.includes("Value") || kpi.label.includes("LTV")
                      ? `$${kpi.value.toLocaleString()}`
                      : kpi.value.toLocaleString()
                    }
                  </span>
                  <span className={`text-xs font-medium ${kpi.change >= 0 ? "text-secondary" : "text-destructive"}`}>
                    {kpi.change >= 0 ? "+" : ""}{kpi.change}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.changeLabel}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <LineChart className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground">Revenue Trend</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setChartType("line")}
                    className={`p-2 rounded-lg transition-colors ${
                      chartType === "line" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <LineChart className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setChartType("bar")}
                    className={`p-2 rounded-lg transition-colors ${
                      chartType === "bar" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Simple bar chart visualization */}
              <div className="h-64 flex items-end gap-2">
                {revenueData.map((data, i) => (
                  <div key={data.name} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex gap-1 items-end" style={{ height: "200px" }}>
                      {/* Previous period bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${((data.previousValue || 0) / maxValue) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex-1 rounded-t-md bg-muted/50"
                      />
                      {/* Current period bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.value / maxValue) * 100}%` }}
                        transition={{ delay: i * 0.05 + 0.1, duration: 0.5 }}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-secondary"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{data.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-primary to-secondary" />
                  <span className="text-xs text-muted-foreground">This period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-muted/50" />
                  <span className="text-xs text-muted-foreground">Previous period</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Traffic Sources */}
          <div>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-secondary/10">
                  <PieChart className="h-4 w-4 text-secondary" />
                </div>
                <h3 className="font-medium text-foreground">Traffic Sources</h3>
              </div>

              <div className="space-y-4">
                {sourceData.map((source, i) => (
                  <motion.div
                    key={source.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{source.name}</span>
                      <span className="text-sm font-medium text-foreground">{source.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${source.value}%` }}
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                        className={`h-full rounded-full ${
                          i === 0 ? "bg-gradient-to-r from-primary to-secondary" :
                          i === 1 ? "bg-secondary" :
                          i === 2 ? "bg-primary" : "bg-muted-foreground"
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Quick Stats */}
            <GlassCard className="p-6 mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">Quick Stats</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/5">
                  <span className="text-sm text-muted-foreground">New Visitors</span>
                  <span className="text-sm font-medium text-foreground">2,847</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/5">
                  <span className="text-sm text-muted-foreground">Returning</span>
                  <span className="text-sm font-medium text-foreground">1,234</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/5">
                  <span className="text-sm text-muted-foreground">Bounce Rate</span>
                  <span className="text-sm font-medium text-foreground">32.4%</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
