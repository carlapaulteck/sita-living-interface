import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Wind,
  Footprints,
  Coffee,
  Music,
  Sun,
  Droplets,
  Eye,
  Smile,
  Phone,
  BookOpen,
  Moon,
  Sparkles,
  Clock,
  ArrowRight,
  Check,
  RefreshCw,
  BrainCircuit,
  TreePine,
  Waves
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cognitiveBudgetLedger, CognitiveDomain, CognitiveBudgetState } from "@/lib/cognitiveBudgetLedger";

interface RecoverySuggestion {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: typeof Heart;
  domain: CognitiveDomain;
  energyRestore: number;
  gradient: string;
  bgGradient: string;
}

const allSuggestions: RecoverySuggestion[] = [
  // Health/Physical Recovery
  {
    id: "walk",
    title: "Take a Walk",
    description: "A 10-minute walk outdoors can reset your mental state",
    duration: "10 min",
    icon: Footprints,
    domain: "health",
    energyRestore: 15,
    gradient: "from-emerald-500 to-teal-400",
    bgGradient: "from-emerald-500/20 to-teal-400/10"
  },
  {
    id: "stretch",
    title: "Desk Stretches",
    description: "Quick stretches to release tension and improve circulation",
    duration: "5 min",
    icon: Wind,
    domain: "health",
    energyRestore: 10,
    gradient: "from-cyan-500 to-blue-400",
    bgGradient: "from-cyan-500/20 to-blue-400/10"
  },
  {
    id: "breathing",
    title: "Box Breathing",
    description: "4 seconds in, hold, out, hold. Repeat for calm focus",
    duration: "3 min",
    icon: Waves,
    domain: "health",
    energyRestore: 12,
    gradient: "from-violet-500 to-purple-400",
    bgGradient: "from-violet-500/20 to-purple-400/10"
  },
  {
    id: "hydrate",
    title: "Hydrate",
    description: "Drink a full glass of water - dehydration drains energy",
    duration: "1 min",
    icon: Droplets,
    domain: "health",
    energyRestore: 5,
    gradient: "from-blue-500 to-cyan-400",
    bgGradient: "from-blue-500/20 to-cyan-400/10"
  },
  {
    id: "sunlight",
    title: "Get Sunlight",
    description: "Step outside for natural light to boost alertness",
    duration: "5 min",
    icon: Sun,
    domain: "health",
    energyRestore: 10,
    gradient: "from-amber-500 to-yellow-400",
    bgGradient: "from-amber-500/20 to-yellow-400/10"
  },

  // Social Recovery
  {
    id: "chat",
    title: "Social Break",
    description: "Brief casual chat with someone you like",
    duration: "5 min",
    icon: Smile,
    domain: "social",
    energyRestore: 10,
    gradient: "from-secondary to-pink-400",
    bgGradient: "from-secondary/20 to-pink-400/10"
  },
  {
    id: "call",
    title: "Quick Call",
    description: "Call a friend or family member for connection",
    duration: "10 min",
    icon: Phone,
    domain: "social",
    energyRestore: 15,
    gradient: "from-rose-500 to-pink-400",
    bgGradient: "from-rose-500/20 to-pink-400/10"
  },

  // Mental/Learning Recovery
  {
    id: "read",
    title: "Leisure Reading",
    description: "Read something light and enjoyable, not work-related",
    duration: "15 min",
    icon: BookOpen,
    domain: "learning",
    energyRestore: 10,
    gradient: "from-accent to-teal-400",
    bgGradient: "from-accent/20 to-teal-400/10"
  },
  {
    id: "music",
    title: "Listen to Music",
    description: "Put on a favorite song or calming playlist",
    duration: "5 min",
    icon: Music,
    domain: "learning",
    energyRestore: 8,
    gradient: "from-fuchsia-500 to-purple-400",
    bgGradient: "from-fuchsia-500/20 to-purple-400/10"
  },

  // Work Recovery
  {
    id: "coffee",
    title: "Coffee Break",
    description: "Step away for a proper coffee or tea break",
    duration: "10 min",
    icon: Coffee,
    domain: "work",
    energyRestore: 10,
    gradient: "from-primary to-amber-400",
    bgGradient: "from-primary/20 to-amber-400/10"
  },
  {
    id: "eyes",
    title: "20-20-20 Rule",
    description: "Look at something 20 feet away for 20 seconds",
    duration: "1 min",
    icon: Eye,
    domain: "work",
    energyRestore: 5,
    gradient: "from-sky-500 to-blue-400",
    bgGradient: "from-sky-500/20 to-blue-400/10"
  },
  {
    id: "nature",
    title: "Nature View",
    description: "Look at plants or nature photos to reduce stress",
    duration: "2 min",
    icon: TreePine,
    domain: "work",
    energyRestore: 7,
    gradient: "from-green-500 to-emerald-400",
    bgGradient: "from-green-500/20 to-emerald-400/10"
  },

  // Deep Recovery
  {
    id: "meditation",
    title: "Mini Meditation",
    description: "Close your eyes and focus on your breath",
    duration: "5 min",
    icon: BrainCircuit,
    domain: "health",
    energyRestore: 15,
    gradient: "from-indigo-500 to-violet-400",
    bgGradient: "from-indigo-500/20 to-violet-400/10"
  },
  {
    id: "powernap",
    title: "Power Nap",
    description: "A 15-20 minute nap can significantly restore energy",
    duration: "20 min",
    icon: Moon,
    domain: "health",
    energyRestore: 25,
    gradient: "from-slate-500 to-zinc-400",
    bgGradient: "from-slate-500/20 to-zinc-400/10"
  },
];

