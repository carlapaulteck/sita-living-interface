import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, ChevronRight, Coffee, Brain, Target, Moon, Heart, TrendingUp } from "lucide-react";
import { useCognitiveState } from "@/hooks/useCognitiveState";
import { useAuth } from "@/hooks/useAuth";

interface Suggestion {
  id: string;
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: string;
  priority: "low" | "medium" | "high";
  category: "productivity" | "wellness" | "insight" | "warning";
}

interface ProactiveAISuggestionsProps {
  onSuggestionClick?: (suggestion: Suggestion) => void;
  position?: "bottom-left" | "bottom-center" | "floating";
  maxVisible?: number;
}

// Suggestion templates based on cognitive state and metrics
const SUGGESTION_TEMPLATES: Record<string, (metrics: any) => Suggestion | null> = {
  high_stress: (metrics) => {
    if (metrics.stressIndex > 0.7) {
      return {
        id: "high_stress",
        icon: <Coffee className="w-4 h-4" />,
        title: "Take a breath",
        message: "Your stress levels are elevated. A 5-minute break could help reset your focus.",
        action: "Start break timer",
        priority: "high",
        category: "wellness",
      };
    }
    return null;
  },

  low_budget: (metrics) => {
    if (metrics.cognitiveBudget < 0.3) {
      return {
        id: "low_budget",
        icon: <Moon className="w-4 h-4" />,
        title: "Energy running low",
        message: "Consider wrapping up complex tasks. Your cognitive reserves are depleted.",
        action: "View recovery options",
        priority: "high",
        category: "warning",
      };
    }
    return null;
  },

  flow_opportunity: (metrics) => {
    if (metrics.state === "flow" && metrics.focusLevel > 0.8) {
      return {
        id: "flow_opportunity",
        icon: <Target className="w-4 h-4" />,
        title: "You're in the zone!",
        message: "Peak focus detected. This is a great time for your most important task.",
        priority: "medium",
        category: "productivity",
      };
    }
    return null;
  },

  fatigue_warning: (metrics) => {
    if (metrics.state === "fatigued") {
      return {
        id: "fatigue_warning",
        icon: <Heart className="w-4 h-4" />,
        title: "Time to recharge",
        message: "Extended session detected. A short walk or stretch could boost your energy.",
        action: "Suggest break activity",
        priority: "medium",
        category: "wellness",
      };
    }
    return null;
  },

  distraction_pattern: (metrics) => {
    if (metrics.state === "distracted" && metrics.focusLevel < 0.4) {
      return {
        id: "distraction_pattern",
        icon: <Brain className="w-4 h-4" />,
        title: "Focus drifting",
        message: "I notice your attention is scattered. Would you like to try a focus session?",
        action: "Start focus mode",
        priority: "medium",
        category: "productivity",
      };
    }
    return null;
  },

  recovery_complete: (metrics) => {
    if (metrics.state === "recovery" && metrics.cognitiveBudget > 0.7) {
      return {
        id: "recovery_complete",
        icon: <TrendingUp className="w-4 h-4" />,
        title: "Feeling refreshed!",
        message: "Your energy levels have recovered. Ready to tackle something meaningful?",
        action: "View priorities",
        priority: "low",
        category: "insight",
      };
    }
    return null;
  },

  hyperfocus_warning: (metrics) => {
    if (metrics.state === "hyperfocus" && metrics.timeToNextState && metrics.timeToNextState < 20) {
      return {
        id: "hyperfocus_warning",
        icon: <Lightbulb className="w-4 h-4" />,
        title: "Intense focus",
        message: "You've been deeply focused for a while. Remember to hydrate and stretch.",
        priority: "low",
        category: "wellness",
      };
    }
    return null;
  },
};

// Time-based suggestions
const getTimeBasedSuggestion = (): Suggestion | null => {
  const hour = new Date().getHours();

  if (hour >= 9 && hour < 10) {
    return {
      id: "morning_planning",
      icon: <Target className="w-4 h-4" />,
      title: "Morning clarity",
      message: "Morning cortisol peak is ideal for strategic thinking. What's your top priority today?",
      priority: "low",
      category: "productivity",
    };
  }

  if (hour >= 14 && hour < 15) {
    return {
      id: "afternoon_dip",
      icon: <Coffee className="w-4 h-4" />,
      title: "Afternoon energy",
      message: "Post-lunch dip is normal. Consider a brief walk or lighter tasks for the next hour.",
      priority: "low",
      category: "insight",
    };
  }

  if (hour >= 17 && hour < 18) {
    return {
      id: "end_of_day",
      icon: <Moon className="w-4 h-4" />,
      title: "Winding down",
      message: "Consider capturing tomorrow's priorities while today's context is fresh.",
      action: "Plan tomorrow",
      priority: "low",
      category: "productivity",
    };
  }

  return null;
};

