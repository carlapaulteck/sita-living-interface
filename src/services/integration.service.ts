import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface Integration {
  id: string;
  user_id: string;
  organization_id: string | null;
  provider: string;
  name: string;
  status: string | null;
  config: Json | null;
  scopes: string[] | null;
  last_sync_at: string | null;
  sync_error: string | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SyncLog {
  id: string;
  integration_id: string;
  sync_type: string;
  status: string | null;
  records_processed: number | null;
  records_created: number | null;
  records_updated: number | null;
  records_failed: number | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  metadata: Json | null;
}

export type IntegrationProvider = 
  | "google"
  | "stripe"
  | "slack"
  | "whatsapp"
  | "n8n"
  | "zapier"
  | "plaid"
  | "fitbit"
  | "apple_health"
  | "calendar";

export interface ProviderInfo {
  id: IntegrationProvider;
  name: string;
  description: string;
  icon: string;
  category: "productivity" | "finance" | "health" | "communication" | "automation";
  scopes: string[];
  features: string[];
}

export const integrationService = {
  /**
   * Get all integrations for the current user
   */
  async getIntegrations(): Promise<Integration[]> {
    const { data, error } = await supabase
      .from("integrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Integration[];
  },

  /**
   * Get integration by ID
   */
  async getIntegration(integrationId: string): Promise<Integration | null> {
    const { data, error } = await supabase
      .from("integrations")
      .select("*")
      .eq("id", integrationId)
      .single();

    if (error) throw error;
    return data as Integration | null;
  },

  /**
   * Get integrations by provider
   */
  async getIntegrationsByProvider(provider: IntegrationProvider): Promise<Integration[]> {
    const { data, error } = await supabase
      .from("integrations")
      .select("*")
      .eq("provider", provider);

    if (error) throw error;
    return (data || []) as Integration[];
  },

  /**
   * Connect a new integration
   */
  async connectIntegration(
    provider: IntegrationProvider,
    name: string,
    config?: Record<string, unknown>
  ): Promise<Integration> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("integrations")
      .insert({
        user_id: user.id,
        provider,
        name,
        config: config as unknown as Json,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    return data as Integration;
  },

  /**
   * Update integration
   */
  async updateIntegration(
    integrationId: string,
    updates: Partial<Pick<Integration, "name" | "config" | "status">>
  ): Promise<Integration> {
    const { data, error } = await supabase
      .from("integrations")
      .update({
        ...updates,
        config: updates.config as unknown as Json,
      })
      .eq("id", integrationId)
      .select()
      .single();

    if (error) throw error;
    return data as Integration;
  },

  /**
   * Disconnect an integration
   */
  async disconnectIntegration(integrationId: string): Promise<void> {
    const { error } = await supabase
      .from("integrations")
      .delete()
      .eq("id", integrationId);

    if (error) throw error;
  },

  /**
   * Trigger a sync for an integration
   */
  async syncIntegration(integrationId: string): Promise<{ sync_id: string }> {
    const { data, error } = await supabase.functions.invoke("integration-hub", {
      body: {
        action: "sync",
        integration_id: integrationId,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Get sync logs for an integration
   */
  async getSyncLogs(integrationId: string, limit = 50): Promise<SyncLog[]> {
    const { data, error } = await supabase
      .from("integration_sync_logs")
      .select("*")
      .eq("integration_id", integrationId)
      .order("started_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as SyncLog[];
  },

  /**
   * Get available integration providers
   */
  getAvailableProviders(): ProviderInfo[] {
    return [
      {
        id: "google",
        name: "Google Workspace",
        description: "Connect Google Calendar, Sheets, and Drive",
        icon: "🔵",
        category: "productivity",
        scopes: ["calendar", "sheets", "drive"],
        features: ["Calendar sync", "Spreadsheet automation", "File storage"],
      },
      {
        id: "stripe",
        name: "Stripe",
        description: "Payment processing and financial tracking",
        icon: "💳",
        category: "finance",
        scopes: ["read_transactions", "read_customers"],
        features: ["Transaction tracking", "Revenue analytics", "Invoice management"],
      },
      {
        id: "slack",
        name: "Slack",
        description: "Team communication and notifications",
        icon: "💬",
        category: "communication",
        scopes: ["chat:write", "channels:read"],
        features: ["Notifications", "Workflow triggers", "Team updates"],
      },
      {
        id: "whatsapp",
        name: "WhatsApp Business",
        description: "Customer communication via WhatsApp",
        icon: "📱",
        category: "communication",
        scopes: ["messages:send", "messages:read"],
        features: ["Template messages", "Automated responses", "Broadcast lists"],
      },
      {
        id: "n8n",
        name: "n8n",
        description: "Advanced workflow automation",
        icon: "⚡",
        category: "automation",
        scopes: ["workflows:execute"],
        features: ["Custom workflows", "API integrations", "Data transformation"],
      },
      {
        id: "zapier",
        name: "Zapier",
        description: "Connect to 5000+ apps",
        icon: "🔗",
        category: "automation",
        scopes: ["zaps:execute"],
        features: ["App connections", "Triggers", "Multi-step Zaps"],
      },
      {
        id: "plaid",
        name: "Plaid",
        description: "Bank account and transaction data",
        icon: "🏦",
        category: "finance",
        scopes: ["transactions", "accounts"],
        features: ["Account balances", "Transaction history", "Identity verification"],
      },
      {
        id: "fitbit",
        name: "Fitbit",
        description: "Health and fitness tracking",
        icon: "⌚",
        category: "health",
        scopes: ["activity", "sleep", "heart_rate"],
        features: ["Activity tracking", "Sleep analysis", "Heart rate monitoring"],
      },
      {
        id: "apple_health",
        name: "Apple Health",
        description: "Health data from Apple devices",
        icon: "❤️",
        category: "health",
        scopes: ["activity", "nutrition", "sleep"],
        features: ["Activity data", "Nutrition tracking", "Sleep patterns"],
      },
      {
        id: "calendar",
        name: "Calendar",
        description: "Generic calendar integration",
        icon: "📅",
        category: "productivity",
        scopes: ["events:read", "events:write"],
        features: ["Event sync", "Scheduling", "Reminders"],
      },
    ];
  },

  /**
   * Get provider info by ID
   */
  getProviderInfo(provider: IntegrationProvider): ProviderInfo | undefined {
    return this.getAvailableProviders().find((p) => p.id === provider);
  },

  /**
   * Check integration health
   */
  async checkIntegrationHealth(integrationId: string): Promise<{ healthy: boolean; message?: string }> {
    const { data, error } = await supabase.functions.invoke("integration-hub", {
      body: {
        action: "health",
        integration_id: integrationId,
      },
    });

    if (error) {
      return { healthy: false, message: error.message };
    }
    return data;
  },
};
