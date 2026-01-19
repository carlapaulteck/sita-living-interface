-- Fix remaining security issues

-- 1. Fix handle_updated_at function with search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 2. Fix handle_new_user_role function - already has search_path but confirming
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- 3. Fix permissive INSERT policies - find and fix WITH CHECK (true) on non-service policies
-- Fix notifications table INSERT policy
DROP POLICY IF EXISTS "Users can create their own notifications" ON public.notifications;
CREATE POLICY "Users can create their own notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Fix activity_feed INSERT policy
DROP POLICY IF EXISTS "Users can insert own activities" ON public.activity_feed;
CREATE POLICY "Users can insert own activities"
ON public.activity_feed
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Fix cognitive_signals INSERT policy
DROP POLICY IF EXISTS "Users can insert own signals" ON public.cognitive_signals;
CREATE POLICY "Users can insert own signals"
ON public.cognitive_signals
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Fix cognitive_states INSERT policy
DROP POLICY IF EXISTS "Users can insert own states" ON public.cognitive_states;
CREATE POLICY "Users can insert own states"
ON public.cognitive_states
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Fix cognitive_budget_log INSERT policy
DROP POLICY IF EXISTS "Users can insert own budget logs" ON public.cognitive_budget_log;
CREATE POLICY "Users can insert own budget logs"
ON public.cognitive_budget_log
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Fix realtime_metrics INSERT policy
DROP POLICY IF EXISTS "Users can insert own metrics" ON public.realtime_metrics;
CREATE POLICY "Users can insert own metrics"
ON public.realtime_metrics
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());