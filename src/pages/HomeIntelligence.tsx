import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { PropertyDashboard } from "@/components/home/PropertyDashboard";
import { SmartHomeControls } from "@/components/home/SmartHomeControls";
import { MaintenanceTracker } from "@/components/home/MaintenanceTracker";
import { SecurityOverview } from "@/components/home/SecurityOverview";

const TABS = [
  { id: "property", label: "Property" },
  { id: "smart-home", label: "Smart Home" },
  { id: "maintenance", label: "Maintenance" },
  { id: "security", label: "Security" },
];

export default function HomeIntelligence() {
  const [activeTab, setActiveTab] = useState("property");

  const renderContent = () => {
    switch (activeTab) {
      case "property":
        return <PropertyDashboard />;
      case "smart-home":
        return <SmartHomeControls />;
      case "maintenance":
        return <MaintenanceTracker />;
      case "security":
        return <SecurityOverview />;
      default:
        return <PropertyDashboard />;
    }
  };

  return (
    <ModuleLayout
      title="Home Intelligence"
      subtitle="Smart home management and property insights"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </ModuleLayout>
  );
}
