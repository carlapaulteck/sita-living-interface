import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  CreditCard,
  Ticket,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Megaphone,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

const StatCard = ({ title, value, change, icon, trend, loading }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="bg-[#151515] border-white/5 hover:border-white/10 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            {loading ? (
              <div className="h-8 w-16 bg-white/5 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-foreground">{value}</p>
            )}
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${
                trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-muted-foreground'
              }`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
                <span>{change > 0 ? '+' : ''}{change}% from last week</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const AdminDashboardPage = () => {
  // Fetch total users count
  const { data: usersCount, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch open tickets count
  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['admin-tickets-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('id, status')
        .in('status', ['open', 'in_progress']);
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch recent errors
  const { data: errorsData, isLoading: errorsLoading } = useQuery({
    queryKey: ['admin-errors-recent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch subscriptions data
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['admin-subscriptions-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan, status, amount');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch recent tickets
  const { data: recentTickets, isLoading: recentTicketsLoading } = useQuery({
    queryKey: ['admin-recent-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    }
  });

  const openTicketsCount = ticketsData?.length || 0;
  const unresolvedErrorsCount = errorsData?.filter(e => !e.is_resolved).length || 0;
  const totalMRR = subscriptionsData?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-3 h-3" />;
      case 'in_progress': return <Activity className="w-3 h-3" />;
      case 'resolved': return <CheckCircle className="w-3 h-3" />;
      case 'closed': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-400';
      case 'error': return 'bg-orange-500/10 text-orange-400';
      case 'warning': return 'bg-yellow-500/10 text-yellow-400';
      default: return 'bg-blue-500/10 text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={usersCount || 0}
          change={12}
          trend="up"
          icon={<Users className="w-5 h-5 text-primary" />}
          loading={usersLoading}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(totalMRR / 100).toLocaleString()}`}
          change={8}
          trend="up"
          icon={<CreditCard className="w-5 h-5 text-primary" />}
          loading={subscriptionsLoading}
        />
        <StatCard
          title="Open Tickets"
          value={openTicketsCount}
          change={-5}
          trend="down"
          icon={<Ticket className="w-5 h-5 text-primary" />}
          loading={ticketsLoading}
        />
        <StatCard
          title="Unresolved Errors"
          value={unresolvedErrorsCount}
          icon={<AlertTriangle className="w-5 h-5 text-primary" />}
          loading={errorsLoading}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-[#151515] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Recent Tickets</CardTitle>
              <Link to="/admin/tickets">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                {recentTicketsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : recentTickets && recentTickets.length > 0 ? (
                  <div className="space-y-3">
                    {recentTickets.map((ticket) => (
                      <Link
                        key={ticket.id}
                        to={`/admin/tickets?id=${ticket.id}`}
                        className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{ticket.subject}</p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{ticket.message}</p>
                          </div>
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {getStatusIcon(ticket.status)}
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span>{format(new Date(ticket.created_at), 'MMM d, h:mm a')}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                    <Ticket className="w-10 h-10 mb-2 opacity-50" />
                    <p>No tickets yet</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Errors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-[#151515] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Recent Errors</CardTitle>
              <Link to="/admin/errors">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                {errorsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : errorsData && errorsData.length > 0 ? (
                  <div className="space-y-3">
                    {errorsData.map((error) => (
                      <div
                        key={error.id}
                        className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{error.error_type}</p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{error.message}</p>
                          </div>
                          <Badge className={getSeverityColor(error.severity)}>
                            {error.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {error.component && <span className="font-mono">{error.component}</span>}
                          <span>{format(new Date(error.created_at), 'MMM d, h:mm a')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                    <CheckCircle className="w-10 h-10 mb-2 opacity-50 text-emerald-500" />
                    <p>No errors logged</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-[#151515] border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/admin/users">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm">Manage Users</span>
                </Button>
              </Link>
              <Link to="/admin/announcements">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10">
                  <Megaphone className="w-5 h-5 text-primary" />
                  <span className="text-sm">New Announcement</span>
                </Button>
              </Link>
              <Link to="/admin/subscriptions">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="text-sm">Subscriptions</span>
                </Button>
              </Link>
              <Link to="/admin/settings">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10">
                  <Settings className="w-5 h-5 text-primary" />
                  <span className="text-sm">Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
