import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight, TrendingUp, Wallet, PiggyBank, Zap, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncomeType, RiskTolerance, WealthProfile } from "@/types/onboarding";

const INCOME_TYPES: { id: IncomeType; label: string; icon: typeof Wallet }[] = [
  { id: "salary", label: "Salary", icon: Wallet },
  { id: "business", label: "Business", icon: TrendingUp },
  { id: "creator", label: "Creator", icon: Zap },
  { id: "trading", label: "Trading", icon: DollarSign },
  { id: "mixed", label: "Mixed", icon: PiggyBank },
];

const RISK_LEVELS: { id: RiskTolerance; label: string; desc: string }[] = [
  { id: "low", label: "Conservative", desc: "Preserve capital first" },
  { id: "medium", label: "Balanced", desc: "Steady growth" },
  { id: "high", label: "Aggressive", desc: "Maximum growth" },
];

const PRIMARY_LEVERS = [
  { id: "increase-revenue", label: "Increase Revenue" },
  { id: "reduce-burn", label: "Reduce Burn" },
  { id: "invest", label: "Invest Profits" },
  { id: "automate-ops", label: "Automate Operations" },
];

const WEALTH_MEANINGS = [
  { id: "stability", label: "Stability" },
  { id: "freedom", label: "Freedom" },
  { id: "status", label: "Status" },
  { id: "mission", label: "Mission" },
];

export function WealthPersonalizationStep() {
  const { data, updateData, nextStep, prevStep, isQuickMode } = useOnboarding();

  // Skip in quick mode
  if (isQuickMode) {
    nextStep();
    return null;
  }

  const wealthProfile: WealthProfile = data.wealthProfile || {
    incomeType: "salary",
    revenueSources: [],
    riskTolerance: "medium",
    primaryLever: "increase-revenue",
    wealthMeaning: "freedom",
    automations: {
      trackDaily: true,
      alertAnomalies: true,
      weeklySummary: true,
      revenueExperiments: false,
    },
  };

  const updateWealthProfile = (updates: Partial<WealthProfile>) => {
    updateData("wealthProfile", { ...wealthProfile, ...updates });
  };

  return (
    <motion.div
      className="flex flex-col items-center max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-3xl font-display font-medium text-foreground mb-2 text-center">
        Wealth Profile
      </h2>
      <p className="text-muted-foreground mb-6 text-center">
        How do you earn and grow wealth?
      </p>

      {/* Income Type */}
      <div className="w-full mb-5">
        <span className="text-sm font-medium text-foreground mb-2 block">Income Type</span>
        <div className="flex flex-wrap gap-2">
          {INCOME_TYPES.map((type) => {
            const isSelected = wealthProfile.incomeType === type.id;
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => updateWealthProfile({ incomeType: type.id })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Risk Tolerance */}
      <GlassCard className="w-full p-4 mb-5">
        <span className="text-sm font-medium text-foreground mb-3 block">Risk Tolerance</span>
        <div className="flex gap-2">
          {RISK_LEVELS.map((level) => {
            const isSelected = wealthProfile.riskTolerance === level.id;
            return (
              <button
                key={level.id}
                onClick={() => updateWealthProfile({ riskTolerance: level.id })}
                className={`flex-1 px-3 py-3 rounded-xl text-sm transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                <span className="font-medium block">{level.label}</span>
                <span className="text-xs opacity-70">{level.desc}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Primary Lever */}
      <div className="w-full mb-5">
        <span className="text-sm font-medium text-foreground mb-2 block">Primary Focus</span>
        <div className="grid grid-cols-2 gap-2">
          {PRIMARY_LEVERS.map((lever) => {
            const isSelected = wealthProfile.primaryLever === lever.id;
            return (
              <button
                key={lever.id}
                onClick={() => updateWealthProfile({ primaryLever: lever.id as any })}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                {lever.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wealth Meaning */}
      <div className="w-full mb-5">
        <span className="text-sm font-medium text-foreground mb-2 block">What does wealth mean to you?</span>
        <div className="flex gap-2">
          {WEALTH_MEANINGS.map((meaning) => {
            const isSelected = wealthProfile.wealthMeaning === meaning.id;
            return (
              <button
                key={meaning.id}
                onClick={() => updateWealthProfile({ wealthMeaning: meaning.id as any })}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                {meaning.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Automations */}
      <GlassCard className="w-full p-4 mb-6">
        <span className="text-sm font-medium text-foreground mb-3 block">Wealth Automations</span>
        <div className="flex flex-col gap-2">
          {[
            { key: "trackDaily", label: "Track income daily" },
            { key: "alertAnomalies", label: "Alert on anomalies" },
            { key: "weeklySummary", label: "Weekly strategy summary" },
            { key: "revenueExperiments", label: "Run revenue experiments" },
          ].map((auto) => {
            const value = wealthProfile.automations[auto.key as keyof typeof wealthProfile.automations];
            return (
              <div key={auto.key} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{auto.label}</span>
                <button
                  onClick={() => updateWealthProfile({
                    automations: { ...wealthProfile.automations, [auto.key]: !value }
                  })}
                  className={`w-10 h-5 rounded-full transition-all ${
                    value ? "bg-primary" : "bg-foreground/20"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-foreground transition-transform ${
                    value ? "translate-x-5" : "translate-x-0.5"
                  }`} />
                </button>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} className="gap-2">
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
