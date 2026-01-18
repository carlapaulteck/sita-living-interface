-- Create spending alerts table
CREATE TABLE public.spending_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('budget_limit', 'unusual_spending', 'large_transaction')),
  category TEXT,
  threshold_percentage INTEGER DEFAULT 80,
  threshold_amount DECIMAL,
  is_active BOOLEAN DEFAULT true,
  notification_method TEXT DEFAULT 'in_app' CHECK (notification_method IN ('in_app', 'push', 'email')),
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create saving rules table
CREATE TABLE public.saving_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('income_percentage', 'round_up', 'fixed_schedule', 'condition')),
  trigger_condition JSONB DEFAULT '{}',
  target_goal_id UUID REFERENCES public.savings_goals(id) ON DELETE SET NULL,
  amount DECIMAL NOT NULL,
  is_percentage BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  total_saved DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create bills table
CREATE TABLE public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  category TEXT,
  is_autopay BOOLEAN DEFAULT false,
  provider TEXT,
  notes TEXT,
  next_due_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create bill payments table
CREATE TABLE public.bill_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount_paid DECIMAL NOT NULL,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.spending_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saving_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for spending_alerts
CREATE POLICY "Users can view their own spending alerts" ON public.spending_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own spending alerts" ON public.spending_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own spending alerts" ON public.spending_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own spending alerts" ON public.spending_alerts FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for saving_rules
CREATE POLICY "Users can view their own saving rules" ON public.saving_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own saving rules" ON public.saving_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own saving rules" ON public.saving_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saving rules" ON public.saving_rules FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for bills
CREATE POLICY "Users can view their own bills" ON public.bills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bills" ON public.bills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bills" ON public.bills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bills" ON public.bills FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for bill_payments
CREATE POLICY "Users can view their own bill payments" ON public.bill_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bill payments" ON public.bill_payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bill payments" ON public.bill_payments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bill payments" ON public.bill_payments FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_spending_alerts_updated_at BEFORE UPDATE ON public.spending_alerts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_saving_rules_updated_at BEFORE UPDATE ON public.saving_rules FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON public.bills FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();