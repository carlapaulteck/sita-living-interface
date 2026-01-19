-- =============================================
-- PHASE 1: PLATFORM INFRASTRUCTURE FOUNDATION
-- =============================================

-- Organizations (Multi-tenancy)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'free',
  max_members INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Members
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  permissions JSONB DEFAULT '[]',
  invited_by UUID,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Roles & Permissions (RBAC)
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate Limiting Tracker
CREATE TABLE public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint, window_start)
);

-- Webhooks Registry
CREATE TABLE public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  headers JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  failure_count INTEGER DEFAULT 0,
  last_triggered_at TIMESTAMPTZ,
  last_response_code INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook Logs
CREATE TABLE public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES public.webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_code INTEGER,
  response_body TEXT,
  duration_ms INTEGER,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Module Manifests (Governance)
CREATE TABLE public.module_manifests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL,
  icon TEXT,
  routes JSONB NOT NULL DEFAULT '[]',
  tables JSONB NOT NULL DEFAULT '[]',
  dependencies JSONB NOT NULL DEFAULT '[]',
  capabilities JSONB NOT NULL DEFAULT '[]',
  config_schema JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_core BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Agents Registry
CREATE TABLE public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  module TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  capabilities JSONB NOT NULL DEFAULT '[]',
  triggers JSONB DEFAULT '[]',
  config JSONB DEFAULT '{}',
  model TEXT DEFAULT 'google/gemini-2.5-flash',
  max_tokens INTEGER DEFAULT 4096,
  temperature NUMERIC DEFAULT 0.7,
  is_active BOOLEAN DEFAULT true,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Tasks Queue
CREATE TABLE public.agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  output_data JSONB,
  context JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  priority INTEGER DEFAULT 5,
  parent_task_id UUID REFERENCES public.agent_tasks(id) ON DELETE SET NULL,
  workflow_id UUID,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Workflows (DAG execution)
CREATE TABLE public.agent_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  steps JSONB NOT NULL DEFAULT '[]',
  trigger_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  run_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Workflow Steps (coordination)
CREATE TABLE public.agent_workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.agent_workflows(id) ON DELETE CASCADE,
  workflow_run_id UUID,
  step_number INTEGER NOT NULL,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.agent_tasks(id) ON DELETE SET NULL,
  depends_on UUID[],
  input_mapping JSONB DEFAULT '{}',
  output_mapping JSONB DEFAULT '{}',
  status TEXT DEFAULT 'waiting',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrations Registry
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  credentials_encrypted TEXT,
  scopes TEXT[],
  status TEXT DEFAULT 'connected',
  last_sync_at TIMESTAMPTZ,
  sync_error TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Integration Sync Logs
CREATE TABLE public.integration_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL,
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'running',
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- System Metrics
CREATE TABLE public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  dimensions JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX idx_agent_tasks_user ON public.agent_tasks(user_id);
CREATE INDEX idx_agent_tasks_status ON public.agent_tasks(status);
CREATE INDEX idx_agent_tasks_agent ON public.agent_tasks(agent_id);
CREATE INDEX idx_agent_tasks_scheduled ON public.agent_tasks(scheduled_at);
CREATE INDEX idx_webhook_logs_webhook ON public.webhook_logs(webhook_id);
CREATE INDEX idx_integrations_user ON public.integrations(user_id);
CREATE INDEX idx_integrations_provider ON public.integrations(provider);
CREATE INDEX idx_system_metrics_name ON public.system_metrics(metric_name);
CREATE INDEX idx_system_metrics_time ON public.system_metrics(recorded_at);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is org member
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id AND user_id = check_user_id
  );
$$;

-- Helper function: Check if user is org owner
CREATE OR REPLACE FUNCTION public.is_org_owner(org_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organizations
    WHERE id = org_id AND owner_id = check_user_id
  );
$$;

-- Helper function: Check if user is org admin
CREATE OR REPLACE FUNCTION public.is_org_admin(org_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id 
    AND user_id = check_user_id 
    AND role IN ('admin', 'owner')
  );
$$;

-- RLS Policies for organizations
CREATE POLICY "Users can view their organizations" ON public.organizations
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    public.is_org_member(id, auth.uid())
  );

CREATE POLICY "Users can create organizations" ON public.organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their organizations" ON public.organizations
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their organizations" ON public.organizations
  FOR DELETE USING (owner_id = auth.uid());

-- RLS Policies for organization_members
CREATE POLICY "Members can view org members" ON public.organization_members
  FOR SELECT USING (public.is_org_member(organization_id, auth.uid()));

CREATE POLICY "Admins can add members" ON public.organization_members
  FOR INSERT WITH CHECK (public.is_org_admin(organization_id, auth.uid()));

