import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Play,
  Pause,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Timer,
  TrendingUp
} from "lucide-react";
import { agentService, type TaskRecord, type Agent } from "@/services/agent.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export function AgentTaskMonitor() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const { data: tasks = [], isLoading: tasksLoading, refetch } = useQuery({
    queryKey: ["agent-tasks", statusFilter],
    queryFn: async () => {
      const allTasks = await agentService.getTasks();
      return statusFilter === "all" ? allTasks : allTasks.filter(t => t.status === statusFilter);
    },
    refetchInterval: 5000,
  });

  const { data: agents = [] } = useQuery({
    queryKey: ["ai-agents"],
    queryFn: () => agentService.getAgents(),
  });

  const retryMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error("Task not found");
      return agentService.queueTask({ 
        task_type: task.task_type,
        input_data: task.input_data as Record<string, unknown>,
        agent_id: task.agent_id || undefined,
        priority: task.priority || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-tasks"] });
      toast.success("Task queued for retry");
    },
    onError: (error: Error) => {
      toast.error(`Failed to retry task: ${error.message}`);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (taskId: string) => agentService.cancelTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-tasks"] });
      toast.success("Task cancelled");
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4 text-secondary" />;
      case "failed": return <XCircle className="h-4 w-4 text-destructive" />;
      case "running": return <RefreshCw className="h-4 w-4 text-primary animate-spin" />;
      case "pending": return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-secondary/20 text-secondary border-secondary/30">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "running":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Running</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAgentName = (agentId: string | null) => {
    if (!agentId) return "Unassigned";
    const agent = agents.find(a => a.id === agentId);
    return agent?.display_name || "Unknown Agent";
  };

  // Stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    failed: tasks.filter(t => t.status === "failed").length,
    running: tasks.filter(t => t.status === "running").length,
    pending: tasks.filter(t => t.status === "pending").length,
  };

  const successRate = stats.total > 0 
    ? Math.round((stats.completed / (stats.completed + stats.failed)) * 100) || 0
    : 0;

  if (tasksLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Zap className="h-4 w-4" />
            <span className="text-sm">Total Tasks</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">Completed</span>
          </div>
          <p className="text-2xl font-bold text-secondary">{stats.completed}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm">Running</span>
          </div>
          <p className="text-2xl font-bold text-primary">{stats.running}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-destructive mb-1">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Failed</span>
          </div>
          <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Success Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-foreground">{successRate}%</p>
            <Progress value={successRate} className="flex-1 h-2" />
          </div>
        </GlassCard>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Task Queue</h2>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-foreground font-medium">No tasks found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Agent tasks will appear here when created
              </p>
            </GlassCard>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.02 }}
              >
                <GlassCard className="p-4">
                  <div 
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 mt-0.5">
                        {getStatusIcon(task.status || "pending")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{task.task_type}</p>
                          {getStatusBadge(task.status || "pending")}
                          {task.priority && task.priority > 5 && (
                            <Badge variant="outline" className="text-xs">
                              Priority: {task.priority}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Bot className="h-3 w-3" />
                            {getAgentName(task.agent_id)}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {formatDistanceToNow(new Date(task.created_at || ""), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.retry_count && task.retry_count > 0 && (
                        <Badge variant="outline" className="text-xs">
                          Retry: {task.retry_count}/{task.max_retries || 3}
                        </Badge>
                      )}
                      {expandedTask === task.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedTask === task.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border/50"
                      >
                        <div className="grid gap-4">
                          {/* Input Data */}
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Input Data</p>
                            <pre className="text-xs bg-muted/20 p-3 rounded-lg overflow-x-auto">
                              {JSON.stringify(task.input_data, null, 2)}
                            </pre>
                          </div>

                          {/* Output Data */}
                          {task.output_data && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Output Data</p>
                              <pre className="text-xs bg-secondary/10 p-3 rounded-lg overflow-x-auto">
                                {JSON.stringify(task.output_data, null, 2)}
                              </pre>
                            </div>
                          )}

                          {/* Error */}
                          {task.error_message && (
                            <div>
                              <p className="text-xs font-medium text-destructive mb-1">Error</p>
                              <pre className="text-xs bg-destructive/10 p-3 rounded-lg overflow-x-auto text-destructive">
                                {task.error_message}
                              </pre>
                            </div>
                          )}

                          {/* Timestamps */}
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div>
                              <p className="text-muted-foreground">Created</p>
                              <p className="text-foreground">
                                {task.created_at ? format(new Date(task.created_at), "PPp") : "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Started</p>
                              <p className="text-foreground">
                                {task.started_at ? format(new Date(task.started_at), "PPp") : "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Completed</p>
                              <p className="text-foreground">
                                {task.completed_at ? format(new Date(task.completed_at), "PPp") : "-"}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            {task.status === "failed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  retryMutation.mutate(task.id);
                                }}
                                disabled={retryMutation.isPending}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Retry
                              </Button>
                            )}
                            {(task.status === "pending" || task.status === "running") && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cancelMutation.mutate(task.id);
                                }}
                              >
                                <Pause className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
