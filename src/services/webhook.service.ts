import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface Webhook {
  id: string;
  organization_id: string | null;
  user_id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  headers: Json | null;
  is_active: boolean | null;
  failure_count: number | null;
  last_triggered_at: string | null;
  last_response_code: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface WebhookLog {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: Json;
  status: string | null;
  response_code: number | null;
  response_body: string | null;
  error_message: string | null;
  duration_ms: number | null;
  retry_count: number | null;
  created_at: string | null;
}

export const webhookService = {
  async getWebhooks(): Promise<Webhook[]> {
    const { data, error } = await supabase
      .from("webhooks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Webhook[];
  },

  async getOrganizationWebhooks(orgId: string): Promise<Webhook[]> {
    const { data, error } = await supabase
      .from("webhooks")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Webhook[];
  },

  async createWebhook(
    url: string,
    events: string[],
    organizationId?: string
  ): Promise<Webhook> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    
    const secret = crypto.randomUUID() + crypto.randomUUID();

    const { data, error } = await supabase
      .from("webhooks")
      .insert({
        user_id: user.id,
        name: "Webhook",
        url,
        events,
        secret,
        organization_id: organizationId || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Webhook;
  },

  async updateWebhook(
    webhookId: string,
    updates: Partial<Pick<Webhook, "url" | "events" | "is_active">>
  ): Promise<Webhook> {
    const { data, error } = await supabase
      .from("webhooks")
      .update(updates)
      .eq("id", webhookId)
      .select()
      .single();

    if (error) throw error;
    return data as Webhook;
  },

  async deleteWebhook(webhookId: string): Promise<void> {
    const { error } = await supabase.from("webhooks").delete().eq("id", webhookId);
    if (error) throw error;
  },

  async regenerateSecret(webhookId: string): Promise<string> {
    const newSecret = crypto.randomUUID() + crypto.randomUUID();
    const { error } = await supabase.from("webhooks").update({ secret: newSecret }).eq("id", webhookId);
    if (error) throw error;
    return newSecret;
  },

  async testWebhook(webhookId: string) {
    const { data, error } = await supabase.functions.invoke("webhook-dispatcher", {
      body: { action: "test", webhook_id: webhookId },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  async getWebhookLogs(webhookId: string, limit = 50): Promise<WebhookLog[]> {
    const { data, error } = await supabase
      .from("webhook_logs")
      .select("*")
      .eq("webhook_id", webhookId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as WebhookLog[];
  },

  /**
   * Get available webhook events
   */
  getAvailableEvents(): { category: string; events: { name: string; description: string }[] }[] {
    return [
      {
        category: "Agents",
        events: [
          { name: "agent.task.created", description: "When a new agent task is created" },
          { name: "agent.task.completed", description: "When an agent task completes" },
          { name: "agent.task.failed", description: "When an agent task fails" },
          { name: "agent.workflow.completed", description: "When a workflow completes" },
        ],
      },
      {
        category: "Finance",
        events: [
          { name: "finance.transaction.created", description: "When a transaction is recorded" },
          { name: "finance.budget.exceeded", description: "When a budget is exceeded" },
          { name: "finance.bill.due", description: "When a bill is coming due" },
        ],
      },
      {
        category: "Health",
        events: [
          { name: "health.goal.achieved", description: "When a health goal is achieved" },
          { name: "health.habit.completed", description: "When a habit is completed" },
          { name: "health.workout.logged", description: "When a workout is logged" },
        ],
      },
      {
        category: "Automation",
        events: [
          { name: "automation.triggered", description: "When an automation runs" },
          { name: "automation.error", description: "When an automation fails" },
        ],
      },
      {
        category: "System",
        events: [
          { name: "user.login", description: "When user logs in" },
          { name: "notification.created", description: "When a notification is created" },
        ],
      },
    ];
  },
};
