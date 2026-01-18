import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { RegulatoryMonitoring } from "@/components/intelligence/RegulatoryMonitoring";
import { SentimentDashboard } from "@/components/intelligence/SentimentDashboard";
import { SupplyChainIntel } from "@/components/intelligence/SupplyChainIntel";
import { MarketIntelligence } from "@/components/intelligence/MarketIntelligence";

const TABS = [
  { id: "regulatory", label: "Regulatory" },
  { id: "sentiment", label: "Sentiment" },
  { id: "supply-chain", label: "Supply Chain" },
  { id: "market", label: "Market Intel" },
];

export default function Intelligence() {
  const [activeTab, setActiveTab] = useState("regulatory");

  const renderContent = () => {
    switch (activeTab) {
      case "regulatory":
        return <RegulatoryMonitoring />;
      case "sentiment":
        return <SentimentDashboard />;
      case "supply-chain":
        return <SupplyChainIntel />;
      case "market":
        return <MarketIntelligence />;
      default:
        return <RegulatoryMonitoring />;
    }
  };

  return (
    <ModuleLayout
      title="Intelligence Layer"
      subtitle="Market monitoring and business intelligence"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </ModuleLayout>
  );
}
