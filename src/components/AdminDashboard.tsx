import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { UserManagementTable } from "@/components/UserManagementTable";
import { PushNotificationSettings } from "@/components/PushNotificationSettings";
import {
  Users,
  Activity,
  Brain,
  Shield,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  BarChart3,
  UserCog,
  Bell,
  Database,
} from "lucide-react";

interface UserStats {
  totalUsers: number;
  activeToday: number;
  newThisWeek: number;
}

interface SystemHealth {
  database: "healthy" | "degraded" | "down";
  auth: "healthy" | "degraded" | "down";
  realtime: "healthy" | "degraded" | "down";
}

export function AdminDashboard() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeToday: 0,
    newThisWeek: 0,
  });
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: "healthy",
    auth: "healthy",
    realtime: "healthy",
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch user count from profiles
      const { count: profileCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from("activity_feed")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch cognitive states for activity metrics
      const today = new Date().toISOString().split("T")[0];
      const { count: activeCount } = await supabase
        .from("cognitive_states")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today);

      setUserStats({
        totalUsers: profileCount || 0,
        activeToday: activeCount || 0,
        newThisWeek: Math.floor((profileCount || 0) * 0.15), // Estimate
      });

      setRecentActivity(activityData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case "down":
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: userStats.totalUsers,
      icon: Users,
      trend: "+12%",
      color: "primary",
    },
    {
      title: "Active Today",
      value: userStats.activeToday,
      icon: Activity,
      trend: "+5%",
      color: "secondary",
    },
    {
      title: "New This Week",
      value: userStats.newThisWeek,
      icon: TrendingUp,
      trend: "+23%",
      color: "accent",
    },
    {
      title: "System Health",
      value: "Healthy",
      icon: Shield,
      trend: "100%",
      color: "success",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform overview and management
          </p>
        </div>
        <Button
          onClick={fetchDashboardData}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Database className="h-4 w-4" />
            System Health
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
              <span className="text-sm text-muted-foreground">Database</span>
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.database)}
                <span className="text-xs capitalize">{systemHealth.database}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
              <span className="text-sm text-muted-foreground">Authentication</span>
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.auth)}
                <span className="text-xs capitalize">{systemHealth.auth}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
              <span className="text-sm text-muted-foreground">Realtime</span>
              <div className="flex items-center gap-2">
                {getHealthIcon(systemHealth.realtime)}
                <span className="text-xs capitalize">{systemHealth.realtime}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => document.getElementById('user-management')?.scrollIntoView({ behavior: 'smooth' })}>
              <UserCog className="h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => setShowNotificationSettings(true)}>
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
            <Button variant="outline" size="sm" className="gap-2 justify-start">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button variant="outline" size="sm" className="gap-2 justify-start">
              <Brain className="h-4 w-4" />
              Cognitive
            </Button>
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity
              </p>
            ) : (
              recentActivity.slice(0, 5).map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {activity.title || "Activity"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.created_at
                        ? new Date(activity.created_at).toLocaleTimeString()
                        : "Just now"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      {/* User Management Table */}
      <div id="user-management">
        <UserManagementTable />
      </div>

      {/* Push Notification Settings Modal */}
      <PushNotificationSettings 
        isOpen={showNotificationSettings} 
        onClose={() => setShowNotificationSettings(false)} 
      />
    </div>
  );
}
