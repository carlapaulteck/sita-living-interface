import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  Users, 
  TrendingUp, 
  Megaphone, 
  Settings, 
  DollarSign,
  ChevronDown,
  Sparkles,
  X,
  Brain,
  Target,
  Lightbulb,
  Check,
  Clock,
  ArrowRight,
  Zap,
  BarChart3
} from "lucide-react";
import { advisorData } from "@/lib/demoData";

interface AdvisorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const advisorConfig: Record<string, { 
  icon: any; 
  gradient: string; 
  bgGlow: string;
  accentColor: string;
}> = {
  CEO: { 
    icon: Users, 
    gradient: "from-purple-500 to-violet-600",
    bgGlow: "bg-purple-500/20",
    accentColor: "text-purple-400"
  },
  CFO: { 
    icon: DollarSign, 
    gradient: "from-emerald-500 to-teal-600",
    bgGlow: "bg-emerald-500/20",
    accentColor: "text-emerald-400"
  },
  CMO: { 
    icon: Megaphone, 
    gradient: "from-orange-500 to-amber-600",
    bgGlow: "bg-orange-500/20",
    accentColor: "text-orange-400"
  },
  COO: { 
    icon: Settings, 
    gradient: "from-blue-500 to-cyan-600",
    bgGlow: "bg-blue-500/20",
    accentColor: "text-blue-400"
  },
  CRO: { 
    icon: TrendingUp, 
    gradient: "from-rose-500 to-pink-600",
    bgGlow: "bg-rose-500/20",
    accentColor: "text-rose-400"
  },
};

export function AdvisorPanel({ isOpen, onClose }: AdvisorPanelProps) {
  const [expandedAdvisor, setExpandedAdvisor] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[85vh] overflow-auto"
      >
        <GlassCard className="p-8 relative overflow-hidden">
          {/* Animated background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-secondary/30"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 hover:scale-105 z-10"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8 relative">
            <motion.div 
              className="relative"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/20 border border-primary/20">
                <Brain className="h-7 w-7 text-primary" />
              </div>
              <motion.div
                className="absolute -inset-2 rounded-3xl border border-primary/20"
                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h2 className="text-2xl font-display font-medium text-foreground">Advisory Council</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Five perspectives. One aligned decision.</p>
            </div>
            
            {/* Status badge */}
            <motion.div 
              className="ml-auto px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 flex items-center gap-2"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-2 h-2 rounded-full bg-secondary"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-secondary">Council Active</span>
            </motion.div>
          </div>

          {/* Advisors Grid */}
          <div className="space-y-3 mb-8">
            {advisorData.advisors.map((advisor, i) => {
              const config = advisorConfig[advisor.role] || advisorConfig.CEO;
              const Icon = config.icon;
              const isExpanded = expandedAdvisor === advisor.role;

              return (
                <motion.div
                  key={advisor.role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, type: "spring" }}
                >
                  <button
                    onClick={() => setExpandedAdvisor(isExpanded ? null : advisor.role)}
                    className="w-full text-left group"
                  >
                    <div className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                      isExpanded 
                        ? "bg-foreground/10 border-primary/40 shadow-lg shadow-primary/5" 
                        : "bg-foreground/5 border-transparent hover:bg-foreground/8 hover:border-foreground/10"
                    }`}>
                      {/* Glow effect on hover */}
                      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${config.bgGlow} blur-xl`} />
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}
                            whileHover={{ scale: 1.05, rotate: 5 }}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </motion.div>
                          <div>
                            <p className="font-medium text-foreground text-lg">{advisor.role}</p>
                            <p className="text-sm text-muted-foreground">{advisor.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`text-sm font-medium ${config.accentColor}`}>{advisor.insight}</p>
                            <div className="flex items-center gap-2 justify-end mt-1">
                              <div className="h-1.5 w-16 rounded-full bg-foreground/10 overflow-hidden">
                                <motion.div 
                                  className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${advisor.confidence * 100}%` }}
                                  transition={{ delay: 0.3 + i * 0.1 }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {Math.round(advisor.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-5 pt-5 border-t border-border/30">
                              <div className="grid grid-cols-3 gap-3">
                                <motion.button 
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 text-left group"
                                >
                                  <BarChart3 className="h-4 w-4 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                                  <span className="text-sm font-medium text-foreground">Simulate</span>
                                  <p className="text-xs text-muted-foreground mt-0.5">Test impact</p>
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`p-4 rounded-xl bg-gradient-to-br ${config.gradient} text-left group shadow-lg`}
                                >
                                  <Check className="h-4 w-4 text-white/80 mb-2" />
                                  <span className="text-sm font-medium text-white">Approve</span>
                                  <p className="text-xs text-white/70 mt-0.5">Execute now</p>
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 text-left group"
                                >
                                  <Clock className="h-4 w-4 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                                  <span className="text-sm font-medium text-foreground">Defer</span>
                                  <p className="text-xs text-muted-foreground mt-0.5">Decide later</p>
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Unified Recommendation */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Lightbulb className="h-5 w-5 text-primary" />
                </motion.div>
                <p className="text-sm font-semibold text-foreground">Unified Recommendation</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{advisorData.recommendation}</p>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 py-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 text-sm font-medium text-muted-foreground border border-transparent hover:border-foreground/10"
            >
              Hold Decision
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-200 text-sm font-medium text-white shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              <span>Approve Recommendation</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
