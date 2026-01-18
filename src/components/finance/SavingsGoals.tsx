import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  Trophy,
  Sparkles,
  Calendar,
  Trash2,
  Edit2,
  Check,
  TrendingUp,
  Plane,
  Home,
  Car,
  GraduationCap,
  Wallet,
  X,
  PartyPopper,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Confetti from "react-confetti";

interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  category: string;
  icon: string;
  color: string;
  is_completed: boolean;
  completed_at: string | null;
}

const GOAL_ICONS: Record<string, any> = {
  target: Target,
  vacation: Plane,
  home: Home,
  car: Car,
  education: GraduationCap,
  emergency: Wallet,
  trophy: Trophy,
};

const GOAL_CATEGORIES = [
  { id: "emergency", label: "Emergency Fund", icon: "emergency", color: "#22c55e" },
  { id: "vacation", label: "Vacation", icon: "vacation", color: "#06b6d4" },
  { id: "home", label: "Home", icon: "home", color: "#8b5cf6" },
  { id: "car", label: "Car", icon: "car", color: "#f59e0b" },
  { id: "education", label: "Education", icon: "education", color: "#ec4899" },
  { id: "general", label: "General", icon: "target", color: "#E8C27B" },
];

const DEFAULT_GOALS: Omit<SavingsGoal, "id">[] = [
  {
    name: "Emergency Fund",
    target_amount: 10000,
    current_amount: 6500,
    deadline: null,
    category: "emergency",
    icon: "emergency",
    color: "#22c55e",
    is_completed: false,
    completed_at: null,
  },
  {
    name: "Hawaii Vacation",
    target_amount: 5000,
    current_amount: 3200,
    deadline: "2025-06-01",
    category: "vacation",
    icon: "vacation",
    color: "#06b6d4",
    is_completed: false,
    completed_at: null,
  },
  {
    name: "New Car Down Payment",
    target_amount: 8000,
    current_amount: 2100,
    deadline: "2025-12-01",
    category: "car",
    icon: "car",
    color: "#f59e0b",
    is_completed: false,
    completed_at: null,
  },
];

