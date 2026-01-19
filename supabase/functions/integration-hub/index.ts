import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface IntegrationConfig {
  provider: string;
  name: string;
  config: Record<string, unknown>;
  scopes?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.split("/").filter(Boolean);
    const action = path[path.length - 1];
    const provider = url.searchParams.get("provider");

    switch (req.method) {
      case "GET": {
        if (action === "list") {
          // List all integrations for user
          const { data: integrations } = await supabase
            .from("integrations")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          return new Response(JSON.stringify({ integrations }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (action === "available") {
          // List available integration providers
          const providers = getAvailableProviders();
          return new Response(JSON.stringify({ providers }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (action === "status" && provider) {
          // Get integration status
          const { data: integration } = await supabase
            .from("integrations")
            .select("*")
            .eq("user_id", user.id)
            .eq("provider", provider)
            .single();

          return new Response(
            JSON.stringify({ connected: !!integration, integration }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (action === "logs" && provider) {
          // Get sync logs
          const { data: integration } = await supabase
            .from("integrations")
            .select("id")
            .eq("user_id", user.id)
            .eq("provider", provider)
            .single();

          if (!integration) {
            return new Response(JSON.stringify({ logs: [] }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          const { data: logs } = await supabase
            .from("integration_sync_logs")
            .select("*")
            .eq("integration_id", integration.id)
            .order("started_at", { ascending: false })
            .limit(20);

          return new Response(JSON.stringify({ logs }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        break;
      }

      case "POST": {
        if (action === "connect") {
          // Connect a new integration
          const config: IntegrationConfig = await req.json();
          const result = await connectIntegration(supabase, user.id, config);
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (action === "sync" && provider) {
          // Trigger a sync
          const result = await syncIntegration(supabase, user.id, provider);
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (action === "oauth-callback") {
          // Handle OAuth callback
          const { code, state, provider: oauthProvider } = await req.json();
          const result = await handleOAuthCallback(
            supabase,
            user.id,
            oauthProvider,
            code,
            state
          );
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        break;
      }

      case "DELETE": {
        if (provider) {
          // Disconnect integration
          const { error } = await supabase
            .from("integrations")
            .delete()
            .eq("user_id", user.id)
            .eq("provider", provider);

          if (error) {
            throw new Error(`Failed to disconnect: ${error.message}`);
          }

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
      }

      case "PATCH": {
        if (provider) {
          // Update integration config
          const { config } = await req.json();
          const { error } = await supabase
            .from("integrations")
            .update({ config, updated_at: new Date().toISOString() })
            .eq("user_id", user.id)
            .eq("provider", provider);

          if (error) {
            throw new Error(`Failed to update: ${error.message}`);
          }

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;
      }
    }

    return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Integration hub error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getAvailableProviders() {
  return [
    {
      id: "google",
      name: "Google Workspace",
      description: "Connect to Google Calendar, Sheets, and Drive",
      icon: "https://www.google.com/favicon.ico",
      scopes: ["calendar", "sheets", "drive"],
      auth_type: "oauth2",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Payment processing and subscription management",
      icon: "https://stripe.com/favicon.ico",
      scopes: ["read", "write"],
      auth_type: "api_key",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Team communication and notifications",
      icon: "https://slack.com/favicon.ico",
      scopes: ["chat:write", "channels:read"],
      auth_type: "oauth2",
    },
    {
      id: "notion",
      name: "Notion",
      description: "Workspace and knowledge management",
      icon: "https://www.notion.so/favicon.ico",
      scopes: ["read", "insert", "update"],
      auth_type: "oauth2",
    },
    {
      id: "n8n",
      name: "n8n",
      description: "Workflow automation",
      icon: "https://n8n.io/favicon.ico",
      scopes: ["workflows"],
      auth_type: "api_key",
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "SMS and voice communications",
      icon: "https://www.twilio.com/favicon.ico",
      scopes: ["sms", "voice"],
      auth_type: "api_key",
    },
    {
      id: "plaid",
      name: "Plaid",
      description: "Bank account connections",
      icon: "https://plaid.com/favicon.ico",
      scopes: ["transactions", "accounts"],
      auth_type: "link_token",
    },
    {
      id: "fitbit",
      name: "Fitbit",
      description: "Health and fitness data",
      icon: "https://www.fitbit.com/favicon.ico",
      scopes: ["activity", "sleep", "heartrate"],
      auth_type: "oauth2",
    },
    {
      id: "apple_health",
      name: "Apple Health",
      description: "iOS health data sync",
      icon: "https://www.apple.com/favicon.ico",
      scopes: ["read"],
      auth_type: "device",
    },
  ];
}

async function connectIntegration(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  config: IntegrationConfig
) {
  // Check if already connected
  const { data: existing } = await supabase
    .from("integrations")
    .select("id")
    .eq("user_id", userId)
    .eq("provider", config.provider)
    .single();

  if (existing) {
    // Update existing integration
    const { error } = await supabase
      .from("integrations")
      .update({
        name: config.name,
        config: config.config,
        scopes: config.scopes,
        status: "connected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      throw new Error(`Failed to update integration: ${error.message}`);
    }

    return { success: true, action: "updated", integration_id: existing.id };
  }

  // Create new integration
  const { data: integration, error } = await supabase
    .from("integrations")
    .insert({
      user_id: userId,
      provider: config.provider,
      name: config.name,
      config: config.config,
      scopes: config.scopes,
      status: "connected",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create integration: ${error.message}`);
  }

  return { success: true, action: "created", integration_id: integration.id };
}

async function syncIntegration(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  provider: string
) {
  // Get integration
  const { data: integration, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", provider)
    .single();

  if (error || !integration) {
    throw new Error("Integration not found");
  }

  // Create sync log
  const { data: syncLog } = await supabase
    .from("integration_sync_logs")
    .insert({
      integration_id: integration.id,
      sync_type: "full",
      status: "running",
    })
    .select()
    .single();

  try {
    // Perform provider-specific sync
    const result = await performSync(provider, integration);

    // Update sync log
    await supabase
      .from("integration_sync_logs")
      .update({
        status: "completed",
        records_processed: result.processed,
        records_created: result.created,
        records_updated: result.updated,
        completed_at: new Date().toISOString(),
      })
      .eq("id", syncLog?.id);

    // Update integration
    await supabase
      .from("integrations")
      .update({
        last_sync_at: new Date().toISOString(),
        sync_error: null,
      })
      .eq("id", integration.id);

    return { success: true, ...result };
  } catch (error) {
    // Update sync log with error
    await supabase
      .from("integration_sync_logs")
      .update({
        status: "failed",
        error_message: error.message,
        completed_at: new Date().toISOString(),
      })
      .eq("id", syncLog?.id);

    // Update integration
    await supabase
      .from("integrations")
      .update({
        sync_error: error.message,
      })
      .eq("id", integration.id);

    throw error;
  }
}

async function performSync(
  provider: string,
  integration: Record<string, unknown>
): Promise<{ processed: number; created: number; updated: number }> {
  // Provider-specific sync logic would go here
  // For now, return mock results
  switch (provider) {
    case "google":
      return { processed: 50, created: 10, updated: 5 };
    case "stripe":
      return { processed: 25, created: 3, updated: 2 };
    case "slack":
      return { processed: 100, created: 20, updated: 10 };
    default:
      return { processed: 0, created: 0, updated: 0 };
  }
}

async function handleOAuthCallback(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  provider: string,
  code: string,
  state: string
): Promise<{ success: boolean; integration_id?: string }> {
  // In a real implementation, exchange the code for tokens
  // For now, create a mock integration
  const { data: integration, error } = await supabase
    .from("integrations")
    .upsert({
      user_id: userId,
      provider,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Integration`,
      config: { oauth_state: state },
      status: "connected",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`OAuth callback failed: ${error.message}`);
  }

  return { success: true, integration_id: integration.id };
}
