import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  X, 
  Beaker, 
  TrendingUp, 
  TrendingDown,
  Pause,
  Play,
  Trophy,
  AlertCircle,
  BarChart3,
  Users,
  DollarSign,
  Zap
} from "lucide-react";

interface Experiment {
  id: string;
  name: string;
  type: "offer" | "creative" | "copy" | "pricing" | "flow";
  status: "testing" | "scaling" | "paused" | "winner" | "killed";
  startDate: string;
  lift: number;
  confidence: number;
  sampleSize: number;
  control: {
    name: string;
    conversions: number;
    visitors: number;
  };
  variant: {
    name: string;
    conversions: number;
    visitors: number;
  };
}

interface ExperimentsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const experiments: Experiment[] = [
  {
    id: "e1",
    name: "Homepage Hero CTA",
    type: "copy",
    status: "testing",
    startDate: "2026-01-10",
    lift: 8.2,
    confidence: 0.72,
    sampleSize: 2450,
    control: { name: "Get Started", conversions: 124, visitors: 1200 },
    variant: { name: "Start Free Trial", conversions: 142, visitors: 1250 },
  },
  {
    id: "e2",
    name: "Email Subject Lines",
    type: "copy",
    status: "winner",
    startDate: "2026-01-05",
    lift: 23.4,
    confidence: 0.94,
    sampleSize: 8200,
    control: { name: "Your weekly update", conversions: 312, visitors: 4100 },
    variant: { name: "3 things you missed", conversions: 398, visitors: 4100 },
  },
  {
    id: "e3",
    name: "Pricing Page Layout",
    type: "flow",
    status: "paused",
    startDate: "2026-01-12",
    lift: -2.1,
    confidence: 0.45,
    sampleSize: 890,
    control: { name: "3-column", conversions: 42, visitors: 450 },
    variant: { name: "2-column focus", conversions: 39, visitors: 440 },
  },
  {
    id: "e4",
    name: "Bundle Offer",
    type: "offer",
    status: "scaling",
    startDate: "2026-01-08",
    lift: 14.2,
    confidence: 0.89,
    sampleSize: 3200,
    control: { name: "Single product", conversions: 156, visitors: 1600 },
    variant: { name: "Bundle + 20% off", conversions: 182, visitors: 1600 },
  },
  {
    id: "e5",
    name: "UGC Creative",
    type: "creative",
    status: "testing",
    startDate: "2026-01-14",
    lift: 5.8,
    confidence: 0.58,
    sampleSize: 1200,
    control: { name: "Product shot", conversions: 58, visitors: 600 },
    variant: { name: "Customer video", conversions: 64, visitors: 600 },
  },
];

const statusColors = {
  testing: "bg-primary/20 text-primary",
  scaling: "bg-secondary/20 text-secondary",
  paused: "bg-muted text-muted-foreground",
  winner: "bg-secondary/20 text-secondary",
  killed: "bg-destructive/20 text-destructive",
};

const statusIcons = {
  testing: Beaker,
  scaling: TrendingUp,
  paused: Pause,
  winner: Trophy,
  killed: AlertCircle,
};

const typeIcons = {
  offer: DollarSign,
  creative: Zap,
  copy: BarChart3,
  pricing: DollarSign,
  flow: Users,
};

