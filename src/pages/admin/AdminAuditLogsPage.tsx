import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ClipboardList,
  Search,
  Filter,
  User,
  Settings,
  Shield,
  MessageSquare,
  CreditCard,
  Download
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const AdminAuditLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [targetFilter, setTargetFilter] = useState<string>('all');

  // Fetch audit logs
  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', searchQuery, actionFilter, targetFilter],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (targetFilter !== 'all') {
        query = query.eq('target_type', targetFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter by action and search
      let filtered = data || [];
      
      if (actionFilter !== 'all') {
        filtered = filtered.filter(l => l.action.includes(actionFilter));
      }

      if (searchQuery) {
        filtered = filtered.filter(l => 
          l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.target_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.admin_user_id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return filtered;
    }
  });

  const getActionIcon = (action: string) => {
    if (action.includes('user') || action.includes('role')) return <User className="w-4 h-4" />;
    if (action.includes('ticket') || action.includes('message')) return <MessageSquare className="w-4 h-4" />;
    if (action.includes('subscription') || action.includes('billing')) return <CreditCard className="w-4 h-4" />;
    if (action.includes('setting') || action.includes('config')) return <Settings className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('delete')) return 'bg-red-500/10 text-red-400';
    if (action.includes('create') || action.includes('add')) return 'bg-emerald-500/10 text-emerald-400';
    if (action.includes('update') || action.includes('edit')) return 'bg-blue-500/10 text-blue-400';
    return 'bg-zinc-500/10 text-zinc-400';
  };

  const formatDetails = (details: Record<string, unknown>) => {
    if (!details || Object.keys(details).length === 0) return '—';
    return Object.entries(details)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">Track all admin actions</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-[#151515] border-white/5">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-[150px] bg-white/5 border-white/10">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
            <Select value={targetFilter} onValueChange={setTargetFilter}>
              <SelectTrigger className="w-full md:w-[150px] bg-white/5 border-white/10">
                <SelectValue placeholder="Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Targets</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="support_ticket">Ticket</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-[#151515] border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Audit Trail ({logs?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-white/5 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Timestamp</TableHead>
                    <TableHead className="text-muted-foreground">Action</TableHead>
                    <TableHead className="text-muted-foreground">Target</TableHead>
                    <TableHead className="text-muted-foreground">Admin</TableHead>
                    <TableHead className="text-muted-foreground">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(10)].map((_, i) => (
                      <TableRow key={i} className="border-white/5">
                        <TableCell colSpan={5}>
                          <div className="h-10 bg-white/5 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : logs && logs.length > 0 ? (
                    logs.map((log) => (
                      <TableRow key={log.id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="text-muted-foreground text-sm">
                          <div>
                            <p>{format(new Date(log.created_at), 'MMM d, yyyy')}</p>
                            <p className="text-xs">{format(new Date(log.created_at), 'h:mm:ss a')}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionColor(log.action)}>
                            {getActionIcon(log.action)}
                            <span className="ml-1">{log.action.replace(/_/g, ' ')}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-foreground">{log.target_type}</p>
                            {log.target_id && (
                              <p className="text-xs text-muted-foreground font-mono">
                                {log.target_id.slice(0, 8)}...
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {log.admin_user_id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                          {formatDetails(log.details as Record<string, unknown>)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminAuditLogsPage;