export function ProactiveAISuggestions({
  onSuggestionClick,
  position = "floating",
  maxVisible = 1,
}: ProactiveAISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);
  
  const cognitive = useCognitiveState();
  const { user } = useAuth();

  // Generate suggestions based on current state
  const generateSuggestions = useCallback(() => {
    const metrics = {
      state: cognitive.state,
      stressIndex: cognitive.stressIndex,
      focusLevel: cognitive.focusLevel,
      cognitiveBudget: cognitive.cognitiveBudget,
      timeToNextState: cognitive.timeToNextState,
    };

    const newSuggestions: Suggestion[] = [];

    // Check all template conditions
    for (const [, generator] of Object.entries(SUGGESTION_TEMPLATES)) {
      const suggestion = generator(metrics);
      if (suggestion && !dismissedIds.has(suggestion.id)) {
        newSuggestions.push(suggestion);
      }
    }

    // Add time-based suggestion
    const timeSuggestion = getTimeBasedSuggestion();
    if (timeSuggestion && !dismissedIds.has(timeSuggestion.id)) {
      newSuggestions.push(timeSuggestion);
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    newSuggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    setSuggestions(newSuggestions);
  }, [cognitive, dismissedIds]);

  // Generate suggestions periodically
  useEffect(() => {
    if (!user) return;

    generateSuggestions();

    // Regenerate every 2 minutes
    const interval = setInterval(generateSuggestions, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, generateSuggestions]);

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
    
    // Clear dismissed after 30 minutes to allow re-triggering
    setTimeout(() => {
      setDismissedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 30 * 60 * 1000);
  };

  const handleClick = (suggestion: Suggestion) => {
    onSuggestionClick?.(suggestion);
    handleDismiss(suggestion.id);
  };

  const visibleSuggestions = suggestions.slice(0, isExpanded ? suggestions.length : maxVisible);

  if (visibleSuggestions.length === 0) return null;

  const positionClasses = {
    "bottom-left": "bottom-24 left-4",
    "bottom-center": "bottom-24 left-1/2 -translate-x-1/2",
    "floating": "bottom-32 right-4",
  };

  const priorityColors = {
    high: "border-destructive/30 bg-destructive/5",
    medium: "border-primary/30 bg-primary/5",
    low: "border-accent/30 bg-accent/5",
  };

  const categoryIcons = {
    productivity: <Target className="w-3 h-3 text-primary" />,
    wellness: <Heart className="w-3 h-3 text-green-400" />,
    insight: <Lightbulb className="w-3 h-3 text-yellow-400" />,
    warning: <Coffee className="w-3 h-3 text-orange-400" />,
  };

  return (
    <div className={`fixed z-40 ${positionClasses[position]}`}>
      <AnimatePresence mode="popLayout">
        {visibleSuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ delay: index * 0.1 }}
            className={`relative mb-2 p-3 rounded-xl border backdrop-blur-sm shadow-lg max-w-xs ${priorityColors[suggestion.priority]}`}
          >
            {/* Category badge */}
            <div className="absolute -top-2 -left-2 p-1 rounded-full bg-card border border-border shadow-sm">
              {categoryIcons[suggestion.category]}
            </div>

            {/* Close button */}
            <button
              onClick={() => handleDismiss(suggestion.id)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-foreground/10 transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-3 pt-1">
              <div className="p-2 rounded-lg bg-foreground/5 text-foreground">
                {suggestion.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-0.5">
                  {suggestion.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {suggestion.message}
                </p>
                {suggestion.action && (
                  <button
                    onClick={() => handleClick(suggestion)}
                    className="mt-2 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    {suggestion.action}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Animated accent line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Show more indicator */}
      {suggestions.length > maxVisible && !isExpanded && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsExpanded(true)}
          className="w-full py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
        >
          +{suggestions.length - maxVisible} more suggestions
        </motion.button>
      )}
    </div>
  );
}
