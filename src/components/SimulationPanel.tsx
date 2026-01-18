import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { MetricRing } from "./MetricRing";
import { 
  X, 
  Brain, 
  Lightbulb, 
  Target, 
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Check,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  DollarSign,
  Users,
  Gauge,
  Zap
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface SimulationResult {
  metric: string;
  current: number;
  projected: number;
  confidence: number;
  impact: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
}

interface SimulationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimulationPanel({ isOpen, onClose }: SimulationPanelProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [budgetChange, setBudgetChange] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [capacityChange, setCapacityChange] = useState(0);
  const [results, setResults] = useState<SimulationResult[] | null>(null);

  const runSimulation = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      const simulatedResults: SimulationResult[] = [
        {
          metric: "Monthly Revenue",
          current: 24800,
          projected: 24800 * (1 + (budgetChange * 0.008) + (priceChange * 0.012)),
          confidence: 0.78,
          impact: budgetChange + priceChange > 0 ? "positive" : budgetChange + priceChange < 0 ? "negative" : "neutral",
          icon: DollarSign,
        },
        {
          metric: "Lead Volume",
          current: 142,
          projected: Math.round(142 * (1 + budgetChange * 0.015 - priceChange * 0.005)),
          confidence: 0.82,
          impact: budgetChange > priceChange ? "positive" : "negative",
          icon: Users,
        },
        {
          metric: "Conversion Rate",
          current: 12.4,
          projected: 12.4 * (1 - budgetChange * 0.002 + priceChange * 0.003),
          confidence: 0.71,
          impact: priceChange > budgetChange ? "positive" : "neutral",
          icon: Target,
        },
        {
          metric: "Capacity Utilization",
          current: 78,
          projected: Math.min(100, 78 + capacityChange * 0.5 + budgetChange * 2),
          confidence: 0.89,
          impact: capacityChange > 10 ? "negative" : "positive",
          icon: Gauge,
        },
      ];
      
      setResults(simulatedResults);
      setIsSimulating(false);
    }, 1500);
  };

  const resetSimulation = () => {
    setBudgetChange(0);
    setPriceChange(0);
    setCapacityChange(0);
    setResults(null);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-2xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        <GlassCard className="p-8 relative overflow-hidden">
          {/* Ambient Effects */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl" />

          {/* Header */}
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <motion.div 
                animate={{ rotate: isSimulating ? 360 : 0 }}
                transition={{ duration: 2, repeat: isSimulating ? Infinity : 0, ease: "linear" }}
                className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30"
              >
                <Brain className="h-7 w-7 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-display font-medium text-foreground">Scenario Simulator</h2>
                <p className="text-sm text-muted-foreground">Preview the impact before making changes</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-foreground/10 transition-colors"
            >
              <X className="h-6 w-6 text-muted-foreground" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {/* Controls */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium text-foreground">Adjust Variables</h3>
              </div>

              {/* Budget Change */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-foreground/5 to-foreground/[0.02] border border-border/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">Marketing Budget</span>
                  </div>
                  <span className={`text-lg font-display font-bold ${
                    budgetChange > 0 ? "text-secondary" : budgetChange < 0 ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {budgetChange > 0 ? "+" : ""}{budgetChange}%
                  </span>
                </div>
                <Slider
                  value={[budgetChange]}
                  onValueChange={([v]) => setBudgetChange(v)}
                  min={-50}
                  max={50}
                  step={5}
                  className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-primary [&_[role=slider]]:to-secondary [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-primary/30"
                />
              </motion.div>

              {/* Price Change */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-foreground/5 to-foreground/[0.02] border border-border/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-secondary/10">
                      <TrendingUp className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="font-medium text-foreground">Pricing</span>
                  </div>
                  <span className={`text-lg font-display font-bold ${
                    priceChange > 0 ? "text-secondary" : priceChange < 0 ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {priceChange > 0 ? "+" : ""}{priceChange}%
                  </span>
                </div>
                <Slider
                  value={[priceChange]}
                  onValueChange={([v]) => setPriceChange(v)}
                  min={-30}
                  max={30}
                  step={5}
                  className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-secondary [&_[role=slider]]:to-primary [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-secondary/30"
                />
              </motion.div>

              {/* Capacity Change */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-foreground/5 to-foreground/[0.02] border border-border/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent/10">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <span className="font-medium text-foreground">Capacity Increase</span>
                  </div>
                  <span className={`text-lg font-display font-bold ${
                    capacityChange > 0 ? "text-secondary" : "text-muted-foreground"
                  }`}>
                    +{capacityChange}%
                  </span>
                </div>
                <Slider
                  value={[capacityChange]}
                  onValueChange={([v]) => setCapacityChange(v)}
                  min={0}
                  max={50}
                  step={5}
                  className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-accent [&_[role=slider]]:to-secondary [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-accent/30"
                />
              </motion.div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center justify-center gap-3 shadow-lg shadow-primary/30 disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.div>
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Run Simulation
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetSimulation}
                  className="px-5 py-4 rounded-2xl bg-foreground/10 text-muted-foreground hover:bg-foreground/15 transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-secondary" />
                <h3 className="text-lg font-medium text-foreground">Projected Impact</h3>
              </div>

              {results ? (
                <div className="space-y-4">
                  {results.map((result, i) => (
                    <motion.div
                      key={result.metric}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-5 rounded-2xl border transition-all ${
                        result.impact === "positive"
                          ? "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30"
                          : result.impact === "negative"
                          ? "bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30"
                          : "bg-foreground/5 border-border/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${
                            result.impact === "positive" ? "bg-secondary/20" : 
                            result.impact === "negative" ? "bg-destructive/20" : "bg-muted"
                          }`}>
                            <result.icon className={`h-4 w-4 ${
                              result.impact === "positive" ? "text-secondary" : 
                              result.impact === "negative" ? "text-destructive" : "text-muted-foreground"
                            }`} />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">{result.metric}</span>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          result.impact === "positive"
                            ? "bg-secondary/20 text-secondary"
                            : result.impact === "negative"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {Math.round(result.confidence * 100)}% confidence
                        </span>
                      </div>
                      <div className="flex items-end gap-4">
                        <span className="text-lg text-muted-foreground/60 line-through">
                          {result.metric.includes("Revenue") || result.metric.includes("$")
                            ? `$${result.current.toLocaleString()}`
                            : result.metric.includes("%") || result.metric.includes("Rate") || result.metric.includes("Utilization")
                            ? `${result.current.toFixed(1)}%`
                            : result.current.toLocaleString()
                          }
                        </span>
                        <span className={`text-3xl font-display font-bold ${
                          result.impact === "positive" ? "text-secondary" : 
                          result.impact === "negative" ? "text-destructive" : "text-foreground"
                        }`}>
                          {result.metric.includes("Revenue") || result.metric.includes("$")
                            ? `$${Math.round(result.projected).toLocaleString()}`
                            : result.metric.includes("%") || result.metric.includes("Rate") || result.metric.includes("Utilization")
                            ? `${result.projected.toFixed(1)}%`
                            : Math.round(result.projected).toLocaleString()
                          }
                        </span>
                        {result.impact === "positive" && <TrendingUp className="h-5 w-5 text-secondary mb-1" />}
                        {result.impact === "negative" && <AlertTriangle className="h-5 w-5 text-destructive mb-1" />}
                      </div>
                    </motion.div>
                  ))}

                  <div className="flex gap-3 pt-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-secondary to-secondary/80 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-secondary/30"
                    >
                      <Check className="h-5 w-5" />
                      Apply Changes
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-4 rounded-2xl bg-foreground/10 text-foreground font-medium hover:bg-foreground/15 transition-colors"
                    >
                      Save Scenario
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] flex items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-foreground/5 to-transparent border border-dashed border-border/50"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="h-10 w-10 text-primary/60" />
                    </div>
                    <p className="text-lg font-medium text-foreground mb-2">Ready to Simulate</p>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Adjust the variables on the left and run a simulation to preview projected outcomes
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}