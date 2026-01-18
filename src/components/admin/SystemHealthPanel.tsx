import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, CheckCircle, AlertTriangle, XCircle, Zap, Database, Server, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { subHours, subDays } from 'date-fns';

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string | number;
  icon: React.ReactNode;
  detail?: string;
}

const SystemHealthPanel = () => {
  // Fetch error metrics
  const { data: errorMetrics, isLoading: errorsLoading } = useQuery({
    queryKey: ['admin-error-metrics'],
    queryFn: async () => {
      const oneDayAgo = subDays(new Date(), 1).toISOString();
      const oneHourAgo = subHours(new Date(), 1).toISOString();

      // Last 24 hours errors
      const { data: dailyErrors, error: dailyError } = await supabase
        .from('error_logs')
        .select('id, severity, is_resolved')
        .gte('created_at', oneDayAgo);

      if (dailyError) throw dailyError;

      // Last hour errors (for spike detection)
      const { data: hourlyErrors, error: hourlyError } = await supabase
        .from('error_logs')
        .select('id, severity')
        .gte('created_at', oneHourAgo);

      if (hourlyError) throw hourlyError;

      const totalDaily = dailyErrors?.length || 0;
      const criticalCount = dailyErrors?.filter(e => e.severity === 'critical').length || 0;
      const unresolvedCount = dailyErrors?.filter(e => !e.is_resolved).length || 0;
      const hourlyCount = hourlyErrors?.length || 0;

      return {
        daily: totalDaily,
        critical: criticalCount,
        unresolved: unresolvedCount,
        hourly: hourlyCount,
        errorRate: totalDaily > 0 ? (criticalCount / totalDaily) * 100 : 0,
      };
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch API/database status (using a simple query as health check)
  const { data: dbStatus, isLoading: dbLoading } = useQuery({
    queryKey: ['admin-db-health'],
    queryFn: async () => {
      const start = Date.now();
      
      try {
        const { error } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });

        const latency = Date.now() - start;

        if (error) {
          return { status: 'critical' as const, latency: 0, message: error.message };
        }

        return {
          status: latency > 500 ? 'warning' as const : 'healthy' as const,
          latency,
          message: latency > 500 ? 'High latency detected' : 'Operating normally',
        };
      } catch {
        return { status: 'critical' as const, latency: 0, message: 'Connection failed' };
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch active tickets (support load)
  const { data: supportLoad } = useQuery({
    queryKey: ['admin-support-load'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('id, status, priority')
        .in('status', ['open', 'in_progress']);

      if (error) throw error;

      const tickets = data || [];
      const criticalTickets = tickets.filter(t => t.priority === 'critical').length;

      return {
        total: tickets.length,
        critical: criticalTickets,
      };
    },
  });

  const getStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return 'text-emerald-400 bg-emerald-500/10';
      case 'warning': return 'text-amber-400 bg-amber-500/10';
      case 'critical': return 'text-red-400 bg-red-500/10';
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <XCircle className="w-4 h-4" />;
    }
  };

  // Determine overall system status
  const overallStatus: 'healthy' | 'warning' | 'critical' = 
    dbStatus?.status === 'critical' || (errorMetrics?.critical || 0) > 5
      ? 'critical'
      : dbStatus?.status === 'warning' || (errorMetrics?.hourly || 0) > 10
      ? 'warning'
      : 'healthy';

  const healthMetrics: HealthMetric[] = [
    {
      name: 'Database',
      status: dbStatus?.status || 'healthy',
      value: dbStatus ? `${dbStatus.latency}ms` : '...',
      icon: <Database className="w-4 h-4" />,
      detail: dbStatus?.message,
    },
    {
      name: 'Errors (24h)',
      status: (errorMetrics?.daily || 0) > 50 ? 'critical' : (errorMetrics?.daily || 0) > 20 ? 'warning' : 'healthy',
      value: errorMetrics?.daily || 0,
      icon: <AlertTriangle className="w-4 h-4" />,
      detail: `${errorMetrics?.unresolved || 0} unresolved`,
    },
    {
      name: 'Error Rate',
      status: (errorMetrics?.errorRate || 0) > 20 ? 'critical' : (errorMetrics?.errorRate || 0) > 10 ? 'warning' : 'healthy',
      value: `${(errorMetrics?.errorRate || 0).toFixed(1)}%`,
      icon: <Zap className="w-4 h-4" />,
      detail: `${errorMetrics?.critical || 0} critical`,
    },
    {
      name: 'Support Queue',
      status: (supportLoad?.critical || 0) > 0 ? 'warning' : (supportLoad?.total || 0) > 20 ? 'warning' : 'healthy',
      value: supportLoad?.total || 0,
      icon: <Clock className="w-4 h-4" />,
      detail: `${supportLoad?.critical || 0} critical tickets`,
    },
  ];

  return (
    <Card className="bg-[#151515] border-white/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-primary" />
            System Health
          </CardTitle>
          <Badge className={getStatusColor(overallStatus)}>
            {getStatusIcon(overallStatus)}
            <span className="ml-1 capitalize">{overallStatus}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {healthMetrics.map((metric) => (
            <div
              key={metric.name}
              className={`p-4 rounded-lg border ${
                metric.status === 'critical'
                  ? 'bg-red-500/5 border-red-500/20'
                  : metric.status === 'warning'
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {metric.icon}
                  <span className="text-xs">{metric.name}</span>
                </div>
                {getStatusIcon(metric.status)}
              </div>
              <p className={`text-xl font-bold ${
                metric.status === 'critical'
                  ? 'text-red-400'
                  : metric.status === 'warning'
                  ? 'text-amber-400'
                  : 'text-foreground'
              }`}>
                {metric.value}
              </p>
              {metric.detail && (
                <p className="text-xs text-muted-foreground mt-1">{metric.detail}</p>
              )}
            </div>
          ))}
        </div>

        {/* Quick Status Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">System Load</span>
            <span className="text-foreground">
              {overallStatus === 'healthy' ? 'Normal' : overallStatus === 'warning' ? 'Elevated' : 'Critical'}
            </span>
          </div>
          <Progress
            value={overallStatus === 'healthy' ? 30 : overallStatus === 'warning' ? 65 : 90}
            className={`h-2 ${
              overallStatus === 'critical'
                ? '[&>div]:bg-red-500'
                : overallStatus === 'warning'
                ? '[&>div]:bg-amber-500'
                : ''
            }`}
          />
        </div>

        {/* Uptime Indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Server className="w-4 h-4" />
            <span>API Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              dbStatus?.status === 'healthy' ? 'bg-emerald-400 animate-pulse' :
              dbStatus?.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
            }`} />
            <span className="text-sm text-foreground">
              {dbStatus?.status === 'healthy' ? 'Operational' : 
               dbStatus?.status === 'warning' ? 'Degraded' : 'Down'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthPanel;
