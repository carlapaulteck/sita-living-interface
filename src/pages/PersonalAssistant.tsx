import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModuleLayout } from "@/components/ModuleLayout";
import { GlassCard } from "@/components/GlassCard";
import { AgentDashboard } from "@/components/agents/AgentDashboard";
import { AgentTimeline } from "@/components/agents/AgentTimeline";
import { AgentSettings } from "@/components/agents/AgentSettings";
import { OrchestrationView } from "@/components/agents/OrchestrationView";
import { AutomationBuilder } from "@/components/AutomationBuilder";
import { AutomationHistoryLog } from "@/components/AutomationHistoryLog";
import { UnifiedInbox } from "@/components/UnifiedInbox";
import { ProactiveAISuggestions } from "@/components/ProactiveAISuggestions";
import { 
  Bot, 
  Zap, 
  Inbox, 
  Settings, 
  History,
  Sparkles,
  Brain
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "inbox", label: "Inbox" },
  { id: "automations", label: "Automations" },
  { id: "agents", label: "Agents" },
  { id: "history", label: "History" },
  { id: "settings", label: "Settings" },
];

const PersonalAssistant = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showInbox, setShowInbox] = useState(false);
  const [showAutomations, setShowAutomations] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Status */}
              <GlassCard className="p-6" glow="cyan">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-accent/20 border border-accent/30">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">SITA Active</h3>
                    <p className="text-sm text-muted-foreground">Your personal VA is online</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground">Tasks Completed Today</span>
                    <span className="text-lg font-semibold text-accent">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground">Active Automations</span>
                    <span className="text-lg font-semibold text-primary">8</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground">Messages Handled</span>
                    <span className="text-lg font-semibold text-emerald-400">24</span>
                  </div>
                </div>
              </GlassCard>

              {/* Proactive Suggestions */}
              <ProactiveAISuggestions />
            </div>

            {/* Agent Orchestration */}
            <OrchestrationView />

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInbox(true)}
                className="p-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 text-center"
              >
                <Inbox className="h-6 w-6 text-accent mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">Open Inbox</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAutomations(true)}
                className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 text-center"
              >
                <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">Create Automation</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("agents")}
                className="p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 text-center"
              >
                <Brain className="h-6 w-6 text-secondary mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">Manage Agents</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("settings")}
                className="p-4 rounded-xl bg-gradient-to-br from-muted/20 to-muted/5 border border-border/30 text-center"
              >
                <Settings className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">VA Settings</span>
              </motion.button>
            </div>
          </div>
        );

      case "inbox":
        return (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Inbox className="h-6 w-6 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Unified Inbox</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Manage all your communications in one place. Click below to open the full inbox.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInbox(true)}
              className="w-full p-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 text-center"
            >
              <span className="text-sm font-medium text-foreground">Open Full Inbox</span>
            </motion.button>
          </GlassCard>
        );

      case "automations":
        return (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Automation Builder</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Create custom automations to handle repetitive tasks. Click below to open the builder.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAutomations(true)}
              className="w-full p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 text-center"
            >
              <span className="text-sm font-medium text-foreground">Open Automation Builder</span>
            </motion.button>
          </GlassCard>
        );

      case "agents":
        return <AgentDashboard />;

      case "history":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AutomationHistoryLog />
            <AgentTimeline />
          </div>
        );

      case "settings":
        return <AgentSettings />;

      default:
        return null;
    }
  };

  return (
    <>
      <ModuleLayout
        title="Personal Assistant"
        subtitle="Your AI-powered virtual assistant"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderContent()}
      </ModuleLayout>

      {/* Modals */}
      <AnimatePresence>
        {showInbox && <UnifiedInbox isOpen={showInbox} onClose={() => setShowInbox(false)} />}
        {showAutomations && <AutomationBuilder isOpen={showAutomations} onClose={() => setShowAutomations(false)} />}
      </AnimatePresence>
    </>
  );
};

export default PersonalAssistant;
