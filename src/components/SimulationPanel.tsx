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
  Sliders
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface SimulationResult {
  metric: string;
  current: number;
  projected: number;
  confidence: number;
  impact: "positive" | "negative" | "neutral";
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
    
    // Simulate API delay
    setTimeout(() => {
      const simulatedResults: SimulationResult[] = [
        {
          metric: "Monthly Revenue",
          current: 24800,
          projected: 24800 * (1 + (budgetChange * 0.008) + (priceChange * 0.012)),
          confidence: 0.78,
          impact: budgetChange + priceChange > 0 ? "positive" : budgetChange + priceChange < 0 ? "negative" : "neutral",
        },
        {
          metric: "Lead Volume",
          current: 142,
          projected: Math.round(142 * (1 + budgetChange * 0.015 - priceChange * 0.005)),
          confidence: 0.82,
          impact: budgetChange > priceChange ? "positive" : "negative",
        },
        {
          metric: "Conversion Rate",
          current: 12.4,
          projected: 12.4 * (1 - budgetChange * 0.002 + priceChange * 0.003),
          confidence: 0.71,
          impact: priceChange > budgetChange ? "positive" : "neutral",
        },
        {
          metric: "Capacity Utilization",
          current: 78,
          projected: Math.min(100, 78 + capacityChange * 0.5 + budgetChange * 2),
          confidence: 0.89,
          impact: capacityChange > 10 ? "negative" : "positive",
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
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <GlassCard className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-display font-medium text-foreground">Scenario Simulator</h2>
                <p className="text-sm text-muted-foreground">See the projected impact before making changes</p>
              </div>
            </div>
            <button onClick={onClose}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  Adjust Variables
                </h3>

                {/* Budget Change */}
                <div className="p-4 rounded-xl bg-foreground/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-foreground">Marketing Budget</span>
                    <span className={`text-sm font-medium ${
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
                  />
                </div>

                {/* Price Change */}
                <div className="p-4 rounded-xl bg-foreground/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-foreground">Pricing</span>
                    <span className={`text-sm font-medium ${
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
                  />
                </div>

                {/* Capacity Change */}
                <div className="p-4 rounded-xl bg-foreground/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-foreground">Capacity Increase</span>
                    <span className={`text-sm font-medium ${
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
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="flex-1 py-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isSimulating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Simulation
                    </>
                  )}
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-4 py-3 rounded-xl bg-foreground/5 text-muted-foreground hover:bg-foreground/10 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Projected Impact
              </h3>

              {results ? (
                <div className="space-y-3">
                  {results.map((result, i) => (
                    <motion.div
                      key={result.metric}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl bg-foreground/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{result.metric}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          result.impact === "positive"
                            ? "bg-secondary/20 text-secondary"
                            : result.impact === "negative"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {Math.round(result.confidence * 100)}% confidence
                        </span>
                      </div>
                      <div className="flex items-end gap-3">
                        <span className="text-lg font-medium text-muted-foreground line-through">
                          {result.metric.includes("Revenue") || result.metric.includes("$")
                            ? `$${result.current.toLocaleString()}`
                            : result.metric.includes("%") || result.metric.includes("Rate") || result.metric.includes("Utilization")
                            ? `${result.current.toFixed(1)}%`
                            : result.current.toLocaleString()
                          }
                        </span>
                        <span className={`text-2xl font-display font-semibold ${
                          result.impact === "positive" ? "text-secondary" : result.impact === "negative" ? "text-destructive" : "text-foreground"
                        }`}>
                          {result.metric.includes("Revenue") || result.metric.includes("$")
                            ? `$${Math.round(result.projected).toLocaleString()}`
                            : result.metric.includes("%") || result.metric.includes("Rate") || result.metric.includes("Utilization")
                            ? `${result.projected.toFixed(1)}%`
                            : Math.round(result.projected).toLocaleString()
                          }
                        </span>
                        {result.impact === "positive" && <TrendingUp className="h-4 w-4 text-secondary" />}
                        {result.impact === "negative" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8 rounded-xl bg-foreground/5">
                  <div className="text-center">
                    <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Adjust the variables and run a simulation to see projected outcomes</p>
                  </div>
                </div>
              )}

              {results && (
                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <button className="flex-1 py-3 rounded-xl bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors font-medium flex items-center justify-center gap-2">
                    <Check className="h-4 w-4" />
                    Apply Changes
                  </button>
                  <button className="flex-1 py-3 rounded-xl bg-foreground/5 text-muted-foreground hover:bg-foreground/10 transition-colors">
                    Save Scenario
                  </button>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
