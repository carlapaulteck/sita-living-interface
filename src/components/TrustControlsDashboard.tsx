import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { 
  X, 
  Shield, 
  Hand, 
  Eye, 
  EyeOff,
  Clock,
  Brain,
  Battery,
  Activity,
  Lock,
  Unlock,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Check,
  RefreshCw
} from "lucide-react";
import { useAdaptationSafe } from "@/contexts/AdaptationContext";
import { useCognitiveSafe } from "@/contexts/CognitiveContext";

interface TrustControlsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrustControlsDashboard({ isOpen, onClose }: TrustControlsDashboardProps) {
  const adaptation = useAdaptationSafe();
  const cognitive = useCognitiveSafe();
  const [activeTab, setActiveTab] = useState<'overview' | 'controls' | 'insights'>('overview');
  
  if (!isOpen) return null;

  const budgetPercentage = (adaptation?.cognitiveBudgetRemaining ?? 1) * 100;
  const momentState = adaptation?.momentState ?? 'neutral';
  const confidence = adaptation?.confidence ?? 0.5;
  
  const stateColors: Record<string, { bg: string; text: string; border: string }> = {
    flow: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
    hyperfocus: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    distracted: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
    overload: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    fatigued: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
    recovery: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    neutral: { bg: "bg-foreground/5", text: "text-muted-foreground", border: "border-foreground/10" },
  };

  const currentStateStyle = stateColors[momentState] || stateColors.neutral;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg my-8"
      >
        <GlassCard className="relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/15 rounded-full blur-3xl" />
          
          {/* Header */}
          <div className="p-6 pb-0 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 border border-secondary/20">
                  <Shield className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-medium text-foreground">Trust Controls</h2>
                  <p className="text-xs text-muted-foreground">Your cognitive sovereignty dashboard</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-lg bg-foreground/5">
              {(['overview', 'controls', 'insights'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 relative z-10">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  {/* Current State */}
                  <div className={`p-4 rounded-xl border ${currentStateStyle.bg} ${currentStateStyle.border}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className={`h-4 w-4 ${currentStateStyle.text}`} />
                        <span className="text-sm font-medium text-foreground">Current State</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${currentStateStyle.bg} ${currentStateStyle.text} border ${currentStateStyle.border}`}>
                        {(confidence * 100).toFixed(0)}% confident
                      </span>
                    </div>
                    <p className={`text-2xl font-display font-medium capitalize ${currentStateStyle.text}`}>
                      {momentState}
                    </p>
                    {cognitive && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {cognitive.explainWhy()}
                      </p>
                    )}
                  </div>

                  {/* Cognitive Budget */}
                  <div className="p-4 rounded-xl bg-foreground/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Cognitive Budget</span>
                      </div>
                      <span className="text-sm text-primary font-medium">
                        {budgetPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${budgetPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          budgetPercentage > 60 
                            ? 'bg-gradient-to-r from-green-500 to-primary' 
                            : budgetPercentage > 30 
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                              : 'bg-gradient-to-r from-red-500 to-orange-500'
                        }`}
                      />
                    </div>
                    
                    {/* Domain breakdown */}
                    {adaptation?.budgetState && (
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {Object.entries(adaptation.budgetState.domains).map(([domain, data]) => (
                          <div key={domain} className="text-center">
                            <div className="h-1 rounded-full bg-foreground/10 mb-1.5 overflow-hidden">
                              <div 
                                className="h-full bg-secondary rounded-full"
                                style={{ width: `${(data as { remaining: number }).remaining * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground capitalize">{domain}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Recommendations */}
                  {adaptation?.getRecommendations && adaptation.getRecommendations().length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium text-foreground">Recommendations</span>
                      </div>
                      {adaptation.getRecommendations().slice(0, 3).map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                          <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'controls' && (
                <motion.div
                  key="controls"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  {/* Let Me Struggle */}
                  <ControlCard
                    icon={Hand}
                    title="Let me struggle"
                    description="Temporarily disable all UI adaptations"
                    enabled={cognitive?.letMeStruggle ?? false}
                    onChange={(v) => cognitive?.setLetMeStruggle(v)}
                  />

                  {/* Adaptation Mode */}
                  <div className="p-4 rounded-xl bg-foreground/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Adaptation Visibility</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['invisible', 'subtle', 'visible'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => cognitive?.setAdaptationMode(mode)}
                          className={`py-2 px-3 rounded-lg text-sm capitalize transition-all ${
                            cognitive?.adaptationMode === mode
                              ? 'bg-primary/20 text-primary border border-primary/30'
                              : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {cognitive?.adaptationMode === 'invisible' 
                        ? "UI changes happen silently in the background"
                        : cognitive?.adaptationMode === 'subtle'
                          ? "You'll see gentle hints when the UI adapts"
                          : "All adaptations are clearly announced"}
                    </p>
                  </div>

                  {/* Override Window */}
                  <ControlCard
                    icon={Clock}
                    title="Focus mode (2 hours)"
                    description="Lock current UI state for deep work"
                    enabled={false}
                    onChange={() => {}}
                  />

                  {/* Safety Lock */}
                  <ControlCard
                    icon={Lock}
                    title="Safety lock"
                    description="Require confirmation for any UI changes"
                    enabled={false}
                    onChange={() => {}}
                  />
                </motion.div>
              )}

              {activeTab === 'insights' && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  {/* Evolution Insights */}
                  {adaptation?.evolutionInsights && adaptation.evolutionInsights.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Learning from You</span>
                      </div>
                      {adaptation.evolutionInsights.map((insight, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10"
                        >
                          <p className="text-sm text-foreground">{insight}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Still learning your patterns...
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Insights will appear as SITA learns your rhythms
                      </p>
                    </div>
                  )}

                  {/* Pattern Awareness */}
                  <div className="p-4 rounded-xl bg-foreground/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">What I've Noticed</span>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• You work best in 45-minute focused sprints</p>
                      <p>• Energy typically peaks mid-morning</p>
                      <p>• Context switches cost you ~8 min recovery</p>
                    </div>
                  </div>

                  {/* Data Transparency */}
                  <div className="p-4 rounded-xl bg-foreground/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Your Data</span>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Export All
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All cognitive data is stored locally and encrypted. 
                      You can export or delete anytime.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 relative z-10">
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

interface ControlCardProps {
  icon: typeof Hand;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}

function ControlCard({ icon: Icon, title, description, enabled, onChange }: ControlCardProps) {
  return (
    <div className={`p-4 rounded-xl transition-all ${enabled ? 'bg-primary/10 border border-primary/20' : 'bg-foreground/5'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${enabled ? 'bg-primary/20' : 'bg-foreground/5'}`}>
            <Icon className={`h-4 w-4 ${enabled ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onChange} />
      </div>
    </div>
  );
}
