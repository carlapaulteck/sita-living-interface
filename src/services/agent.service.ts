import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface AgentTask {
  agent_id?: string;
  agent_name?: string;
  task_type: string;
  input_data: Record<string, unknown>;
  priority?: number;
  context?: Record<string, unknown>;
  workflow_id?: string;
  parent_task_id?: string;
}

export interface WorkflowStep {
  agent_name: string;
  task_type: string;
  input_mapping?: Record<string, string>;
  depends_on?: string[];
}

export interface Agent {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  module: string;
  capabilities: Json;
  config: Json | null;
  is_active: boolean | null;
  is_system: boolean | null;
  model: string | null;
  temperature: number | null;
  max_tokens: number | null;
  triggers: Json | null;
  avatar_url: string | null;
}

export interface TaskRecord {
  id: string;
  agent_id: string | null;
  user_id: string;
  task_type: string;
  input_data: Json;
  output_data: Json | null;
  status: string | null;
  priority: number | null;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  created_at: string | null;
  retry_count: number | null;
  max_retries: number | null;
  ai_agents?: {
    name: string;
    display_name: string;
    module: string;
  } | null;
}

export interface WorkflowRecord {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  steps: Json;
  is_active: boolean | null;
  run_count: number | null;
  last_run_at: string | null;
  trigger_config: Json | null;
  organization_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const agentService = {
  /**
   * Execute an agent task immediately
   */
  async executeTask(task: AgentTask): Promise<{ task_id: string; status: string; output?: unknown }> {
    const { data, error } = await supabase.functions.invoke("agent-orchestrator", {
      body: task,
      headers: { "x-action": "execute" },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Queue an agent task for later execution
   */
  async queueTask(task: AgentTask): Promise<{ task_id: string; status: string }> {
    const { data, error } = await supabase.functions.invoke("agent-orchestrator", {
      body: task,
      headers: { "x-action": "queue" },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Execute a workflow (DAG of agent tasks)
   */
  async executeWorkflow(
    workflowId: string | undefined,
    steps: WorkflowStep[],
    context: Record<string, unknown>
  ): Promise<{ workflow_run_id: string; status: string; steps: unknown[] }> {
    const { data, error } = await supabase.functions.invoke("agent-orchestrator", {
      body: { workflow_id: workflowId, steps, context },
      headers: { "x-action": "workflow" },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Get all available agents
   */
  async getAgents(): Promise<Agent[]> {
    const { data, error } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("is_active", true)
      .order("module", { ascending: true });

    if (error) throw error;
    return (data || []) as Agent[];
  },

  /**
   * Get agents by module
   */
  async getAgentsByModule(module: string): Promise<Agent[]> {
    const { data, error } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("module", module)
      .eq("is_active", true);

    if (error) throw error;
    return (data || []) as Agent[];
  },

  /**
   * Get user's tasks
   */
  async getTasks(status?: string, limit = 50): Promise<TaskRecord[]> {
    let query = supabase
      .from("agent_tasks")
      .select("*, ai_agents(name, display_name, module)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as TaskRecord[];
  },

  /**
   * Get a specific task
   */
  async getTask(taskId: string): Promise<TaskRecord | null> {
    const { data, error } = await supabase
      .from("agent_tasks")
      .select("*, ai_agents(name, display_name, module)")
      .eq("id", taskId)
      .single();

    if (error) throw error;
    return data as TaskRecord | null;
  },

  /**
   * Cancel a pending task
   */
  async cancelTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from("agent_tasks")
      .update({ status: "cancelled", completed_at: new Date().toISOString() })
      .eq("id", taskId)
      .eq("status", "pending");

    if (error) throw error;
  },

  /**
   * Get user's workflows
   */
  async getWorkflows() {
    const { data, error } = await supabase
      .from("agent_workflows")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create a new workflow
   */
  async createWorkflow(
    name: string,
    steps: WorkflowStep[],
    description?: string,
    triggerConfig?: Record<string, unknown>
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("agent_workflows")
      .insert({
        name,
        description,
        steps: steps as unknown as Json,
        trigger_config: triggerConfig as unknown as Json,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Toggle workflow active state
   */
  async toggleWorkflow(workflowId: string, isActive: boolean) {
    const { error } = await supabase
      .from("agent_workflows")
      .update({ is_active: isActive })
      .eq("id", workflowId);

    if (error) throw error;
  },

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowId: string) {
    const { error } = await supabase
      .from("agent_workflows")
      .delete()
      .eq("id", workflowId);

    if (error) throw error;
  },
};
