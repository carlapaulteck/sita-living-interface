import { supabase } from "@/integrations/supabase/client";

export interface Webhook {
  id: string;
  organization_id: string | null;
  user_id: string;
  url: string;
  secret: string;
  events: string[];
  is_active: boolean;
  failure_count: number;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface WebhookLog {
  id: string;
  webhook_id: string;
  event: string;
  payload: Record<string, unknown>;
  response_status: number | null;
  response_body: string | null;
  status: "pending" | "success" | "failed";
  error_message: string | null;
  created_at: string;
}

export const webhookService = {
  /**
   * Get all webhooks for the current user
   */
  async getWebhooks(): Promise<Webhook[]> {
    const { data, error } = await supabase
      .from("webhooks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get webhooks for an organization
   */
  async getOrganizationWebhooks(orgId: string): Promise<Webhook[]> {
    const { data, error } = await supabase
      .from("webhooks")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create a new webhook
   */
  async createWebhook(
    url: string,
    events: string[],
    organizationId?: string
  ): Promise<Webhook> {
    // Generate a secure secret
    const secret = crypto.randomUUID() + crypto.randomUUID();

    const { data, error } = await supabase
      .from("webhooks")
      .insert({
        url,
        events,
        secret,
        organization_id: organizationId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a webhook
   */
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
    return data;
  },

  /**
   * Delete a webhook
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    const { error } = await supabase
      .from("webhooks")
      .delete()
      .eq("id", webhookId);

    if (error) throw error;
  },

  /**
   * Regenerate webhook secret
   */
  async regenerateSecret(webhookId: string): Promise<string> {
    const newSecret = crypto.randomUUID() + crypto.randomUUID();

    const { error } = await supabase
      .from("webhooks")
      .update({ secret: newSecret })
      .eq("id", webhookId);

    if (error) throw error;
    return newSecret;
  },

  /**
   * Test a webhook by sending a test payload
   */
  async testWebhook(webhookId: string): Promise<{ success: boolean; response?: string; error?: string }> {
    const { data, error } = await supabase.functions.invoke("webhook-dispatcher", {
      body: {
        action: "test",
        webhook_id: webhookId,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  /**
   * Get webhook logs
   */
  async getWebhookLogs(webhookId: string, limit = 50): Promise<WebhookLog[]> {
    const { data, error } = await supabase
      .from("webhook_logs")
      .select("*")
      .eq("webhook_id", webhookId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
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
