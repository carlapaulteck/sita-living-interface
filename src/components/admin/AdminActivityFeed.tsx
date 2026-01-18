import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, User, MessageSquare, Shield, CreditCard, Settings, Flag, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';

interface AuditLogEntry {
  id: string;
  admin_user_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const AdminActivityFeed = () => {
  const { data: recentActivity, isLoading } = useQuery({
    queryKey: ['admin-activity-feed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as AuditLogEntry[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getActionIcon = (action: string, targetType: string) => {
    if (targetType === 'user' || action.includes('role')) {
      return <User className="w-4 h-4" />;
    }
    if (targetType === 'support_ticket' || action.includes('ticket')) {
      return <MessageSquare className="w-4 h-4" />;
    }
    if (targetType === 'subscription') {
      return <CreditCard className="w-4 h-4" />;
    }
    if (targetType === 'feature_flag') {
      return <Flag className="w-4 h-4" />;
    }
    if (targetType === 'error_log') {
      return <AlertTriangle className="w-4 h-4" />;
    }
    if (targetType === 'settings') {
      return <Settings className="w-4 h-4" />;
    }
    return <Shield className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('delete')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (action.includes('create')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (action.includes('update')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  };

  const formatAction = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTargetType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="bg-[#151515] border-white/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-primary" />
          Admin Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className={`p-2 rounded-lg border ${getActionColor(entry.action)}`}>
                    {getActionIcon(entry.action, entry.target_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {formatAction(entry.action)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTargetType(entry.target_type)}
                          {entry.target_id && (
                            <span className="font-mono ml-1">
                              ({entry.target_id.slice(0, 8)}...)
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    {entry.details && Object.keys(entry.details).length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground bg-white/5 rounded px-2 py-1">
                        {Object.entries(entry.details)
                          .filter(([key]) => !['timestamp', 'duration_ms'].includes(key))
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: <span className="text-foreground">{String(value)}</span>
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
              <Activity className="w-10 h-10 mb-2 opacity-50" />
              <p>No activity logged yet</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AdminActivityFeed;
