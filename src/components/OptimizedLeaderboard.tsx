import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Star, Flame, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/GlassCard";
import { VirtualList } from "@/components/VirtualList";
import { useRealtimeOptimized } from "@/hooks/useRealtimeOptimized";
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";
import { leanQuery } from "@/hooks/useOptimizedQuery";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const timeFilters = [
  { id: "weekly", label: "This Week" },
  { id: "monthly", label: "This Month" },
  { id: "alltime", label: "All Time" },
];

const levelConfigs = [
  { level: 1, name: "Newcomer", minPoints: 0, icon: Star, color: "text-slate-400" },
  { level: 2, name: "Seeker", minPoints: 100, icon: Zap, color: "text-blue-400" },
  { level: 3, name: "Apprentice", minPoints: 300, icon: Flame, color: "text-orange-400" },
  { level: 4, name: "Practitioner", minPoints: 600, icon: Medal, color: "text-purple-400" },
  { level: 5, name: "Adept", minPoints: 1000, icon: Trophy, color: "text-primary" },
  { level: 6, name: "Master", minPoints: 2000, icon: Crown, color: "text-yellow-400" },
];

interface MemberPoint {
  user_id: string;
  total_points: number;
  current_level: number;
  streak_days: number;
}

interface Profile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
}

export const OptimizedLeaderboard = () => {
  const [timeFilter, setTimeFilter] = useState("alltime");
  const { user } = useAuth();

  // Optimized lean query - only select needed fields
  const { data: leaderboard = [], refetch } = useOptimizedQuery<MemberPoint[]>(
    ['leaderboard', timeFilter],
    async () => {
      const { data } = await leanQuery<MemberPoint[]>({
        table: 'member_points',
        select: 'user_id, total_points, current_level, streak_days',
        order: { column: 'total_points', ascending: false },
        limit: 100,
      });
      return data || [];
    }
  );

  // Fetch profiles separately - lean query
  const { data: profiles = [] } = useOptimizedQuery<Profile[]>(
    ['leaderboard-profiles', leaderboard.map(l => l.user_id)],
    async () => {
      if (leaderboard.length === 0) return [];
      const { data } = await leanQuery<Profile[]>({
        table: 'academy_profiles',
        select: 'user_id, display_name, avatar_url',
        filters: { user_id: leaderboard.map(l => l.user_id) },
      });
      return data || [];
    },
    { enabled: leaderboard.length > 0 }
  );

  // User's own points
  const { data: memberPoints } = useOptimizedQuery(
    ['my-points', user?.id],
    async () => {
      if (!user?.id) return null;
      const { data } = await leanQuery<MemberPoint>({
        table: 'member_points',
        select: 'user_id, total_points, current_level, streak_days',
        filters: { user_id: user.id },
        single: true,
      });
      return data;
    },
    { enabled: !!user?.id }
  );

  // Real-time updates with debouncing
  useRealtimeOptimized<MemberPoint>({
    table: 'member_points',
    event: 'UPDATE',
    onUpdate: useCallback(() => {
      refetch();
    }, [refetch]),
    batchWindow: 500, // Batch updates every 500ms
  });

  const profilesMap = useMemo(() => 
    new Map(profiles.map(p => [p.user_id, p])),
    [profiles]
  );

  const currentUserRank = useMemo(() => 
    leaderboard.findIndex(p => p.user_id === user?.id) + 1,
    [leaderboard, user?.id]
  );

  const getLevelConfig = (level: number) => levelConfigs.find(l => l.level === level) || levelConfigs[0];
  const getNextLevel = (level: number) => levelConfigs.find(l => l.level === level + 1);

  const levelProgress = useMemo(() => {
    if (!memberPoints) return { current: 0, needed: 100, progress: 0 };
    const nextLevel = getNextLevel(memberPoints.current_level || 1);
    if (!nextLevel) return { current: memberPoints.total_points || 0, needed: 0, progress: 100 };
    const currentLevelConfig = getLevelConfig(memberPoints.current_level || 1);
    const pointsInCurrentLevel = (memberPoints.total_points || 0) - currentLevelConfig.minPoints;
    const pointsNeededForNext = nextLevel.minPoints - currentLevelConfig.minPoints;
    return { current: pointsInCurrentLevel, needed: pointsNeededForNext, progress: (pointsInCurrentLevel / pointsNeededForNext) * 100 };
  }, [memberPoints]);

  // Virtual list row renderer
  const renderLeaderboardItem = useCallback((item: MemberPoint, index: number) => {
    const config = getLevelConfig(item.current_level || 1);
    const Icon = config.icon;
    const isCurrentUser = item.user_id === user?.id;
    const profile = profilesMap.get(item.user_id);

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: Math.min(index * 0.02, 0.3) }}
        className={cn(
          "flex items-center gap-4 p-3 rounded-xl transition-all",
          isCurrentUser ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/30"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
          index < 3
            ? index === 0
              ? "bg-yellow-400/20 text-yellow-400"
              : index === 1
              ? "bg-slate-300/20 text-slate-300"
              : "bg-amber-600/20 text-amber-600"
            : "bg-muted text-muted-foreground"
        )}>
          {index + 1}
        </div>
        <Avatar className="w-10 h-10 border border-border">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
            {profile?.display_name?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("font-medium truncate", isCurrentUser ? "text-primary" : "text-foreground")}>
              {profile?.display_name || 'Member'}{isCurrentUser && " (You)"}
            </span>
            <Badge variant="outline" className={cn("text-xs", config.color)}>
              <Icon className="w-3 h-3 mr-1" />{config.name}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Level {item.current_level || 1} • {item.streak_days || 0} day streak</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-foreground">{item.total_points || 0}</p>
          <p className="text-xs text-muted-foreground">XP</p>
        </div>
      </motion.div>
    );
  }, [user?.id, profilesMap]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
          <p className="text-sm text-muted-foreground">Compete and climb the ranks</p>
        </div>
      </div>

      {memberPoints && (
        <GlassCard premium className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16 border-2 border-primary/50">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xl">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    {profilesMap.get(user?.id || '')?.display_name || 'You'}
                  </h3>
                  {(() => {
                    const config = getLevelConfig(memberPoints.current_level || 1);
                    const Icon = config.icon;
                    return (
                      <Badge className={cn("gap-1", config.color, "bg-current/10 border-current/30")}>
                        <Icon className="w-3 h-3" />{config.name}
                      </Badge>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-primary" />Rank #{currentUserRank || '-'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-secondary" />{memberPoints.total_points || 0} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" />{memberPoints.streak_days || 0} day streak
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Level {memberPoints.current_level || 1} Progress</span>
                <span className="text-primary font-medium">{levelProgress.current}/{levelProgress.needed} XP</span>
              </div>
              <Progress value={levelProgress.progress} className="h-3" />
            </div>
          </div>
        </GlassCard>
      )}

      <Tabs value={timeFilter} onValueChange={setTimeFilter}>
        <TabsList className="w-full bg-card/50 border border-border/50">
          {timeFilters.map((filter) => (
            <TabsTrigger key={filter.id} value={filter.id} className="flex-1">
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={timeFilter} className="mt-6">
          <GlassCard hover={false}>
            {leaderboard.length > 0 ? (
              <VirtualList
                items={leaderboard}
                itemHeight={72}
                containerHeight={500}
                renderItem={renderLeaderboardItem}
                className="space-y-2"
              />
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No members on the leaderboard yet</p>
              </div>
            )}
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
