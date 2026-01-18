import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CognitiveBudgetVisualization } from "@/components/CognitiveBudgetVisualization";
import { useAuth } from "@/hooks/useAuth";
import { useHabits } from "@/hooks/useHabits";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useCognitiveState } from "@/hooks/useCognitiveState";
import {
  Calendar,
  CheckCircle2,
  Target,
  Flame,
  Clock,
  ArrowRight,
  Sparkles,
  Heart,
  Brain,
  Zap,
  TrendingUp,
  Sunrise,
} from "lucide-react";

interface QuickActionProps {
  onOpenCalendar: () => void;
  onOpenHabits: () => void;
  onOpenNotifications: () => void;
  onOpenRecovery: () => void;
  onOpenWeeklyInsights: () => void;
  onOpenWakeUpReceipt?: () => void;
  onOpenCognitiveBudget?: () => void;
}

export function ClientDashboard({
  onOpenCalendar,
  onOpenHabits,
  onOpenNotifications,
  onOpenRecovery,
  onOpenWeeklyInsights,
  onOpenWakeUpReceipt,
  onOpenCognitiveBudget,
}: QuickActionProps) {
  const { user } = useAuth();
  const { habits, getTodayProgress, getStreak, isCompletedToday } = useHabits();
  const { events, getTodayEvents, getCurrentEventStatus } = useCalendarEvents();
  const cognitiveState = useCognitiveState();
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const todayEvents = getTodayEvents();
  const currentEventStatus = getCurrentEventStatus();
  const currentEvent = currentEventStatus.currentEvent;
  const todayProgress = getTodayProgress;
  const topHabits = habits.slice(0, 3);

  const quickActions = [
    {
      icon: Calendar,
      label: "Calendar",
      description: `${todayEvents.length} events today`,
      onClick: onOpenCalendar,
      color: "text-[#00FFFF]",
      bgColor: "bg-[#00FFFF]/10",
    },
    {
      icon: CheckCircle2,
      label: "Habits",
      description: `${todayProgress.completed}/${todayProgress.total} complete`,
      onClick: onOpenHabits,
      color: "text-[#9370DB]",
      bgColor: "bg-[#9370DB]/10",
    },
    {
      icon: TrendingUp,
      label: "Insights",
      description: "View your patterns",
      onClick: onOpenWeeklyInsights,
      color: "text-[#FFD700]",
      bgColor: "bg-[#FFD700]/10",
    },
    {
      icon: Heart,
      label: "Recovery",
      description: "Take a break",
      onClick: onOpenRecovery,
      color: "text-pink-400",
      bgColor: "bg-pink-400/10",
    },
    ...(onOpenWakeUpReceipt ? [{
      icon: Sunrise,
      label: "Wake-Up",
      description: "Morning receipt",
      onClick: onOpenWakeUpReceipt,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    }] : []),
    ...(onOpenCognitiveBudget ? [{
      icon: Brain,
      label: "Energy",
      description: "Cognitive budget",
      onClick: onOpenCognitiveBudget,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    }] : []),
  ];

  const getStateColor = () => {
    switch (cognitiveState?.state) {
      case "flow":
        return "text-green-400";
      case "hyperfocus":
        return "text-[#00FFFF]";
      case "fatigued":
        return "text-yellow-400";
      case "overload":
        return "text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-display font-medium text-foreground">
          {greeting}
          {user?.user_metadata?.name && (
            <span className="text-primary">, {user.user_metadata.name}</span>
          )}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {cognitiveState?.state && cognitiveState.state !== "neutral" ? (
            <span className="flex items-center justify-center gap-2">
              <Brain className={`h-4 w-4 ${getStateColor()}`} />
              <span>
                Cognitive state:{" "}
                <span className={getStateColor()}>
                  {cognitiveState.state.charAt(0).toUpperCase() +
                    cognitiveState.state.slice(1)}
                </span>
              </span>
            </span>
          ) : (
            "Ready to start your day"
          )}
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={action.onClick}
              className="w-full p-4 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-primary/30 transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center mx-auto mb-2`}
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <p className="text-sm font-medium text-foreground">
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {action.description}
              </p>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Habits */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Today's Habits
            </h3>
            <Button variant="ghost" size="sm" onClick={onOpenHabits}>
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          {habits.length === 0 ? (
            <div className="text-center py-6">
              <Sparkles className="h-8 w-8 text-primary/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No habits yet. Start tracking!
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={onOpenHabits}
              >
                Add First Habit
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {topHabits.map((habit) => {
                const completed = isCompletedToday(habit.id);
                const streak = getStreak(habit.id);
                return (
                  <div
                    key={habit.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      completed ? "bg-primary/10" : "bg-foreground/5"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/10"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {habit.name}
                      </p>
                      {streak > 0 && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-400" />
                          {streak} day streak
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Daily Progress</span>
                  <span className="text-primary">{todayProgress.percentage}%</span>
                </div>
                <Progress value={todayProgress.percentage} className="h-2" />
              </div>
            </div>
          )}
        </GlassCard>

        {/* Today's Schedule */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#00FFFF]" />
              Today's Schedule
            </h3>
            <Button variant="ghost" size="sm" onClick={onOpenCalendar}>
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          {todayEvents.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 text-[#00FFFF]/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No events scheduled for today
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={onOpenCalendar}
              >
                Add Event
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentEvent && (
                <div className="p-3 rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-3 w-3 text-[#00FFFF]" />
                    <span className="text-xs text-[#00FFFF]">Happening Now</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {currentEvent.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(currentEvent.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(currentEvent.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}

              {todayEvents
                .filter((e) => e.id !== currentEvent?.id)
                .slice(0, 3)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-foreground/5"
                  >
                    <div className="w-1 h-10 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Cognitive Budget Visualization */}
      <CognitiveBudgetVisualization compact />
    </div>
  );
}
