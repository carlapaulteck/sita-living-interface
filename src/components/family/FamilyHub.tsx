import { motion } from "framer-motion";
import { Users, Calendar, Bell, Heart, Target, Star } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  status: "available" | "busy" | "away";
  avatar?: string;
}

const FAMILY_MEMBERS: FamilyMember[] = [
  { id: "1", name: "Partner", role: "Co-pilot", status: "available" },
  { id: "2", name: "Alex Jr.", role: "Student", status: "busy" },
  { id: "3", name: "Emma", role: "Explorer", status: "available" },
];

const STATUS_COLORS = {
  available: "bg-emerald-500",
  busy: "bg-amber-500",
  away: "bg-muted-foreground",
};

export function FamilyHub() {
  return (
    <div className="space-y-6">
      {/* Signal Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricSignalCard
          title="Family Sync"
          value="92%"
          subtitle="Schedule alignment"
          icon={Users}
          status="healthy"
        />
          <MetricSignalCard
          title="Shared Tasks"
          value="8"
          subtitle="Active this week"
          icon={Target}
          status="healthy"
        />
          <MetricSignalCard
          title="Upcoming"
          value="3"
          subtitle="Family events"
          icon={Calendar}
          status="warning"
        />
        <MetricSignalCard
          title="Wellness"
          value="Good"
          subtitle="Family health score"
          icon={Heart}
          status="healthy"
        />
      </div>

      {/* Family Members Grid */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-lg font-display font-medium text-foreground mb-4">Family Members</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FAMILY_MEMBERS.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-lg font-medium text-foreground">{member.name[0]}</span>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${STATUS_COLORS[member.status]}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Schedule Family Time", icon: Calendar },
          { label: "Set Reminder", icon: Bell },
          { label: "Celebrate Win", icon: Star },
          { label: "Check-in", icon: Heart },
        ].map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
          >
            <action.icon className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground text-center">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
