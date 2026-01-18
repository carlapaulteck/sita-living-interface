-- Fix the overly permissive error_logs insert policy
-- Instead of allowing any insert, require a valid user_id match
DROP POLICY IF EXISTS "Authenticated users can log errors" ON public.error_logs;

CREATE POLICY "Authenticated users can log errors"
ON public.error_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());