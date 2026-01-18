import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2,
  Circle,
  Plus,
  X,
  Flame,
  Target,
  Heart,
  Brain,
  Dumbbell,
  Book,
  Coffee,
  Moon,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/GlassCard";
import { useHabits, CreateHabitInput, ContributionDay } from "@/hooks/useHabits";

// Icon mapping for habits
const HABIT_ICONS: Record<string, typeof Heart> = {
  heart: Heart,
  brain: Brain,
  dumbbell: Dumbbell,
  book: Book,
  coffee: Coffee,
  moon: Moon,
  target: Target,
  sparkles: Sparkles,
  check: CheckCircle2,
};

const DOMAIN_OPTIONS = [
  { value: "health", label: "Health", color: "text-green-500" },
  { value: "mind", label: "Mind", color: "text-purple-500" },
  { value: "work", label: "Work", color: "text-blue-500" },
  { value: "personal", label: "Personal", color: "text-yellow-500" },
  { value: "social", label: "Social", color: "text-pink-500" },
  { value: "general", label: "General", color: "text-muted-foreground" },
];

interface HabitTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Contribution Grid Component (GitHub-style)
function ContributionGrid({ data, weeks = 16 }: { data: ContributionDay[]; weeks?: number }) {
  const levelColors = [
    "bg-foreground/5",
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/60",
    "bg-primary/80",
  ];
  
  // Group by weeks
  const weekData: ContributionDay[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weekData.push(data.slice(i, i + 7));
  }
  
  // Only show last N weeks
  const displayWeeks = weekData.slice(-weeks);
  
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {displayWeeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (weekIndex * 7 + dayIndex) * 0.005 }}
                className={`w-3 h-3 rounded-sm ${levelColors[day.level]} cursor-pointer hover:ring-1 hover:ring-primary/50`}
                title={`${day.date}: ${day.count} completions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-2">
        <span className="text-xs text-muted-foreground">Less</span>
        {levelColors.map((color, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
        ))}
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
}

export function HabitTracker({ isOpen, onClose }: HabitTrackerProps) {
  const { 
    habits, 
    isLoading, 
    createHabit, 
    completeHabit, 
    deleteHabit,
    getContributionGrid,
    getStreak,
    isCompletedToday,
    getTodayProgress
  } = useHabits();
  
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [newHabit, setNewHabit] = useState<Partial<CreateHabitInput>>({
    name: "",
    description: "",
    icon: "check",
    domain: "general",
  });
  
  const handleCreateHabit = async () => {
    if (!newHabit.name) return;
    
    await createHabit(newHabit as CreateHabitInput);
    setNewHabit({
      name: "",
      description: "",
      icon: "check",
      domain: "general",
    });
    setShowAddHabit(false);
  };
  
  const overallGrid = getContributionGrid(undefined, 16);
  const progress = getTodayProgress;
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-3xl my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-medium text-foreground flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Habit Tracker
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Build consistency, one day at a time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddHabit(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Habit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Today's Progress */}
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">Today's Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {progress.completed} of {progress.total} habits completed
                </p>
              </div>
              <div className="text-3xl font-bold text-primary">
                {progress.percentage}%
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-3 bg-foreground/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
          </GlassCard>
          
          {/* Overall Contribution Grid */}
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Activity Overview
              </h3>
              <span className="text-xs text-muted-foreground">Last 16 weeks</span>
            </div>
            <ContributionGrid data={overallGrid} weeks={16} />
          </GlassCard>
          
          {/* Habits List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground mb-3">Your Habits</h3>
            
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : habits.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <Sparkles className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No habits yet. Start building your routine!</p>
                <Button onClick={() => setShowAddHabit(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Habit
                </Button>
              </GlassCard>
            ) : (
              habits.map(habit => {
                const IconComponent = HABIT_ICONS[habit.icon] || CheckCircle2;
                const completed = isCompletedToday(habit.id);
                const streak = getStreak(habit.id);
                const habitGrid = getContributionGrid(habit.id, 8);
                const isSelected = selectedHabit === habit.id;
                
                return (
                  <GlassCard key={habit.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => completeHabit(habit.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            completed 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-foreground/5 hover:bg-foreground/10"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </motion.button>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${completed ? "text-foreground" : "text-foreground"}`}>
                              {habit.name}
                            </span>
                            {streak > 0 && (
                              <span className="flex items-center gap-1 text-xs text-orange-500">
                                <Flame className="h-3 w-3" />
                                {streak}
                              </span>
                            )}
                          </div>
                          {habit.description && (
                            <p className="text-xs text-muted-foreground">{habit.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedHabit(isSelected ? null : habit.id)}
                        >
                          {isSelected ? "Hide" : "Details"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteHabit(habit.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-foreground/10">
                            <div className="mb-3">
                              <span className="text-xs text-muted-foreground">8-week activity</span>
                            </div>
                            <ContributionGrid data={habitGrid} weeks={8} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                );
              })
            )}
          </div>
          
          {/* Add Habit Modal */}
          <AnimatePresence>
            {showAddHabit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              >
                <GlassCard className="p-6 w-full max-w-md">
                  <h3 className="text-lg font-medium text-foreground mb-4">Create Habit</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Habit Name</Label>
                      <Input
                        id="name"
                        value={newHabit.name}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Morning meditation"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description (optional)</Label>
                      <Input
                        id="description"
                        value={newHabit.description}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Why is this important to you?"
                      />
                    </div>
                    
                    <div>
                      <Label>Icon</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(HABIT_ICONS).map(([key, Icon]) => (
                          <button
                            key={key}
                            onClick={() => setNewHabit(prev => ({ ...prev, icon: key }))}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              newHabit.icon === key 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-foreground/5 hover:bg-foreground/10"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Domain</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {DOMAIN_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            onClick={() => setNewHabit(prev => ({ ...prev, domain: option.value }))}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              newHabit.domain === option.value 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-foreground/5 hover:bg-foreground/10"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowAddHabit(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleCreateHabit}
                      disabled={!newHabit.name}
                    >
                      Create Habit
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
