-- Calendar Events table for multi-tenant calendar sync
CREATE TABLE public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  external_id TEXT,
  calendar_source TEXT DEFAULT 'manual',
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  is_all_day BOOLEAN DEFAULT false,
  is_focus_block BOOLEAN DEFAULT false,
  is_meeting BOOLEAN DEFAULT false,
  attendees JSONB DEFAULT '[]',
  recurrence_rule TEXT,
  color TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habits table
CREATE TABLE public.habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'check',
  color TEXT DEFAULT 'primary',
  domain TEXT DEFAULT 'general',
  frequency TEXT DEFAULT 'daily',
  target_count INTEGER DEFAULT 1,
  reminder_time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habit completions table (for contribution grid)
CREATE TABLE public.habit_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  completed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notification batches table
CREATE TABLE public.notification_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  batch_type TEXT NOT NULL DEFAULT 'digest',
  status TEXT DEFAULT 'pending',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  notification_ids UUID[] DEFAULT '{}',
  cognitive_state TEXT,
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_batches ENABLE ROW LEVEL SECURITY;

-- Calendar events policies
CREATE POLICY "Users can view their own calendar events" 
ON public.calendar_events FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calendar events" 
ON public.calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events" 
ON public.calendar_events FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events" 
ON public.calendar_events FOR DELETE USING (auth.uid() = user_id);

-- Habits policies
CREATE POLICY "Users can view their own habits" 
ON public.habits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits" 
ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" 
ON public.habits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" 
ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- Habit completions policies
CREATE POLICY "Users can view their own habit completions" 
ON public.habit_completions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habit completions" 
ON public.habit_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit completions" 
ON public.habit_completions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit completions" 
ON public.habit_completions FOR DELETE USING (auth.uid() = user_id);

-- Notification batches policies
CREATE POLICY "Users can view their own notification batches" 
ON public.notification_batches FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notification batches" 
ON public.notification_batches FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification batches" 
ON public.notification_batches FOR UPDATE USING (auth.uid() = user_id);

-- Add unique constraint for habit completions (one per day per habit)
CREATE UNIQUE INDEX idx_habit_completions_unique ON public.habit_completions(habit_id, completed_at);

-- Add indexes for performance
CREATE INDEX idx_calendar_events_user_time ON public.calendar_events(user_id, start_time);
CREATE INDEX idx_habits_user ON public.habits(user_id, is_active);
CREATE INDEX idx_habit_completions_user_date ON public.habit_completions(user_id, completed_at);
CREATE INDEX idx_notification_batches_user_status ON public.notification_batches(user_id, status);

-- Triggers for updated_at
CREATE TRIGGER update_calendar_events_updated_at
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
BEFORE UPDATE ON public.habits
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();