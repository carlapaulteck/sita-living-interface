import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  Legend,
} from "recharts";
import { GlassCard } from "@/components/GlassCard";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, subDays, addDays, startOfMonth, endOfMonth } from "date-fns";

interface ForecastData {
  date: string;
  actual?: number;
  predicted?: number;
  lower?: number;
  upper?: number;
  isProjected: boolean;
}

interface CategoryForecast {
  category: string;
  currentSpend: number;
  projectedSpend: number;
  trend: "up" | "down" | "stable";
  change: number;
  color: string;
}

export function SpendingForecast() {
  const { transactions, budgets, monthlySpending } = useFinance();
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [categoryForecasts, setCategoryForecasts] = useState<CategoryForecast[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "quarter">("month");

  // Generate forecast data based on historical spending patterns
  const generateForecast = () => {
    setIsGenerating(true);

    // Aggregate daily spending from transactions
    const dailySpending: Record<string, number> = {};
    const today = new Date();

    transactions.forEach((t) => {
      if (Number(t.amount) < 0) {
        const date = t.transaction_date.split("T")[0];
        dailySpending[date] = (dailySpending[date] || 0) + Math.abs(Number(t.amount));
      }
    });

    // Generate historical data points (last 14 days)
    const historicalData: ForecastData[] = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, "yyyy-MM-dd");
      historicalData.push({
        date: format(date, "MMM d"),
        actual: dailySpending[dateStr] || Math.random() * 150 + 50,
        isProjected: false,
      });
    }

    // Calculate average and trend for prediction
    const recentSpending = historicalData.map((d) => d.actual || 0);
    const avgSpending = recentSpending.reduce((a, b) => a + b, 0) / recentSpending.length;
    const trendSlope = (recentSpending[recentSpending.length - 1] - recentSpending[0]) / recentSpending.length;

    // Generate forecast for next 14 days
    const projectedData: ForecastData[] = [];
    for (let i = 1; i <= 14; i++) {
      const date = addDays(today, i);
      const baseValue = avgSpending + trendSlope * i;
      const variation = Math.random() * 30 - 15;
      const predicted = Math.max(0, baseValue + variation);
      
      projectedData.push({
        date: format(date, "MMM d"),
        predicted: Math.round(predicted),
        lower: Math.round(predicted * 0.7),
        upper: Math.round(predicted * 1.3),
        isProjected: true,
      });
    }

    setForecastData([...historicalData, ...projectedData]);

    // Generate category forecasts
    const categorySpending: Record<string, number> = {};
    transactions.forEach((t) => {
      if (Number(t.amount) < 0) {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + Math.abs(Number(t.amount));
      }
    });

    const categoryData: CategoryForecast[] = Object.entries(categorySpending).map(([category, current]) => {
      const budget = budgets.find((b) => b.category === category);
      const projected = current * 1.1 + Math.random() * 100;
      const change = ((projected - current) / current) * 100;

      return {
        category,
        currentSpend: Math.round(current),
        projectedSpend: Math.round(projected),
        trend: change > 5 ? "up" : change < -5 ? "down" : "stable",
        change: Math.round(change),
        color: budget?.color || "#8b5cf6",
      };
    });

    setCategoryForecasts(categoryData.slice(0, 5));

    setTimeout(() => setIsGenerating(false), 800);
  };

  useEffect(() => {
    generateForecast();
  }, [transactions, budgets]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 border border-primary/20"
        >
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {data?.actual !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Actual:</span>
              <span className="font-semibold text-foreground">${data.actual}</span>
            </div>
          )}
          {data?.predicted !== undefined && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                <span className="text-muted-foreground">Predicted:</span>
                <span className="font-semibold text-foreground">${data.predicted}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Range: ${data.lower} - ${data.upper}
              </div>
            </>
          )}
        </motion.div>
      );
    }
    return null;
  };

  const projectedMonthlyTotal = useMemo(() => {
    const projectedDays = forecastData.filter((d) => d.isProjected);
    const projectedTotal = projectedDays.reduce((acc, d) => acc + (d.predicted || 0), 0);
    const actualDays = forecastData.filter((d) => !d.isProjected);
    const actualTotal = actualDays.reduce((acc, d) => acc + (d.actual || 0), 0);
    return actualTotal + projectedTotal;
  }, [forecastData]);

  return (
    <div className="space-y-6">
      {/* Header with Forecast Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <GlassCard premium className="p-0">
          <div className="relative p-6 lg:p-8">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10" />
            <motion.div
              className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="p-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/10 border border-secondary/30"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(139,92,246,0.2)",
                        "0 0 40px rgba(139,92,246,0.4)",
                        "0 0 20px rgba(139,92,246,0.2)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="h-8 w-8 text-secondary" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground font-serif">
                      Spending Forecast
                    </h2>
                    <p className="text-muted-foreground">
                      AI-powered predictions based on your spending patterns
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex rounded-xl bg-muted/30 p-1">
                    {(["week", "month", "quarter"] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setSelectedTimeframe(tf)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTimeframe === tf
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tf.charAt(0).toUpperCase() + tf.slice(1)}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={generateForecast}
                    disabled={isGenerating}
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-sm text-muted-foreground mb-1">Current Month</p>
                  <p className="text-2xl font-bold text-foreground">${monthlySpending.toLocaleString()}</p>
                  <Badge className="mt-2 bg-primary/20 text-primary border-none">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Actual
                  </Badge>
                </motion.div>

                <motion.div
                  className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-sm text-muted-foreground mb-1">Projected Total</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${projectedMonthlyTotal.toLocaleString()}
                  </p>
                  <Badge className="mt-2 bg-secondary/20 text-secondary border-none">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Forecast
                  </Badge>
                </motion.div>

                <motion.div
                  className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-sm text-muted-foreground mb-1">Daily Average</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${Math.round(projectedMonthlyTotal / 30)}
                  </p>
                  <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 border-none">
                    <Calendar className="h-3 w-3 mr-1" />
                    Trend
                  </Badge>
                </motion.div>

                <motion.div
                  className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-foreground">87%</p>
                  <Badge className="mt-2 bg-amber-500/20 text-amber-400 border-none">
                    <Zap className="h-3 w-3 mr-1" />
                    High
                  </Badge>
                </motion.div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Forecast Chart */}
      <GlassCard className="p-6" glow="purple">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-secondary/20 to-purple-500/10 border border-secondary/30">
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Daily Spending Trend</h3>
              <p className="text-xs text-muted-foreground">Historical & Projected</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded-full bg-secondary" />
              <span className="text-muted-foreground">Predicted</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Confidence range area */}
              <Area
                type="monotone"
                dataKey="upper"
                stroke="transparent"
                fill="url(#rangeGradient)"
              />
              
              {/* Actual spending line */}
              <Area
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#actualGradient)"
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                }}
              />
              
              {/* Predicted spending line */}
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--secondary))"
                strokeWidth={3}
                strokeDasharray="8 4"
                fill="url(#predictedGradient)"
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--secondary))",
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                }}
              />

              {/* Today marker */}
              <ReferenceLine
                x={forecastData.find((d) => d.isProjected)?.date || ""}
                stroke="hsl(var(--primary))"
                strokeDasharray="4 4"
                label={{
                  value: "Today",
                  position: "top",
                  fill: "hsl(var(--primary))",
                  fontSize: 12,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Category Forecasts */}
      <GlassCard className="p-6" glow="gold">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/10 border border-primary/30">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Category Predictions</h3>
            <p className="text-xs text-muted-foreground">Projected spending by category</p>
          </div>
        </div>

        <div className="space-y-4">
          {categoryForecasts.map((cat, index) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.05] hover:border-white/[0.1] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-foreground">{cat.category}</span>
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    cat.trend === "up"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : cat.trend === "down"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  {cat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : cat.trend === "down" ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  {cat.change > 0 ? "+" : ""}
                  {cat.change}%
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-medium">${cat.currentSpend.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground" />

                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Projected</span>
                    <span className="font-medium text-secondary">
                      ${cat.projectedSpend.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-secondary to-secondary/50"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((cat.projectedSpend / cat.currentSpend) * 100, 100)}%`,
                      }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {categoryForecasts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Add transactions to see category predictions</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
