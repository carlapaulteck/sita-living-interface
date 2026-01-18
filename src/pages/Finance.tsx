import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { BudgetManager } from "@/components/finance/BudgetManager";
import { InvestmentPortfolio } from "@/components/finance/InvestmentPortfolio";
import { TaxDashboard } from "@/components/finance/TaxDashboard";
import { RetirementPlanning } from "@/components/finance/RetirementPlanning";

const TABS = [
  { id: "budget", label: "Budget" },
  { id: "investments", label: "Investments" },
  { id: "tax", label: "Tax" },
  { id: "retirement", label: "Retirement" },
];

export default function Finance() {
  const [activeTab, setActiveTab] = useState("budget");

  const renderContent = () => {
    switch (activeTab) {
      case "budget":
        return <BudgetManager />;
      case "investments":
        return <InvestmentPortfolio />;
      case "tax":
        return <TaxDashboard />;
      case "retirement":
        return <RetirementPlanning />;
      default:
        return <BudgetManager />;
    }
  };

  return (
    <ModuleLayout
      title="Personal Finance"
      subtitle="Budget, investments, and financial planning"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </ModuleLayout>
  );
}
