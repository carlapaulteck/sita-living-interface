import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Brain, 
  Briefcase, 
  Heart, 
  Users, 
  BookOpen, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Activity,
  Plus,
  Clock,
  Calendar,
  BarChart3,
  Leaf
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { 
  cognitiveBudgetLedger, 
  CognitiveBudgetState, 
  CognitiveDomain, 
  DomainBudget 
} from "@/lib/cognitiveBudgetLedger";
import { ActivityLogger } from "./ActivityLogger";
import { EnergyForecast } from "./EnergyForecast";
import { RecoverySuggestions } from "./RecoverySuggestions";

interface CognitiveBudgetVisualizationProps {
  isOpen?: boolean;
  onClose?: () => void;
  compact?: boolean;
}

const domainConfig: Record<CognitiveDomain, { 
  icon: typeof Brain; 
  label: string; 
  color: string; 
  gradient: string;
  bgGradient: string;
  glowColor: string;
}> = {
  work: { 
    icon: Briefcase, 
    label: "Work", 
    color: "text-primary",
    gradient: "from-primary to-amber-400",
    bgGradient: "from-primary/20 to-amber-400/10",
    glowColor: "rgba(232, 194, 123, 0.4)"
  },
  health: { 
    icon: Heart, 
    label: "Health", 
    color: "text-rose-400",
    gradient: "from-rose-500 to-pink-400",
    bgGradient: "from-rose-500/20 to-pink-400/10",
    glowColor: "rgba(251, 113, 133, 0.4)"
  },
  social: { 
    icon: Users, 
    label: "Social", 
    color: "text-secondary",
    gradient: "from-secondary to-violet-400",
    bgGradient: "from-secondary/20 to-violet-400/10",
    glowColor: "rgba(147, 112, 219, 0.4)"
  },
  learning: { 
    icon: BookOpen, 
    label: "Learning", 
    color: "text-accent",
    gradient: "from-accent to-teal-400",
    bgGradient: "from-accent/20 to-teal-400/10",
    glowColor: "rgba(100, 210, 230, 0.4)"
  },
};

