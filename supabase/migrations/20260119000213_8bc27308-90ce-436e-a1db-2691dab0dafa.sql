-- =============================================
-- SITA ACADEMY - COMPLETE DATABASE SCHEMA
-- =============================================

-- 1. COMMUNITY POSTS TABLE
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  media_urls TEXT[] DEFAULT '{}',
  poll_options JSONB DEFAULT NULL,
  poll_votes JSONB DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. POST COMMENTS TABLE
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. ACADEMY COURSES TABLE
CREATE TABLE public.academy_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'general',
  difficulty TEXT DEFAULT 'beginner',
  duration_hours NUMERIC DEFAULT 0,
  unlock_at_level INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  lessons_count INTEGER DEFAULT 0,
  enrolled_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. COURSE LESSONS TABLE
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL DEFAULT 'video',
  video_url TEXT,
  video_duration_seconds INTEGER DEFAULT 0,
  text_content TEXT,
  resources JSONB DEFAULT '[]',
  transcript TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. USER COURSE PROGRESS TABLE
CREATE TABLE public.user_course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  watch_progress_seconds INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 6. COMMUNITY EVENTS TABLE
CREATE TABLE public.community_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'livestream',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  meeting_url TEXT,
  cover_image_url TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  max_attendees INTEGER,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. EVENT RSVPS TABLE
CREATE TABLE public.event_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'going',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- 8. MEMBER POINTS TABLE
CREATE TABLE public.member_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  level_name TEXT DEFAULT 'Newcomer',
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. POINT TRANSACTIONS TABLE
CREATE TABLE public.point_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL,
  action_type TEXT NOT NULL,
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. CONTENT LIKES TABLE
CREATE TABLE public.content_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_type, content_id)
);

-- 11. MEMBER PROFILES (Enhanced for Academy)
CREATE TABLE public.academy_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  badges JSONB DEFAULT '[]',
  is_admin BOOLEAN DEFAULT false,
  notification_preferences JSONB DEFAULT '{"email_digest": true, "event_reminders": true, "new_content": true}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. GAMIFICATION SETTINGS TABLE (Admin configurable)
CREATE TABLE public.gamification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default gamification settings
INSERT INTO public.gamification_settings (setting_key, setting_value) VALUES
('point_values', '{"post": 10, "comment": 5, "like_received": 2, "lesson_complete": 15, "course_complete": 100, "event_attend": 25, "daily_login": 5}'),
('levels', '[{"level": 1, "name": "Newcomer", "min_points": 0}, {"level": 2, "name": "Seeker", "min_points": 100}, {"level": 3, "name": "Apprentice", "min_points": 300}, {"level": 4, "name": "Practitioner", "min_points": 600}, {"level": 5, "name": "Adept", "min_points": 1000}, {"level": 6, "name": "Master", "min_points": 2000}]');

-- 13. NOTIFICATIONS TABLE (Academy specific)
CREATE TABLE public.academy_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  reference_type TEXT,
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_notifications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - COMMUNITY POSTS
-- =============================================

CREATE POLICY "Anyone can view posts" ON public.community_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - POST COMMENTS
-- =============================================

CREATE POLICY "Anyone can view comments" ON public.post_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.post_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.post_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.post_comments
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - ACADEMY COURSES
-- =============================================

CREATE POLICY "Anyone can view published courses" ON public.academy_courses
  FOR SELECT USING (is_published = true OR auth.uid() = created_by);

CREATE POLICY "Admins can create courses" ON public.academy_courses
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update own courses" ON public.academy_courses
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can delete own courses" ON public.academy_courses
  FOR DELETE USING (auth.uid() = created_by);

-- =============================================
-- RLS POLICIES - COURSE LESSONS
-- =============================================

CREATE POLICY "Anyone can view lessons of published courses" ON public.course_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.academy_courses 
      WHERE id = course_id AND (is_published = true OR created_by = auth.uid())
    )
  );

CREATE POLICY "Course creators can manage lessons" ON public.course_lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.academy_courses 
      WHERE id = course_id AND created_by = auth.uid()
    )
  );

-- =============================================
-- RLS POLICIES - USER COURSE PROGRESS
-- =============================================

CREATE POLICY "Users can view own progress" ON public.user_course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own progress" ON public.user_course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - COMMUNITY EVENTS
-- =============================================

CREATE POLICY "Anyone can view events" ON public.community_events
  FOR SELECT USING (true);

CREATE POLICY "Admins can create events" ON public.community_events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update own events" ON public.community_events
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can delete own events" ON public.community_events
  FOR DELETE USING (auth.uid() = created_by);

-- =============================================
-- RLS POLICIES - EVENT RSVPS
-- =============================================

CREATE POLICY "Anyone can view RSVPs" ON public.event_rsvps
  FOR SELECT USING (true);

CREATE POLICY "Users can RSVP" ON public.event_rsvps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RSVP" ON public.event_rsvps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own RSVP" ON public.event_rsvps
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - MEMBER POINTS
-- =============================================

CREATE POLICY "Anyone can view points" ON public.member_points
  FOR SELECT USING (true);

CREATE POLICY "Users can create own points record" ON public.member_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own points" ON public.member_points
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - POINT TRANSACTIONS
-- =============================================

CREATE POLICY "Users can view own transactions" ON public.point_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON public.point_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - CONTENT LIKES
-- =============================================

CREATE POLICY "Anyone can view likes" ON public.content_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can create likes" ON public.content_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON public.content_likes
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - ACADEMY PROFILES
-- =============================================

CREATE POLICY "Anyone can view profiles" ON public.academy_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can create own profile" ON public.academy_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.academy_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - GAMIFICATION SETTINGS
-- =============================================

CREATE POLICY "Anyone can view settings" ON public.gamification_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.gamification_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.academy_profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- =============================================
-- RLS POLICIES - ACADEMY NOTIFICATIONS
-- =============================================

CREATE POLICY "Users can view own notifications" ON public.academy_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.academy_notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON public.academy_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academy_courses_updated_at
  BEFORE UPDATE ON public.academy_courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_member_points_updated_at
  BEFORE UPDATE ON public.member_points
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academy_profiles_updated_at
  BEFORE UPDATE ON public.academy_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gamification_settings_updated_at
  BEFORE UPDATE ON public.gamification_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- ENABLE REALTIME
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.member_points;
ALTER PUBLICATION supabase_realtime ADD TABLE public.academy_notifications;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX idx_community_posts_category ON public.community_posts(category);
CREATE INDEX idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX idx_course_lessons_course_id ON public.course_lessons(course_id);
CREATE INDEX idx_user_course_progress_user_id ON public.user_course_progress(user_id);
CREATE INDEX idx_community_events_start_time ON public.community_events(start_time);
CREATE INDEX idx_member_points_total ON public.member_points(total_points DESC);
CREATE INDEX idx_content_likes_content ON public.content_likes(content_type, content_id);
CREATE INDEX idx_academy_notifications_user ON public.academy_notifications(user_id, is_read);