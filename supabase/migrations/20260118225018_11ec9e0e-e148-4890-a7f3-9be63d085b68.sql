-- Create savings goals table for goal tracking feature
CREATE TABLE public.savings_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC NOT NULL DEFAULT 0,
  deadline DATE,
  category TEXT NOT NULL DEFAULT 'general',
  icon TEXT DEFAULT 'target',
  color TEXT DEFAULT '#E8C27B',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own savings goals" 
ON public.savings_goals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own savings goals" 
ON public.savings_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings goals" 
ON public.savings_goals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings goals" 
ON public.savings_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_savings_goals_updated_at
BEFORE UPDATE ON public.savings_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();