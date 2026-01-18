-- Push Subscriptions Table
CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for push_subscriptions
CREATE POLICY "Users can view own subscriptions"
ON public.push_subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
ON public.push_subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
ON public.push_subscriptions FOR DELETE
USING (auth.uid() = user_id);

-- Extend notifications table
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS push_sent BOOLEAN DEFAULT false;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS push_sent_at TIMESTAMPTZ;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';

-- Extend cognitive_profiles with discovery data
ALTER TABLE public.cognitive_profiles ADD COLUMN IF NOT EXISTS density_preference TEXT DEFAULT 'adaptive';
ALTER TABLE public.cognitive_profiles ADD COLUMN IF NOT EXISTS task_organization TEXT DEFAULT 'hybrid';
ALTER TABLE public.cognitive_profiles ADD COLUMN IF NOT EXISTS change_tolerance TEXT DEFAULT 'medium';
ALTER TABLE public.cognitive_profiles ADD COLUMN IF NOT EXISTS progress_visualization TEXT DEFAULT 'progress';
ALTER TABLE public.cognitive_profiles ADD COLUMN IF NOT EXISTS pile_up_response TEXT DEFAULT 'clearer_steps';
ALTER TABLE public.cognitive_profiles ADD COLUMN IF NOT EXISTS reminder_feeling TEXT DEFAULT 'depends';
ALTER TABLE public.cognitive_profiles ADD COLUMN IF NOT EXISTS auto_change_preference TEXT DEFAULT 'ask_first';
ALTER TABLE public.cognitive_profiles ADD COLUMN IF NOT EXISTS self_recognition_tags TEXT[] DEFAULT '{}';
ALTER TABLE public.cognitive_profiles ADD COLUMN IF NOT EXISTS language_softness_preference NUMERIC DEFAULT 0.7;
ALTER TABLE public.cognitive_profiles ADD COLUMN IF NOT EXISTS novelty_tolerance NUMERIC DEFAULT 0.5;
ALTER TABLE public.cognitive_profiles ADD COLUMN IF NOT EXISTS visual_processing NUMERIC DEFAULT 0.5;

-- Create cognitive_budget_log table for tracking energy across domains
CREATE TABLE public.cognitive_budget_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  domain TEXT NOT NULL, -- 'work', 'health', 'social', 'learning'
  activity TEXT NOT NULL,
  energy_cost NUMERIC NOT NULL DEFAULT 0.1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cognitive_budget_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budget log"
ON public.cognitive_budget_log FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget log"
ON public.cognitive_budget_log FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Evolution patterns table for long-term learning
CREATE TABLE public.evolution_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  pattern_type TEXT NOT NULL, -- 'recovery', 'motivation', 'failure', 'preference_drift'
  pattern_data JSONB DEFAULT '{}',
  confidence NUMERIC DEFAULT 0.5,
  last_observed TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.evolution_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own patterns"
ON public.evolution_patterns FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patterns"
ON public.evolution_patterns FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patterns"
ON public.evolution_patterns FOR UPDATE
USING (auth.uid() = user_id);