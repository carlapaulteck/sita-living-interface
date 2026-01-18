import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  Lock, 
  Timer, 
  Hand, 
  ShieldOff,
  X,
  ChevronDown
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useCognitiveSafe } from "@/contexts/CognitiveContext";
import { useAdaptationSafe } from "@/contexts/AdaptationContext";

interface TrustSafeguardsProps {
  className?: string;
  compact?: boolean;
}

export function TrustSafeguards({ className = "", compact = false }: TrustSafeguardsProps) {
  const cognitive = useCognitiveSafe();
  const adaptation = useAdaptationSafe();
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!cognitive || !adaptation) return null;
  
  const hasAdaptations = cognitive.currentState !== "neutral";
  
  if (compact && !hasAdaptations) return null;
  
  return (
    <div className={className}>
      {/* Floating button for "Why did you do this?" */}
      {hasAdaptations && !showExplanation && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowExplanation(true)}
          className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm backdrop-blur-sm hover:bg-secondary/30 transition-all"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Why this UI?</span>
        </motion.button>
      )}
      
      {/* Explanation modal */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowExplanation(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard className="p-6 relative">
                <button
                  onClick={() => setShowExplanation(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <h3 className="text-lg font-display font-medium text-foreground mb-4">
                  Why the UI looks this way
                </h3>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                    <p className="text-sm text-foreground">
                      {cognitive.explainWhy()}
                    </p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>Current state: <span className="text-primary capitalize">{cognitive.currentState}</span></p>
                    <p>Confidence: {(cognitive.confidence * 100).toFixed(0)}%</p>
                    <p>Adaptation mode: <span className="capitalize">{cognitive.adaptationMode}</span></p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowExplanation(false)}
                    >
                      Got it
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        cognitive.setLetMeStruggle(true);
                        setShowExplanation(false);
                      }}
                    >
                      <Hand className="h-4 w-4 mr-2" />
                      Let me struggle
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Safeguard controls panel */}
      {!compact && (
        <GlassCard className="p-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-sm font-medium text-foreground"
          >
            <span className="flex items-center gap-2">
              <ShieldOff className="h-4 w-4 text-primary" />
              Trust Controls
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  {/* Let Me Struggle */}
                  <SafeguardToggle
                    icon={Hand}
                    label="Let me struggle"
                    description="Disable all adaptations temporarily"
                    enabled={cognitive.letMeStruggle}
                    onChange={cognitive.setLetMeStruggle}
                  />
                  
                  {/* Lock Current Mode */}
                  <SafeguardToggle
                    icon={Lock}
                    label="Lock current mode"
                    description="Freeze UI state for manual control"
                    enabled={false}
                    onChange={() => {}}
                  />
                  
                  {/* Manual Override Window */}
                  <SafeguardToggle
                    icon={Timer}
                    label="Override window"
                    description="Schedule periods of no adaptation"
                    enabled={false}
                    onChange={() => {}}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      )}
    </div>
  );
}

interface SafeguardToggleProps {
  icon: typeof Hand;
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}

function SafeguardToggle({ icon: Icon, label, description, enabled, onChange }: SafeguardToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-10 h-5 rounded-full transition-all ${enabled ? "bg-primary" : "bg-foreground/20"}`}
      >
        <div className={`w-4 h-4 rounded-full bg-foreground transition-transform mt-0.5 ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

// Compact floating indicator for current adaptations
export function AdaptationIndicator() {
  const cognitive = useCognitiveSafe();
  
  if (!cognitive || cognitive.currentState === "neutral" || cognitive.letMeStruggle) {
    return null;
  }
  
  const stateColors: Record<string, string> = {
    flow: "bg-green-500/20 border-green-500/30 text-green-400",
    hyperfocus: "bg-purple-500/20 border-purple-500/30 text-purple-400",
    distracted: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
    overload: "bg-red-500/20 border-red-500/30 text-red-400",
    fatigued: "bg-orange-500/20 border-orange-500/30 text-orange-400",
    recovery: "bg-blue-500/20 border-blue-500/30 text-blue-400",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-20 right-4 z-30 px-3 py-1.5 rounded-full border text-xs font-medium backdrop-blur-sm ${stateColors[cognitive.currentState] || ""}`}
    >
      <span className="capitalize">{cognitive.currentState}</span>
      <span className="ml-1 opacity-60">
        {(cognitive.confidence * 100).toFixed(0)}%
      </span>
    </motion.div>
  );
}
