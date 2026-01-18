import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { BudgetManager } from "@/components/finance/BudgetManager";
import { InvestmentPortfolio } from "@/components/finance/InvestmentPortfolio";
import { TaxDashboard } from "@/components/finance/TaxDashboard";
import { RetirementPlanning } from "@/components/finance/RetirementPlanning";
import { FinancialInsights } from "@/components/finance/FinancialInsights";
import { SmartTransactionForm } from "@/components/finance/SmartTransactionForm";
import { SpendingForecast } from "@/components/finance/SpendingForecast";
import { VoiceFinancialAdvisor } from "@/components/finance/VoiceFinancialAdvisor";
import { SavingsGoals } from "@/components/finance/SavingsGoals";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";

const TABS = [
  { id: "insights", label: "AI Insights" },
  { id: "forecast", label: "Forecast" },
  { id: "goals", label: "Goals" },
  { id: "budget", label: "Budget" },
  { id: "investments", label: "Investments" },
  { id: "tax", label: "Tax" },
  { id: "retirement", label: "Retirement" },
];

export default function Finance() {
  const [activeTab, setActiveTab] = useState("insights");
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "insights":
        return (
          <div className="space-y-6">
            <VoiceFinancialAdvisor />
            <FinancialInsights />
          </div>
        );
      case "forecast":
        return <SpendingForecast />;
      case "goals":
        return <SavingsGoals />;
      case "budget":
        return <BudgetManager />;
      case "investments":
        return <InvestmentPortfolio />;
      case "tax":
        return <TaxDashboard />;
      case "retirement":
        return <RetirementPlanning />;
      default:
        return <FinancialInsights />;
    }
  };

  return (
    <>
      <ModuleLayout
        title="Personal Finance"
        subtitle="AI-powered budget, investments, and financial planning"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={
          <Button
            onClick={() => setShowTransactionForm(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <Sparkles className="h-4 w-4" />
          </Button>
        }
      >
        {renderContent()}
      </ModuleLayout>
      
      <SmartTransactionForm 
        open={showTransactionForm} 
        onOpenChange={setShowTransactionForm} 
      />
    </>
  );
}
