import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, UserPlus, UserCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SignupData {
  date: string;
  count: number;
}

const UserAnalyticsWidget = () => {
  // Fetch user signup trends (last 30 days)
  const { data: signupTrends, isLoading: trendsLoading } = useQuery({
    queryKey: ['admin-signup-trends'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const grouped: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const date = format(subDays(new Date(), i), 'MMM d');
        grouped[date] = 0;
      }

      (data || []).forEach((profile) => {
        const date = format(new Date(profile.created_at), 'MMM d');
        if (grouped[date] !== undefined) {
          grouped[date]++;
        }
      });

      return Object.entries(grouped).map(([date, count]) => ({
        date,
        count,
      })) as SignupData[];
    },
  });

  // Fetch active users (users with activity in last 7 days)
  const { data: activeUsers, isLoading: activeLoading } = useQuery({
    queryKey: ['admin-active-users'],
    queryFn: async () => {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      
      // Check activity_feed for recent activity
      const { data, error } = await supabase
        .from('activity_feed')
        .select('user_id')
        .gte('created_at', sevenDaysAgo);

      if (error) throw error;

      // Get unique users
      const uniqueUsers = new Set((data || []).map(a => a.user_id));
      return uniqueUsers.size;
    },
  });

  // Fetch onboarding completion rate
  const { data: onboardingStats, isLoading: onboardingLoading } = useQuery({
    queryKey: ['admin-onboarding-stats'],
    queryFn: async () => {
      const { count: totalCount, error: totalError } = await supabase
        .from('user_preferences')
        .select('id', { count: 'exact', head: true });

      const { count: completedCount, error: completedError } = await supabase
        .from('user_preferences')
        .select('id', { count: 'exact', head: true })
        .not('completed_at', 'is', null);

      if (totalError || completedError) throw totalError || completedError;

      const total = totalCount || 0;
      const completed = completedCount || 0;
      
      return {
        total,
        completed,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    },
  });

  // Get total users
  const { data: totalUsers } = useQuery({
    queryKey: ['admin-total-users-analytics'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Today's signups
  const todaySignups = signupTrends?.find(
    (d) => d.date === format(new Date(), 'MMM d')
  )?.count || 0;

  return (
    <Card className="bg-[#151515] border-white/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-primary" />
          User Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-white/5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs">Total Users</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalUsers?.toLocaleString() || 0}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-white/5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <UserPlus className="w-4 h-4" />
              <span className="text-xs">Today's Signups</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">
              +{todaySignups}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-white/5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <UserCheck className="w-4 h-4" />
              <span className="text-xs">Active (7d)</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {activeLoading ? '...' : activeUsers}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-white/5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Onboarding Rate</span>
            </div>
            <p className="text-2xl font-bold text-amber-400">
              {onboardingLoading ? '...' : `${onboardingStats?.rate || 0}%`}
            </p>
          </div>
        </div>

        {/* Signup Chart */}
        <div>
          <p className="text-sm text-muted-foreground mb-3">Signups (Last 30 days)</p>
          <div className="h-[180px]">
            {trendsLoading ? (
              <div className="h-full w-full bg-white/5 rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signupTrends}>
                  <defs>
                    <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#signupGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAnalyticsWidget;
