import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ErrorLog {
  id: string;
  error_type: string;
  message: string;
  stack_trace: string | null;
  user_id: string | null;
  component: string | null;
  severity: string;
  metadata: unknown;
  is_resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

const AdminErrorLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [resolvedFilter, setResolvedFilter] = useState<string>('all');
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const queryClient = useQueryClient();

  // Fetch error logs
  const { data: errors, isLoading, refetch } = useQuery({
    queryKey: ['admin-errors', searchQuery, severityFilter, resolvedFilter],
    queryFn: async () => {
      let query = supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (severityFilter !== 'all') {
        query = query.eq('severity', severityFilter);
      }
      if (resolvedFilter === 'resolved') {
        query = query.eq('is_resolved', true);
      } else if (resolvedFilter === 'unresolved') {
        query = query.eq('is_resolved', false);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter by search
      if (searchQuery) {
        return data?.filter(e => 
          e.error_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.component?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];
      }

      return data || [];
    }
  });

  // Mark as resolved
  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('error_logs')
        .update({
          is_resolved: true,
          resolved_by: user.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-errors'] });
      toast.success('Error marked as resolved');
    }
  });

  // Delete error log
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('error_logs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-errors'] });
      toast.success('Error log deleted');
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'error': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const stats = React.useMemo(() => {
    if (!errors) return { critical: 0, error: 0, warning: 0, info: 0, unresolved: 0 };
    return {
      critical: errors.filter(e => e.severity === 'critical' && !e.is_resolved).length,
      error: errors.filter(e => e.severity === 'error' && !e.is_resolved).length,
      warning: errors.filter(e => e.severity === 'warning' && !e.is_resolved).length,
      info: errors.filter(e => e.severity === 'info' && !e.is_resolved).length,
      unresolved: errors.filter(e => !e.is_resolved).length
    };
  }, [errors]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Error Logs</h1>
          <p className="text-muted-foreground">Monitor and resolve platform errors</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-[#151515] border-white/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#151515] border-white/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Errors</p>
            <p className="text-2xl font-bold text-orange-400">{stats.error}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#151515] border-white/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Warnings</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.warning}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#151515] border-white/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Info</p>
            <p className="text-2xl font-bold text-blue-400">{stats.info}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#151515] border-white/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Unresolved</p>
            <p className="text-2xl font-bold text-foreground">{stats.unresolved}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#151515] border-white/5">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search errors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-[150px] bg-white/5 border-white/10">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resolvedFilter} onValueChange={setResolvedFilter}>
              <SelectTrigger className="w-full md:w-[150px] bg-white/5 border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error Logs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-[#151515] border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Error Logs ({errors?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : errors && errors.length > 0 ? (
                <div className="space-y-3">
                  {errors.map((error) => (
                    <div
                      key={error.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        error.is_resolved
                          ? 'bg-white/2 border-white/5 opacity-60'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={getSeverityColor(error.severity)}>
                              {error.severity}
                            </Badge>
                            {error.is_resolved ? (
                              <Badge className="bg-emerald-500/10 text-emerald-400">
                                <CheckCircle className="w-3 h-3 mr-1" /> Resolved
                              </Badge>
                            ) : (
                              <Badge className="bg-zinc-500/10 text-zinc-400">
                                <XCircle className="w-3 h-3 mr-1" /> Open
                              </Badge>
                            )}
                            {error.component && (
                              <Badge className="bg-white/5 text-muted-foreground font-mono text-xs">
                                {error.component}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-medium text-foreground">{error.error_type}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {error.message}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{format(new Date(error.created_at), 'MMM d, h:mm a')}</span>
                            {error.user_id && (
                              <span className="font-mono">User: {error.user_id.slice(0, 8)}...</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedError(error)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {!error.is_resolved && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-emerald-400 hover:text-emerald-300"
                              onClick={() => resolveMutation.mutate(error.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => {
                              if (confirm('Delete this error log?')) {
                                deleteMutation.mutate(error.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mb-3 opacity-50 text-emerald-500" />
                  <p>No errors found</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Detail Dialog */}
      <Dialog open={!!selectedError} onOpenChange={() => setSelectedError(null)}>
        <DialogContent className="bg-[#111111] border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Error Details</DialogTitle>
          </DialogHeader>
          {selectedError && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getSeverityColor(selectedError.severity)}>
                  {selectedError.severity}
                </Badge>
                {selectedError.component && (
                  <Badge className="bg-white/5 text-muted-foreground font-mono">
                    {selectedError.component}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Error Type</p>
                <p className="text-foreground font-medium">{selectedError.error_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="text-foreground">{selectedError.message}</p>
              </div>
              {selectedError.stack_trace && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Stack Trace</p>
                  <pre className="p-3 rounded-lg bg-black/50 text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap font-mono">
                    {selectedError.stack_trace}
                  </pre>
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Occurred: {format(new Date(selectedError.created_at), 'MMM d, yyyy h:mm a')}</span>
                {selectedError.user_id && (
                  <span className="font-mono">User: {selectedError.user_id}</span>
                )}
              </div>
              {!selectedError.is_resolved && (
                <Button
                  onClick={() => {
                    resolveMutation.mutate(selectedError.id);
                    setSelectedError(null);
                  }}
                  className="w-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Resolved
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminErrorLogsPage;
