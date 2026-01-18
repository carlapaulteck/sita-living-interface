import { motion } from "framer-motion";
import { Wrench, Calendar, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";

interface MaintenanceTask {
  id: string;
  task: string;
  category: string;
  dueDate: string;
  status: "upcoming" | "due" | "overdue" | "completed";
  estimatedCost?: string;
}

const TASKS: MaintenanceTask[] = [
  { id: "1", task: "HVAC Filter Replacement", category: "HVAC", dueDate: "Next Week", status: "upcoming", estimatedCost: "$25" },
  { id: "2", task: "Gutter Cleaning", category: "Exterior", dueDate: "This Week", status: "due", estimatedCost: "$150" },
  { id: "3", task: "Smoke Detector Battery", category: "Safety", dueDate: "2 Days Ago", status: "overdue", estimatedCost: "$15" },
  { id: "4", task: "Water Heater Flush", category: "Plumbing", dueDate: "Last Month", status: "completed" },
];

const STATUS_CONFIG = {
  upcoming: { color: "text-muted-foreground", bg: "bg-muted/50", icon: Clock },
  due: { color: "text-amber-400", bg: "bg-amber-500/10", icon: AlertTriangle },
  overdue: { color: "text-rose-400", bg: "bg-rose-500/10", icon: AlertTriangle },
  completed: { color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
};

export function MaintenanceTracker() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard title="Upcoming" value="3" subtitle="This month" icon={Calendar} status="neutral" />
        <MetricSignalCard title="Due Now" value="1" subtitle="Needs attention" icon={AlertTriangle} status="warning" />
        <MetricSignalCard title="Overdue" value="1" subtitle="Urgent" icon={AlertTriangle} status="critical" />
        <MetricSignalCard title="Completed" value="8" subtitle="This year" icon={CheckCircle2} status="healthy" />
      </div>

      {/* Task List */}
      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-medium text-foreground">Maintenance Schedule</h3>
          <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors">
            Add Task
          </button>
        </div>

        <div className="space-y-3">
          {TASKS.map((task, index) => {
            const config = STATUS_CONFIG[task.status];
            const Icon = config.icon;
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl border ${config.bg} border-border/50`}
              >
                <div className={`p-2 rounded-lg ${config.bg}`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.task}
                  </p>
                  <p className="text-xs text-muted-foreground">{task.category} • {task.dueDate}</p>
                </div>
                {task.estimatedCost && task.status !== "completed" && (
                  <span className="text-sm text-muted-foreground">{task.estimatedCost}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* Vendor Contacts */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-lg font-display font-medium text-foreground mb-4">Trusted Vendors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "ABC Plumbing", service: "Plumbing", rating: 4.8 },
            { name: "Cool Air HVAC", service: "HVAC", rating: 4.9 },
            { name: "Green Lawn Care", service: "Landscaping", rating: 4.7 },
            { name: "Handy Home Repair", service: "General", rating: 4.6 },
          ].map((vendor, index) => (
            <motion.div
              key={vendor.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50"
            >
              <Wrench className="h-5 w-5 text-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{vendor.name}</p>
                <p className="text-xs text-muted-foreground">{vendor.service}</p>
              </div>
              <span className="text-sm text-primary">★ {vendor.rating}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