export function CognitiveBudgetVisualization({ 
  isOpen = true, 
  onClose, 
  compact = false 
}: CognitiveBudgetVisualizationProps) {
  const { user } = useAuth();
  const [budgetState, setBudgetState] = useState<CognitiveBudgetState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showActivityLogger, setShowActivityLogger] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchBudgetState = async () => {
    if (!user?.id) return;
    
    try {
      cognitiveBudgetLedger.setUser(user.id);
      const state = await cognitiveBudgetLedger.getBudgetState();
      setBudgetState(state);
    } catch (error) {
      console.error("Error fetching budget state:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBudgetState();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchBudgetState, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBudgetState();
  };

  const getTotalPercentage = () => {
    if (!budgetState) return 100;
    return Math.round(budgetState.total.remaining / budgetState.total.capacity * 100);
  };

  const getStatusIcon = (status: DomainBudget["status"]) => {
    switch (status) {
      case "healthy": return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
      case "depleted": return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
      case "overdrawn": return <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />;
    }
  };

  const getBatteryIcon = (percentage: number) => {
    if (percentage > 70) return <BatteryFull className="h-5 w-5 text-emerald-400" />;
    if (percentage > 40) return <BatteryMedium className="h-5 w-5 text-amber-400" />;
    if (percentage > 15) return <BatteryLow className="h-5 w-5 text-orange-400" />;
    return <Battery className="h-5 w-5 text-rose-400" />;
  };

  const getTrendIcon = (domain: CognitiveDomain) => {
    // Simulated trend logic - in production this would compare to yesterday
    const trends: Record<CognitiveDomain, "up" | "down" | "stable"> = {
      work: "down",
      health: "stable",
      social: "up",
      learning: "stable"
    };
    
    switch (trends[domain]) {
      case "up": return <TrendingUp className="h-3 w-3 text-emerald-400" />;
      case "down": return <TrendingDown className="h-3 w-3 text-rose-400" />;
      default: return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  if (!isOpen) return null;

  const totalPercentage = getTotalPercentage();
  const domains = budgetState?.domains || {} as Record<CognitiveDomain, DomainBudget>;

  // Compact mode for inline display
  if (compact) {
    return (
      <GlassCard className="p-5 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 relative">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Brain className="h-4 w-4 text-secondary" />
            Cognitive Budget
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
          </motion.button>
        </div>

        {/* Total Energy Display */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-foreground/10"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#budgetGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 251.2" }}
                animate={{ 
                  strokeDasharray: `${totalPercentage * 2.512} 251.2` 
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--secondary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">{totalPercentage}%</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getBatteryIcon(totalPercentage)}
              <span className="text-sm font-medium text-foreground">
                {totalPercentage > 70 ? "Energized" : totalPercentage > 40 ? "Balanced" : totalPercentage > 15 ? "Low Energy" : "Rest Needed"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {budgetState?.recommendations?.[0] || "Energy levels are being tracked"}
            </p>
          </div>
        </div>

        {/* Domain Bars */}
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(domainConfig) as CognitiveDomain[]).map((domain) => {
            const config = domainConfig[domain];
            const domainData = domains[domain];
            const percentage = domainData ? Math.round((domainData.remaining / domainData.capacity) * 100) : 100;
            
            return (
              <motion.div
                key={domain}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center group"
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${config.bgGradient} mb-2 transition-all group-hover:scale-105`}>
                  <config.icon className={`h-4 w-4 ${config.color} mx-auto`} />
                </div>
                <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden mb-1">
                  <motion.div 
                    className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(percentage, 0)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground capitalize">{domain}</span>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    );
  }

  // Full modal mode
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", duration: 0.6 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl"
        >
          <GlassCard className="p-8 relative overflow-hidden">
            {/* Ambient background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div 
                className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(147,112,219,0.15) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(232,194,123,0.1) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 border border-secondary/20">
                    <Brain className="h-6 w-6 text-secondary" />
                  </div>
                  <motion.div
                    className="absolute -inset-1 rounded-2xl bg-secondary/20 blur-lg"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h2 className="text-xl font-display font-medium text-foreground">Cognitive Budget</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5" />
                    Real-time energy tracking
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
                </motion.button>
                {onClose && (
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    Close
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="relative">
              <TabsList className="w-full bg-foreground/5 p-1 mb-6">
                <TabsTrigger value="overview" className="flex-1 gap-2 data-[state=active]:bg-secondary/20">
                  <Brain className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="forecast" className="flex-1 gap-2 data-[state=active]:bg-accent/20">
                  <BarChart3 className="h-4 w-4" />
                  Forecast
                </TabsTrigger>
                <TabsTrigger value="log" className="flex-1 gap-2 data-[state=active]:bg-primary/20">
                  <Plus className="h-4 w-4" />
                  Log Activity
                </TabsTrigger>
                <TabsTrigger value="recovery" className="flex-1 gap-2 data-[state=active]:bg-rose-500/20">
                  <Leaf className="h-4 w-4" />
                  Recovery
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">

            {/* Main Energy Display */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative text-center py-10 mb-8 rounded-3xl bg-gradient-to-br from-secondary/10 via-foreground/5 to-primary/10 border border-secondary/20 overflow-hidden"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
              />
              
              <div className="relative">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {getBatteryIcon(totalPercentage)}
                  <span className="text-sm text-muted-foreground">Total Energy Available</span>
                </div>
                
                <motion.div 
                  className="text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary via-primary to-secondary"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ backgroundSize: "200%" }}
                >
                  {totalPercentage}%
                </motion.div>
                
                <p className="text-sm text-muted-foreground mt-3">
                  {totalPercentage > 70 ? "You're running at optimal capacity" : 
                   totalPercentage > 40 ? "Moderate energy - pace yourself" : 
                   totalPercentage > 15 ? "Energy is low - consider lighter activities" : 
                   "Rest is recommended - you've worked hard today"}
                </p>
              </div>
            </motion.div>

            {/* Domain Cards Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {(Object.keys(domainConfig) as CognitiveDomain[]).map((domain, index) => {
                const config = domainConfig[domain];
                const domainData = domains[domain];
                const percentage = domainData ? Math.round((domainData.remaining / domainData.capacity) * 100) : 100;
                const spent = domainData ? Math.round(domainData.spent * 100) : 0;
                
                return (
                  <motion.div
                    key={domain}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="relative p-5 rounded-2xl bg-foreground/5 border border-foreground/10 overflow-hidden group hover:border-foreground/20 transition-all"
                  >
                    {/* Hover glow */}
                    <motion.div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        background: `radial-gradient(circle at center, ${config.glowColor} 0%, transparent 70%)` 
                      }}
                    />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${config.bgGradient} border border-white/5`}>
                            <config.icon className={`h-5 w-5 ${config.color}`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{config.label}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {getStatusIcon(domainData?.status || "healthy")}
                              <span className="capitalize">{domainData?.status || "healthy"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(domain)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Remaining</span>
                          <span className={`font-semibold ${config.color}`}>{Math.max(percentage, 0)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                          <motion.div 
                            className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(percentage, 0)}%` }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Spent today: {spent}%</span>
                          <span>Cap: {Math.round((domainData?.capacity || 0.25) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recommendations */}
            {budgetState?.recommendations && budgetState.recommendations.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/10 border border-secondary/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <h4 className="text-sm font-medium text-foreground">Smart Recommendations</h4>
                </div>
                <div className="space-y-2">
                  {budgetState.recommendations.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Footer */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-xs text-muted-foreground mt-4"
            >
              Last updated: {budgetState?.lastUpdated ? new Date(budgetState.lastUpdated).toLocaleTimeString() : "Just now"}
            </motion.p>
              </TabsContent>

              {/* Forecast Tab */}
              <TabsContent value="forecast" className="mt-0">
                <EnergyForecast compact={false} />
              </TabsContent>

              {/* Log Activity Tab */}
              <TabsContent value="log" className="mt-0">
                <ActivityLogger embedded onActivityLogged={handleRefresh} />
              </TabsContent>

              {/* Recovery Tab */}
              <TabsContent value="recovery" className="mt-0">
                <RecoverySuggestions compact={false} />
              </TabsContent>
            </Tabs>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}