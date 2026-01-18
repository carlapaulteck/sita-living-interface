import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Scenario } from "@/lib/scenarioData";
import {
  Activity,
  Clock,
  Users,
  TrendingDown,
  Check,
  AlertCircle,
  Gauge,
  Package,
  Wallet,
  Calendar,
  ChevronRight,
} from "lucide-react";

interface OperationsDashboardProps {
  scenario: Scenario;
}

interface OperationsCard {
  id: string;
  title: string;
  icon: any;
  status: "balanced" | "optimal" | "attention" | "critical";
  statusLabel: string;
  description: string;
  metric?: string;
  trend?: "up" | "down" | "stable";
}

export function OperationsDashboard({ scenario }: OperationsDashboardProps) {
  const { metrics, businessProfile } = scenario;
  
  // Calculate capacity
  const capacityUsed = businessProfile.capacity 
    ? Math.round((businessProfile.capacity.usedSlots / businessProfile.capacity.weeklySlots) * 100)
    : businessProfile.footTraffic
    ? Math.round((businessProfile.footTraffic.today / businessProfile.footTraffic.baseline) * 100)
    : 75;

  const getCapacityStatus = () => {
    if (capacityUsed < 60) return "balanced";
    if (capacityUsed < 85) return "optimal";
    if (capacityUsed < 95) return "attention";
    return "critical";
  };

  const cards: OperationsCard[] = [
    {
      id: "capacity",
      title: "Capacity",
      icon: Gauge,
      status: getCapacityStatus(),
      statusLabel: capacityUsed < 85 ? "Balanced" : "Near limit",
      description: capacityUsed < 85 
        ? "Safe headroom for growth"
        : "Consider adding capacity",
      metric: `${capacityUsed}%`,
      trend: capacityUsed < 85 ? "stable" : "up",
    },
    {
      id: "delivery",
      title: "Delivery Health",
      icon: Package,
      status: "optimal",
      statusLabel: "On time",
      description: "All commitments tracking on schedule",
      metric: "98%",
      trend: "stable",
    },
    {
      id: "team",
      title: "Team Load",
      icon: Users,
      status: metrics.autonomy > 0.7 ? "optimal" : "balanced",
      statusLabel: metrics.autonomy > 0.7 ? "Sustainable" : "Manageable",
      description: `${Math.round(metrics.timeSavedHoursWeek)}h automated this week`,
      metric: `${Math.round(metrics.autonomy * 100)}%`,
      trend: "up",
    },
    {
      id: "costs",
      title: "Cost Reduction",
      icon: TrendingDown,
      status: "balanced",
      statusLabel: "2 savings identified",
      description: "Automation reducing overhead",
      metric: "$420",
      trend: "down",
    },
  ];

  const getStatusColor = (status: OperationsCard["status"]) => {
    switch (status) {
      case "optimal": return "bg-secondary/20 text-secondary";
      case "balanced": return "bg-primary/20 text-primary";
      case "attention": return "bg-accent/20 text-accent";
      case "critical": return "bg-destructive/20 text-destructive";
    }
  };

  const getStatusIcon = (status: OperationsCard["status"]) => {
    switch (status) {
      case "optimal": return <Check className="h-3 w-3" />;
      case "balanced": return <Activity className="h-3 w-3" />;
      case "attention": return <AlertCircle className="h-3 w-3" />;
      case "critical": return <AlertCircle className="h-3 w-3" />;
    }
  };

  const upcomingTasks = [
    { id: 1, title: "Review weekly metrics", time: "2:00 PM", type: "review" },
    { id: 2, title: "Team sync call", time: "3:30 PM", type: "meeting" },
    { id: 3, title: "Approve budget allocation", time: "Tomorrow", type: "approval" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-display font-medium text-foreground">Operations</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Capacity, delivery, and team health.
        </p>
      </div>

      {/* Operations Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-5 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-foreground/5">
                  <card.icon className="h-5 w-5 text-foreground" />
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getStatusColor(card.status)}`}
                >
                  {getStatusIcon(card.status)}
                  <span className="ml-1">{card.statusLabel}</span>
                </Badge>
              </div>

              <h3 className="font-medium text-sm text-foreground mb-1">{card.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{card.description}</p>

              {card.metric && (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-display font-semibold text-foreground">
                    {card.metric}
                  </span>
                  {card.trend && (
                    <span className={`text-xs ${
                      card.trend === "up" ? "text-secondary" :
                      card.trend === "down" ? "text-primary" :
                      "text-muted-foreground"
                    }`}>
                      {card.trend === "up" ? "↑" : card.trend === "down" ? "↓" : "→"}
                    </span>
                  )}
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Capacity Visualization */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Capacity Overview</h3>
          <Badge variant="secondary" className={getStatusColor(getCapacityStatus())}>
            {capacityUsed}% utilized
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Capacity Bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Utilized</span>
              <span>Available</span>
            </div>
            <div className="h-4 bg-foreground/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${capacityUsed}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  capacityUsed < 60 ? "bg-primary" :
                  capacityUsed < 85 ? "bg-secondary" :
                  capacityUsed < 95 ? "bg-accent" :
                  "bg-destructive"
                }`}
              />
            </div>
          </div>

          {/* Capacity Details */}
          {businessProfile.capacity && (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-foreground/5 text-center">
                <p className="text-xs text-muted-foreground">Weekly Slots</p>
                <p className="text-lg font-semibold text-foreground">
                  {businessProfile.capacity.weeklySlots}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-foreground/5 text-center">
                <p className="text-xs text-muted-foreground">Used</p>
                <p className="text-lg font-semibold text-foreground">
                  {businessProfile.capacity.usedSlots}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-foreground/5 text-center">
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-lg font-semibold text-secondary">
                  {businessProfile.capacity.weeklySlots - businessProfile.capacity.usedSlots}
                </p>
              </div>
            </div>
          )}

          {businessProfile.footTraffic && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-foreground/5 text-center">
                <p className="text-xs text-muted-foreground">Today's Traffic</p>
                <p className="text-lg font-semibold text-foreground">
                  {businessProfile.footTraffic.today}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-foreground/5 text-center">
                <p className="text-xs text-muted-foreground">Baseline</p>
                <p className="text-lg font-semibold text-muted-foreground">
                  {businessProfile.footTraffic.baseline}
                </p>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Upcoming Tasks */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming
          </h3>
        </div>

        <div className="space-y-2">
          {upcomingTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  task.type === "approval" ? "bg-primary" :
                  task.type === "meeting" ? "bg-secondary" :
                  "bg-muted-foreground"
                }`} />
                <span className="text-sm text-foreground">{task.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{task.time}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Automation Savings */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Automation Impact</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-foreground/5 text-center">
            <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-semibold text-foreground">
              {metrics.timeSavedHoursWeek}h
            </p>
            <p className="text-xs text-muted-foreground">Time saved</p>
          </div>
          <div className="p-4 rounded-xl bg-foreground/5 text-center">
            <Wallet className="h-5 w-5 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-display font-semibold text-foreground">
              ${Math.round(metrics.timeSavedHoursWeek * 50)}
            </p>
            <p className="text-xs text-muted-foreground">Value of time</p>
          </div>
          <div className="p-4 rounded-xl bg-foreground/5 text-center">
            <Activity className="h-5 w-5 text-accent mx-auto mb-2" />
            <p className="text-2xl font-display font-semibold text-foreground">
              {Math.round(metrics.autonomy * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">Autonomous</p>
          </div>
          <div className="p-4 rounded-xl bg-foreground/5 text-center">
            <TrendingDown className="h-5 w-5 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-display font-semibold text-foreground">
              -23%
            </p>
            <p className="text-xs text-muted-foreground">Overhead reduction</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
