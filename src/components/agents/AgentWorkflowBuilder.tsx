import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Play, 
  Pause, 
  Plus,
  Settings2,
  Zap,
  ArrowRight,
  GitBranch,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { agentService, type Agent, type WorkflowRecord } from "@/services/agent.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AgentWorkflowBuilder() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ["ai-agents"],
    queryFn: () => agentService.getAgents(),
  });

  const { data: workflows = [], isLoading: workflowsLoading } = useQuery({
    queryKey: ["agent-workflows"],
    queryFn: () => agentService.getWorkflows(),
  });

  const activeAgents = agents.filter(a => a.is_active);
  const systemAgents = agents.filter(a => a.is_system);

  const createWorkflowMutation = useMutation({
    mutationFn: () => {
      const steps: import("@/services/agent.service").WorkflowStep[] = selectedAgents.map((agentName, index) => ({
        agent_name: agentName,
        task_type: "workflow_step",
        depends_on: index > 0 ? [selectedAgents[index - 1]] : undefined,
      }));
      return agentService.createWorkflow(workflowName, steps, workflowDescription);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-workflows"] });
      toast.success("Workflow created successfully");
      setIsCreateOpen(false);
      setWorkflowName("");
      setWorkflowDescription("");
      setSelectedAgents([]);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create workflow: ${error.message}`);
    },
  });

  const toggleWorkflowMutation = useMutation({
    mutationFn: ({ workflowId, isActive }: { workflowId: string; isActive: boolean }) =>
      agentService.toggleWorkflow(workflowId, !isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-workflows"] });
      toast.success("Workflow updated");
    },
  });

  const deleteWorkflowMutation = useMutation({
    mutationFn: (workflowId: string) => agentService.deleteWorkflow(workflowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-workflows"] });
      toast.success("Workflow deleted");
    },
  });

  const addAgentToWorkflow = (agentName: string) => {
    if (!selectedAgents.includes(agentName)) {
      setSelectedAgents([...selectedAgents, agentName]);
    }
  };

  const removeAgentFromWorkflow = (agentName: string) => {
    setSelectedAgents(selectedAgents.filter(a => a !== agentName));
  };

  const getModuleColor = (module: string) => {
    const colors: Record<string, string> = {
      finance: "text-emerald-400 bg-emerald-500/10",
      health: "text-rose-400 bg-rose-500/10",
      productivity: "text-blue-400 bg-blue-500/10",
      communication: "text-violet-400 bg-violet-500/10",
      research: "text-amber-400 bg-amber-500/10",
      default: "text-primary bg-primary/10",
    };
    return colors[module] || colors.default;
  };

  if (agentsLoading || workflowsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Bot className="h-4 w-4" />
            <span className="text-sm">Total Agents</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{agents.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <Zap className="h-4 w-4" />
            <span className="text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold text-secondary">{activeAgents.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <GitBranch className="h-4 w-4" />
            <span className="text-sm">Workflows</span>
          </div>
          <p className="text-2xl font-bold text-primary">{workflows.length}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Settings2 className="h-4 w-4" />
            <span className="text-sm">System Agents</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{systemAgents.length}</p>
        </GlassCard>
      </div>

      {/* Agents Grid */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Available Agents</h3>
          <Badge variant="outline">{agents.length} registered</Badge>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.slice(0, 12).map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getModuleColor(agent.module)}`}>
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{agent.display_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{agent.module}</p>
                  </div>
                </div>
                <Badge
                  variant={agent.is_active ? "default" : "secondary"}
                  className={agent.is_active ? "bg-secondary/20 text-secondary border-secondary/30" : ""}
                >
                  {agent.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              {agent.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {agent.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
        {agents.length > 12 && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            +{agents.length - 12} more agents available
          </p>
        )}
      </GlassCard>

      {/* Workflows */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Workflows</h3>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Agent Workflow</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input
                    id="workflow-name"
                    placeholder="e.g., Morning Briefing Pipeline"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="workflow-desc">Description</Label>
                  <Textarea
                    id="workflow-desc"
                    placeholder="Describe what this workflow does..."
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Add Agents (in order of execution)</Label>
                  <Select onValueChange={addAgentToWorkflow}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.filter(a => a.is_active).map((agent) => (
                        <SelectItem key={agent.id} value={agent.name}>
                          {agent.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedAgents.length > 0 && (
                  <div className="space-y-2">
                    <Label>Workflow Steps</Label>
                    <div className="space-y-2">
                      {selectedAgents.map((agentName, index) => (
                        <div
                          key={agentName}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/20"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{agentName}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAgentFromWorkflow(agentName)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => createWorkflowMutation.mutate()}
                  disabled={!workflowName || selectedAgents.length === 0 || createWorkflowMutation.isPending}
                  className="w-full"
                >
                  {createWorkflowMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <GitBranch className="h-4 w-4 mr-2" />
                  )}
                  Create Workflow
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {workflows.length === 0 ? (
              <div className="text-center py-8">
                <GitBranch className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-foreground font-medium">No workflows yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a workflow to orchestrate multiple agents
                </p>
              </div>
            ) : (
              workflows.map((workflow, index) => (
                <motion.div
                  key={workflow.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-muted/20"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{workflow.name}</p>
                        <Badge variant={workflow.is_active ? "default" : "secondary"}>
                          {workflow.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {workflow.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {workflow.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {workflow.run_count || 0} runs
                        </span>
                        {workflow.last_run_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last run {formatDistanceToNow(new Date(workflow.last_run_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleWorkflowMutation.mutate({ 
                          workflowId: workflow.id, 
                          isActive: workflow.is_active || false 
                        })}
                      >
                        {workflow.is_active ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteWorkflowMutation.mutate(workflow.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </div>
  );
}
