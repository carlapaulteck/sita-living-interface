import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  components: {
    database: ComponentHealth;
    auth: ComponentHealth;
    storage: ComponentHealth;
    realtime: ComponentHealth;
  };
  metrics: {
    uptime_seconds: number;
    active_connections: number;
    pending_tasks: number;
    failed_tasks_24h: number;
    webhook_success_rate: number;
  };
}

interface ComponentHealth {
  status: "up" | "down" | "degraded";
  latency_ms?: number;
  message?: string;
}

const startTime = Date.now();

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

    if (path === "health" || path === "") {
      const health = await getHealthStatus(supabase);
      const statusCode = health.status === "healthy" ? 200 : 
                         health.status === "degraded" ? 200 : 503;
      
      return new Response(JSON.stringify(health), {
        status: statusCode,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (path === "ready") {
      // Kubernetes readiness probe
      const dbHealth = await checkDatabase(supabase);
      const ready = dbHealth.status === "up";
      
      return new Response(JSON.stringify({ ready }), {
        status: ready ? 200 : 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (path === "live") {
      // Kubernetes liveness probe
      return new Response(JSON.stringify({ alive: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (path === "metrics") {
      // Prometheus-style metrics
      const metrics = await getMetrics(supabase);
      return new Response(formatPrometheusMetrics(metrics), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Health check error:", error);
    return new Response(
      JSON.stringify({
        status: "unhealthy",
        error: error?.message || "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function getHealthStatus(supabase: any): Promise<HealthStatus> {
  const [database, auth, storage, realtime] = await Promise.all([
    checkDatabase(supabase),
    checkAuth(supabase),
    checkStorage(supabase),
    checkRealtime(supabase),
  ]);

  const metrics = await getMetrics(supabase);
  const components = { database, auth, storage, realtime };
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
      active_connections: metrics.activeConnections,
      pending_tasks: metrics.pendingTasks,
      failed_tasks_24h: metrics.failedTasks24h,
      webhook_success_rate: metrics.webhookSuccessRate,
    },
  };
}

async function checkDatabase(supabase: any): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    const latency = Date.now() - start;
    if (error) return { status: "down", latency_ms: latency, message: error.message };
    if (latency > 1000) return { status: "degraded", latency_ms: latency, message: "High latency" };
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

async function checkRealtime(_supabase: any): Promise<ComponentHealth> {
  return { status: "up" };
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

  const { data: webhookLogs } = await supabase
    .from("webhook_logs")
    .select("status")
    .gte("created_at", yesterday);

  let webhookSuccessRate = 1.0;
  if (webhookLogs && webhookLogs.length > 0) {
    const successful = webhookLogs.filter((l: any) => l.status === "success").length;
    webhookSuccessRate = successful / webhookLogs.length;
  }

  return {
    activeConnections: 0,
    pendingTasks: pendingTasks || 0,
    failedTasks24h: failedTasks24h || 0,
    webhookSuccessRate,
  };
}

function formatPrometheusMetrics(metrics: Record<string, number>): string {
  return [
    `sita_uptime_seconds ${Math.floor((Date.now() - startTime) / 1000)}`,
    `sita_pending_tasks ${metrics.pendingTasks}`,
    `sita_failed_tasks_24h ${metrics.failedTasks24h}`,
    `sita_webhook_success_rate ${metrics.webhookSuccessRate}`,
  ].join("\n");
}
  supabase: ReturnType<typeof createClient>
): Promise<HealthStatus> {
  const [database, auth, storage, realtime] = await Promise.all([
    checkDatabase(supabase),
    checkAuth(supabase),
    checkStorage(supabase),
    checkRealtime(supabase),
  ]);

  const metrics = await getMetrics(supabase);

  // Determine overall status
  const components = { database, auth, storage, realtime };
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
      active_connections: metrics.activeConnections,
      pending_tasks: metrics.pendingTasks,
      failed_tasks_24h: metrics.failedTasks24h,
      webhook_success_rate: metrics.webhookSuccessRate,
    },
  };
}

async function checkDatabase(
  supabase: ReturnType<typeof createClient>
): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    const latency = Date.now() - start;

    if (error) {
      return { status: "down", latency_ms: latency, message: error.message };
    }

    if (latency > 1000) {
      return { status: "degraded", latency_ms: latency, message: "High latency" };
    }

    return { status: "up", latency_ms: latency };
  } catch (error) {
    return { status: "down", message: error.message };
  }
}

async function checkAuth(
  supabase: ReturnType<typeof createClient>
): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    // Simple auth check - verify session endpoint is responsive
    await supabase.auth.getSession();
    const latency = Date.now() - start;

    return { status: "up", latency_ms: latency };
  } catch (error) {
    return { status: "down", message: error.message };
  }
}

async function checkStorage(
  supabase: ReturnType<typeof createClient>
): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    const { error } = await supabase.storage.listBuckets();
    const latency = Date.now() - start;

    if (error) {
      return { status: "degraded", latency_ms: latency, message: error.message };
    }

    return { status: "up", latency_ms: latency };
  } catch (error) {
    return { status: "down", message: error.message };
  }
}

async function checkRealtime(
  supabase: ReturnType<typeof createClient>
): Promise<ComponentHealth> {
  // Realtime health is checked via presence
  // For now, assume healthy if other services are up
  return { status: "up" };
}

async function getMetrics(supabase: ReturnType<typeof createClient>) {
  // Get pending tasks count
  const { count: pendingTasks } = await supabase
    .from("agent_tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Get failed tasks in last 24 hours
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: failedTasks24h } = await supabase
    .from("agent_tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "failed")
    .gte("created_at", yesterday);

  // Get webhook success rate
  const { data: webhookLogs } = await supabase
    .from("webhook_logs")
    .select("status")
    .gte("created_at", yesterday);

  let webhookSuccessRate = 1.0;
  if (webhookLogs && webhookLogs.length > 0) {
    const successful = webhookLogs.filter(l => l.status === "success").length;
    webhookSuccessRate = successful / webhookLogs.length;
  }

  return {
    activeConnections: 0, // Would come from realtime subscription count
    pendingTasks: pendingTasks || 0,
    failedTasks24h: failedTasks24h || 0,
    webhookSuccessRate,
  };
}

function formatPrometheusMetrics(metrics: Record<string, number>): string {
  const lines = [
    "# HELP sita_uptime_seconds Total uptime in seconds",
    "# TYPE sita_uptime_seconds gauge",
    `sita_uptime_seconds ${Math.floor((Date.now() - startTime) / 1000)}`,
    "",
    "# HELP sita_pending_tasks Number of pending agent tasks",
    "# TYPE sita_pending_tasks gauge",
    `sita_pending_tasks ${metrics.pendingTasks}`,
    "",
    "# HELP sita_failed_tasks_24h Number of failed tasks in last 24 hours",
    "# TYPE sita_failed_tasks_24h gauge",
    `sita_failed_tasks_24h ${metrics.failedTasks24h}`,
    "",
    "# HELP sita_webhook_success_rate Webhook success rate (0-1)",
    "# TYPE sita_webhook_success_rate gauge",
    `sita_webhook_success_rate ${metrics.webhookSuccessRate}`,
  ];

  return lines.join("\n");
}
