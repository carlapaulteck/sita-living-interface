import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { AgentDashboard } from "@/components/agents/AgentDashboard";
import { OrchestrationView } from "@/components/agents/OrchestrationView";
import { AgentTimeline } from "@/components/agents/AgentTimeline";
import { AgentSettings } from "@/components/agents/AgentSettings";
import { AgentWorkflowBuilder } from "@/components/agents/AgentWorkflowBuilder";

const TABS = [
  { id: "dashboard", label: "Active Agents" },
  { id: "workflows", label: "Workflows" },
  { id: "orchestration", label: "Orchestration" },
  { id: "timeline", label: "Activity" },
  { id: "settings", label: "Settings" },
];

export default function Agents() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AgentDashboard />;
      case "workflows":
        return <AgentWorkflowBuilder />;
      case "orchestration":
        return <OrchestrationView />;
      case "timeline":
        return <AgentTimeline />;
      case "settings":
        return <AgentSettings />;
      default:
        return <AgentDashboard />;
    }
  };

  return (
    <ModuleLayout
      title="AI Agent Control"
      subtitle="Autonomous agent monitoring and orchestration"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </ModuleLayout>
  );
}
