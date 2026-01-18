import { motion } from "framer-motion";
import { 
  Sunrise, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Clock,
  Sparkles,
  Heart,
  Brain
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";

interface TodayWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof Sunrise;
  trend?: "up" | "down" | "neutral";
  accentColor?: "gold" | "cyan" | "rose" | "violet";
  onClick?: () => void;
}

const ACCENT_COLORS = {
  gold: "text-primary border-primary/30 bg-primary/10",
  cyan: "text-accent border-accent/30 bg-accent/10",
  rose: "text-rose-400 border-rose-400/30 bg-rose-400/10",
  violet: "text-violet-400 border-violet-400/30 bg-violet-400/10",
};

function TodayWidget({ title, value, subtitle, icon: Icon, trend, accentColor = "gold", onClick }: TodayWidgetProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300",
        "bg-gradient-to-r from-card/50 to-card/30",
        "hover:scale-[1.02] active:scale-[0.98]",
        ACCENT_COLORS[accentColor]
      )}
      whileTap={{ scale: 0.98 }}
    >
      <div className={cn("p-2 rounded-lg", ACCENT_COLORS[accentColor])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {trend && (
        <TrendingUp className={cn(
          "h-4 w-4",
          trend === "up" && "text-emerald-400",
          trend === "down" && "text-rose-400 rotate-180",
          trend === "neutral" && "text-muted-foreground rotate-90"
        )} />
      )}
    </motion.button>
  );
}

interface SmartHomeScreenProps {
  userName: string;
  greeting: string;
  onOpenBriefing?: () => void;
  onOpenCalendar?: () => void;
  onOpenHabits?: () => void;
}

export function SmartHomeScreen({ userName, greeting, onOpenBriefing, onOpenCalendar, onOpenHabits }: SmartHomeScreenProps) {
  const hour = new Date().getHours();
  const isEvening = hour >= 18;
  const isMorning = hour < 12;

  // Mock data - would come from real data sources
  const todayData = {
    focusTime: "3h 45m",
    tasksCompleted: 7,
    totalTasks: 12,
    upcomingMeetings: 2,
    portfolioChange: "+2.4%",
    wellnessScore: 82,
    nextEvent: "Team Sync",
    nextEventTime: "2:00 PM",
  };

  return (
    <GlassCard className="p-4 sm:p-6" hover={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isMorning ? (
            <Sunrise className="h-5 w-5 text-primary" />
          ) : isEvening ? (
            <Sparkles className="h-5 w-5 text-violet-400" />
          ) : (
            <Clock className="h-5 w-5 text-accent" />
          )}
          <h2 className="text-lg font-display font-medium text-foreground">
            Today's View
          </h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Quick Status Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <TodayWidget
          title="Focus Time"
          value={todayData.focusTime}
          icon={Brain}
          accentColor="violet"
        />
        <TodayWidget
          title="Tasks"
          value={`${todayData.tasksCompleted}/${todayData.totalTasks}`}
          icon={CheckCircle2}
          accentColor="cyan"
          onClick={onOpenHabits}
        />
        <TodayWidget
          title="Portfolio"
          value={todayData.portfolioChange}
          icon={TrendingUp}
          trend="up"
          accentColor="gold"
        />
        <TodayWidget
          title="Wellness"
          value={`${todayData.wellnessScore}%`}
          icon={Heart}
          accentColor="rose"
        />
      </div>

      {/* Upcoming Event Preview */}
      <motion.button
        onClick={onOpenCalendar}
        className="w-full flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300"
        whileTap={{ scale: 0.98 }}
      >
        <Calendar className="h-5 w-5 text-primary" />
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-foreground">Next: {todayData.nextEvent}</p>
          <p className="text-xs text-muted-foreground">{todayData.nextEventTime}</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
          +{todayData.upcomingMeetings} more
        </span>
      </motion.button>

      {/* AI Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 p-3 rounded-xl bg-gradient-to-r from-secondary/10 to-primary/5 border border-secondary/20"
      >
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-secondary mt-0.5" />
          <div>
            <p className="text-sm text-foreground">
              {isMorning 
                ? "Your morning focus block starts in 30 minutes. Ready to review priorities?"
                : isEvening
                ? "Great work today! You've exceeded your focus goals. Time to wind down?"
                : "You have a 45-minute gap before your next meeting. Perfect for deep work."
              }
            </p>
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
}
