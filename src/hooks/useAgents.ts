import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Agent {
  id: string;
  agent_name: string;
  status: "active" | "idle" | "paused";
  tasks_completed: number;
  last_action: string | null;
  last_action_at: string | null;
  config: Record<string, unknown> | null;
}

export interface AgentActivity {
  id: string;
  agent_name: string;
  action: string;
  status: string;
  priority: string;
  created_at: string;
}

const DEFAULT_AGENTS = [
  { agent_name: "Research Agent", status: "active" as const, tasks_completed: 47, last_action: "Analyzed competitor pricing" },
  { agent_name: "Email Agent", status: "active" as const, tasks_completed: 128, last_action: "Drafted response to vendor inquiry" },
  { agent_name: "Scheduling Agent", status: "idle" as const, tasks_completed: 34, last_action: "Rescheduled team standup" },
  { agent_name: "Finance Agent", status: "active" as const, tasks_completed: 89, last_action: "Reconciled monthly expenses" },
  { agent_name: "Health Agent", status: "paused" as const, tasks_completed: 23, last_action: "Reminded about medication" },
  { agent_name: "Content Agent", status: "idle" as const, tasks_completed: 56, last_action: "Generated weekly newsletter draft" },
];

export function useAgents() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize agents for new users
  const initializeAgents = async () => {
    if (!user) return;

    const { data: existing } = await supabase
      .from("user_agents")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    if (!existing || existing.length === 0) {
      const agentsToInsert = DEFAULT_AGENTS.map(a => ({
        user_id: user.id,
        agent_name: a.agent_name,
        status: a.status,
        tasks_completed: a.tasks_completed,
        last_action: a.last_action,
        last_action_at: new Date().toISOString(),
      }));

      await supabase.from("user_agents").insert(agentsToInsert);
    }
  };

  // Fetch agents
  const fetchAgents = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_agents")
      .select("*")
      .eq("user_id", user.id)
      .order("agent_name");

    if (error) {
      console.error("Error fetching agents:", error);
      return;
    }

    setAgents(data as Agent[]);
  };

  // Fetch recent activities
  const fetchActivities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("agent_activities")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching activities:", error);
      return;
    }

    setActivities(data as AgentActivity[]);
  };

  // Toggle agent status (pause/resume)
  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    if (!user) return;

    const newStatus = currentStatus === "paused" ? "active" : "paused";
    
    const { error } = await supabase
      .from("user_agents")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", agentId)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update agent status");
      return;
    }

    // Log the activity
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      await supabase.from("agent_activities").insert({
        user_id: user.id,
        agent_name: agent.agent_name,
        action: newStatus === "paused" ? "Agent paused by user" : "Agent resumed by user",
        status: "completed",
        priority: "medium",
      });
    }

    toast.success(`Agent ${newStatus === "paused" ? "paused" : "resumed"}`);
    fetchAgents();
    fetchActivities();
  };

  // Pause all agents
  const pauseAllAgents = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("user_agents")
      .update({ status: "paused", updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .neq("status", "paused");

    if (error) {
      toast.error("Failed to pause agents");
      return;
    }

    await supabase.from("agent_activities").insert({
      user_id: user.id,
      agent_name: "System",
      action: "All agents paused by user",
      status: "completed",
      priority: "high",
    });

    toast.success("All agents paused");
    fetchAgents();
    fetchActivities();
  };

  // Resume all agents
  const resumeAllAgents = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("user_agents")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("status", "paused");

    if (error) {
      toast.error("Failed to resume agents");
      return;
    }

    await supabase.from("agent_activities").insert({
      user_id: user.id,
      agent_name: "System",
      action: "All agents resumed by user",
      status: "completed",
      priority: "high",
    });

    toast.success("All agents resumed");
    fetchAgents();
    fetchActivities();
  };

  // Set up realtime subscription for activities
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("agent-activities")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "agent_activities",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setActivities(prev => [payload.new as AgentActivity, ...prev.slice(0, 19)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await initializeAgents();
      await Promise.all([fetchAgents(), fetchActivities()]);
      setIsLoading(false);
    };

    if (user) {
      load();
    }
  }, [user]);

  return {
    agents,
    activities,
    isLoading,
    toggleAgentStatus,
    pauseAllAgents,
    resumeAllAgents,
    refetch: () => Promise.all([fetchAgents(), fetchActivities()]),
  };
}
