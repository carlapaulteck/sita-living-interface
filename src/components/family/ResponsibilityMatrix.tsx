import { motion } from "framer-motion";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

interface Responsibility {
  id: string;
  task: string;
  assignee: string;
  status: "done" | "pending" | "overdue";
  dueDate: string;
}

const RESPONSIBILITIES: Responsibility[] = [
  { id: "1", task: "Grocery Shopping", assignee: "Partner", status: "done", dueDate: "Today" },
  { id: "2", task: "Help with Homework", assignee: "You", status: "pending", dueDate: "Today" },
  { id: "3", task: "Soccer Carpool", assignee: "Partner", status: "pending", dueDate: "Tomorrow" },
  { id: "4", task: "Clean Room", assignee: "Alex Jr.", status: "overdue", dueDate: "Yesterday" },
  { id: "5", task: "Pack Lunch", assignee: "You", status: "done", dueDate: "Today" },
];

const STATUS_CONFIG = {
  done: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  pending: { icon: Circle, color: "text-amber-400", bg: "bg-amber-500/10" },
  overdue: { icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-500/10" },
};

export function ResponsibilityMatrix() {
  const groupedByAssignee = RESPONSIBILITIES.reduce((acc, resp) => {
    if (!acc[resp.assignee]) acc[resp.assignee] = [];
    acc[resp.assignee].push(resp);
    return acc;
  }, {} as Record<string, Responsibility[]>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {["done", "pending", "overdue"].map((status) => {
          const count = RESPONSIBILITIES.filter(r => r.status === status).length;
          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
          return (
            <GlassCard key={status} className="p-4" hover={false}>
              <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg ${config.bg}`}>
                <config.icon className={`h-4 w-4 ${config.color}`} />
                <span className={`text-sm font-medium ${config.color} capitalize`}>{status}</span>
              </div>
              <p className="text-2xl font-display font-semibold text-foreground mt-2">{count}</p>
            </GlassCard>
          );
        })}
      </div>

      {/* Responsibilities by Person */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groupedByAssignee).map(([assignee, tasks], groupIndex) => (
          <GlassCard key={assignee} className="p-6" hover={false}>
            <h3 className="text-lg font-display font-medium text-foreground mb-4">{assignee}</h3>
            <div className="space-y-2">
              {tasks.map((task, index) => {
                const config = STATUS_CONFIG[task.status];
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50"
                  >
                    <config.icon className={`h-5 w-5 ${config.color}`} />
                    <div className="flex-1">
                      <p className={`text-sm ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {task.task}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
