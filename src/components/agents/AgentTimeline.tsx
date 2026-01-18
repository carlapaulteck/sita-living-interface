import { GlassCard } from "@/components/GlassCard";
import { Bot, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const timelineEvents = [
  { time: "9:45 AM", agent: "Email Agent", action: "Processed 12 new emails, flagged 2 as urgent", type: "success" },
  { time: "9:30 AM", agent: "Finance Agent", action: "Detected unusual charge of $450 on business card", type: "alert" },
  { time: "9:15 AM", agent: "Scheduling Agent", action: "Automatically rescheduled conflicting meetings", type: "success" },
  { time: "9:00 AM", agent: "Research Agent", action: "Completed daily market analysis report", type: "success" },
  { time: "8:45 AM", agent: "Content Agent", action: "Generated morning briefing summary", type: "success" },
  { time: "8:30 AM", agent: "Health Agent", action: "Sent medication reminder notification", type: "info" },
  { time: "8:00 AM", agent: "Scheduling Agent", action: "Blocked 2-hour focus time on calendar", type: "success" },
  { time: "7:30 AM", agent: "Email Agent", action: "Sent 3 auto-replies to known senders", type: "success" },
];

const stats = {
  today: { tasks: 47, success: 45, alerts: 2 },
  week: { tasks: 312, success: 298, alerts: 14 },
};

export function AgentTimeline() {
  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.today.tasks}</p>
          <p className="text-xs text-muted-foreground">Tasks Today</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-secondary">{stats.today.success}</p>
          <p className="text-xs text-muted-foreground">Successful</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{stats.today.alerts}</p>
          <p className="text-xs text-muted-foreground">Alerts</p>
        </GlassCard>
      </div>

      {/* Timeline */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Today's Activity</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-border/50" />
          
          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 relative"
              >
                <div className={`relative z-10 p-2 rounded-full ${
                  event.type === 'success' ? 'bg-secondary/10' :
                  event.type === 'alert' ? 'bg-destructive/10' :
                  'bg-primary/10'
                }`}>
                  {event.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                  ) : event.type === 'alert' ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <Clock className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-xs font-medium text-primary">{event.agent}</span>
                  </div>
                  <p className={`text-sm ${event.type === 'alert' ? 'text-destructive' : 'text-foreground'}`}>
                    {event.action}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Weekly Summary */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-foreground">{stats.week.tasks}</p>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-secondary">{Math.round((stats.week.success / stats.week.tasks) * 100)}%</p>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">~18 hrs</p>
            <p className="text-sm text-muted-foreground">Time Saved</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
