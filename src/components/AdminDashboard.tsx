import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CreditCard,
  DollarSign,
  Calendar,
  Zap,
  Crown,
  Star,
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

interface Subscription {
  id: string;
  user_email: string;
  plan: "free" | "pro" | "business" | "enterprise";
  status: "active" | "cancelled" | "past_due" | "trialing";
  amount: number;
  next_billing: string;
  created_at: string;
}

// Demo subscription data for display
const demoSubscriptions: Subscription[] = [
  { id: "1", user_email: "sarah@company.com", plan: "enterprise", status: "active", amount: 299, next_billing: "2026-02-18", created_at: "2025-06-15" },
  { id: "2", user_email: "john@startup.io", plan: "business", status: "active", amount: 99, next_billing: "2026-02-01", created_at: "2025-08-22" },
  { id: "3", user_email: "maria@agency.co", plan: "pro", status: "active", amount: 29, next_billing: "2026-01-25", created_at: "2025-11-10" },
  { id: "4", user_email: "alex@freelance.dev", plan: "pro", status: "trialing", amount: 29, next_billing: "2026-01-30", created_at: "2026-01-01" },
  { id: "5", user_email: "team@corp.net", plan: "business", status: "past_due", amount: 99, next_billing: "2026-01-10", created_at: "2025-04-20" },
  { id: "6", user_email: "solo@indie.app", plan: "free", status: "active", amount: 0, next_billing: "-", created_at: "2025-12-01" },
];

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
  const [subscriptions] = useState<Subscription[]>(demoSubscriptions);
  const [activeTab, setActiveTab] = useState("overview");

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

  const getPlanBadge = (plan: Subscription["plan"]) => {
    const styles = {
      free: "bg-gray-500/20 text-gray-400",
      pro: "bg-blue-500/20 text-blue-400",
      business: "bg-purple-500/20 text-purple-400",
      enterprise: "bg-amber-500/20 text-amber-400",
    };
    return styles[plan];
  };

  const getStatusBadge = (status: Subscription["status"]) => {
    const styles = {
      active: "bg-green-500/20 text-green-400",
      trialing: "bg-cyan-500/20 text-cyan-400",
      past_due: "bg-red-500/20 text-red-400",
      cancelled: "bg-gray-500/20 text-gray-400",
    };
    return styles[status];
  };

  // Calculate subscription metrics
  const totalMRR = subscriptions.filter(s => s.status === "active").reduce((sum, s) => sum + s.amount, 0);
  const activeSubscriptions = subscriptions.filter(s => s.status === "active" || s.status === "trialing").length;
  const churnRisk = subscriptions.filter(s => s.status === "past_due").length;

  const statCards = [
    {
      title: "Total Users",
      value: userStats.totalUsers,
      icon: Users,
      trend: "+12%",
      color: "primary",
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions,
      icon: CreditCard,
      trend: "+8%",
      color: "secondary",
    },
    {
      title: "Monthly Revenue",
      value: `$${totalMRR.toLocaleString()}`,
      icon: DollarSign,
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

      {/* Tabs for different admin sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
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
                <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => setActiveTab('users')}>
                  <UserCog className="h-4 w-4" />
                  Manage Users
                </Button>
                <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => setShowNotificationSettings(true)}>
                  <Bell className="h-4 w-4" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => setActiveTab('subscriptions')}>
                  <CreditCard className="h-4 w-4" />
                  Subscriptions
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
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-6">
          <div className="space-y-6">
            {/* Subscription Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
                    <p className="text-2xl font-semibold text-foreground">${totalMRR.toLocaleString()}</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <CreditCard className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Subscriptions</p>
                    <p className="text-2xl font-semibold text-foreground">{activeSubscriptions}</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-red-500/10">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Churn Risk</p>
                    <p className="text-2xl font-semibold text-foreground">{churnRisk}</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Subscriptions Table */}
            <GlassCard className="p-6">
              <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Client Subscriptions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Client</th>
                      <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Plan</th>
                      <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Amount</th>
                      <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Next Billing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="border-b border-border/30 hover:bg-foreground/5">
                        <td className="py-3 px-2">
                          <span className="text-sm text-foreground">{sub.user_email}</span>
                        </td>
                        <td className="py-3 px-2">
                          <Badge className={`${getPlanBadge(sub.plan)} border-0 capitalize`}>
                            {sub.plan === "enterprise" && <Crown className="h-3 w-3 mr-1" />}
                            {sub.plan === "business" && <Star className="h-3 w-3 mr-1" />}
                            {sub.plan}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge className={`${getStatusBadge(sub.status)} border-0 capitalize`}>
                            {sub.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-foreground">
                            {sub.amount === 0 ? "Free" : `$${sub.amount}/mo`}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-muted-foreground">
                            {sub.next_billing === "-" ? "-" : new Date(sub.next_billing).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagementTable />
        </TabsContent>
      </Tabs>

      {/* Push Notification Settings Modal */}
      <PushNotificationSettings 
        isOpen={showNotificationSettings} 
        onClose={() => setShowNotificationSettings(false)} 
      />
    </div>
  );
}
