import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { GlassCard } from "@/components/GlassCard";
import { MetricRing } from "@/components/MetricRing";
import { mindGrowthData } from "@/lib/demoData";
import { 
  Brain, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles,
  Clock,
  Flame,
  TrendingUp,
  Zap,
  Circle
} from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "focus", label: "Focus" },
  { id: "learning", label: "Learning" },
  { id: "habits", label: "Habits" },
  { id: "creativity", label: "Creativity" },
  { id: "mindfulness", label: "Mindfulness" },
];

export default function MindGrowth() {
  const [activeTab, setActiveTab] = useState("overview");
  const data = mindGrowthData;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab data={data} />;
      case "focus":
        return <FocusTab data={data.focus} />;
      case "learning":
        return <LearningTab data={data.learning} />;
      case "habits":
        return <HabitsTab data={data.habits} />;
      case "creativity":
        return <CreativityTab data={data.creativity} />;
      case "mindfulness":
        return <MindfulnessTab data={data.mindfulness} />;
      default:
        return <OverviewTab data={data} />;
    }
  };

  return (
    <ModuleLayout
      title="Mind & Growth"
      subtitle="Cognitive performance & personal development"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </ModuleLayout>
  );
}

function OverviewTab({ data }: { data: typeof mindGrowthData }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Focus Score */}
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-medium text-muted-foreground mb-6">Focus Score</h3>
          <div className="flex items-center justify-center gap-8">
            <MetricRing
              label="Focus"
              value={`${data.overview.focusScore}%`}
              percentage={data.overview.focusScore}
              color="cyan"
              size={140}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-6">Deep work: {data.focus.deepWorkToday} today</p>
        </GlassCard>
      </div>

      {/* Quick Stats */}
      <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
        <StatCard
          icon={Flame}
          title="Learning Streak"
          value={`${data.overview.learningStreak}`}
          subtitle="days"
          color="gold"
        />
        <StatCard
          icon={CheckCircle2}
          title="Habits"
          value={`${data.overview.habitsCompleted}/${data.overview.habitsTotal}`}
          subtitle="completed"
          color="cyan"
        />
        <StatCard
          icon={Lightbulb}
          title="Creativity"
          value={`${data.overview.creativityIndex}%`}
          subtitle="index"
          color="gold"
        />
        <StatCard
          icon={Sparkles}
          title="Meditation"
          value={`${data.mindfulness.meditationToday}`}
          subtitle="min today"
          color="cyan"
        />
      </div>

      {/* Current Focus Windows */}
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-secondary/10">
              <Clock className="h-5 w-5 text-secondary" />
            </div>
            <h3 className="font-medium">Today's Focus Windows</h3>
          </div>
          <div className="space-y-3">
            {data.focus.focusWindows.map((window, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">{window.time}</p>
                  <p className="text-sm text-muted-foreground">{window.duration}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  window.quality === "High" 
                    ? "bg-secondary/20 text-secondary" 
                    : "bg-primary/20 text-primary"
                }`}>
                  {window.quality}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Active Learning */}
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Active Learning</h3>
          </div>
          <div className="space-y-3">
            {data.learning.currentCourses.map((course, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{course.name}</span>
                  <span className="text-xs text-muted-foreground">{course.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: i * 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-yellow-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function FocusTab({ data }: { data: typeof mindGrowthData.focus }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-medium text-muted-foreground mb-6">Deep Work Today</h3>
          <span className="text-5xl font-display font-bold text-foreground">{data.deepWorkToday}</span>
          <p className="text-sm text-muted-foreground mt-4">Average session: {data.avgFocusSession}</p>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
        <StatCard icon={Target} title="Focus Windows" value={`${data.focusWindows.length}`} subtitle="completed" color="cyan" />
        <StatCard icon={Zap} title="Distractions" value={`${data.distractions}`} subtitle="today" color="gold" />
      </div>

      <div className="col-span-12">
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Focus Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.focusWindows.map((window, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">{window.time}</p>
                  <p className="text-sm text-muted-foreground">{window.duration}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  window.quality === "High" 
                    ? "bg-secondary/20 text-secondary" 
                    : "bg-primary/20 text-primary"
                }`}>
                  {window.quality} Quality
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function LearningTab({ data }: { data: typeof mindGrowthData.learning }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8">
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Active Courses</h3>
          <div className="space-y-4">
            {data.currentCourses.map((course, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{course.name}</span>
                  <span className="text-sm text-muted-foreground">{course.hoursLeft}h left</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-secondary to-cyan-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-4">
        <StatCard icon={Flame} title="Streak" value={`${data.streak}`} subtitle="days" color="gold" />
        <StatCard icon={TrendingUp} title="Skills Gained" value={`${data.skillsGained}`} subtitle="this month" color="cyan" />
      </div>

      <div className="col-span-12">
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Reading List</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.booksReading.map((book, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                <div className="w-10 h-14 rounded bg-primary/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{book.title}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${book.progress}%` }} />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{book.progress}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function HabitsTab({ data }: { data: typeof mindGrowthData.habits }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8">
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Today's Habits</h3>
          <div className="space-y-3">
            {data.today.map((habit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  habit.completed ? "bg-secondary/10" : "bg-muted/30"
                }`}
              >
                {habit.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className={`flex-1 ${habit.completed ? "text-foreground" : "text-muted-foreground"}`}>
                  {habit.name}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-4">
        <GlassCard className="p-6">
          <MetricRing
            label="Weekly"
            value={`${data.weeklyCompletion}%`}
            percentage={data.weeklyCompletion}
            color="gold"
            size={100}
          />
        </GlassCard>
        <StatCard icon={Flame} title="Longest Streak" value={`${data.longestStreak}`} subtitle="days" color="gold" />
      </div>
    </div>
  );
}

function CreativityTab({ data }: { data: typeof mindGrowthData.creativity }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Lightbulb} title="Active Projects" value={`${data.projectsActive}`} subtitle="in progress" color="gold" />
      <StatCard icon={Sparkles} title="Ideas Captured" value={`${data.ideasCaptured}`} subtitle="this week" color="cyan" />
      <StatCard icon={TrendingUp} title="Content Created" value={`${data.contentCreated}`} subtitle="pieces" color="gold" />
      <StatCard icon={Clock} title="Peak Time" value={data.creativityPeakTime} subtitle="creative hours" color="cyan" />
    </div>
  );
}

function MindfulnessTab({ data }: { data: typeof mindGrowthData.mindfulness }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          <MetricRing
            label="Today"
            value={`${data.meditationToday} min`}
            percentage={(data.meditationToday / 30) * 100}
            color="cyan"
            size={140}
          />
          <p className="text-sm text-muted-foreground mt-6">Streak: {data.meditationStreak} days</p>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
        <StatCard icon={Clock} title="Total Time" value={`${data.totalMinutes}`} subtitle="minutes" color="gold" />
        <StatCard icon={Flame} title="Streak" value={`${data.meditationStreak}`} subtitle="days" color="cyan" />
        <StatCard icon={Brain} title="Stress" value={data.stressLevel} subtitle="level" color="gold" />
        <StatCard icon={TrendingUp} title="Mood" value={data.moodTrend} subtitle="trend" color="cyan" />
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: any; 
  title: string; 
  value: string; 
  subtitle: string; 
  color: "cyan" | "gold";
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl ${color === "cyan" ? "bg-secondary/10" : "bg-primary/10"}`}>
          <Icon className={`h-4 w-4 ${color === "cyan" ? "text-secondary" : "text-primary"}`} />
        </div>
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-display font-semibold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </GlassCard>
  );
}