interface RecoverySuggestionsProps {
  compact?: boolean;
}

export function RecoverySuggestions({ compact = false }: RecoverySuggestionsProps) {
  const { user } = useAuth();
  const [budgetState, setBudgetState] = useState<CognitiveBudgetState | null>(null);
  const [suggestions, setSuggestions] = useState<RecoverySuggestion[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchStateAndGenerateSuggestions();
  }, [user?.id]);

  const fetchStateAndGenerateSuggestions = async () => {
    if (!user?.id) return;

    try {
      cognitiveBudgetLedger.setUser(user.id);
      const state = await cognitiveBudgetLedger.getBudgetState();
      setBudgetState(state);
      generateSuggestions(state);
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  const generateSuggestions = (state: CognitiveBudgetState) => {
    const selected: RecoverySuggestion[] = [];
    
    // Find depleted domains
    const depletedDomains: CognitiveDomain[] = [];
    for (const [domain, budget] of Object.entries(state.domains)) {
      if (budget.status === "depleted" || budget.status === "overdrawn") {
        depletedDomains.push(domain as CognitiveDomain);
      }
    }

    // Prioritize suggestions based on depleted domains
    if (depletedDomains.length > 0) {
      // For depleted domains, suggest recovery from OTHER domains
      for (const depleted of depletedDomains) {
        // Get suggestions from healthy domains that could help
        const crossDomainHelpers: Record<CognitiveDomain, CognitiveDomain[]> = {
          work: ["health", "social"], // Work depleted? Try health or social activities
          health: ["social", "learning"], // Health depleted? Try social or learning
          social: ["health", "learning"], // Social depleted? Try health or learning
          learning: ["health", "social"], // Learning depleted? Try health or social
        };

        const helperDomains = crossDomainHelpers[depleted];
        for (const helper of helperDomains) {
          const helperBudget = state.domains[helper];
          if (helperBudget.status === "healthy") {
            const domainSuggestions = allSuggestions.filter(s => s.domain === helper);
            const available = domainSuggestions.filter(s => !selected.find(sel => sel.id === s.id));
            if (available.length > 0) {
              selected.push(available[Math.floor(Math.random() * available.length)]);
            }
          }
        }
      }
    }

    // If overall energy is low, add high-restore activities
    if (state.total.remaining < 0.3) {
      const highRestore = allSuggestions
        .filter(s => s.energyRestore >= 15)
        .filter(s => !selected.find(sel => sel.id === s.id));
      if (highRestore.length > 0) {
        selected.push(highRestore[Math.floor(Math.random() * highRestore.length)]);
      }
    }

    // Fill with general suggestions if needed
    while (selected.length < (compact ? 3 : 5)) {
      const remaining = allSuggestions.filter(s => !selected.find(sel => sel.id === s.id));
      if (remaining.length === 0) break;
      selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }

    // Sort by energy restore (highest first)
    selected.sort((a, b) => b.energyRestore - a.energyRestore);

    setSuggestions(selected);
  };

  const handleComplete = async (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion || !user?.id) return;

    setCompletedActivities([...completedActivities, suggestionId]);

    // Log as restorative activity
    try {
      cognitiveBudgetLedger.setUser(user.id);
      await cognitiveBudgetLedger.logActivity(
        suggestion.id,
        suggestion.domain,
        -(suggestion.energyRestore / 100) // Negative cost = restoration
      );
    } catch (error) {
      console.error("Error logging recovery:", error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (budgetState) {
      generateSuggestions(budgetState);
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getMostDepletedDomain = () => {
    if (!budgetState) return null;
    let lowest: CognitiveDomain = "work";
    let lowestRemaining = 1;

    for (const [domain, budget] of Object.entries(budgetState.domains)) {
      if (budget.remaining < lowestRemaining) {
        lowestRemaining = budget.remaining;
        lowest = domain as CognitiveDomain;
      }
    }

    return lowest;
  };

  const depletedDomain = getMostDepletedDomain();

  if (compact) {
    return (
      <GlassCard className="p-5 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-medium text-foreground">Recovery</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
          </motion.button>
        </div>

        <div className="space-y-2">
          {suggestions.slice(0, 3).map((suggestion, i) => {
            const isCompleted = completedActivities.includes(suggestion.id);
            
            return (
              <motion.button
                key={suggestion.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleComplete(suggestion.id)}
                disabled={isCompleted}
                className={`
                  w-full p-3 rounded-xl border transition-all text-left flex items-center gap-3
                  ${isCompleted 
                    ? "bg-emerald-500/10 border-emerald-500/30" 
                    : `bg-gradient-to-r ${suggestion.bgGradient} border-foreground/10 hover:border-foreground/20`
                  }
                `}
              >
                <div className={`p-2 rounded-lg ${isCompleted ? "bg-emerald-500/20" : `bg-gradient-to-br ${suggestion.bgGradient}`}`}>
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <suggestion.icon className="h-4 w-4 text-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{suggestion.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {suggestion.duration}
                    <span className="text-emerald-400">+{suggestion.energyRestore}%</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </GlassCard>
    );
  }

  // Full view
  return (
    <GlassCard className="p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <motion.div 
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,113,133,0.15) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <motion.div 
            className="relative"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-400/10 border border-rose-500/20">
              <Heart className="h-5 w-5 text-rose-400" />
            </div>
            <motion.div
              className="absolute -inset-1 rounded-xl bg-rose-500/20 blur-lg"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <div>
            <h3 className="text-lg font-display font-medium text-foreground">Recovery Suggestions</h3>
            <p className="text-sm text-muted-foreground">
              {depletedDomain 
                ? `Personalized for ${depletedDomain} recovery`
                : "Activities to restore your energy"
              }
            </p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className="p-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
        </motion.button>
      </div>

      {/* Suggestions Grid */}
      <div className="space-y-3">
        {suggestions.map((suggestion, i) => {
          const isCompleted = completedActivities.includes(suggestion.id);
          
          return (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              layout
            >
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleComplete(suggestion.id)}
                disabled={isCompleted}
                className={`
                  w-full p-4 rounded-xl border transition-all text-left
                  ${isCompleted 
                    ? "bg-emerald-500/10 border-emerald-500/30" 
                    : "bg-foreground/5 border-foreground/10 hover:border-foreground/20 hover:bg-foreground/[0.07]"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isCompleted ? "bg-emerald-500/20" : `bg-gradient-to-br ${suggestion.bgGradient}`}`}>
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                        >
                          <Check className="h-5 w-5 text-emerald-400" />
                        </motion.div>
                      ) : (
                        <suggestion.icon className="h-5 w-5 text-foreground" />
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-emerald-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span className="text-sm font-medium">+{suggestion.energyRestore}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      {suggestion.duration}
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Energy Restored Summary */}
      {completedActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-foreground">Energy Restored Today</span>
            </div>
            <span className="text-lg font-bold text-emerald-400">
              +{completedActivities.reduce((sum, id) => {
                const activity = suggestions.find(s => s.id === id);
                return sum + (activity?.energyRestore || 0);
              }, 0)}%
            </span>
          </div>
        </motion.div>
      )}
    </GlassCard>
  );
}
