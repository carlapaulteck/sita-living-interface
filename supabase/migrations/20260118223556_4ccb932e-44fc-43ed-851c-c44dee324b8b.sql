-- Create finance_transactions table
CREATE TABLE public.finance_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT NOT NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create finance_budgets table
CREATE TABLE public.finance_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  budget_amount DECIMAL(12,2) NOT NULL,
  period TEXT NOT NULL DEFAULT 'monthly',
  color TEXT DEFAULT '#8b5cf6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category, period)
);

-- Create finance_investments table
CREATE TABLE public.finance_investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT,
  investment_type TEXT NOT NULL,
  current_value DECIMAL(14,2) NOT NULL,
  cost_basis DECIMAL(14,2) NOT NULL,
  shares DECIMAL(10,4),
  allocation_percentage DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent_activities table for real-time agent activity feed
CREATE TABLE public.agent_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_name TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  priority TEXT DEFAULT 'low',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_agents table for tracking agent states
CREATE TABLE public.user_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle',
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  last_action TEXT,
  last_action_at TIMESTAMP WITH TIME ZONE,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, agent_name)
);

-- Enable RLS on all tables
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_agents ENABLE ROW LEVEL SECURITY;

-- RLS policies for finance_transactions
CREATE POLICY "Users can view their own transactions" ON public.finance_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transactions" ON public.finance_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON public.finance_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON public.finance_transactions FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for finance_budgets
CREATE POLICY "Users can view their own budgets" ON public.finance_budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own budgets" ON public.finance_budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own budgets" ON public.finance_budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own budgets" ON public.finance_budgets FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for finance_investments
CREATE POLICY "Users can view their own investments" ON public.finance_investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own investments" ON public.finance_investments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own investments" ON public.finance_investments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own investments" ON public.finance_investments FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for agent_activities
CREATE POLICY "Users can view their own agent activities" ON public.agent_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own agent activities" ON public.agent_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_agents
CREATE POLICY "Users can view their own agents" ON public.user_agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own agents" ON public.user_agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own agents" ON public.user_agents FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_finance_transactions_updated_at BEFORE UPDATE ON public.finance_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_finance_budgets_updated_at BEFORE UPDATE ON public.finance_budgets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_finance_investments_updated_at BEFORE UPDATE ON public.finance_investments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_agents_updated_at BEFORE UPDATE ON public.user_agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for agent_activities
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_activities;