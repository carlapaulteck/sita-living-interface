import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { 
  X, 
  Pause, 
  AlertOctagon,
  Shield,
  Wallet,
  Clock,
  CheckSquare,
  Bell,
  Volume2,
  VolumeX
} from "lucide-react";

interface BoundariesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BoundariesPanel({ isOpen, onClose }: BoundariesPanelProps) {
  const [autonomyLevel, setAutonomyLevel] = useState(2); // 0-3 scale
  const [budgetCap, setBudgetCap] = useState(500);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const autonomyLevels = [
    { level: 0, name: "Observe", desc: "Only watch and learn" },
    { level: 1, name: "Suggest", desc: "Recommend actions, wait for approval" },
    { level: 2, name: "Act", desc: "Execute low-risk actions automatically" },
    { level: 3, name: "Autopilot", desc: "Full autonomy within guardrails" },
  ];

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
        className="w-full max-w-lg max-h-[80vh] overflow-auto"
      >
        <GlassCard className="p-6 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-foreground/5 transition-colors z-10"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-medium text-foreground">Boundaries</h2>
              <p className="text-sm text-muted-foreground">How you want the system to operate.</p>
            </div>
          </div>

          {/* Autonomy Level */}
          <div className="mb-6 relative z-10">
            <h3 className="text-sm font-medium text-foreground mb-3">Autopilot Level</h3>
            <div className="space-y-2">
              {autonomyLevels.map((level) => (
                <button
                  key={level.level}
                  onClick={() => setAutonomyLevel(level.level)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    autonomyLevel === level.level
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-foreground/5 hover:bg-foreground/10 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">{level.name}</p>
                      <p className="text-xs text-muted-foreground">{level.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      autonomyLevel === level.level
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}>
                      {autonomyLevel === level.level && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Caps */}
          <div className="mb-6 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                Budget Caps
              </h3>
              <span className="text-sm text-primary font-medium">${budgetCap}/mo</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={budgetCap}
              onChange={(e) => setBudgetCap(parseInt(e.target.value))}
              className="w-full h-2 bg-foreground/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>$100</span>
              <span>$2,000</span>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="mb-6 relative z-10">
            <button
              onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
              className="w-full p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {quietHoursEnabled ? (
                    <VolumeX className="h-5 w-5 text-primary" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="text-left">
                    <p className="font-medium text-sm text-foreground">Quiet Hours</p>
                    <p className="text-xs text-muted-foreground">10pm - 7am · No notifications</p>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors ${
                  quietHoursEnabled ? "bg-primary" : "bg-muted"
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
                    quietHoursEnabled ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                  }`} />
                </div>
              </div>
            </button>
          </div>

          {/* Approvals Required */}
          <div className="mb-6 relative z-10">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
              Always Require Approval
            </h3>
            <div className="space-y-2">
              {[
                "Spend over $50",
                "External messages to new contacts",
                "Calendar changes",
                "Posting public content"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5">
                  <div className="w-4 h-4 rounded border-2 border-primary bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-sm" />
                  </div>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Stop */}
          <div className="relative z-10">
            <button
              onClick={() => setEmergencyMode(!emergencyMode)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                emergencyMode
                  ? "bg-destructive/20 border-destructive"
                  : "bg-foreground/5 border-transparent hover:border-destructive/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertOctagon className={`h-6 w-6 ${emergencyMode ? "text-destructive" : "text-muted-foreground"}`} />
                <div className="text-left">
                  <p className={`font-medium text-sm ${emergencyMode ? "text-destructive" : "text-foreground"}`}>
                    {emergencyMode ? "All Automation Paused" : "Emergency Stop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {emergencyMode ? "Click again to resume" : "Pause all outbound actions immediately"}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