CREATE POLICY "Admins can update members" ON public.organization_members
  FOR UPDATE USING (public.is_org_admin(organization_id, auth.uid()));

CREATE POLICY "Admins can remove members" ON public.organization_members
  FOR DELETE USING (public.is_org_admin(organization_id, auth.uid()));

-- RLS Policies for roles
CREATE POLICY "Members can view roles" ON public.roles
  FOR SELECT USING (
    organization_id IS NULL OR 
    public.is_org_member(organization_id, auth.uid())
  );

CREATE POLICY "Admins can manage roles" ON public.roles
  FOR ALL USING (
    organization_id IS NULL OR 
    public.is_org_admin(organization_id, auth.uid())
  );

-- RLS Policies for rate_limits
CREATE POLICY "Users can view own rate limits" ON public.rate_limits
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage rate limits" ON public.rate_limits
  FOR ALL USING (true);

-- RLS Policies for webhooks
CREATE POLICY "Users can view own webhooks" ON public.webhooks
  FOR SELECT USING (
    user_id = auth.uid() OR 
    (organization_id IS NOT NULL AND public.is_org_member(organization_id, auth.uid()))
  );

CREATE POLICY "Users can create webhooks" ON public.webhooks
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own webhooks" ON public.webhooks
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own webhooks" ON public.webhooks
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for webhook_logs
CREATE POLICY "Users can view own webhook logs" ON public.webhook_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.webhooks 
      WHERE webhooks.id = webhook_logs.webhook_id 
      AND webhooks.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert webhook logs" ON public.webhook_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for module_manifests (read-only for users)
CREATE POLICY "Anyone can view active modules" ON public.module_manifests
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage modules" ON public.module_manifests
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for ai_agents (read-only for users)
CREATE POLICY "Anyone can view active agents" ON public.ai_agents
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage agents" ON public.ai_agents
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for agent_tasks
CREATE POLICY "Users can view own tasks" ON public.agent_tasks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create tasks" ON public.agent_tasks
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tasks" ON public.agent_tasks
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can cancel own tasks" ON public.agent_tasks
  FOR DELETE USING (user_id = auth.uid() AND status = 'pending');

-- RLS Policies for agent_workflows
CREATE POLICY "Users can view own workflows" ON public.agent_workflows
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create workflows" ON public.agent_workflows
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workflows" ON public.agent_workflows
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own workflows" ON public.agent_workflows
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for agent_workflow_steps
CREATE POLICY "Users can view own workflow steps" ON public.agent_workflow_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.agent_workflows 
      WHERE agent_workflows.id = agent_workflow_steps.workflow_id 
      AND agent_workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own workflow steps" ON public.agent_workflow_steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.agent_workflows 
      WHERE agent_workflows.id = agent_workflow_steps.workflow_id 
      AND agent_workflows.user_id = auth.uid()
    )
  );

-- RLS Policies for integrations
CREATE POLICY "Users can view own integrations" ON public.integrations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create integrations" ON public.integrations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own integrations" ON public.integrations
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own integrations" ON public.integrations
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for integration_sync_logs
CREATE POLICY "Users can view own sync logs" ON public.integration_sync_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.integrations 
      WHERE integrations.id = integration_sync_logs.integration_id 
      AND integrations.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert sync logs" ON public.integration_sync_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for system_metrics (admin only)
