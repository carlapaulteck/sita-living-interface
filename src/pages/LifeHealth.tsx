import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { GlassCard } from "@/components/GlassCard";
import { MetricRing } from "@/components/MetricRing";
import { lifeHealthData } from "@/lib/demoData";
import { 
  Moon, 
  Activity, 
  Apple, 
  Heart, 
  Battery,
  Droplets,
  Flame,
  Footprints,
  Zap,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "sleep", label: "Sleep" },
  { id: "fitness", label: "Fitness" },
  { id: "nutrition", label: "Nutrition" },
  { id: "vitals", label: "Vitals" },
  { id: "recovery", label: "Recovery" },
];

export default function LifeHealth() {
  const [activeTab, setActiveTab] = useState("overview");
  const data = lifeHealthData;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab data={data} />;
      case "sleep":
        return <SleepTab data={data.sleep} />;
      case "fitness":
        return <FitnessTab data={data.fitness} />;
      case "nutrition":
        return <NutritionTab data={data.nutrition} />;
      case "vitals":
        return <VitalsTab data={data.vitals} />;
      case "recovery":
        return <RecoveryTab data={data.recovery} />;
      default:
        return <OverviewTab data={data} />;
    }
  };

  return (
    <ModuleLayout
      title="Life & Health"
      subtitle="Your wellness dashboard"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </ModuleLayout>
  );
}

function OverviewTab({ data }: { data: typeof lifeHealthData }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Main Wellness Score */}
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-medium text-muted-foreground mb-6">Wellness Score</h3>
          <div className="flex items-center justify-center gap-8">
            <MetricRing
              label="Overall"
              value={`${data.overview.wellnessScore}%`}
              percentage={data.overview.wellnessScore}
              color="gold"
              size={140}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-6">You're performing above average today</p>
        </GlassCard>
      </div>

      {/* Quick Stats */}
      <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
        <StatCard
          icon={Moon}
          title="Sleep Quality"
          value={`${data.overview.sleepQuality}%`}
          subtitle="Excellent"
          color="cyan"
        />
        <StatCard
          icon={Zap}
          title="Energy Level"
          value={`${data.overview.energyLevel}%`}
          subtitle="Good"
          color="gold"
        />
        <StatCard
          icon={Heart}
          title="Heart Rate"
          value={`${data.vitals.heartRate}`}
          subtitle="BPM"
          color="cyan"
        />
        <StatCard
          icon={Activity}
          title="Stress Level"
          value={data.overview.stressLevel}
          subtitle="Keep it up"
          color="gold"
        />
      </div>

      {/* Today's Progress */}
      <div className="col-span-12 lg:col-span-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <Footprints className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Steps</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-display font-semibold text-foreground">
                {data.fitness.steps.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">/ {data.fitness.goal.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(data.fitness.steps / data.fitness.goal) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-secondary to-cyan-400"
              />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-secondary/10">
              <Droplets className="h-5 w-5 text-secondary" />
            </div>
            <h3 className="font-medium">Hydration</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-display font-semibold text-foreground">
                {data.nutrition.hydration}
              </span>
              <span className="text-sm text-muted-foreground">/ {data.nutrition.hydrationGoal}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-secondary to-cyan-400"
              />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Calories</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-display font-semibold text-foreground">
                {data.nutrition.caloriesConsumed.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">/ {data.nutrition.calorieGoal.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(data.nutrition.caloriesConsumed / data.nutrition.calorieGoal) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-yellow-400"
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function SleepTab({ data }: { data: typeof lifeHealthData.sleep }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          <MetricRing
            label="Sleep Quality"
            value={`${data.quality}%`}
            percentage={data.quality}
            color="cyan"
            size={160}
          />
          <p className="text-muted-foreground mt-6">Last night: {data.duration}</p>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
        <StatCard icon={Moon} title="REM Cycles" value={`${data.remCycles}`} subtitle="cycles" color="cyan" />
        <StatCard icon={Clock} title="Deep Sleep" value={data.deepSleep} subtitle="duration" color="gold" />
        <StatCard icon={Activity} title="Light Sleep" value={data.lightSleep} subtitle="duration" color="cyan" />
        <StatCard icon={Zap} title="Awake Time" value={data.awakeTime} subtitle="interruptions" color="gold" />
      </div>
    </div>
  );
}

function FitnessTab({ data }: { data: typeof lifeHealthData.fitness }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8">
        <GlassCard className="p-6">
          <h3 className="text-lg font-medium mb-6">Today's Activity</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <MetricRing
                label="Steps"
                value={data.steps.toLocaleString()}
                percentage={(data.steps / data.goal) * 100}
                color="cyan"
                size={100}
              />
            </div>
            <div className="text-center">
              <MetricRing
                label="Active Min"
                value={`${data.activeMinutes}`}
                percentage={(data.activeMinutes / 60) * 100}
                color="gold"
                size={100}
              />
            </div>
            <div className="text-center">
              <MetricRing
                label="Calories"
                value={data.caloriesBurned.toLocaleString()}
                percentage={(data.caloriesBurned / 2500) * 100}
                color="cyan"
                size={100}
              />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-4">
        <StatCard icon={Target} title="Workouts" value={`${data.workoutsThisWeek}`} subtitle="this week" color="gold" />
        <StatCard icon={Flame} title="Streak" value={`${data.streak}`} subtitle="days" color="cyan" />
      </div>
    </div>
  );
}

