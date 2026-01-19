import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const startTime = Date.now();

interface ComponentHealth {
  status: "up" | "down" | "degraded";
  latency_ms?: number;
  message?: string;
}

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  components: Record<string, ComponentHealth>;
  metrics: Record<string, number>;
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
    const format = url.searchParams.get("format") || "json";

    const healthStatus = await getHealthStatus(supabase);

    if (format === "prometheus") {
      const metrics = formatPrometheusMetrics(healthStatus.metrics);
      return new Response(metrics, {
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }

    const statusCode = healthStatus.status === "healthy" ? 200 : 
                       healthStatus.status === "degraded" ? 200 : 503;

    return new Response(JSON.stringify(healthStatus), {
      status: statusCode,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      status: "unhealthy", 
      error: error?.message || "Unknown error" 
    }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function getHealthStatus(supabase: any): Promise<HealthStatus> {
  const [database, auth, storage] = await Promise.all([
    checkDatabase(supabase),
    checkAuth(supabase),
    checkStorage(supabase),
  ]);

  const metrics = await getMetrics(supabase);
  const components = { database, auth, storage };
  const componentStatuses = Object.values(components);
  
  let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";
  if (componentStatuses.some(c => c.status === "down")) {
    overallStatus = "unhealthy";
  } else if (componentStatuses.some(c => c.status === "degraded")) {
    overallStatus = "degraded";
  }

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    components,
    metrics: {
      uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
      ...metrics,
    },
  };
}

async function checkDatabase(supabase: any): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    const latency = Date.now() - start;
    if (error) return { status: "down", latency_ms: latency, message: error.message };
    if (latency > 1000) return { status: "degraded", latency_ms: latency };
    return { status: "up", latency_ms: latency };
  } catch (error: any) {
    return { status: "down", message: error?.message };
  }
}

async function checkAuth(supabase: any): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    await supabase.auth.getSession();
    return { status: "up", latency_ms: Date.now() - start };
  } catch (error: any) {
    return { status: "down", message: error?.message };
  }
}

async function checkStorage(supabase: any): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    const { error } = await supabase.storage.listBuckets();
    const latency = Date.now() - start;
    if (error) return { status: "degraded", latency_ms: latency, message: error.message };
    return { status: "up", latency_ms: latency };
  } catch (error: any) {
    return { status: "down", message: error?.message };
  }
}

async function getMetrics(supabase: any) {
  const { count: pendingTasks } = await supabase
    .from("agent_tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: failedTasks24h } = await supabase
    .from("agent_tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "failed")
    .gte("created_at", yesterday);

  return {
    pending_tasks: pendingTasks || 0,
    failed_tasks_24h: failedTasks24h || 0,
  };
}

function formatPrometheusMetrics(metrics: Record<string, number>): string {
  return Object.entries(metrics)
    .map(([key, value]) => `sita_${key} ${value}`)
    .join("\n");
}