CREATE POLICY "Admins can view metrics" ON public.system_metrics
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert metrics" ON public.system_metrics
  FOR INSERT WITH CHECK (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_webhooks_updated_at
  BEFORE UPDATE ON public.webhooks
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_module_manifests_updated_at
  BEFORE UPDATE ON public.module_manifests
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_ai_agents_updated_at
  BEFORE UPDATE ON public.ai_agents
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_agent_workflows_updated_at
  BEFORE UPDATE ON public.agent_workflows
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- Insert default system roles
INSERT INTO public.roles (name, description, permissions, is_system) VALUES
  ('owner', 'Organization owner with full access', '["*"]', true),
  ('admin', 'Administrator with management access', '["read", "write", "manage_members", "manage_settings"]', true),
  ('member', 'Standard member with read/write access', '["read", "write"]', true),
  ('viewer', 'Read-only access', '["read"]', true);

-- Insert default AI agents
INSERT INTO public.ai_agents (name, display_name, module, description, capabilities, is_system) VALUES
  ('growth-strategist', 'Growth Strategist', 'business', 'Analyzes market trends and suggests growth strategies', '["market_analysis", "strategy_planning", "competitor_research"]', true),
  ('campaign-manager', 'Campaign Manager', 'business', 'Manages and optimizes marketing campaigns', '["campaign_creation", "performance_tracking", "budget_optimization"]', true),
  ('seo-optimizer', 'SEO Optimizer', 'business', 'Optimizes content for search engines', '["keyword_research", "content_optimization", "ranking_analysis"]', true),
  ('content-creator', 'Content Creator', 'business', 'Creates engaging content for various platforms', '["blog_writing", "social_media", "copywriting"]', true),
  ('lead-scorer', 'Lead Scorer', 'business', 'Scores and prioritizes sales leads', '["lead_scoring", "qualification", "pipeline_analysis"]', true),
  ('revenue-analyst', 'Revenue Analyst', 'business', 'Analyzes revenue streams and forecasts', '["revenue_analysis", "forecasting", "attribution"]', true),
  ('calendar-agent', 'Calendar Agent', 'assistant', 'Manages calendar and scheduling', '["scheduling", "reminders", "availability"]', true),
  ('task-prioritizer', 'Task Prioritizer', 'assistant', 'Prioritizes tasks based on importance and deadlines', '["prioritization", "time_blocking", "deadline_tracking"]', true),
  ('email-summarizer', 'Email Summarizer', 'assistant', 'Summarizes and categorizes emails', '["email_summary", "categorization", "action_extraction"]', true),
  ('meeting-prep', 'Meeting Prep', 'assistant', 'Prepares meeting agendas and summaries', '["agenda_creation", "note_taking", "action_items"]', true),
  ('family-coordinator', 'Family Coordinator', 'assistant', 'Coordinates family activities and tasks', '["family_calendar", "chore_management", "meal_planning"]', true),
  ('budget-agent', 'Budget Agent', 'finance', 'Manages budgets and spending tracking', '["budget_creation", "spending_analysis", "alerts"]', true),
  ('investment-agent', 'Investment Agent', 'finance', 'Provides investment insights and tracking', '["portfolio_analysis", "market_research", "rebalancing"]', true),
  ('tax-advisor', 'Tax Advisor', 'finance', 'Helps with tax planning and optimization', '["tax_planning", "deduction_tracking", "estimation"]', true),
  ('spending-analyst', 'Spending Analyst', 'finance', 'Analyzes spending patterns', '["pattern_analysis", "categorization", "recommendations"]', true),
  ('savings-optimizer', 'Savings Optimizer', 'finance', 'Optimizes savings strategies', '["goal_planning", "automation", "optimization"]', true),
  ('nutrition-coach', 'Nutrition Coach', 'health', 'Provides nutrition guidance and meal planning', '["meal_planning", "calorie_tracking", "dietary_advice"]', true),
  ('workout-planner', 'Workout Planner', 'health', 'Creates personalized workout plans', '["workout_creation", "progress_tracking", "adaptation"]', true),
  ('recovery-advisor', 'Recovery Advisor', 'health', 'Advises on recovery and rest', '["recovery_analysis", "sleep_optimization", "stress_management"]', true),
  ('focus-coach', 'Focus Coach', 'mindset', 'Helps maintain focus and productivity', '["focus_sessions", "distraction_blocking", "deep_work"]', true),
  ('decision-advisor', 'Decision Advisor', 'mindset', 'Helps with decision making', '["decision_frameworks", "pros_cons", "scenario_analysis"]', true),
  ('habit-tracker-agent', 'Habit Tracker', 'mindset', 'Tracks and encourages habit formation', '["habit_tracking", "streaks", "reminders"]', true),
  ('stress-manager', 'Stress Manager', 'mindset', 'Helps manage stress and anxiety', '["breathing_exercises", "meditation", "workload_analysis"]', true);

-- Insert default module manifests
INSERT INTO public.module_manifests (module_name, display_name, description, version, icon, capabilities, is_core) VALUES
  ('business', 'Business OS', 'Marketing, sales, and business growth tools', '2.0.0', 'Briefcase', '["campaigns", "analytics", "leads", "revenue"]', true),
  ('finance', 'Personal Finance', 'Budget, investments, and financial planning', '2.0.0', 'DollarSign', '["budgets", "transactions", "investments", "goals"]', true),
  ('health', 'Health & Fitness', 'Fitness tracking, nutrition, and recovery', '2.0.0', 'Heart', '["workouts", "nutrition", "recovery", "wearables"]', true),
  ('assistant', 'Personal Assistant', 'Calendar, tasks, and productivity', '2.0.0', 'Calendar', '["calendar", "tasks", "reminders", "family"]', true),
  ('mindset', 'Mindset & Growth', 'Focus, habits, and personal development', '2.0.0', 'Brain', '["focus", "habits", "decisions", "journaling"]', true),
  ('academy', 'Academy & Community', 'Learning and community engagement', '2.0.0', 'GraduationCap', '["courses", "events", "community", "mentorship"]', true);