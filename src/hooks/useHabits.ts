import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  domain: string;
  frequency: string;
  target_count: number;
  reminder_time?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  count: number;
  notes?: string;
  created_at: string;
}

export interface CreateHabitInput {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  domain?: string;
  frequency?: string;
  target_count?: number;
  reminder_time?: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function useHabits() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      setHabits(data || []);
    } catch (err) {
      toast({
        title: "Error loading habits",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const fetchCompletions = useCallback(async (daysBack: number = 365) => {
    if (!user) return;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    
    try {
      const { data, error } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", user.id)
        .gte("completed_at", startDate.toISOString().split("T")[0])
        .order("completed_at", { ascending: false });
      
      if (error) throw error;
      setCompletions(data || []);
    } catch (err) {
      console.error("Error fetching completions:", err);
    }
  }, [user]);

  const createHabit = useCallback(async (input: CreateHabitInput) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from("habits")
        .insert({
          user_id: user.id,
          name: input.name,
          description: input.description,
          icon: input.icon || "check",
          color: input.color || "primary",
          domain: input.domain || "general",
          frequency: input.frequency || "daily",
          target_count: input.target_count || 1,
          reminder_time: input.reminder_time,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setHabits(prev => [...prev, data]);
      toast({
        title: "Habit created",
        description: `"${input.name}" is now being tracked`,
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Failed to create habit",
        description: (err as Error).message,
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  const completeHabit = useCallback(async (habitId: string, date?: Date) => {
    if (!user) return false;
    
    const completedAt = (date || new Date()).toISOString().split("T")[0];
    
    try {
      // Check if already completed today
      const existing = completions.find(c => 
        c.habit_id === habitId && c.completed_at === completedAt
      );
      
      if (existing) {
        // Increment count
        const { error } = await supabase
          .from("habit_completions")
          .update({ count: existing.count + 1 })
          .eq("id", existing.id);
        
        if (error) throw error;
        
        setCompletions(prev => prev.map(c => 
          c.id === existing.id ? { ...c, count: c.count + 1 } : c
        ));
      } else {
        // Create new completion
        const { data, error } = await supabase
          .from("habit_completions")
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_at: completedAt,
            count: 1,
          })
          .select()
          .single();
        
        if (error) throw error;
        setCompletions(prev => [data, ...prev]);
      }
      
      const habit = habits.find(h => h.id === habitId);
      toast({
        title: "Habit completed!",
        description: habit ? `Great job on "${habit.name}"` : "Keep it up!",
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Failed to log completion",
        description: (err as Error).message,
        variant: "destructive",
      });
      return false;
    }
  }, [user, habits, completions, toast]);

  const uncompleteHabit = useCallback(async (habitId: string, date?: Date) => {
    if (!user) return false;
    
    const completedAt = (date || new Date()).toISOString().split("T")[0];
    
    try {
      const existing = completions.find(c => 
        c.habit_id === habitId && c.completed_at === completedAt
      );
      
      if (!existing) return false;
      
      if (existing.count > 1) {
        const { error } = await supabase
          .from("habit_completions")
          .update({ count: existing.count - 1 })
          .eq("id", existing.id);
        
        if (error) throw error;
        
        setCompletions(prev => prev.map(c => 
          c.id === existing.id ? { ...c, count: c.count - 1 } : c
        ));
      } else {
        const { error } = await supabase
          .from("habit_completions")
          .delete()
          .eq("id", existing.id);
        
        if (error) throw error;
        setCompletions(prev => prev.filter(c => c.id !== existing.id));
      }
      
      return true;
    } catch (err) {
      toast({
        title: "Failed to update",
        description: (err as Error).message,
        variant: "destructive",
      });
      return false;
    }
  }, [user, completions, toast]);

  const deleteHabit = useCallback(async (habitId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from("habits")
        .update({ is_active: false })
        .eq("id", habitId)
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      setHabits(prev => prev.filter(h => h.id !== habitId));
      toast({
        title: "Habit archived",
        description: "The habit has been removed from tracking",
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Failed to delete habit",
        description: (err as Error).message,
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Generate contribution grid data
  const getContributionGrid = useCallback((habitId?: string, weeks: number = 52): ContributionDay[] => {
    const grid: ContributionDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Start from the beginning of the first week
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (weeks * 7) + 1);
    
    const filteredCompletions = habitId 
      ? completions.filter(c => c.habit_id === habitId)
      : completions;
    
    // Create a map for quick lookup
    const completionMap = new Map<string, number>();
    filteredCompletions.forEach(c => {
      const key = c.completed_at;
      completionMap.set(key, (completionMap.get(key) || 0) + c.count);
    });
    
    // Get max count for level calculation
    const maxCount = Math.max(...Array.from(completionMap.values()), 1);
    
    for (let i = 0; i < weeks * 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const count = completionMap.get(dateStr) || 0;
      
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) {
        const ratio = count / maxCount;
        if (ratio <= 0.25) level = 1;
        else if (ratio <= 0.5) level = 2;
        else if (ratio <= 0.75) level = 3;
        else level = 4;
      }
      
      grid.push({ date: dateStr, count, level });
    }
    
    return grid;
  }, [completions]);

  // Calculate streak for a habit
  const getStreak = useCallback((habitId: string): number => {
    const habitCompletions = completions
      .filter(c => c.habit_id === habitId)
      .map(c => c.completed_at)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    if (habitCompletions.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < habitCompletions.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedStr = expectedDate.toISOString().split("T")[0];
      
      if (habitCompletions.includes(expectedStr)) {
        streak++;
      } else if (i === 0) {
        // Check if yesterday was completed (allow for not yet completed today)
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        if (habitCompletions.includes(yesterdayStr)) {
          continue; // Give them a pass for today
        }
        break;
      } else {
        break;
      }
    }
    
    return streak;
  }, [completions]);

  // Check if habit is completed today
  const isCompletedToday = useCallback((habitId: string): boolean => {
    const today = new Date().toISOString().split("T")[0];
    return completions.some(c => c.habit_id === habitId && c.completed_at === today);
  }, [completions]);

  // Get today's progress
  const getTodayProgress = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const completedToday = habits.filter(h => 
      completions.some(c => c.habit_id === h.id && c.completed_at === today)
    );
    
    return {
      completed: completedToday.length,
      total: habits.length,
      percentage: habits.length > 0 ? Math.round((completedToday.length / habits.length) * 100) : 0,
    };
  }, [habits, completions]);

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchCompletions();
    }
  }, [user, fetchHabits, fetchCompletions]);

  return {
    habits,
    completions,
    isLoading,
    fetchHabits,
    createHabit,
    completeHabit,
    uncompleteHabit,
    deleteHabit,
    getContributionGrid,
    getStreak,
    isCompletedToday,
    getTodayProgress,
  };
}
