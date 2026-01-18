import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { 
  X, 
  Sunrise, 
  Battery, 
  Brain, 
  Calendar, 
  AlertTriangle,
  TrendingUp,
  Target,
  RefreshCw,
  Volume2,
  VolumeX,
  Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface BriefingData {
  greeting: string;
  energyForecast: {
    level: number;
    trend: "rising" | "stable" | "declining";
    peakWindow: string;
  };
  cognitiveWeather: {
    condition: string;
    recommendation: string;
    optimalTaskTypes: string[];
  };
  priorities: Array<{
    title: string;
    urgency: "high" | "medium" | "low";
    domain: string;
  }>;
  needsAttention: Array<{
    type: string;
    message: string;
    actionUrl?: string;
  }>;
  winsOvernight: Array<{
    description: string;
    value?: string;
  }>;
  gentleReminder: string;
}

interface MorningBriefingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MorningBriefing({ isOpen, onClose }: MorningBriefingProps) {
  const { user } = useAuth();
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const fetchBriefing = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('morning-briefing', {
        body: { userId: user.id }
      });
      
      if (fnError) throw fnError;
      setBriefing(data);
    } catch (err) {
      console.error('Failed to fetch briefing:', err);
      setError('Unable to generate briefing');
      // Fallback data for demo
      setBriefing({
        greeting: "Good morning. Let's make today count.",
        energyForecast: {
          level: 72,
          trend: "rising",
          peakWindow: "10am - 1pm"
        },
        cognitiveWeather: {
          condition: "Clear skies",
          recommendation: "Great day for deep work",
          optimalTaskTypes: ["Strategic planning", "Creative work", "Complex decisions"]
        },
        priorities: [
          { title: "Review Q1 projections", urgency: "high", domain: "business" },
          { title: "30min walk", urgency: "medium", domain: "health" },
          { title: "Read market analysis", urgency: "low", domain: "wealth" }
        ],
        needsAttention: [
          { type: "invoice", message: "2 invoices pending review" }
        ],
        winsOvernight: [
          { description: "Lead responded positively", value: "$2,400 potential" },
          { description: "System optimized 3 workflows" }
        ],
        gentleReminder: "You've been pushing hard. Consider an afternoon pause."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchBriefing();
    }
    return () => stop();
  }, [isOpen, user]);

  const handleSpeak = () => {
    if (!briefing) return;
    
    if (isSpeaking) {
      stop();
      return;
    }
    
    const text = `${briefing.greeting}. 
      Your energy forecast is ${briefing.energyForecast.level}% and ${briefing.energyForecast.trend}. 
      Peak window is ${briefing.energyForecast.peakWindow}.
      ${briefing.cognitiveWeather.recommendation}.
      Your top priority is ${briefing.priorities[0]?.title || 'to rest'}.
      ${briefing.gentleReminder}`;
    
    speak(text);
  };

  if (!isOpen) return null;

  const urgencyColors = {
    high: "text-red-400 bg-red-500/10 border-red-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    low: "text-green-400 bg-green-500/10 border-green-500/20"
  };

  const trendIcons = {
    rising: "↑",
    stable: "→",
    declining: "↓"
  };

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
        <GlassCard className="p-6 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
                <Sunrise className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-display font-medium text-foreground">Morning Briefing</h2>
                <p className="text-xs text-muted-foreground">Your personalized daily forecast</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {ttsSupported && (
                <button
                  onClick={handleSpeak}
                  className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                  title={isSpeaking ? "Stop" : "Read aloud"}
                >
                  {isSpeaking ? (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              )}
              <button
                onClick={fetchBriefing}
                className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {isLoading && !briefing ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-muted-foreground">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Preparing your briefing...</span>
              </div>
            </div>
          ) : briefing ? (
            <div className="space-y-5 relative z-10">
              {/* Greeting */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-foreground font-display"
              >
                {briefing.greeting}
              </motion.p>

              {/* Energy Forecast */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Energy Forecast</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Peak: {briefing.energyForecast.peakWindow}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-foreground/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${briefing.energyForecast.level}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {briefing.energyForecast.level}%
                  </span>
                  <span className="text-primary">
                    {trendIcons[briefing.energyForecast.trend]}
                  </span>
                </div>
              </motion.div>

              {/* Cognitive Weather */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-foreground/5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">Cognitive Weather</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">
                    {briefing.cognitiveWeather.condition}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {briefing.cognitiveWeather.recommendation}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {briefing.cognitiveWeather.optimalTaskTypes.map((task, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-md bg-foreground/5 text-muted-foreground"
                    >
                      {task}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Priorities */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Today's Focus</span>
                </div>
                <div className="space-y-2">
                  {briefing.priorities.map((priority, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-lg border ${urgencyColors[priority.urgency]}`}
                    >
                      <span className="text-sm text-foreground">{priority.title}</span>
                      <span className="text-xs opacity-60 capitalize">{priority.domain}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Wins Overnight */}
              {briefing.winsOvernight.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">While You Rested</span>
                  </div>
                  <div className="space-y-2">
                    {briefing.winsOvernight.map((win, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <span className="text-sm text-foreground">{win.description}</span>
                        {win.value && (
                          <span className="text-xs text-primary font-medium">{win.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Needs Attention */}
              {briefing.needsAttention.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium text-foreground">Needs Attention</span>
                  </div>
                  <div className="space-y-2">
                    {briefing.needsAttention.map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                        <span className="text-sm text-foreground">{item.message}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Gentle Reminder */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-4 border-t border-foreground/5"
              >
                <p className="text-sm text-muted-foreground italic text-center">
                  "{briefing.gentleReminder}"
                </p>
              </motion.div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={onClose}
                  className="flex-1 gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Start My Day
                </Button>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={fetchBriefing}>
                Try Again
              </Button>
            </div>
          ) : null}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
