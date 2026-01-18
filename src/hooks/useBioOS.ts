import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

// Types
export interface HealthRecord {
  id: string;
  user_id: string;
  record_type: string;
  title: string;
  provider?: string | null;
  record_date: string;
  notes?: string | null;
  file_path?: string | null;
  extracted_data?: Json;
  created_at: string;
  updated_at?: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_date: string;
  workout_type: string;
  title: string;
  duration_minutes?: number | null;
  calories_burned?: number | null;
  exercises?: Json;
  notes?: string | null;
  energy_level?: number | null;
  created_at: string;
}

export interface MealPlanMeal {
  day: number;
  meal_type: string;
  name: string;
  description?: string;
  ingredients?: string[];
  macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  prep_time_minutes?: number;
  recipe?: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  goal?: string | null;
  daily_calories?: number | null;
  protein_grams?: number | null;
  carbs_grams?: number | null;
  fat_grams?: number | null;
  meals?: Json;
  preferences?: Json;
  allergies?: string[] | null;
  is_active: boolean | null;
  created_at: string;
  updated_at?: string;
}

export interface FoodLog {
  id: string;
  user_id: string;
  log_date: string;
  meal_type: string;
  food_name: string;
  calories?: number | null;
  protein_grams?: number | null;
  carbs_grams?: number | null;
  fat_grams?: number | null;
  serving_size?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface RecoveryMetric {
  id: string;
  user_id: string;
  metric_date: string;
  recovery_score?: number | null;
  sleep_hours?: number | null;
  sleep_quality?: number | null;
  hrv?: number | null;
  resting_hr?: number | null;
  stress_level?: number | null;
  soreness_level?: number | null;
  energy_level?: number | null;
  mood?: number | null;
  notes?: string | null;
  created_at: string;
}

export interface BioProfile {
  id: string;
  user_id: string;
  height_cm?: number | null;
  weight_kg?: number | null;
  target_weight_kg?: number | null;
  date_of_birth?: string | null;
  biological_sex?: string | null;
  activity_level?: string | null;
  fitness_goal?: string | null;
  diet_type?: string | null;
  allergies?: string[] | null;
  food_dislikes?: string[] | null;
  cooking_time_preference?: string | null;
  meals_per_day?: number | null;
  equipment?: string[] | null;
  injuries?: string[] | null;
  created_at: string;
  updated_at: string;
}

// Hook
export function useBioOS() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Bio Profile
  const { data: bioProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['bio-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('bio_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as BioProfile | null;
    },
    enabled: !!user,
  });

  const updateBioProfile = useMutation({
    mutationFn: async (profile: Partial<BioProfile>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data: existing } = await supabase
        .from('bio_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('bio_profiles')
          .update({ ...profile, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bio_profiles')
          .insert({ ...profile, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-profile'] });
      toast.success('Profile updated');
    },
    onError: (error) => {
      toast.error('Failed to update profile');
      console.error(error);
    },
  });

  // Health Records
  const { data: healthRecords = [], isLoading: recordsLoading } = useQuery({
    queryKey: ['health-records', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user.id)
        .order('record_date', { ascending: false });
      if (error) throw error;
      return data as HealthRecord[];
    },
    enabled: !!user,
  });

  const addHealthRecord = useMutation({
    mutationFn: async (record: { record_type: string; title: string; record_date: string; provider?: string; notes?: string; file_path?: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('health_records')
        .insert({ 
          record_type: record.record_type,
          title: record.title,
          record_date: record.record_date,
          provider: record.provider,
          notes: record.notes,
          file_path: record.file_path,
          user_id: user.id 
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      toast.success('Health record added');
    },
  });

  // Workout Logs
  const { data: workoutLogs = [], isLoading: workoutsLoading } = useQuery({
    queryKey: ['workout-logs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('workout_date', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data as WorkoutLog[];
    },
    enabled: !!user,
  });

  const addWorkoutLog = useMutation({
    mutationFn: async (workout: Omit<WorkoutLog, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('workout_logs')
        .insert({ ...workout, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-logs'] });
      toast.success('Workout logged');
    },
  });

  // Meal Plans
  const { data: mealPlans = [], isLoading: mealPlansLoading } = useQuery({
    queryKey: ['meal-plans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as MealPlan[];
    },
    enabled: !!user,
  });

  const activeMealPlan = mealPlans.find(p => p.is_active);

  const generateMealPlan = useMutation({
    mutationFn: async (params: {
      goal: string;
      durationDays: number;
      dailyCalories: number;
      proteinGrams: number;
      carbsGrams: number;
      fatGrams: number;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const response = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          ...params,
          dietType: bioProfile?.diet_type || 'standard',
          allergies: bioProfile?.allergies || [],
          foodDislikes: bioProfile?.food_dislikes || [],
          cookingTimePreference: bioProfile?.cooking_time_preference || 'moderate',
          mealsPerDay: bioProfile?.meals_per_day || 3,
        },
      });

      if (response.error) throw response.error;
      if (!response.data.success) throw new Error(response.data.error);

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + params.durationDays);

      // Deactivate existing plans
      await supabase
        .from('meal_plans')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Save new plan
      const { error } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          plan_name: `${params.goal} Plan - ${startDate.toLocaleDateString()}`,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          goal: params.goal,
          daily_calories: params.dailyCalories,
          protein_grams: params.proteinGrams,
          carbs_grams: params.carbsGrams,
          fat_grams: params.fatGrams,
          meals: response.data.meals,
          preferences: { generated_by: 'ai' },
          allergies: bioProfile?.allergies || [],
          is_active: true,
        });

      if (error) throw error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] });
      toast.success('Meal plan generated!');
    },
    onError: (error) => {
      toast.error('Failed to generate meal plan');
      console.error(error);
    },
  });

  // Food Logs
  const { data: foodLogs = [], isLoading: foodLogsLoading } = useQuery({
    queryKey: ['food-logs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('log_date', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as FoodLog[];
    },
    enabled: !!user,
  });

  const addFoodLog = useMutation({
    mutationFn: async (log: Omit<FoodLog, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('food_logs')
        .insert({ ...log, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-logs'] });
      toast.success('Food logged');
    },
  });

  // Recovery Metrics
  const { data: recoveryMetrics = [], isLoading: recoveryLoading } = useQuery({
    queryKey: ['recovery-metrics', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('recovery_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('metric_date', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data as RecoveryMetric[];
    },
    enabled: !!user,
  });

  const todayRecovery = recoveryMetrics.find(
    m => m.metric_date === new Date().toISOString().split('T')[0]
  );

  const addRecoveryMetric = useMutation({
    mutationFn: async (metric: Omit<RecoveryMetric, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('Not authenticated');
      
      // Upsert for today's date
      const { error } = await supabase
        .from('recovery_metrics')
        .upsert(
          { ...metric, user_id: user.id },
          { onConflict: 'user_id,metric_date' }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery-metrics'] });
      toast.success('Recovery metrics updated');
    },
  });

  return {
    // Profile
    bioProfile,
    profileLoading,
    updateBioProfile,

    // Health Records
    healthRecords,
    recordsLoading,
    addHealthRecord,

    // Workouts
    workoutLogs,
    workoutsLoading,
    addWorkoutLog,

    // Meal Plans
    mealPlans,
    activeMealPlan,
    mealPlansLoading,
    generateMealPlan,

    // Food Logs
    foodLogs,
    foodLogsLoading,
    addFoodLog,

    // Recovery
    recoveryMetrics,
    todayRecovery,
    recoveryLoading,
    addRecoveryMetric,

    // Loading state
    isLoading: profileLoading || recordsLoading || workoutsLoading || mealPlansLoading || foodLogsLoading || recoveryLoading,
  };
}
