import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Star,
  Flame,
  Zap
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GlassCard } from "@/components/GlassCard";
import { useAcademy } from "@/hooks/useAcademy";
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

export const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState("alltime");
  const { user } = useAuth();
  const { profiles, memberPoints, getLeaderboard } = useAcademy();
  
  const leaderboardData = getLeaderboard();
  const currentUserPoints = memberPoints;
  const currentUserRank = leaderboardData.findIndex(p => p.user_id === user?.id) + 1;

  const getLevelConfig = (level: number) => {
    return levelConfigs.find(l => l.level === level) || levelConfigs[0];
  };

  const getNextLevel = (level: number) => {
    return levelConfigs.find(l => l.level === level + 1);
  };

  const getPointsToNextLevel = () => {
    if (!currentUserPoints) return { current: 0, needed: 100, progress: 0 };
    
    const nextLevel = getNextLevel(currentUserPoints.current_level || 1);
    if (!nextLevel) return { current: currentUserPoints.total_points, needed: 0, progress: 100 };
    
    const currentLevelConfig = getLevelConfig(currentUserPoints.current_level || 1);
    const pointsInCurrentLevel = (currentUserPoints.total_points || 0) - currentLevelConfig.minPoints;
    const pointsNeededForNext = nextLevel.minPoints - currentLevelConfig.minPoints;
    
    return {
      current: pointsInCurrentLevel,
      needed: pointsNeededForNext,
      progress: (pointsInCurrentLevel / pointsNeededForNext) * 100,
    };
  };

  const levelProgress = getPointsToNextLevel();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
          <p className="text-sm text-muted-foreground">
            Compete and climb the ranks
          </p>
        </div>
      </div>

      {/* Current User Stats */}
      {currentUserPoints && (
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
                    {profiles.find(p => p.user_id === user?.id)?.display_name || 'You'}
                  </h3>
                  {(() => {
                    const config = getLevelConfig(currentUserPoints.current_level || 1);
                    const Icon = config.icon;
                    return (
                      <Badge className={cn("gap-1", config.color, "bg-current/10 border-current/30")}>
                        <Icon className="w-3 h-3" />
                        {config.name}
                      </Badge>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-primary" />
                    Rank #{currentUserRank || '-'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-secondary" />
                    {currentUserPoints.total_points || 0} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    {currentUserPoints.streak_days || 0} day streak
                  </span>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Level {currentUserPoints.current_level || 1} Progress
                </span>
                <span className="text-primary font-medium">
                  {levelProgress.current}/{levelProgress.needed} XP
                </span>
              </div>
              <Progress value={levelProgress.progress} className="h-3" />
              {getNextLevel(currentUserPoints.current_level || 1) && (
                <p className="text-xs text-muted-foreground">
                  {levelProgress.needed - levelProgress.current} XP to {getNextLevel(currentUserPoints.current_level || 1)?.name}
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Time Filter */}
      <Tabs value={timeFilter} onValueChange={setTimeFilter}>
        <TabsList className="w-full bg-card/50 border border-border/50">
          {timeFilters.map((filter) => (
            <TabsTrigger
              key={filter.id}
              value={filter.id}
              className="flex-1"
            >
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={timeFilter} className="mt-6">
          {/* Top 3 Podium */}
          <div className="flex justify-center gap-4 mb-8">
            {leaderboardData.slice(0, 3).map((member, index) => {
              const config = getLevelConfig(member.current_level || 1);
              const Icon = config.icon;
              const heights = ['h-32', 'h-40', 'h-28'];
              const positions = [1, 0, 2];
              const actualIndex = positions[index];
              const podiumMember = leaderboardData[actualIndex];
              
              if (!podiumMember) return null;
              
              const podiumConfig = getLevelConfig(podiumMember.current_level || 1);
              const PodiumIcon = podiumConfig.icon;
              
              return (
                <motion.div
                  key={podiumMember.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className={cn(
                    "relative",
                    actualIndex === 0 && "order-2"
                  )}>
                    {actualIndex === 0 && (
                      <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400" />
                    )}
                    <Avatar className={cn(
                      "border-2",
                      actualIndex === 0 ? "w-20 h-20 border-yellow-400" :
                      actualIndex === 1 ? "w-16 h-16 border-slate-300" :
                      "w-14 h-14 border-amber-600"
                    )}>
                      <AvatarImage src={profiles.find(p => p.user_id === podiumMember.user_id)?.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                        {podiumMember.level_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      actualIndex === 0 ? "bg-yellow-400 text-yellow-900" :
                      actualIndex === 1 ? "bg-slate-300 text-slate-900" :
                      "bg-amber-600 text-amber-100"
                    )}>
                      {actualIndex + 1}
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-medium text-foreground text-sm">
                      {profiles.find(p => p.user_id === podiumMember.user_id)?.display_name || 'Member'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {podiumMember.total_points || 0} XP
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Full Leaderboard */}
          <GlassCard hover={false}>
            <div className="space-y-2">
              {leaderboardData.map((member, index) => {
                const config = getLevelConfig(member.current_level || 1);
                const Icon = config.icon;
                const isCurrentUser = member.user_id === user?.id;
                const profile = profiles.find(p => p.user_id === member.user_id);
                
                return (
                  <motion.div
                    key={member.user_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-xl transition-all",
                      isCurrentUser 
                        ? "bg-primary/10 border border-primary/30" 
                        : "hover:bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                      index < 3 
                        ? index === 0 ? "bg-yellow-400/20 text-yellow-400" :
                          index === 1 ? "bg-slate-300/20 text-slate-300" :
                          "bg-amber-600/20 text-amber-600"
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
                        <span className={cn(
                          "font-medium truncate",
                          isCurrentUser ? "text-primary" : "text-foreground"
                        )}>
                          {profile?.display_name || 'Member'}
                          {isCurrentUser && " (You)"}
                        </span>
                        <Badge variant="outline" className={cn("text-xs", config.color)}>
                          <Icon className="w-3 h-3 mr-1" />
                          {config.name}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Level {member.current_level || 1} • {member.streak_days || 0} day streak
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-foreground">{member.total_points || 0}</p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </motion.div>
                );
              })}
              
              {leaderboardData.length === 0 && (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No members on the leaderboard yet</p>
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* Points Guide */}
      <GlassCard hover={false}>
        <h4 className="font-semibold text-foreground mb-4">How to Earn XP</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { action: "Create a post", points: 10, icon: "📝" },
            { action: "Comment", points: 5, icon: "💬" },
            { action: "Complete lesson", points: 15, icon: "📚" },
            { action: "Finish course", points: 100, icon: "🎓" },
            { action: "Attend event", points: 25, icon: "📅" },
            { action: "Daily login", points: 5, icon: "🔥" },
            { action: "Receive like", points: 2, icon: "❤️" },
            { action: "Help others", points: 10, icon: "🤝" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/50"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{item.action}</p>
                <p className="text-xs text-primary">+{item.points} XP</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
