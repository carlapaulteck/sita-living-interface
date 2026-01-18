-- Automation execution history log
CREATE TABLE public.automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  automation_id TEXT NOT NULL,
  automation_name TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  actions_taken JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;

-- RLS policies for automation_runs
CREATE POLICY "Users can view own automation runs"
ON public.automation_runs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own automation runs"
ON public.automation_runs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own automation runs"
ON public.automation_runs FOR DELETE
USING (auth.uid() = user_id);

-- User-created custom automations
CREATE TABLE public.user_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB DEFAULT '{}'::jsonb,
  action_type TEXT NOT NULL,
  action_config JSONB DEFAULT '{}'::jsonb,
  is_enabled BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  cooldown_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_automations ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_automations
CREATE POLICY "Users can view own automations"
ON public.user_automations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own automations"
ON public.user_automations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own automations"
ON public.user_automations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own automations"
ON public.user_automations FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at on user_automations
CREATE TRIGGER update_user_automations_updated_at
BEFORE UPDATE ON public.user_automations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();