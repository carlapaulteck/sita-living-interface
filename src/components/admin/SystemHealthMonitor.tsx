import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Server, 
  Database, 
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Wifi
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface HealthCheck {
  status: "healthy" | "degraded" | "down";
  latency_ms: number;
  timestamp: string;
  version?: string;
  checks?: {
    database: boolean;
    auth: boolean;
    storage: boolean;
  };
}

export function SystemHealthMonitor() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: healthData, isLoading, refetch } = useQuery({
    queryKey: ["system-health"],
    queryFn: async (): Promise<HealthCheck> => {
      const start = performance.now();
      
      try {
        const { data, error } = await supabase.functions.invoke("health");
        const latency = Math.round(performance.now() - start);
        
        if (error) {
          return {
            status: "down",
            latency_ms: latency,
            timestamp: new Date().toISOString(),
          };
        }
        
        return {
          status: data?.status || "healthy",
          latency_ms: latency,
          timestamp: new Date().toISOString(),
          version: data?.version,
          checks: data?.checks,
        };
      } catch {
        return {
          status: "down",
          latency_ms: Math.round(performance.now() - start),
          timestamp: new Date().toISOString(),
        };
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: recentErrors = [] } = useQuery({
    queryKey: ["recent-errors"],
    queryFn: async () => {
      const { data } = await supabase
        .from("error_logs")
        .select("id, error_type, message, severity, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
    refetchInterval: 60000,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle2 className="h-5 w-5 text-secondary" />;
      case "degraded": return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default: return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-secondary/20 text-secondary border-secondary/30";
      case "degraded": return "bg-amber-500/20 text-amber-500 border-amber-500/30";
      default: return "bg-destructive/20 text-destructive border-destructive/30";
    }
  };

  const getLatencyStatus = (latency: number) => {
    if (latency < 200) return { label: "Excellent", color: "text-secondary" };
    if (latency < 500) return { label: "Good", color: "text-primary" };
    if (latency < 1000) return { label: "Fair", color: "text-amber-500" };
    return { label: "Slow", color: "text-destructive" };
  };

  const latencyStatus = healthData ? getLatencyStatus(healthData.latency_ms) : null;

  return (
    <div className="space-y-6">
      {/* Main Status */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">System Health</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {/* Overall Status */}
            <div className="p-4 rounded-xl bg-muted/20">
              <div className="flex items-center gap-3 mb-3">
                {getStatusIcon(healthData?.status || "down")}
                <div>
                  <p className="font-medium text-foreground">Overall Status</p>
                  <Badge className={getStatusColor(healthData?.status || "down")}>
                    {healthData?.status?.toUpperCase() || "UNKNOWN"}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Last checked {healthData?.timestamp 
                  ? formatDistanceToNow(new Date(healthData.timestamp), { addSuffix: true })
                  : "never"}
              </p>
            </div>

            {/* Latency */}
            <div className="p-4 rounded-xl bg-muted/20">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Response Time</p>
                  <p className={`text-2xl font-bold ${latencyStatus?.color}`}>
                    {healthData?.latency_ms || 0}ms
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={Math.min(100, ((healthData?.latency_ms || 0) / 10))} 
                  className="h-1.5 flex-1" 
                />
                <span className={`text-xs ${latencyStatus?.color}`}>
                  {latencyStatus?.label}
                </span>
              </div>
            </div>

            {/* Version */}
            <div className="p-4 rounded-xl bg-muted/20">
              <div className="flex items-center gap-3 mb-3">
                <Server className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">API Version</p>
                  <p className="text-lg font-mono text-muted-foreground">
                    {healthData?.version || "v1.0.0"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wifi className="h-3 w-3" />
                <span>Edge Functions Active</span>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Service Checks */}
      {healthData?.checks && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Service Status</h3>
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-muted/20 text-center"
            >
              <Database className={`h-6 w-6 mx-auto mb-2 ${healthData.checks.database ? "text-secondary" : "text-destructive"}`} />
              <p className="text-sm font-medium text-foreground">Database</p>
              <Badge variant={healthData.checks.database ? "default" : "destructive"} className="mt-1">
                {healthData.checks.database ? "Online" : "Offline"}
              </Badge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-muted/20 text-center"
            >
              <Zap className={`h-6 w-6 mx-auto mb-2 ${healthData.checks.auth ? "text-secondary" : "text-destructive"}`} />
              <p className="text-sm font-medium text-foreground">Auth</p>
              <Badge variant={healthData.checks.auth ? "default" : "destructive"} className="mt-1">
                {healthData.checks.auth ? "Online" : "Offline"}
              </Badge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-muted/20 text-center"
            >
              <Server className={`h-6 w-6 mx-auto mb-2 ${healthData.checks.storage ? "text-secondary" : "text-destructive"}`} />
              <p className="text-sm font-medium text-foreground">Storage</p>
              <Badge variant={healthData.checks.storage ? "default" : "destructive"} className="mt-1">
                {healthData.checks.storage ? "Online" : "Offline"}
              </Badge>
            </motion.div>
          </div>
        </GlassCard>
      )}

      {/* Recent Errors */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Errors</h3>
        {recentErrors.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-secondary opacity-50" />
            <p className="text-sm text-muted-foreground">No recent errors</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentErrors.map((error: { id: string; error_type: string; message: string; severity: string | null; created_at: string | null }, index: number) => (
              <motion.div
                key={error.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20"
              >
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{error.error_type}</span>
                    <Badge variant="outline" className="text-xs">
                      {error.severity || "error"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{error.message}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {error.created_at 
                    ? formatDistanceToNow(new Date(error.created_at), { addSuffix: true })
                    : "Unknown"}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
