import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Trophy,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useAcademy } from "@/hooks/useAcademy";
import { cn } from "@/lib/utils";
import type { MemberPoints, AcademyProfile } from "@/types/academy";

export const AdminStats = () => {
  const { members, posts, courses, events, leaderboard } = useAcademy();
  
  const totalMembers = members.length;
  const totalPosts = posts.length;
  const publishedCourses = courses.filter(c => c.is_published).length;
  const upcomingEvents = events.filter(e => new Date(e.start_time) >= new Date()).length;
  const activeMembers = leaderboard.filter((m: MemberPoints) => (m.total_points || 0) > 0).length;

  const stats = [
    {
      label: "Total Members",
      value: totalMembers,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      change: "+12%",
      trend: "up" as const,
    },
    {
      label: "Active Members",
      value: activeMembers,
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      change: "+8%",
      trend: "up" as const,
    },
    {
      label: "Community Posts",
      value: totalPosts,
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      change: "+24%",
      trend: "up" as const,
    },
    {
      label: "Published Courses",
      value: publishedCourses,
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/20",
      change: "+2",
      trend: "up" as const,
    },
    {
      label: "Upcoming Events",
      value: upcomingEvents,
      icon: Clock,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      change: "+3",
      trend: "up" as const,
    },
    {
      label: "Total XP Earned",
      value: leaderboard.reduce((acc: number, m: MemberPoints) => acc + (m.total_points || 0), 0),
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      change: "+1.2k",
      trend: "up" as const,
    },
  ];

  const topContributors = leaderboard.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard>
                <div className="flex items-start justify-between">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bgColor)}>
                    <Icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-foreground">
                    {typeof stat.value === 'number' && stat.value >= 1000 
                      ? `${(stat.value / 1000).toFixed(1)}k` 
                      : stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Contributors */}
        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Top Contributors
          </h3>
          <div className="space-y-3">
            {topContributors.map((member: MemberPoints, index: number) => {
              const memberProfile = members.find((p: AcademyProfile) => p.user_id === member.user_id);
              return (
                <div key={member.user_id} className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                    index === 0 ? "bg-yellow-400/20 text-yellow-400" :
                    index === 1 ? "bg-slate-300/20 text-slate-300" :
                    index === 2 ? "bg-amber-600/20 text-amber-600" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-foreground font-medium">
                    {memberProfile?.display_name?.[0] || 'M'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {memberProfile?.display_name || 'Member'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.level_name || 'Newcomer'}
                    </p>
                  </div>
                  <p className="font-bold text-primary">{member.total_points || 0} XP</p>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-secondary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Create Course", icon: BookOpen, color: "bg-primary/20 text-primary" },
              { label: "Schedule Event", icon: Clock, color: "bg-purple-500/20 text-purple-400" },
              { label: "Send Broadcast", icon: MessageSquare, color: "bg-blue-500/20 text-blue-400" },
              { label: "Award Badge", icon: Trophy, color: "bg-yellow-500/20 text-yellow-400" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", action.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Engagement Chart Placeholder */}
      <GlassCard hover={false}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Engagement Over Time</h3>
        <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl border border-border/50">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Engagement analytics coming soon</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
