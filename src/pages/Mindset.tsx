import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModuleLayout } from "@/components/ModuleLayout";
import { GlassCard } from "@/components/GlassCard";
import { HabitTracker } from "@/components/HabitTracker";
import { WeeklyInsights } from "@/components/WeeklyInsights";
import { CognitiveBudgetVisualization } from "@/components/CognitiveBudgetVisualization";
import { RecoveryMode } from "@/components/RecoveryMode";
import { MetricRing } from "@/components/MetricRing";
import { 
  Brain, 
  Target, 
  Flame, 
  Moon, 
  BarChart3,
  Sparkles,
  CheckSquare,
  Lightbulb
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "habits", label: "Habits" },
  { id: "focus", label: "Focus" },
  { id: "insights", label: "Insights" },
  { id: "recovery", label: "Recovery" },
];

const Mindset = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showRecovery, setShowRecovery] = useState(false);
  const [showHabits, setShowHabits] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showCognitive, setShowCognitive] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Mental State Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6" glow="brand">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Focus Index</h3>
                  <Target className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex items-center justify-center">
                  <MetricRing 
                    label="Focus"
                    value="74%"
                    percentage={74}
                    color="purple"
                    size={120}
                  />
                </div>
              </GlassCard>

              <GlassCard className="p-6" glow="cyan">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Habit Streak</h3>
                  <Flame className="h-5 w-5 text-orange-400" />
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground mb-2">12</div>
                  <p className="text-sm text-muted-foreground">Days in a row</p>
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-3 h-3 rounded-full ${i < 5 ? 'bg-orange-400' : 'bg-muted/30'}`} 
                      />
                    ))}
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Cognitive Budget</h3>
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <div className="flex items-center justify-center">
                  <MetricRing 
                    label="Energy"
                    value="68%"
                    percentage={68}
                    color="cyan"
                    size={120}
                  />
                </div>
              </GlassCard>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowHabits(true)}
                className="p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 text-center"
              >
                <CheckSquare className="h-6 w-6 text-secondary mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">Track Habits</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInsights(true)}
                className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 text-center"
              >
                <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">View Insights</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCognitive(true)}
                className="p-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 text-center"
              >
                <Brain className="h-6 w-6 text-accent mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">Cognitive Budget</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRecovery(true)}
                className="p-4 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30 text-center"
              >
                <Moon className="h-6 w-6 text-rose-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">Recovery Mode</span>
              </motion.button>
            </div>

            {/* Learning & Growth */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-secondary/20 border border-secondary/30">
                  <Lightbulb className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Daily Learning</h3>
                  <p className="text-sm text-muted-foreground">Micro-learning for continuous growth</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="text-2xl font-bold text-foreground mb-1">12 min</div>
                  <p className="text-xs text-muted-foreground">Focus time today</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="text-2xl font-bold text-foreground mb-1">3</div>
                  <p className="text-xs text-muted-foreground">Lessons completed</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div className="text-2xl font-bold text-foreground mb-1">85%</div>
                  <p className="text-xs text-muted-foreground">Retention score</p>
                </div>
              </div>
            </GlassCard>
          </div>
        );

      case "habits":
        return (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckSquare className="h-6 w-6 text-secondary" />
              <h3 className="text-lg font-semibold text-foreground">Habit Tracker</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Track your daily habits and build consistency. Click below to open the full tracker.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowHabits(true)}
              className="w-full p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 text-center"
            >
              <span className="text-sm font-medium text-foreground">Open Habit Tracker</span>
            </motion.button>
          </GlassCard>
        );

      case "focus":
        return (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-secondary/20 border border-secondary/30">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Focus Sessions</h3>
                <p className="text-sm text-muted-foreground">Deep work blocks for maximum productivity</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Today's Focus Blocks</h4>
                {[
                  { time: "9:00 AM - 10:30 AM", task: "Strategic Planning", completed: true },
                  { time: "2:00 PM - 3:30 PM", task: "Creative Work", completed: true },
                  { time: "4:00 PM - 5:00 PM", task: "Review & Reflect", completed: false },
                ].map((block, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${block.completed ? 'bg-secondary/10 border-secondary/30' : 'bg-muted/10 border-border/30'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{block.task}</p>
                        <p className="text-xs text-muted-foreground">{block.time}</p>
                      </div>
                      {block.completed && (
                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                          <CheckSquare className="h-4 w-4 text-secondary" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <MetricRing 
                  label="Focus Score"
                  value="82%"
                  percentage={82}
                  color="purple"
                  size={160}
                />
              </div>
            </div>
          </GlassCard>
        );

      case "insights":
        return (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Weekly Insights</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              View your weekly patterns and performance insights. Click below to open the full report.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInsights(true)}
              className="w-full p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 text-center"
            >
              <span className="text-sm font-medium text-foreground">Open Weekly Insights</span>
            </motion.button>
          </GlassCard>
        );

      case "recovery":
        return (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Moon className="h-6 w-6 text-rose-400" />
              <h3 className="text-lg font-semibold text-foreground">Recovery Mode</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Take a mental break and restore your energy. Click below to enter recovery mode.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRecovery(true)}
              className="w-full p-4 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30 text-center"
            >
              <span className="text-sm font-medium text-foreground">Enter Recovery Mode</span>
            </motion.button>
          </GlassCard>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <ModuleLayout
        title="Mindset"
        subtitle="Mental growth and cognitive optimization"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderContent()}
      </ModuleLayout>

      {/* Modals */}
      <AnimatePresence>
        {showHabits && <HabitTracker isOpen={showHabits} onClose={() => setShowHabits(false)} />}
        {showInsights && <WeeklyInsights isOpen={showInsights} onClose={() => setShowInsights(false)} />}
        {showCognitive && <CognitiveBudgetVisualization isOpen={showCognitive} onClose={() => setShowCognitive(false)} />}
        {showRecovery && <RecoveryMode isOpen={showRecovery} onClose={() => setShowRecovery(false)} autoActivated={false} />}
      </AnimatePresence>
    </>
  );
};

export default Mindset;
