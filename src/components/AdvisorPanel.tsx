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
  X
} from "lucide-react";
import { advisorData } from "@/lib/demoData";

interface AdvisorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const advisorIcons: Record<string, any> = {
  CEO: Users,
  CFO: DollarSign,
  CMO: Megaphone,
  COO: Settings,
  CRO: TrendingUp,
};

export function AdvisorPanel({ isOpen, onClose }: AdvisorPanelProps) {
  const [expandedAdvisor, setExpandedAdvisor] = useState<string | null>(null);

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
        className="w-full max-w-2xl max-h-[80vh] overflow-auto"
      >
        <GlassCard className="p-6 relative">
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-foreground/5 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-medium text-foreground">Advisory Council</h2>
              <p className="text-sm text-muted-foreground">Independent perspectives. One decision.</p>
            </div>
          </div>

          {/* Advisors */}
          <div className="space-y-3 mb-6">
            {advisorData.advisors.map((advisor, i) => {
              const Icon = advisorIcons[advisor.role] || Users;
              const isExpanded = expandedAdvisor === advisor.role;

              return (
                <motion.div
                  key={advisor.role}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <button
                    onClick={() => setExpandedAdvisor(isExpanded ? null : advisor.role)}
                    className="w-full text-left"
                  >
                    <div className={`p-4 rounded-xl border transition-all duration-200 ${
                      isExpanded 
                        ? "bg-foreground/10 border-primary/30" 
                        : "bg-foreground/5 border-transparent hover:bg-foreground/10"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{advisor.role}</p>
                            <p className="text-xs text-muted-foreground">{advisor.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm text-foreground">{advisor.insight}</p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round(advisor.confidence * 100)}% confidence
                            </p>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`} />
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-border/50">
                              <div className="grid grid-cols-2 gap-3">
                                <button className="p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm text-left">
                                  Simulate
                                </button>
                                <button className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm text-left text-primary">
                                  Approve
                                </button>
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

          {/* Recommendation */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <p className="text-sm font-medium text-foreground mb-1">Recommendation</p>
            <p className="text-sm text-muted-foreground">{advisorData.recommendation}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm font-medium text-muted-foreground"
            >
              Hold
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-sm font-medium text-white"
            >
              Approve Recommendation
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
