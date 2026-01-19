import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Star, Trophy, MapPin, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/GlassCard";
import { useAcademy } from "@/hooks/useAcademy";
import { cn } from "@/lib/utils";

const levelColors: Record<number, string> = {
  1: "text-slate-400",
  2: "text-blue-400",
  3: "text-orange-400",
  4: "text-purple-400",
  5: "text-primary",
  6: "text-yellow-400",
};

export const MemberDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const { profiles, leaderboard, membersLoading } = useAcademy();

  const membersWithPoints = profiles.map(profile => {
    const points = leaderboard.find(l => l.user_id === profile.user_id);
    return {
      ...profile,
      total_points: points?.total_points || 0,
      current_level: points?.current_level || 1,
      level_name: points?.level_name || 'Newcomer',
    };
  });

  const filteredMembers = membersWithPoints
    .filter(member => {
      const matchesSearch = 
        member.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.bio?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === null || member.current_level === selectedLevel;
      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => (b.total_points || 0) - (a.total_points || 0));

  const levelFilters = [
    { level: null, label: "All" },
    { level: 1, label: "Newcomer" },
    { level: 2, label: "Seeker" },
    { level: 3, label: "Apprentice" },
    { level: 4, label: "Practitioner" },
    { level: 5, label: "Adept" },
    { level: 6, label: "Master" },
  ];

  if (membersLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading members...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Members</h2>
          <p className="text-sm text-muted-foreground">{profiles.length} community members</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search members..." className="pl-10 bg-card/50 border-border/50" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {levelFilters.map((filter) => (
          <motion.button
            key={filter.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedLevel(filter.level)}
            className={cn(
              "px-4 py-2 rounded-xl whitespace-nowrap transition-all text-sm",
              selectedLevel === filter.level ? "bg-primary/20 text-primary border border-primary/30" : "bg-card/50 text-muted-foreground border border-border/50 hover:text-foreground"
            )}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member, index) => (
            <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
              <GlassCard className="h-full">
                <div className="flex items-start gap-4">
                  <Avatar className="w-14 h-14 border-2 border-border">
                    <AvatarImage src={member.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-lg">
                      {member.display_name?.[0]?.toUpperCase() || 'M'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground truncate">{member.display_name || 'Member'}</h4>
                      {member.is_admin && <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Admin</Badge>}
                    </div>
                    <Badge variant="outline" className={cn("text-xs mt-1", levelColors[member.current_level || 1])}>
                      <Star className="w-3 h-3 mr-1" />
                      {member.level_name}
                    </Badge>
                  </div>
                </div>

                {member.bio && <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{member.bio}</p>}

                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  {member.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{member.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span>{member.total_points} XP</span>
                  </div>
                </div>

                {member.badges && member.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {member.badges.slice(0, 3).map((badge, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{badge.name}</Badge>
                    ))}
                    {member.badges.length > 3 && <Badge variant="outline" className="text-xs">+{member.badges.length - 3}</Badge>}
                  </div>
                )}

                {member.website && (
                  <a href={member.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline mt-3">
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No members found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
};