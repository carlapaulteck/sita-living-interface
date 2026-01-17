import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { Sparkles, Clock, Target, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SitaOrb3D } from "@/components/SitaOrb3D";
import { NORTH_STAR_METRICS } from "@/types/onboarding";

export function ImprintStep() {
  const { data, complete } = useOnboarding();

  // Derive insights from collected data
  const rhythmLabel = data.dailyRhythm.template === "early-bird" ? "Early riser" 
    : data.dailyRhythm.template === "night-owl" ? "Night owl"
    : "Flexible schedule";

  const topMetric = NORTH_STAR_METRICS.find(m => data.northStarMetrics[0] === m.id);
  
  const firstAutomation = data.automations[0];

  const insightCards = [
    {
      icon: Clock,
      label: "Your Rhythm",
      value: rhythmLabel,
      detail: `Wake ${data.dailyRhythm.wakeTime} · Sleep ${data.dailyRhythm.sleepTime}`,
      color: "text-secondary",
    },
    {
      icon: Target,
      label: "Primary Goal",
      value: topMetric?.label || "Personal optimization",
      detail: "We'll track this daily",
      color: "text-primary",
    },
    {
      icon: Zap,
      label: "First Automation",
      value: firstAutomation?.name || "Custom setup",
      detail: firstAutomation?.trigger || "Ready when you are",
      color: "text-purple-400",
    },
    {
      icon: Brain,
      label: "SITA Mode",
      value: data.assistantStyle.charAt(0).toUpperCase() + data.assistantStyle.slice(1),
      detail: data.autonomyLevel === "autopilot" ? "Full autonomy with guardrails" : `${data.autonomyLevel} mode active`,
      color: "text-green-400",
    },
  ];

  return (
    <motion.div
      className="flex flex-col items-center max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Orb speaking */}
      <motion.div 
        className="w-48 h-48 mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <SitaOrb3D state="speaking" />
      </motion.div>

      <motion.h2 
        className="text-3xl font-display font-medium text-foreground mb-2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Here's what I learned about you, {data.name}
      </motion.h2>
      
      <motion.p 
        className="text-muted-foreground mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Your personalized dashboard is ready
      </motion.p>

      {/* Insight Cards */}
      <motion.div 
        className="grid grid-cols-2 gap-4 w-full mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {insightCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <GlassCard className="p-4 h-full">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-foreground/5">
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">{card.label}</span>
                    <p className="font-medium text-foreground text-sm">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{card.detail}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Connected Sources */}
      {data.integrations.length > 0 && (
        <motion.div
          className="w-full mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-4 border-secondary/30">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm text-foreground">
                {data.integrations.length} source{data.integrations.length > 1 ? "s" : ""} ready to connect
              </span>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Button 
          onClick={complete}
          className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-8 py-6 text-lg"
        >
          <Sparkles className="h-5 w-5" />
          Enter Your Dashboard
        </Button>
      </motion.div>

      <motion.p
        className="text-xs text-muted-foreground mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Everything can be adjusted in settings at any time
      </motion.p>
    </motion.div>
  );
}
