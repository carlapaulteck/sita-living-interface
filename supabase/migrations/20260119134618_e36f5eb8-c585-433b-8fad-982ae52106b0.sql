-- Security Hardening Migration
-- Fix all RLS policy issues found in security scan

-- 1. Fix academy_profiles - should require authentication
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.academy_profiles;
CREATE POLICY "Authenticated users can view profiles"
ON public.academy_profiles
FOR SELECT
TO authenticated
USING (true);

-- 2. Fix member_points - should require authentication  
DROP POLICY IF EXISTS "Anyone can view member points" ON public.member_points;
CREATE POLICY "Authenticated users can view member points"
ON public.member_points
FOR SELECT
TO authenticated
USING (true);

-- 3. Fix gamification_settings - should require authentication
DROP POLICY IF EXISTS "Anyone can view gamification settings" ON public.gamification_settings;
CREATE POLICY "Authenticated users can view gamification settings"
ON public.gamification_settings
FOR SELECT
TO authenticated
USING (true);

-- 4. Fix content_likes - should require authentication
DROP POLICY IF EXISTS "Anyone can view likes" ON public.content_likes;
CREATE POLICY "Authenticated users can view likes"
ON public.content_likes
FOR SELECT
TO authenticated
USING (true);

-- 5. Fix event_rsvps - should require authentication
DROP POLICY IF EXISTS "Anyone can view RSVPs" ON public.event_rsvps;
CREATE POLICY "Authenticated users can view RSVPs"
ON public.event_rsvps
FOR SELECT
TO authenticated
USING (true);

-- 6. Fix academy_notifications INSERT policy - should not use USING(true)
DROP POLICY IF EXISTS "System can insert notifications" ON public.academy_notifications;
CREATE POLICY "Users can receive notifications"
ON public.academy_notifications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 7. Add service role policy for system notifications
CREATE POLICY "Service role can insert notifications"
ON public.academy_notifications
FOR INSERT
TO service_role
WITH CHECK (true);

-- 8. Fix community_posts - require auth for all operations
DROP POLICY IF EXISTS "Anyone can view posts" ON public.community_posts;
CREATE POLICY "Authenticated users can view posts"
ON public.community_posts
FOR SELECT
TO authenticated
USING (true);

-- 9. Fix post_comments - require auth
DROP POLICY IF EXISTS "Anyone can view comments" ON public.post_comments;
CREATE POLICY "Authenticated users can view comments"
ON public.post_comments
FOR SELECT
TO authenticated
USING (true);

-- 10. Fix community_events - require auth
DROP POLICY IF EXISTS "Anyone can view events" ON public.community_events;
CREATE POLICY "Authenticated users can view events"
ON public.community_events
FOR SELECT
TO authenticated
USING (true);

-- 11. Update has_role function with explicit search_path for security
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 12. Update get_user_role function with explicit search_path
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role 
      WHEN 'admin' THEN 1 
      WHEN 'moderator' THEN 2 
      WHEN 'user' THEN 3 
    END
  LIMIT 1
$$;