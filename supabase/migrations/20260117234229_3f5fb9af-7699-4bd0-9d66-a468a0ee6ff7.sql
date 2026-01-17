-- Create cognitive_signals table for tracking behavioral patterns
CREATE TABLE public.cognitive_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  signal_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on cognitive_signals
ALTER TABLE public.cognitive_signals ENABLE ROW LEVEL SECURITY;

-- RLS policies for cognitive_signals
CREATE POLICY "Users can insert own signals" ON public.cognitive_signals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own signals" ON public.cognitive_signals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own signals" ON public.cognitive_signals
  FOR DELETE USING (auth.uid() = user_id);

-- Create cognitive_states table for inferred states
CREATE TABLE public.cognitive_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  state TEXT NOT NULL,
  confidence NUMERIC DEFAULT 0.5,
  stress_index NUMERIC DEFAULT 0,
  focus_level NUMERIC DEFAULT 0.5,
  cognitive_budget NUMERIC DEFAULT 1.0,
  predicted_next_state TEXT,
  time_to_onset_minutes INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on cognitive_states
ALTER TABLE public.cognitive_states ENABLE ROW LEVEL SECURITY;

-- RLS policies for cognitive_states
CREATE POLICY "Users can insert own states" ON public.cognitive_states
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own states" ON public.cognitive_states
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own states" ON public.cognitive_states
  FOR UPDATE USING (auth.uid() = user_id);

-- Create cognitive_profiles table for user cognitive preferences
CREATE TABLE public.cognitive_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  attention_window INTEGER DEFAULT 25,
  initiation_friction TEXT DEFAULT 'medium',
  switching_cost TEXT DEFAULT 'medium',
  structure_preference TEXT DEFAULT 'moderate',
  sensory_load_tolerance JSONB DEFAULT '{"visual": 0.7, "audio": 0.5, "haptic": 0.8}'::jsonb,
  reward_sensitivity TEXT DEFAULT 'moderate',
  predictability_need TEXT DEFAULT 'moderate',
  adaptation_mode TEXT DEFAULT 'subtle',
  let_me_struggle BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on cognitive_profiles
ALTER TABLE public.cognitive_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for cognitive_profiles
CREATE POLICY "Users can insert own profile" ON public.cognitive_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own profile" ON public.cognitive_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.cognitive_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_cognitive_profiles_updated_at
  BEFORE UPDATE ON public.cognitive_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create personalization_profiles table for god-tier personalization
CREATE TABLE public.personalization_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  causality_graph JSONB DEFAULT '[]'::jsonb,
  recovery_signature JSONB DEFAULT '{"fastest_inputs": [], "time_to_baseline": {}, "failed_interventions": []}'::jsonb,
  motivation_fingerprint JSONB DEFAULT '{"curiosity": 0.5, "competence": 0.5, "autonomy": 0.5, "social": 0.5, "progress": 0.5, "novelty": 0.5}'::jsonb,
  time_perception JSONB DEFAULT '{"time_blindness": 0.5, "future_discounting": 0.5, "deadline_response": "moderate", "planning_horizon": "medium"}'::jsonb,
  emotional_grammar JSONB DEFAULT '{}'::jsonb,
  threshold_memory JSONB DEFAULT '{"limits": [], "warnings": [], "collapse_patterns": []}'::jsonb,
  failure_taxonomy JSONB DEFAULT '{"overextension": 0, "boredom": 0, "perfection_freeze": 0, "emotional_overload": 0, "novelty_decay": 0}'::jsonb,
  identity_modes JSONB DEFAULT '{"work": {}, "home": {}, "social": {}, "recovery": {}}'::jsonb,
  meaning_anchors JSONB DEFAULT '{"phrases": [], "memories": [], "symbols": [], "values": []}'::jsonb,
  do_not_touch_zones TEXT[] DEFAULT '{}',
  trust_velocity JSONB DEFAULT '{"acceptance_rate": 0.5, "override_rate": 0, "ignore_rate": 0}'::jsonb,
  resistance_log JSONB DEFAULT '[]'::jsonb,
  preference_drift_log JSONB DEFAULT '[]'::jsonb,
  silence_model JSONB DEFAULT '{"quiet_triggers": [], "preferred_silence_duration": 30}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on personalization_profiles
ALTER TABLE public.personalization_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for personalization_profiles
CREATE POLICY "Users can insert own profile" ON public.personalization_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own profile" ON public.personalization_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.personalization_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_personalization_profiles_updated_at
  BEFORE UPDATE ON public.personalization_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.cognitive_states;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cognitive_profiles;