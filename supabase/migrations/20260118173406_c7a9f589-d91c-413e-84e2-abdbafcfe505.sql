-- Create feature_flags table
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  enabled_for_roles TEXT[] DEFAULT '{}',
  enabled_for_users UUID[] DEFAULT '{}',
  disabled_for_users UUID[] DEFAULT '{}',
  percentage_rollout INTEGER DEFAULT 100 CHECK (percentage_rollout >= 0 AND percentage_rollout <= 100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read flags (needed to check if features are enabled)
CREATE POLICY "Authenticated users can read feature flags"
ON public.feature_flags
FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage feature flags
CREATE POLICY "Admins can insert feature flags"
ON public.feature_flags
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update feature flags"
ON public.feature_flags
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete feature flags"
ON public.feature_flags
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for fast key lookups
CREATE INDEX idx_feature_flags_key ON public.feature_flags(key);

-- Add trigger for updated_at
CREATE TRIGGER update_feature_flags_updated_at
BEFORE UPDATE ON public.feature_flags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample feature flags
INSERT INTO public.feature_flags (key, name, description, is_enabled, enabled_for_roles) VALUES
('beta_ai_chat', 'Beta AI Chat', 'Access to experimental AI chat features', false, ARRAY['admin']),
('advanced_analytics', 'Advanced Analytics', 'Enhanced analytics dashboard with detailed metrics', true, ARRAY['admin', 'moderator']),
('dark_mode', 'Dark Mode', 'Enable dark mode theme option', true, ARRAY['admin', 'moderator', 'user']),
('export_data', 'Data Export', 'Allow users to export their data', false, ARRAY['admin']);