import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { 
  ChevronRight, 
  Check, 
  Sparkles, 
  Moon, 
  Focus, 
  TrendingUp, 
  Heart, 
  Wifi, 
  Sun, 
  Battery, 
  Shield, 
  Zap, 
  AlertTriangle, 
  DollarSign, 
  Target, 
  Clock, 
  Calendar,
  Brain,
  SkipForward,
  Info,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AUTOMATION_TEMPLATES, AutomationTemplate } from "@/types/onboarding";
import { ScrollArea } from "@/components/ui/scroll-area";

const AUTOMATION_ICONS: Record<string, typeof Moon> = {
  "sleep-low-adjust": Moon,
  "focus-window-silence": Focus,
  "revenue-spike-alert": TrendingUp,
  "stress-high-protocol": Heart,
  "device-disconnect": Wifi,
  "morning-briefing": Sun,
  "energy-dip-alert": Battery,
  "recovery-day-mode": Shield,
  "task-pile-intervention": AlertTriangle,
  "context-switch-guard": Brain,
  "deep-work-streak": Zap,
  "revenue-drop-alert": DollarSign,
  "expense-anomaly": DollarSign,
  "opportunity-scout": Target,
  "evening-wind-down": Moon,
  "weekly-review-prep": Calendar,
};

const CATEGORY_LABELS: Record<string, { label: string; icon: typeof Heart }> = {
  health: { label: "Health & Recovery", icon: Heart },
  focus: { label: "Focus & Productivity", icon: Brain },
  wealth: { label: "Wealth & Business", icon: TrendingUp },
  system: { label: "Daily Flow", icon: Clock },
};

const CATEGORY_COLORS: Record<string, string> = {
  health: "text-emerald-400 bg-emerald-400/10",
  focus: "text-cyan-400 bg-cyan-400/10",
  wealth: "text-amber-400 bg-amber-400/10",
  system: "text-violet-400 bg-violet-400/10",
};

export function AutomationsStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleAutomation = (id: string) => {
    const current = data.automations;
    const existing = current.find(a => a.id === id);
    
    if (existing) {
      updateData("automations", current.filter(a => a.id !== id));
    } else {
      const template = AUTOMATION_TEMPLATES.find(t => t.id === id);
      if (template && current.length < 3) {
        updateData("automations", [...current, { ...template, enabled: true }]);
      }
    }
  };

  const isEnabled = (id: string) => data.automations.some(a => a.id === id);
  const enabledCount = data.automations.length;

  const categories = ["health", "focus", "wealth", "system"];
  
  const filteredTemplates = selectedCategory 
    ? AUTOMATION_TEMPLATES.filter(t => t.category === selectedCategory)
    : AUTOMATION_TEMPLATES;

  const handleSkip = () => {
    // Clear any selected automations and continue
    updateData("automations", []);
    nextStep();
  };

  const handleContinue = () => {
    nextStep();
  };

  return (
    <motion.div
      className="flex flex-col items-center max-w-3xl mx-auto w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-display font-medium text-foreground mb-2">
          Create Your First Automations
        </h2>
        <p className="text-muted-foreground mb-4">
          Pick up to 3 templates to start with. These work in the background to protect your energy and surface opportunities.
        </p>
        
        {/* Selection Counter */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i < enabledCount 
                    ? "bg-secondary shadow-glow-cyan" 
                    : "bg-foreground/10"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {enabledCount}/3 selected
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <Button
          variant={selectedCategory === null ? "secondary" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="text-xs"
        >
          All
        </Button>
        {categories.map((cat) => {
          const { label, icon: Icon } = CATEGORY_LABELS[cat];
          return (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs gap-1"
            >
              <Icon className="h-3 w-3" />
              {label}
            </Button>
          );
        })}
      </div>

      {/* Automation Cards */}
      <ScrollArea className="w-full h-[400px] pr-4">
        <div className="flex flex-col gap-3 w-full">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, index) => {
              const enabled = isEnabled(template.id);
              const isDisabled = !enabled && enabledCount >= 3;
              const Icon = AUTOMATION_ICONS[template.id] || Sparkles;
              const isExpanded = expandedId === template.id;
              const categoryColor = CATEGORY_COLORS[template.category];
              
              return (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <GlassCard
                    className={`p-4 transition-all duration-300 ${
                      enabled
                        ? "ring-2 ring-secondary shadow-glow-cyan"
                        : isDisabled
                          ? "opacity-50"
                          : "hover:border-secondary/30"
                    }`}
                  >
                    <div 
                      className={`flex items-start gap-4 ${!isDisabled ? "cursor-pointer" : "cursor-not-allowed"}`}
                      onClick={() => !isDisabled && toggleAutomation(template.id)}
                    >
                      <div className={`p-2.5 rounded-xl ${enabled ? "bg-secondary/20" : categoryColor}`}>
                        <Icon className={`h-5 w-5 ${enabled ? "text-secondary" : ""}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{template.name}</span>
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${categoryColor}`}>
                            {CATEGORY_LABELS[template.category].label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-medium">When:</span>
                          <span className="text-xs text-foreground/80">{template.trigger}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground font-medium">Then:</span>
                          <span className="text-xs text-secondary">{template.action}</span>
                        </div>
                        
                        {/* Expandable Description */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50 leading-relaxed">
                                {template.description}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Info Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(isExpanded ? null : template.id);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isExpanded 
                              ? "bg-secondary/20 text-secondary" 
                              : "hover:bg-foreground/5 text-muted-foreground"
                          }`}
                        >
                          {isExpanded ? <X className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                        </button>
                        
                        {/* Check indicator */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          enabled 
                            ? "bg-secondary border-secondary" 
                            : "border-foreground/20"
                        }`}>
                          {enabled && <Check className="h-3.5 w-3.5 text-secondary-foreground" />}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Selected Preview */}
      <AnimatePresence>
        {enabledCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="w-full mt-6"
          >
            <GlassCard className="p-4 border-secondary/30">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-foreground">How it works tomorrow</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    SITA will monitor your signals in the background and trigger these {enabledCount} automation{enabledCount > 1 ? "s" : ""} when conditions are met. 
                    Every action taken appears in your morning briefing so you always know what happened while you weren't watching.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {data.automations.map((a) => (
                      <Badge key={a.id} variant="secondary" className="text-xs">
                        {a.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        You can create custom automations and modify these anytime in Settings
      </p>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-6">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        
        {enabledCount === 0 ? (
          <Button variant="ghost" onClick={handleSkip} className="gap-2">
            <SkipForward className="h-4 w-4" />
            Skip for now
          </Button>
        ) : (
          <Button onClick={handleContinue} className="gap-2">
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
