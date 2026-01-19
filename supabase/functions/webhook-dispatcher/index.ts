import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookEvent {
  event_type: string;
  payload: Record<string, unknown>;
  user_id?: string;
  organization_id?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    if (req.method === "POST" && path === "dispatch") {
      const event: WebhookEvent = await req.json();
      const result = await dispatchWebhook(supabase, event);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && path === "test") {
      const { webhook_id, test_payload } = await req.json();
      const result = await testWebhook(supabase, webhook_id, test_payload);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && path === "retry") {
      const { log_id } = await req.json();
      const result = await retryWebhook(supabase, log_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Webhook dispatcher error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function dispatchWebhook(
  supabase: SupabaseClient,
  event: WebhookEvent
) {
  let query = supabase
    .from("webhooks")
    .select("*")
    .eq("is_active", true)
    .contains("events", [event.event_type]);

  if (event.user_id) {
    query = query.eq("user_id", event.user_id);
  }
  if (event.organization_id) {
    query = query.or(`organization_id.eq.${event.organization_id},organization_id.is.null`);
  }

  const { data: webhooks, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch webhooks: ${error.message}`);
  }

  if (!webhooks || webhooks.length === 0) {
    return { dispatched: 0, message: "No webhooks found for this event" };
  }

  const results = await Promise.all(
    webhooks.map((webhook) => sendWebhook(supabase, webhook, event))
  );

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return {
    dispatched: webhooks.length,
    successful,
    failed,
    results,
  };
}

async function sendWebhook(
  supabase: SupabaseClient,
  webhook: Record<string, unknown>,
  event: WebhookEvent
) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  const payload = {
    event: event.event_type,
    timestamp,
    data: event.payload,
    webhook_id: webhook.id,
  };

  const signature = generateSignature(JSON.stringify(payload), webhook.secret as string);

  const { data: logEntry } = await supabase
    .from("webhook_logs")
    .insert({
      webhook_id: webhook.id,
      event_type: event.event_type,
      payload,
      status: "pending",
    })
    .select()
    .single();

  try {
    const response = await fetch(webhook.url as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Webhook-Timestamp": timestamp,
        "X-Webhook-ID": webhook.id as string,
        ...(webhook.headers as Record<string, string> || {}),
      },
      body: JSON.stringify(payload),
    });

    const duration = Date.now() - startTime;
    const responseBody = await response.text();

    await supabase
      .from("webhook_logs")
      .update({
        status: response.ok ? "success" : "failed",
        response_code: response.status,
        response_body: responseBody.substring(0, 1000),
        duration_ms: duration,
      })
      .eq("id", logEntry?.id);

    await supabase
      .from("webhooks")
      .update({
        last_triggered_at: timestamp,
        last_response_code: response.status,
        failure_count: response.ok ? 0 : (webhook.failure_count as number) + 1,
      })
      .eq("id", webhook.id);

    if (!response.ok && (webhook.failure_count as number) >= 4) {
      await supabase
        .from("webhooks")
        .update({ is_active: false })
        .eq("id", webhook.id);
    }

    return {
      webhook_id: webhook.id,
      success: response.ok,
      status_code: response.status,
      duration_ms: duration,
    };
  } catch (err: unknown) {
    const error = err as Error;
    const duration = Date.now() - startTime;

    await supabase
      .from("webhook_logs")
      .update({
        status: "error",
        error_message: error.message,
        duration_ms: duration,
      })
      .eq("id", logEntry?.id);

    await supabase
      .from("webhooks")
      .update({
        failure_count: (webhook.failure_count as number) + 1,
      })
      .eq("id", webhook.id);

    return {
      webhook_id: webhook.id,
      success: false,
      error: error.message,
      duration_ms: duration,
    };
  }
}

async function testWebhook(
  supabase: SupabaseClient,
  webhookId: string,
  testPayload: Record<string, unknown>
) {
  const { data: webhook, error } = await supabase
    .from("webhooks")
    .select("*")
    .eq("id", webhookId)
    .single();

  if (error || !webhook) {
    throw new Error("Webhook not found");
  }

  const testEvent: WebhookEvent = {
    event_type: "webhook.test",
    payload: testPayload || { test: true, timestamp: new Date().toISOString() },
  };

  return sendWebhook(supabase, webhook, testEvent);
}

async function retryWebhook(
  supabase: SupabaseClient,
  logId: string
) {
  const { data: log, error } = await supabase
    .from("webhook_logs")
    .select("*, webhooks(*)")
    .eq("id", logId)
    .single();

  if (error || !log) {
    throw new Error("Webhook log not found");
  }

  if (log.retry_count >= 3) {
    throw new Error("Maximum retry attempts exceeded");
  }

  await supabase
    .from("webhook_logs")
    .update({ retry_count: log.retry_count + 1, status: "retrying" })
    .eq("id", logId);

  const result = await sendWebhook(
    supabase,
    log.webhooks,
    { event_type: log.event_type, payload: log.payload }
  );

  return {
    ...result,
    retry_count: log.retry_count + 1,
  };
}

function generateSignature(payload: string, secret: string): string {
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  return `sha256=${hmac.digest("hex")}`;
}
