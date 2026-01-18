import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Brain, Smile, Moon, Activity, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const moodData = [
  { day: "Mon", mood: 7, energy: 6, stress: 4 },
  { day: "Tue", mood: 6, energy: 5, stress: 5 },
  { day: "Wed", mood: 8, energy: 7, stress: 3 },
  { day: "Thu", mood: 7, energy: 6, stress: 4 },
  { day: "Fri", mood: 8, energy: 8, stress: 2 },
  { day: "Sat", mood: 9, energy: 8, stress: 2 },
  { day: "Sun", mood: 8, energy: 7, stress: 3 },
];

const wellnessActivities = [
  { name: "Meditation", streak: 12, target: 15, icon: Sparkles, lastActivity: "Today" },
  { name: "Journaling", streak: 5, target: 7, icon: Heart, lastActivity: "Yesterday" },
  { name: "Exercise", streak: 8, target: 7, icon: Activity, lastActivity: "Today" },
  { name: "Sleep 7+ hrs", streak: 4, target: 7, icon: Moon, lastActivity: "Last night" },
];

const insights = [
  { type: "positive", message: "Your mood has improved 15% this week" },
  { type: "tip", message: "Morning meditation correlates with higher energy levels" },
  { type: "reminder", message: "Consider a screen break - high usage detected today" },
];

export function MentalWellness() {
  const avgMood = Math.round(moodData.reduce((a, b) => a + b.mood, 0) / moodData.length);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Weekly Mood"
          value={`${avgMood}/10`}
          subtitle="Above average"
          icon={Smile}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="Stress Level"
          value="Low"
          subtitle="Well managed"
          icon={Brain}
          status="healthy"
        />
        <MetricSignalCard
          title="Meditation Streak"
          value="12 days"
          subtitle="Personal best!"
          icon={Sparkles}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="Sleep Quality"
          value="Good"
          subtitle="7.2 hrs avg"
          icon={Moon}
          status="neutral"
        />
      </div>

      {/* Mood Chart */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Wellness Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="mood" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="Mood" />
              <Line type="monotone" dataKey="energy" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37' }} name="Energy" />
              <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} name="Stress" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-xs text-muted-foreground">Mood</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Energy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">Stress</span>
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Wellness Activities */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Wellness Habits</h3>
          <div className="space-y-4">
            {wellnessActivities.map((activity, index) => {
              const Icon = activity.icon;
              const progress = (activity.streak / activity.target) * 100;
              return (
                <motion.div
                  key={activity.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-muted/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{activity.name}</p>
                        <p className="text-xs text-muted-foreground">{activity.lastActivity}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-foreground">{activity.streak}🔥</span>
                  </div>
                  <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{activity.streak} of {activity.target} day goal</p>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* AI Insights */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Wellness Insights</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${
                  insight.type === 'positive' ? 'bg-secondary/10 border border-secondary/20' :
                  insight.type === 'tip' ? 'bg-primary/10 border border-primary/20' :
                  'bg-muted/20'
                }`}
              >
                <p className="text-sm text-foreground">{insight.message}</p>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium">
            Log Today's Mood
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
