import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Heart,
  Users,
  BookOpen,
  Plus,
  Coffee,
  MessageSquare,
  Mail,
  Presentation,
  Dumbbell,
  Wind,
  Phone,
  UsersIcon,
  BookMarked,
  GraduationCap,
  Sparkles,
  Check,
  Zap,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cognitiveBudgetLedger, CognitiveDomain } from "@/lib/cognitiveBudgetLedger";
import { toast } from "@/hooks/use-toast";

interface ActivityLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onActivityLogged?: () => void;
}

interface ActivityPreset {
  id: string;
  label: string;
  icon: typeof Briefcase;
  domain: CognitiveDomain;
  cost: number;
  costLabel: string;
}

const activityPresets: ActivityPreset[] = [
  // Work
  { id: "deep_work", label: "Deep Work", icon: Briefcase, domain: "work", cost: 0.3, costLabel: "High" },
  { id: "meeting", label: "Meeting", icon: Presentation, domain: "work", cost: 0.15, costLabel: "Medium" },
  { id: "email", label: "Emails", icon: Mail, domain: "work", cost: 0.05, costLabel: "Low" },
  { id: "decision", label: "Big Decision", icon: Sparkles, domain: "work", cost: 0.2, costLabel: "Medium" },
  
  // Health
  { id: "workout", label: "Workout", icon: Dumbbell, domain: "health", cost: 0.2, costLabel: "Medium" },
  { id: "meditation", label: "Meditation", icon: Wind, domain: "health", cost: -0.1, costLabel: "Restorative" },
  { id: "coffee_break", label: "Break", icon: Coffee, domain: "health", cost: -0.05, costLabel: "Restorative" },
  
  // Social
  { id: "social_call", label: "Call", icon: Phone, domain: "social", cost: 0.15, costLabel: "Medium" },
  { id: "collaboration", label: "Collab", icon: UsersIcon, domain: "social", cost: 0.2, costLabel: "Medium" },
  { id: "messaging", label: "Chat", icon: MessageSquare, domain: "social", cost: 0.05, costLabel: "Low" },
  
  // Learning
  { id: "reading", label: "Reading", icon: BookMarked, domain: "learning", cost: 0.15, costLabel: "Medium" },
  { id: "course", label: "Course", icon: GraduationCap, domain: "learning", cost: 0.25, costLabel: "High" },
];

const domainColors: Record<CognitiveDomain, { bg: string; border: string; text: string; gradient: string }> = {
  work: { 
    bg: "bg-primary/10", 
    border: "border-primary/30", 
    text: "text-primary",
    gradient: "from-primary to-amber-400"
  },
  health: { 
    bg: "bg-rose-500/10", 
    border: "border-rose-500/30", 
    text: "text-rose-400",
    gradient: "from-rose-500 to-pink-400"
  },
  social: { 
    bg: "bg-secondary/10", 
    border: "border-secondary/30", 
    text: "text-secondary",
    gradient: "from-secondary to-violet-400"
  },
  learning: { 
    bg: "bg-accent/10", 
    border: "border-accent/30", 
    text: "text-accent",
    gradient: "from-accent to-teal-400"
  },
};

