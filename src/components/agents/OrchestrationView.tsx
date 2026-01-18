import { GlassCard } from "@/components/GlassCard";
import { Bot, ArrowRight, CheckCircle2, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

const orchestrationFlows = [
  {
    id: 1,
    name: "Morning Briefing",
    status: "completed",
    steps: [
      { agent: "Email Agent", action: "Scan inbox", status: "completed" },
      { agent: "Scheduling Agent", action: "Check calendar", status: "completed" },
      { agent: "Research Agent", action: "Gather news", status: "completed" },
      { agent: "Content Agent", action: "Generate summary", status: "completed" },
    ]
  },
  {
    id: 2,
    name: "Expense Report",
    status: "in_progress",
    steps: [
      { agent: "Finance Agent", action: "Collect receipts", status: "completed" },
      { agent: "Finance Agent", action: "Categorize expenses", status: "in_progress" },
      { agent: "Email Agent", action: "Send for approval", status: "pending" },
    ]
  },
  {
    id: 3,
    name: "Client Proposal",
    status: "queued",
    steps: [
      { agent: "Research Agent", action: "Analyze client needs", status: "pending" },
      { agent: "Content Agent", action: "Draft proposal", status: "pending" },
      { agent: "Email Agent", action: "Send for review", status: "pending" },
    ]
  },
];

const agentCapabilities = [
  { agent: "Research Agent", skills: ["Web search", "Data analysis", "Report generation", "Competitor monitoring"] },
  { agent: "Email Agent", skills: ["Inbox management", "Auto-replies", "Priority filtering", "Draft composition"] },
  { agent: "Scheduling Agent", skills: ["Calendar management", "Meeting scheduling", "Time blocking", "Conflict resolution"] },
  { agent: "Finance Agent", skills: ["Expense tracking", "Invoice processing", "Budget alerts", "Reconciliation"] },
];

export function OrchestrationView() {
  return (
    <div className="space-y-6">
      {/* Active Workflows */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Active Workflows</h3>
        <div className="space-y-6">
          {orchestrationFlows.map((flow, flowIndex) => (
            <motion.div
              key={flow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: flowIndex * 0.1 }}
              className={`p-4 rounded-xl ${
                flow.status === 'completed' ? 'bg-secondary/5 border border-secondary/20' :
                flow.status === 'in_progress' ? 'bg-primary/5 border border-primary/20' :
                'bg-muted/20 border border-border/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className={`h-4 w-4 ${
                    flow.status === 'completed' ? 'text-secondary' :
                    flow.status === 'in_progress' ? 'text-primary' :
                    'text-muted-foreground'
                  }`} />
                  <span className="font-medium text-foreground">{flow.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  flow.status === 'completed' ? 'bg-secondary/10 text-secondary' :
                  flow.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                  'bg-muted/30 text-muted-foreground'
                }`}>
                  {flow.status === 'completed' ? 'Completed' :
                   flow.status === 'in_progress' ? 'In Progress' : 'Queued'}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {flow.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center gap-2 shrink-0">
                    <div className={`p-3 rounded-xl ${
                      step.status === 'completed' ? 'bg-secondary/10' :
                      step.status === 'in_progress' ? 'bg-primary/10 ring-2 ring-primary/30' :
                      'bg-muted/30'
                    }`}>
                      <div className="flex items-center gap-2">
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="h-4 w-4 text-secondary" />
                        ) : step.status === 'in_progress' ? (
                          <Clock className="h-4 w-4 text-primary animate-pulse" />
                        ) : (
                          <Bot className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-xs font-medium text-foreground">{step.agent}</p>
                          <p className="text-xs text-muted-foreground">{step.action}</p>
                        </div>
                      </div>
                    </div>
                    {stepIndex < flow.steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Agent Capabilities */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Agent Capabilities</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {agentCapabilities.map((agent, index) => (
            <motion.div
              key={agent.agent}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-muted/20"
            >
              <div className="flex items-center gap-2 mb-3">
                <Bot className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{agent.agent}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {agent.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-2 py-1 rounded-full bg-muted/30 text-xs text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