function NutritionTab({ data }: { data: typeof lifeHealthData.nutrition }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-medium mb-6">Macros Today</h3>
          <div className="space-y-4">
            <MacroBar label="Protein" value={data.protein} max={150} unit="g" color="bg-secondary" />
            <MacroBar label="Carbs" value={data.carbs} max={250} unit="g" color="bg-primary" />
            <MacroBar label="Fats" value={data.fats} max={80} unit="g" color="bg-cyan-400" />
          </div>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
        <StatCard icon={Flame} title="Calories" value={`${data.caloriesConsumed}`} subtitle={`/ ${data.calorieGoal}`} color="gold" />
        <StatCard icon={Droplets} title="Water" value={data.hydration} subtitle={`/ ${data.hydrationGoal}`} color="cyan" />
      </div>
    </div>
  );
}

function VitalsTab({ data }: { data: typeof lifeHealthData.vitals }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Heart} title="Heart Rate" value={`${data.heartRate}`} subtitle="BPM" color="cyan" />
      <StatCard icon={Activity} title="HRV" value={`${data.hrv}ms`} subtitle="Good" color="gold" />
      <StatCard icon={TrendingUp} title="Blood Pressure" value={data.bloodPressure} subtitle="mmHg" color="cyan" />
      <StatCard icon={Zap} title="SpO2" value={`${data.oxygenSaturation}%`} subtitle="Excellent" color="gold" />
    </div>
  );
}

function RecoveryTab({ data }: { data: typeof lifeHealthData.recovery }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          <MetricRing
            label="Recovery Score"
            value={`${data.score}%`}
            percentage={data.score}
            color="gold"
            size={160}
          />
          <p className="text-muted-foreground mt-6">{data.recommendation}</p>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
        <StatCard icon={Battery} title="Readiness" value={data.readiness} subtitle="status" color="gold" />
        <StatCard icon={Activity} title="Muscle" value={`${data.muscleRecovery}%`} subtitle="recovered" color="cyan" />
        <StatCard icon={Zap} title="Mental" value={`${data.mentalRecovery}%`} subtitle="recovered" color="gold" />
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

function MacroBar({ 
  label, 
  value, 
  max, 
  unit, 
  color 
}: { 
  label: string; 
  value: number; 
  max: number; 
  unit: string; 
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-medium">{value}{unit}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}
