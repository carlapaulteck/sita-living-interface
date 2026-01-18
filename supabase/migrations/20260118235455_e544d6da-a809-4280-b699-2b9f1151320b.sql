-- Health Records Table
CREATE TABLE public.health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  record_type TEXT NOT NULL, -- 'lab_report', 'imaging', 'visit', 'vaccination', 'prescription'
  title TEXT NOT NULL,
  provider TEXT,
  record_date DATE NOT NULL,
  notes TEXT,
  file_path TEXT,
  extracted_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workout Logs Table
CREATE TABLE public.workout_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
  workout_type TEXT NOT NULL, -- 'strength', 'cardio', 'hiit', 'yoga', 'mobility'
  title TEXT NOT NULL,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  exercises JSONB DEFAULT '[]'::jsonb, -- [{name, sets, reps, weight, notes}]
  notes TEXT,
  energy_level INTEGER, -- 1-10
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Meal Plans Table
CREATE TABLE public.meal_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  goal TEXT, -- 'cut', 'maintain', 'bulk', 'general_health'
  daily_calories INTEGER,
  protein_grams INTEGER,
  carbs_grams INTEGER,
  fat_grams INTEGER,
  meals JSONB DEFAULT '[]'::jsonb, -- [{day, meal_type, name, ingredients, macros, recipe}]
  preferences JSONB DEFAULT '{}'::jsonb,
  allergies TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Food Logs Table
CREATE TABLE public.food_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
  food_name TEXT NOT NULL,
  calories INTEGER,
  protein_grams DECIMAL,
  carbs_grams DECIMAL,
  fat_grams DECIMAL,
  serving_size TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Recovery Metrics Table
CREATE TABLE public.recovery_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  recovery_score INTEGER, -- 0-100
  sleep_hours DECIMAL,
  sleep_quality INTEGER, -- 1-10
  hrv INTEGER,
  resting_hr INTEGER,
  stress_level INTEGER, -- 1-10
  soreness_level INTEGER, -- 1-10
  energy_level INTEGER, -- 1-10
  mood INTEGER, -- 1-10
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, metric_date)
);

-- Bio Profiles Table (user health preferences)
CREATE TABLE public.bio_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  height_cm INTEGER,
  weight_kg DECIMAL,
  target_weight_kg DECIMAL,
  date_of_birth DATE,
  biological_sex TEXT,
  activity_level TEXT, -- 'sedentary', 'light', 'moderate', 'active', 'very_active'
  fitness_goal TEXT, -- 'lose_weight', 'build_muscle', 'maintain', 'improve_endurance'
  diet_type TEXT, -- 'standard', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean'
  allergies TEXT[] DEFAULT '{}',
  food_dislikes TEXT[] DEFAULT '{}',
  cooking_time_preference TEXT, -- 'quick', 'moderate', 'elaborate'
  meals_per_day INTEGER DEFAULT 3,
  equipment TEXT[] DEFAULT '{}', -- gym equipment available
  injuries TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bio_profiles ENABLE ROW LEVEL SECURITY;

-- Health Records Policies
CREATE POLICY "Users can view own health records" ON public.health_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own health records" ON public.health_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health records" ON public.health_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own health records" ON public.health_records FOR DELETE USING (auth.uid() = user_id);

-- Workout Logs Policies
CREATE POLICY "Users can view own workout logs" ON public.workout_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own workout logs" ON public.workout_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workout logs" ON public.workout_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workout logs" ON public.workout_logs FOR DELETE USING (auth.uid() = user_id);

-- Meal Plans Policies
CREATE POLICY "Users can view own meal plans" ON public.meal_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own meal plans" ON public.meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal plans" ON public.meal_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meal plans" ON public.meal_plans FOR DELETE USING (auth.uid() = user_id);

-- Food Logs Policies
CREATE POLICY "Users can view own food logs" ON public.food_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own food logs" ON public.food_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own food logs" ON public.food_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own food logs" ON public.food_logs FOR DELETE USING (auth.uid() = user_id);

-- Recovery Metrics Policies
CREATE POLICY "Users can view own recovery metrics" ON public.recovery_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own recovery metrics" ON public.recovery_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recovery metrics" ON public.recovery_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recovery metrics" ON public.recovery_metrics FOR DELETE USING (auth.uid() = user_id);

-- Bio Profiles Policies
CREATE POLICY "Users can view own bio profile" ON public.bio_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bio profile" ON public.bio_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bio profile" ON public.bio_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_health_records_user_date ON public.health_records(user_id, record_date DESC);
CREATE INDEX idx_workout_logs_user_date ON public.workout_logs(user_id, workout_date DESC);
CREATE INDEX idx_meal_plans_user_active ON public.meal_plans(user_id, is_active);
CREATE INDEX idx_food_logs_user_date ON public.food_logs(user_id, log_date DESC);
CREATE INDEX idx_recovery_metrics_user_date ON public.recovery_metrics(user_id, metric_date DESC);