export function ActivityLogger({ isOpen, onClose, onActivityLogged }: ActivityLoggerProps) {
  const { user } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState<ActivityPreset | null>(null);
  const [customActivity, setCustomActivity] = useState("");
  const [customDomain, setCustomDomain] = useState<CognitiveDomain>("work");
  const [isLogging, setIsLogging] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [recentlyLogged, setRecentlyLogged] = useState<string | null>(null);

  const handleLogActivity = async (activity: ActivityPreset) => {
    if (!user?.id) return;

    setIsLogging(true);
    setSelectedActivity(activity);

    try {
      cognitiveBudgetLedger.setUser(user.id);
      await cognitiveBudgetLedger.logActivity(activity.id, activity.domain, activity.cost);
      
      setRecentlyLogged(activity.id);
      
      toast({
        title: activity.cost < 0 ? "Energy restored!" : "Activity logged",
        description: `${activity.label} ${activity.cost < 0 ? "recharged" : "used"} ${Math.abs(Math.round(activity.cost * 100))}% energy`,
      });

      onActivityLogged?.();
      
      setTimeout(() => {
        setRecentlyLogged(null);
      }, 2000);
    } catch (error) {
      console.error("Error logging activity:", error);
      toast({
        title: "Failed to log activity",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
      setSelectedActivity(null);
    }
  };

  const handleLogCustomActivity = async () => {
    if (!user?.id || !customActivity.trim()) return;

    setIsLogging(true);

    try {
      cognitiveBudgetLedger.setUser(user.id);
      await cognitiveBudgetLedger.logActivity(customActivity, customDomain, 0.1);
      
      toast({
        title: "Activity logged",
        description: `${customActivity} logged to ${customDomain}`,
      });

      setCustomActivity("");
      setShowCustom(false);
      onActivityLogged?.();
    } catch (error) {
      console.error("Error logging custom activity:", error);
    } finally {
      setIsLogging(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", duration: 0.6 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl"
        >
          <GlassCard className="p-6 relative overflow-hidden">
            {/* Ambient glow */}
            <motion.div 
              className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(147,112,219,0.15) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 border border-secondary/20">
                  <Zap className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-medium text-foreground">Log Activity</h2>
                  <p className="text-sm text-muted-foreground">Track your energy expenditure</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Activity Grid by Domain */}
            <div className="space-y-5 mb-6">
              {(["work", "health", "social", "learning"] as CognitiveDomain[]).map((domain) => {
                const domainActivities = activityPresets.filter(a => a.domain === domain);
                const colors = domainColors[domain];
                const DomainIcon = domain === "work" ? Briefcase : 
                                   domain === "health" ? Heart : 
                                   domain === "social" ? Users : BookOpen;

                return (
                  <motion.div 
                    key={domain}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ["work", "health", "social", "learning"].indexOf(domain) * 0.05 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <DomainIcon className={`h-4 w-4 ${colors.text}`} />
                      <span className="text-sm font-medium text-foreground capitalize">{domain}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {domainActivities.map((activity) => {
                        const isRestorative = activity.cost < 0;
                        const isRecent = recentlyLogged === activity.id;
                        
                        return (
                          <motion.button
                            key={activity.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLogActivity(activity)}
                            disabled={isLogging}
                            className={`
                              relative px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2.5
                              ${isRecent 
                                ? `${colors.bg} ${colors.border} ring-2 ring-offset-2 ring-offset-background ring-emerald-400/50` 
                                : `${colors.bg} ${colors.border} hover:bg-opacity-20`
                              }
                              ${selectedActivity?.id === activity.id && isLogging ? "opacity-50" : ""}
                            `}
                          >
                            {isRecent ? (
                              <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <activity.icon className={`h-4 w-4 ${colors.text}`} />
                            )}
                            <span className="text-sm font-medium text-foreground">{activity.label}</span>
                            <span className={`text-xs ${isRestorative ? "text-emerald-400" : "text-muted-foreground"}`}>
                              {isRestorative ? "+" : "-"}{Math.abs(Math.round(activity.cost * 100))}%
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Custom Activity */}
            <div className="border-t border-foreground/10 pt-5">
              {!showCustom ? (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowCustom(true)}
                  className="w-full p-4 rounded-xl border border-dashed border-foreground/20 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">Log custom activity</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <Input
                    value={customActivity}
                    onChange={(e) => setCustomActivity(e.target.value)}
                    placeholder="Activity name..."
                    className="bg-foreground/5 border-foreground/10"
                  />
                  
                  <div className="flex gap-2">
                    {(["work", "health", "social", "learning"] as CognitiveDomain[]).map((domain) => {
                      const colors = domainColors[domain];
                      const DomainIcon = domain === "work" ? Briefcase : 
                                         domain === "health" ? Heart : 
                                         domain === "social" ? Users : BookOpen;
                      
                      return (
                        <motion.button
                          key={domain}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCustomDomain(domain)}
                          className={`
                            flex-1 p-2.5 rounded-lg border transition-all flex items-center justify-center gap-2
                            ${customDomain === domain 
                              ? `${colors.bg} ${colors.border} ring-1 ring-offset-1 ring-offset-background ${colors.border}`
                              : "bg-foreground/5 border-foreground/10 hover:bg-foreground/10"
                            }
                          `}
                        >
                          <DomainIcon className={`h-4 w-4 ${customDomain === domain ? colors.text : "text-muted-foreground"}`} />
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      className="flex-1"
                      onClick={() => setShowCustom(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-secondary to-primary text-white"
                      onClick={handleLogCustomActivity}
                      disabled={!customActivity.trim() || isLogging}
                    >
                      Log Activity
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
