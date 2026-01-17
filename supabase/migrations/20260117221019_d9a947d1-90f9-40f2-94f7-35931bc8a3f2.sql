-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_preferences table for onboarding data
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  setup_mode TEXT DEFAULT 'guided',
  primary_intents TEXT[] DEFAULT '{}',
  north_star_metrics TEXT[] DEFAULT '{}',
  assistant_style TEXT DEFAULT 'executive',
  friction_profile JSONB DEFAULT '{}',
  voice_profile JSONB DEFAULT '{}',
  sensory_prefs JSONB DEFAULT '{}',
  daily_rhythm JSONB DEFAULT '{}',
  calendar_connected BOOLEAN DEFAULT false,
  integrations JSONB DEFAULT '[]',
  wealth_profile JSONB,
  health_profile JSONB,
  focus_profile JSONB,
  sovereignty_profile JSONB DEFAULT '{}',
  autonomy_level TEXT DEFAULT 'suggest',
  guardrails JSONB DEFAULT '{}',
  automations JSONB DEFAULT '[]',
  avatar_style TEXT DEFAULT 'orb',
  presence_style TEXT DEFAULT 'calm',
  signature_phrase TEXT,
  morning_ritual BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'dark',
  onboarding_version INTEGER DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON public.user_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences FOR UPDATE 
USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply trigger to tables
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();