import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Bot, Zap, Clock, CheckCircle2, AlertCircle, Pause } from "lucide-react";
import { motion } from "framer-motion";

const agents = [
  { 
    name: "Research Agent", 
    status: "active", 
    tasksCompleted: 47, 
    lastAction: "Analyzed competitor pricing",
    timeAgo: "2m ago"
  },
  { 
    name: "Email Agent", 
    status: "active", 
    tasksCompleted: 128, 
    lastAction: "Drafted response to vendor inquiry",
    timeAgo: "5m ago"
  },
  { 
    name: "Scheduling Agent", 
    status: "idle", 
    tasksCompleted: 34, 
    lastAction: "Rescheduled team standup",
    timeAgo: "1h ago"
  },
  { 
    name: "Finance Agent", 
    status: "active", 
    tasksCompleted: 89, 
    lastAction: "Reconciled monthly expenses",
    timeAgo: "15m ago"
  },
  { 
    name: "Health Agent", 
    status: "paused", 
    tasksCompleted: 23, 
    lastAction: "Reminded about medication",
    timeAgo: "3h ago"
  },
  { 
    name: "Content Agent", 
    status: "idle", 
    tasksCompleted: 56, 
    lastAction: "Generated weekly newsletter draft",
    timeAgo: "45m ago"
  },
];

const recentActions = [
  { agent: "Finance Agent", action: "Flagged unusual transaction", time: "Just now", priority: "high" },
  { agent: "Email Agent", action: "Auto-replied to 3 low-priority emails", time: "2m ago", priority: "low" },
  { agent: "Research Agent", action: "Completed market analysis report", time: "5m ago", priority: "medium" },
  { agent: "Scheduling Agent", action: "Blocked focus time on calendar", time: "10m ago", priority: "low" },
];

export function AgentDashboard() {
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalTasks = agents.reduce((acc, a) => acc + a.tasksCompleted, 0);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Active Agents"
          value={activeAgents.toString()}
          subtitle={`of ${agents.length} total`}
          icon={Bot}
          status="healthy"
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
          <button className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors flex items-center gap-1">
            <Pause className="h-3 w-3" />
            Pause All
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl ${
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
                    <p className="font-medium text-foreground text-sm">{agent.name}</p>
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
                <span className="text-lg font-bold text-foreground">{agent.tasksCompleted}</span>
              </div>
              <p className="text-xs text-muted-foreground">{agent.lastAction}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{agent.timeAgo}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Recent Actions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Agent Actions</h3>
        <div className="space-y-3">
          {recentActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  action.priority === 'high' ? 'bg-destructive/10' :
                  action.priority === 'medium' ? 'bg-primary/10' :
                  'bg-muted/30'
                }`}>
                  {action.priority === 'high' ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{action.action}</p>
                  <p className="text-xs text-muted-foreground">{action.agent}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{action.time}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
