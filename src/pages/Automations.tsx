import { useState } from "react";
import { motion } from "framer-motion";
import { ModuleLayout } from "@/components/ModuleLayout";
import { AutomationHistoryLog } from "@/components/AutomationHistoryLog";
import { AutomationBuilder } from "@/components/AutomationBuilder";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Zap, 
  Activity,
  CheckCircle2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type AutomationsTab = "active" | "history" | "builder";

const TABS = [
  { id: "active" as const, label: "Active" },
  { id: "history" as const, label: "History" },
  { id: "builder" as const, label: "Create New" },
];

export default function Automations() {
  const [activeTab, setActiveTab] = useState<AutomationsTab>("active");
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const { data: automations = [] } = useQuery({
    queryKey: ["user-automations"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return [];
      
      const { data } = await supabase
        .from("user_automations")
        .select("*")
        .eq("user_id", session.session.user.id)
        .order("created_at", { ascending: false });
      
      return data || [];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["automation-stats"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return { total: 0, runsToday: 0, successRate: 0 };
      
      const { count: totalRuns } = await supabase
        .from("automation_runs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.session.user.id);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: runsToday } = await supabase
        .from("automation_runs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.session.user.id)
        .gte("created_at", today.toISOString());
      
      const { count: successRuns } = await supabase
        .from("automation_runs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.session.user.id)
        .eq("status", "success");
      
      const successRate = totalRuns ? Math.round(((successRuns || 0) / totalRuns) * 100) : 100;
      
      return {
        total: totalRuns || 0,
        runsToday: runsToday || 0,
        successRate,
      };
    },
  });

  const activeAutomations = automations.filter((a: { is_enabled: boolean }) => a.is_enabled);

  return (
    <ModuleLayout
      title="Automations"
      subtitle="Background intelligence that works while you don't"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as AutomationsTab)}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-display font-medium text-foreground">
                {activeAutomations.length}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/20">
              <Activity className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-display font-medium text-foreground">
                {stats?.runsToday || 0}
              </p>
              <p className="text-xs text-muted-foreground">Runs Today</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-400/20">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-display font-medium text-foreground">
                {stats?.successRate || 100}%
              </p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Tab Content */}
      {activeTab === "active" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {activeAutomations.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Active Automations
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first automation to let SITA work in the background
              </p>
              <Button onClick={() => setIsBuilderOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Automation
              </Button>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {activeAutomations.map((automation: { 
                id: string; 
                name: string; 
                description?: string;
                trigger_type: string;
                action_type: string;
                is_enabled: boolean;
              }) => (
                <GlassCard key={automation.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-primary" />
                        <h3 className="font-medium text-foreground">{automation.name}</h3>
                      </div>
                      {automation.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {automation.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>When: <span className="text-foreground">{automation.trigger_type}</span></span>
                        <span>Then: <span className="text-secondary">{automation.action_type}</span></span>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${automation.is_enabled ? "bg-green-400" : "bg-muted-foreground"}`} />
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AutomationHistoryLog />
        </motion.div>
      )}

      {activeTab === "builder" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-medium text-foreground mb-2">Create a Custom Automation</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Build your own trigger-action automation with the visual editor
          </p>
          <Button onClick={() => setIsBuilderOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Open Automation Builder
          </Button>
        </motion.div>
      )}

      {/* Automation Builder Dialog */}
      <AutomationBuilder 
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSave={() => setIsBuilderOpen(false)}
      />
    </ModuleLayout>
  );
}