export function SavingsGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratingGoal, setCelebratingGoal] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [newContribution, setNewContribution] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    target_amount: "",
    current_amount: "0",
    deadline: "",
    category: "general",
  });

  const fetchGoals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("savings_goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching goals:", error);
      return;
    }

    if (data.length === 0) {
      // Initialize with default goals
      const goalsToInsert = DEFAULT_GOALS.map((g) => ({
        ...g,
        user_id: user.id,
      }));

      const { error: insertError } = await supabase
        .from("savings_goals")
        .insert(goalsToInsert);

      if (!insertError) {
        fetchGoals();
      }
      return;
    }

    setGoals(data as SavingsGoal[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const handleAddGoal = async () => {
    if (!user || !formData.name || !formData.target_amount) return;

    const category = GOAL_CATEGORIES.find((c) => c.id === formData.category) || GOAL_CATEGORIES[5];

    const { error } = await supabase.from("savings_goals").insert({
      user_id: user.id,
      name: formData.name,
      target_amount: parseFloat(formData.target_amount),
      current_amount: parseFloat(formData.current_amount) || 0,
      deadline: formData.deadline || null,
      category: formData.category,
      icon: category.icon,
      color: category.color,
    });

    if (error) {
      toast.error("Failed to create goal");
      return;
    }

    toast.success("Goal created!");
    setShowAddDialog(false);
    setFormData({ name: "", target_amount: "", current_amount: "0", deadline: "", category: "general" });
    fetchGoals();
  };

  const handleContribute = async (goal: SavingsGoal) => {
    const amount = parseFloat(newContribution[goal.id] || "0");
    if (!amount || amount <= 0) return;

    const newAmount = Number(goal.current_amount) + amount;
    const isNowComplete = newAmount >= Number(goal.target_amount);

    const { error } = await supabase
      .from("savings_goals")
      .update({
        current_amount: newAmount,
        is_completed: isNowComplete,
        completed_at: isNowComplete ? new Date().toISOString() : null,
      })
      .eq("id", goal.id);

    if (error) {
      toast.error("Failed to add contribution");
      return;
    }

    if (isNowComplete) {
      setCelebratingGoal(goal.name);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    } else {
      toast.success(`Added $${amount.toLocaleString()} to ${goal.name}`);
    }

    setNewContribution((prev) => ({ ...prev, [goal.id]: "" }));
    fetchGoals();
  };

  const handleDeleteGoal = async (id: string) => {
    const { error } = await supabase.from("savings_goals").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete goal");
      return;
    }

    toast.success("Goal deleted");
    fetchGoals();
  };

  const getMilestones = (goal: SavingsGoal) => {
    const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100;
    return [25, 50, 75, 100].map((milestone) => ({
      value: milestone,
      reached: progress >= milestone,
    }));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "from-emerald-500 to-green-400";
    if (progress >= 75) return "from-primary to-amber-400";
    if (progress >= 50) return "from-secondary to-purple-400";
    return "from-accent to-cyan-400";
  };

  const IconComponent = (iconName: string) => GOAL_ICONS[iconName] || Target;

  return (
    <>
      {/* Celebration Confetti */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={500}
              gravity={0.2}
            />
            <motion.div
              initial={{ scale: 0, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -100 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="glass-card p-8 text-center border border-primary/30">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <PartyPopper className="h-16 w-16 text-primary mx-auto mb-4" />
                </motion.div>
                <h2 className="text-3xl font-bold text-foreground font-serif mb-2">
                  🎉 Goal Achieved!
                </h2>
                <p className="text-lg text-muted-foreground">
                  Congratulations! You've completed "{celebratingGoal}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
        >
          <GlassCard premium className="p-0">
            <div className="relative p-6 lg:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-primary/10" />
              <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(34,197,94,0.2)",
                        "0 0 40px rgba(34,197,94,0.4)",
                        "0 0 20px rgba(34,197,94,0.2)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy className="h-8 w-8 text-emerald-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground font-serif">Savings Goals</h2>
                    <p className="text-muted-foreground">Track your progress and celebrate milestones</p>
                  </div>
                </div>

                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:opacity-90 text-white gap-2">
                      <Plus className="h-4 w-4" />
                      New Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-white/10">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-xl">Create Savings Goal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Goal Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Emergency Fund"
                          className="bg-white/[0.03] border-white/[0.08]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Target Amount</Label>
                          <Input
                            type="number"
                            value={formData.target_amount}
                            onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                            placeholder="10000"
                            className="bg-white/[0.03] border-white/[0.08]"
                          />
                        </div>
                        <div>
                          <Label>Starting Amount</Label>
                          <Input
                            type="number"
                            value={formData.current_amount}
                            onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                            placeholder="0"
                            className="bg-white/[0.03] border-white/[0.08]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(v) => setFormData({ ...formData, category: v })}
                          >
                            <SelectTrigger className="bg-white/[0.03] border-white/[0.08]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {GOAL_CATEGORIES.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Target Date (Optional)</Label>
                          <Input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="bg-white/[0.03] border-white/[0.08]"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleAddGoal}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-500"
                      >
                        Create Goal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Summary Stats */}
              <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Goals</p>
                  <p className="text-2xl font-bold text-foreground">{goals.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${goals.reduce((a, g) => a + Number(g.current_amount), 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20">
                  <p className="text-sm text-muted-foreground mb-1">Target Total</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${goals.reduce((a, g) => a + Number(g.target_amount), 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-2xl font-bold text-foreground">
                    {goals.filter((g) => g.is_completed).length}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Goals Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {goals.map((goal, index) => {
            const progress = Math.min((Number(goal.current_amount) / Number(goal.target_amount)) * 100, 100);
            const milestones = getMilestones(goal);
            const Icon = IconComponent(goal.icon);

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  className={`p-6 relative overflow-hidden ${
                    goal.is_completed ? "border-emerald-500/30" : ""
                  }`}
                  glow={goal.is_completed ? "gold" : undefined}
                >
                  {goal.is_completed && (
                    <motion.div
                      className="absolute top-4 right-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <div className="p-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                        <Check className="h-5 w-5 text-emerald-400" />
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="p-3 rounded-xl border"
                      style={{
                        backgroundColor: `${goal.color}15`,
                        borderColor: `${goal.color}30`,
                      }}
                    >
                      <Icon className="h-6 w-6" style={{ color: goal.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">{goal.name}</h3>
                      {goal.deadline && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-muted-foreground hover:text-red-400 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
                    </div>

                    {/* Progress Bar with Milestones */}
                    <div className="relative">
                      <div className="h-4 rounded-full bg-muted/30 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(progress)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>

                      {/* Milestone Markers */}
                      <div className="absolute inset-x-0 top-0 h-4 flex items-center">
                        {milestones.map((m, i) => (
                          <motion.div
                            key={m.value}
                            className="absolute"
                            style={{ left: `${m.value}%`, transform: "translateX(-50%)" }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            <div
                              className={`h-4 w-1 ${
                                m.reached ? "bg-foreground" : "bg-muted-foreground/30"
                              }`}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Milestone Labels */}
                    <div className="flex items-center justify-between">
                      {milestones.map((m) => (
                        <motion.div
                          key={m.value}
                          className={`flex items-center gap-1 text-xs ${
                            m.reached ? "text-primary" : "text-muted-foreground"
                          }`}
                          animate={m.reached ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {m.reached && <Sparkles className="h-3 w-3" />}
                          <span>{m.value}%</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Amount Display */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div>
                        <p className="text-sm text-muted-foreground">Saved</p>
                        <p className="text-xl font-bold text-foreground">
                          ${Number(goal.current_amount).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Goal</p>
                        <p className="text-xl font-bold text-foreground">
                          ${Number(goal.target_amount).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Contribution Input */}
                    {!goal.is_completed && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Amount to add"
                          value={newContribution[goal.id] || ""}
                          onChange={(e) =>
                            setNewContribution((prev) => ({ ...prev, [goal.id]: e.target.value }))
                          }
                          className="bg-white/[0.03] border-white/[0.08] flex-1"
                        />
                        <Button
                          onClick={() => handleContribute(goal)}
                          disabled={!newContribution[goal.id]}
                          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {goals.length === 0 && !isLoading && (
          <GlassCard className="p-12 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No savings goals yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first goal to start tracking your progress
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </GlassCard>
        )}
      </div>
    </>
  );
}