export function ExperimentsDashboard({ isOpen, onClose }: ExperimentsDashboardProps) {
  const [filter, setFilter] = useState<"all" | "testing" | "scaling" | "completed">("all");
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);

  if (!isOpen) return null;

  const filteredExperiments = experiments.filter((exp) => {
    if (filter === "all") return true;
    if (filter === "testing") return exp.status === "testing";
    if (filter === "scaling") return exp.status === "scaling";
    if (filter === "completed") return exp.status === "winner" || exp.status === "killed";
    return true;
  });

  const stats = {
    active: experiments.filter((e) => e.status === "testing" || e.status === "scaling").length,
    winners: experiments.filter((e) => e.status === "winner").length,
    avgLift: experiments.filter((e) => e.lift > 0).reduce((acc, e) => acc + e.lift, 0) / experiments.filter((e) => e.lift > 0).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 p-4 border-b border-border/50 bg-background/80 backdrop-blur-xl z-10">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h2 className="text-xl font-display font-medium text-foreground">Experiments Lab</h2>
            <p className="text-sm text-muted-foreground">Continuous optimization through testing</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-border/50 hover:bg-foreground/5 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 pb-20">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Beaker className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-semibold text-foreground">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active Experiments</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-secondary/10">
                <Trophy className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-display font-semibold text-foreground">{stats.winners}</p>
                <p className="text-sm text-muted-foreground">Winners This Month</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-semibold text-foreground">+{stats.avgLift.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Average Lift</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "testing", "scaling", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-foreground/5"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Experiments List */}
        <div className="space-y-4">
          {filteredExperiments.map((experiment, i) => {
            const StatusIcon = statusIcons[experiment.status];
            const TypeIcon = typeIcons[experiment.type];
            const controlRate = (experiment.control.conversions / experiment.control.visitors) * 100;
            const variantRate = (experiment.variant.conversions / experiment.variant.visitors) * 100;

            return (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard
                  className="p-5 cursor-pointer hover:bg-foreground/[0.02] transition-colors"
                  onClick={() => setSelectedExperiment(experiment)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-foreground/5">
                        <TypeIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{experiment.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Started {new Date(experiment.startDate).toLocaleDateString()} · {experiment.sampleSize.toLocaleString()} samples
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusColors[experiment.status]}`}>
                        <StatusIcon className="h-3 w-3" />
                        {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Lift */}
                    <div className="p-3 rounded-xl bg-foreground/5">
                      <p className="text-xs text-muted-foreground mb-1">Lift</p>
                      <div className="flex items-center gap-1">
                        {experiment.lift >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-secondary" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={`text-lg font-semibold ${
                          experiment.lift >= 0 ? "text-secondary" : "text-destructive"
                        }`}>
                          {experiment.lift >= 0 ? "+" : ""}{experiment.lift.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="p-3 rounded-xl bg-foreground/5">
                      <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-foreground">
                          {(experiment.confidence * 100).toFixed(0)}%
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              experiment.confidence >= 0.95 ? "bg-secondary" :
                              experiment.confidence >= 0.8 ? "bg-primary" : "bg-muted-foreground"
                            }`}
                            style={{ width: `${experiment.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Conversion Rates */}
                    <div className="p-3 rounded-xl bg-foreground/5">
                      <p className="text-xs text-muted-foreground mb-1">Conversion</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{controlRate.toFixed(1)}%</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-foreground font-medium">{variantRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Experiment Detail Modal */}
      <AnimatePresence>
        {selectedExperiment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedExperiment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-foreground">{selectedExperiment.name}</h3>
                  <button onClick={() => setSelectedExperiment(null)}>
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Control vs Variant */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-foreground/5">
                      <p className="text-xs text-muted-foreground mb-2">Control</p>
                      <p className="font-medium text-foreground mb-1">{selectedExperiment.control.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedExperiment.control.conversions} / {selectedExperiment.control.visitors}
                      </p>
                      <p className="text-lg font-semibold text-foreground mt-2">
                        {((selectedExperiment.control.conversions / selectedExperiment.control.visitors) * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl ${selectedExperiment.lift >= 0 ? "bg-secondary/10" : "bg-destructive/10"}`}>
                      <p className="text-xs text-muted-foreground mb-2">Variant</p>
                      <p className="font-medium text-foreground mb-1">{selectedExperiment.variant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedExperiment.variant.conversions} / {selectedExperiment.variant.visitors}
                      </p>
                      <p className={`text-lg font-semibold mt-2 ${selectedExperiment.lift >= 0 ? "text-secondary" : "text-destructive"}`}>
                        {((selectedExperiment.variant.conversions / selectedExperiment.variant.visitors) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-border/50">
                    {selectedExperiment.status === "testing" && selectedExperiment.confidence >= 0.95 && (
                      <button className="flex-1 py-3 rounded-xl bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors font-medium">
                        Declare Winner
                      </button>
                    )}
                    {selectedExperiment.status === "testing" && (
                      <button className="flex-1 py-3 rounded-xl bg-foreground/5 text-muted-foreground hover:bg-foreground/10 transition-colors">
                        Pause Experiment
                      </button>
                    )}
                    {selectedExperiment.status === "paused" && (
                      <button className="flex-1 py-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-medium flex items-center justify-center gap-2">
                        <Play className="h-4 w-4" />
                        Resume
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedExperiment(null)}
                      className="flex-1 py-3 rounded-xl bg-foreground/5 text-muted-foreground hover:bg-foreground/10 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
