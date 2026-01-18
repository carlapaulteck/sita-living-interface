import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Bot, Zap, Clock, CheckCircle2, AlertCircle, Pause, Play, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgents } from "@/hooks/useAgents";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function AgentDashboard() {
  const { 
    agents, 
    activities, 
    isLoading, 
    toggleAgentStatus, 
    pauseAllAgents, 
    resumeAllAgents 
  } = useAgents();

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalTasks = agents.reduce((acc, a) => acc + a.tasks_completed, 0);
  const allPaused = agents.length > 0 && agents.every(a => a.status === 'paused');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Active Agents"
          value={activeAgents.toString()}
          subtitle={`of ${agents.length} total`}
          icon={Bot}
          status={activeAgents > 0 ? "healthy" : "warning"}
        />
        <MetricSignalCard
          title="Tasks Today"
          value={totalTasks.toString()}
          subtitle="Completed autonomously"
          icon={CheckCircle2}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="Time Saved"
          value="4.2 hrs"
          subtitle="This week"
          icon={Clock}
          status="healthy"
        />
        <MetricSignalCard
          title="Efficiency"
          value="94%"
          subtitle="Success rate"
          icon={Zap}
          status="healthy"
          trend="up"
        />
      </div>

      {/* Agent Grid */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Your AI Agents</h3>
          <Button
            onClick={allPaused ? resumeAllAgents : pauseAllAgents}
            variant={allPaused ? "default" : "destructive"}
            size="sm"
            className="flex items-center gap-1"
          >
            {allPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            {allPaused ? "Resume All" : "Pause All"}
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl transition-colors ${
                  agent.status === 'active' ? 'bg-secondary/5 border border-secondary/20' :
                  agent.status === 'paused' ? 'bg-destructive/5 border border-destructive/20' :
                  'bg-muted/20 border border-border/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${
                      agent.status === 'active' ? 'bg-secondary/10' :
                      agent.status === 'paused' ? 'bg-destructive/10' :
                      'bg-muted/30'
                    }`}>
                      <Bot className={`h-4 w-4 ${
                        agent.status === 'active' ? 'text-secondary' :
                        agent.status === 'paused' ? 'text-destructive' :
                        'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{agent.agent_name}</p>
                      <div className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          agent.status === 'active' ? 'bg-secondary animate-pulse' :
                          agent.status === 'paused' ? 'bg-destructive' :
                          'bg-muted-foreground'
                        }`} />
                        <span className="text-xs text-muted-foreground capitalize">{agent.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">{agent.tasks_completed}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleAgentStatus(agent.id, agent.status)}
                    >
                      {agent.status === 'paused' ? (
                        <Play className="h-4 w-4 text-secondary" />
                      ) : (
                        <Pause className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{agent.last_action || "No recent activity"}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {agent.last_action_at 
                    ? formatDistanceToNow(new Date(agent.last_action_at), { addSuffix: true })
                    : "Never"
                  }
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </GlassCard>

      {/* Real-time Activity Feed */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Live Activity Feed</h3>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          <AnimatePresence initial={false}>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No agent activity yet</p>
                <p className="text-xs opacity-70">Agent actions will appear here in real-time</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      activity.priority === 'high' ? 'bg-destructive/10' :
                      activity.priority === 'medium' ? 'bg-primary/10' :
                      'bg-muted/30'
                    }`}>
                      {activity.priority === 'high' ? (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.agent_name}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </div>
  );
}
