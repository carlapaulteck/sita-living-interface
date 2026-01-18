import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Battery, 
  Target,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
  Heart,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { useAdaptationSafe } from "@/contexts/AdaptationContext";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Tooltip, Cell } from "recharts";

interface DailyData {
  day: string;
  shortDay: string;
  energy: number;
  focus: number;
  stress: number;
  productivity: number;
  recoveryTime: number;
}

interface WeeklyPattern {
  name: string;
  frequency: number;
  impact: "positive" | "negative" | "neutral";
  description: string;
}

interface WeeklyInsightsProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generate mock weekly data (in production, this comes from the database)
const generateWeekData = (): DailyData[] => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  return days.map((day, i) => ({
    day: fullDays[i],
    shortDay: day,
    energy: 40 + Math.random() * 50,
    focus: 45 + Math.random() * 45,
    stress: 20 + Math.random() * 40,
    productivity: 50 + Math.random() * 40,
    recoveryTime: Math.floor(Math.random() * 60) + 10,
  }));
};

const WEEKLY_PATTERNS: WeeklyPattern[] = [
  {
    name: "Morning Focus Peak",
    frequency: 5,
    impact: "positive",
    description: "You consistently enter flow state between 9-11 AM",
  },
  {
    name: "Wednesday Dip",
    frequency: 4,
    impact: "negative",
    description: "Energy tends to drop mid-week around 2 PM",
  },
  {
    name: "Post-Exercise Clarity",
    frequency: 3,
    impact: "positive",
    description: "30 min walks boost focus by ~25% for 2 hours",
  },
  {
    name: "Evening Recovery",
    frequency: 6,
    impact: "positive",
    description: "You recharge best with low-stimulation activities after 8 PM",
  },
];

export function WeeklyInsights({ isOpen, onClose }: WeeklyInsightsProps) {
  const adaptation = useAdaptationSafe();
  const [weekData] = useState<DailyData[]>(generateWeekData);
  const [selectedMetric, setSelectedMetric] = useState<"energy" | "focus" | "stress">("energy");
  const [weekOffset, setWeekOffset] = useState(0);
  
  // Calculate weekly stats
  const avgEnergy = weekData.reduce((acc, d) => acc + d.energy, 0) / 7;
  const avgFocus = weekData.reduce((acc, d) => acc + d.focus, 0) / 7;
  const avgStress = weekData.reduce((acc, d) => acc + d.stress, 0) / 7;
  const totalRecoveryTime = weekData.reduce((acc, d) => acc + d.recoveryTime, 0);
  
  // Trends (comparing to "last week")
  const energyTrend = Math.random() > 0.5 ? 8 : -5;
  const focusTrend = Math.random() > 0.5 ? 12 : -3;
  const stressTrend = Math.random() > 0.5 ? -10 : 6;
  
  const getWeekLabel = () => {
    if (weekOffset === 0) return "This Week";
    if (weekOffset === -1) return "Last Week";
    return `${Math.abs(weekOffset)} weeks ago`;
  };
  
  const metricColors = {
    energy: "hsl(var(--primary))",
    focus: "hsl(var(--accent))",
    stress: "#ef4444",
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-4xl my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-medium text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Weekly Insights
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your cognitive patterns and energy trends
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Week Navigation */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-foreground min-w-[120px] text-center">
              {getWeekLabel()}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setWeekOffset(prev => Math.min(prev + 1, 0))}
              disabled={weekOffset === 0}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Battery className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Avg Energy</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-foreground">
                  {avgEnergy.toFixed(0)}%
                </span>
                <span className={`text-xs flex items-center gap-0.5 ${energyTrend > 0 ? "text-green-500" : "text-red-500"}`}>
                  {energyTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(energyTrend)}%
                </span>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-accent" />
                <span className="text-xs text-muted-foreground">Avg Focus</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-foreground">
                  {avgFocus.toFixed(0)}%
                </span>
                <span className={`text-xs flex items-center gap-0.5 ${focusTrend > 0 ? "text-green-500" : "text-red-500"}`}>
                  {focusTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(focusTrend)}%
                </span>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-red-500" />
                <span className="text-xs text-muted-foreground">Avg Stress</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-foreground">
                  {avgStress.toFixed(0)}%
                </span>
                <span className={`text-xs flex items-center gap-0.5 ${stressTrend < 0 ? "text-green-500" : "text-red-500"}`}>
                  {stressTrend < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  {Math.abs(stressTrend)}%
                </span>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="h-4 w-4 text-purple-500" />
                <span className="text-xs text-muted-foreground">Recovery Time</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-foreground">
                  {Math.floor(totalRecoveryTime / 60)}h {totalRecoveryTime % 60}m
                </span>
              </div>
            </GlassCard>
          </div>
          
          {/* Main Chart */}
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">Daily Trends</h3>
              <div className="flex gap-2">
                {(["energy", "focus", "stress"] as const).map(metric => (
                  <Button
                    key={metric}
                    variant={selectedMetric === metric ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedMetric(metric)}
                    className="h-7 text-xs capitalize"
                  >
                    {metric}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekData}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metricColors[selectedMetric]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={metricColors[selectedMetric]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="shortDay" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    hide 
                    domain={[0, 100]} 
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value.toFixed(0)}%`, selectedMetric]}
                    labelFormatter={(label) => weekData.find(d => d.shortDay === label)?.day}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={metricColors[selectedMetric]}
                    strokeWidth={2}
                    fill="url(#colorMetric)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
          
          {/* Productivity by Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <GlassCard className="p-6">
              <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Productivity by Day
              </h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData}>
                    <XAxis 
                      dataKey="shortDay" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value.toFixed(0)}%`, "Productivity"]}
                    />
                    <Bar dataKey="productivity" radius={[4, 4, 0, 0]}>
                      {weekData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.productivity > 70 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.3)"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
            
            {/* Energy Distribution */}
            <GlassCard className="p-6">
              <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                Energy Distribution
              </h3>
              <div className="space-y-3">
                {weekData.map((day, i) => (
                  <div key={day.shortDay} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8">{day.shortDay}</span>
                    <div className="flex-1 h-2 bg-foreground/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${day.energy}%` }}
                        transition={{ delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {day.energy.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
          
          {/* Patterns Section */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Discovered Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {WEEKLY_PATTERNS.map((pattern, i) => (
                <motion.div
                  key={pattern.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl ${
                    pattern.impact === "positive" 
                      ? "bg-green-500/10 border border-green-500/20" 
                      : pattern.impact === "negative"
                      ? "bg-red-500/10 border border-red-500/20"
                      : "bg-foreground/5 border border-foreground/10"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {pattern.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      pattern.impact === "positive" 
                        ? "bg-green-500/20 text-green-500" 
                        : pattern.impact === "negative"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-foreground/10 text-muted-foreground"
                    }`}>
                      {pattern.frequency}/7 days
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {pattern.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
          
          {/* Evolution Insights from Adaptation Context */}
          {adaptation?.evolutionInsights && adaptation.evolutionInsights.length > 0 && (
            <GlassCard className="p-6 mt-6">
              <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Personal Evolution
              </h3>
              <div className="space-y-2">
                {adaptation.evolutionInsights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-foreground/5">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{insight}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
          
          {/* Close Button */}
          <div className="mt-6 flex justify-center">
            <Button onClick={onClose} variant="outline">
              Close Insights
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
