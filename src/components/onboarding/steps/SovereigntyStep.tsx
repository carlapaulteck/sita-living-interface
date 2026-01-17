import { motion } from "framer-motion";
import { useOnboarding } from "../OnboardingContext";
import { GlassCard } from "@/components/GlassCard";
import { ChevronRight, Shield, Cloud, HardDrive, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataMode } from "@/types/onboarding";

const DATA_MODES: {
  id: DataMode;
  label: string;
  icon: typeof HardDrive;
  desc: string;
}[] = [
  {
    id: "local-first",
    label: "Local-First",
    icon: HardDrive,
    desc: "Data stays on your devices when possible",
  },
  {
    id: "cloud",
    label: "Cloud",
    icon: Cloud,
    desc: "Sync everywhere, backed up securely",
  },
  {
    id: "hybrid",
    label: "Hybrid",
    icon: RefreshCw,
    desc: "Sensitive local, rest in cloud",
  },
];

const RETENTION_OPTIONS = [
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 365, label: "1 year" },
  { days: -1, label: "Forever" },
];

export function SovereigntyStep() {
  const { data, updateNestedData, nextStep, prevStep, isDeepMode } = useOnboarding();

  // Only show this step in deep mode
  if (!isDeepMode) {
    nextStep();
    return null;
  }

  return (
    <motion.div
      className="flex flex-col items-center max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-display font-medium text-foreground text-center">
          Your Data, Your Rules
        </h2>
      </div>
      <p className="text-muted-foreground mb-8 text-center">
        You own everything. We're just the custodians.
      </p>

      {/* Data Mode */}
      <div className="w-full mb-6">
        <span className="text-sm font-medium text-foreground mb-3 block">Data Storage Mode</span>
        <div className="flex flex-col gap-2">
          {DATA_MODES.map((mode) => {
            const isSelected = data.sovereigntyProfile.dataMode === mode.id;
            const Icon = mode.icon;
            return (
              <GlassCard
                key={mode.id}
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-primary shadow-glow-gold"
                    : "hover:border-primary/30"
                }`}
                onClick={() => updateNestedData("sovereigntyProfile", "dataMode", mode.id)}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <span className="font-medium text-foreground text-sm">{mode.label}</span>
                    <p className="text-xs text-muted-foreground">{mode.desc}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Retention */}
      <GlassCard className="w-full p-4 mb-6">
        <span className="text-sm font-medium text-foreground mb-3 block">Data Retention</span>
        <div className="flex gap-2">
          {RETENTION_OPTIONS.map((option) => {
            const isSelected = data.sovereigntyProfile.retentionDays === option.days;
            return (
              <button
                key={option.days}
                onClick={() => updateNestedData("sovereigntyProfile", "retentionDays", option.days)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Memory Policy */}
      <GlassCard className="w-full p-4 mb-6">
        <span className="text-sm font-medium text-foreground mb-3 block">AI Memory Settings</span>
        <div className="flex flex-col gap-3">
          {[
            { key: "rememberGoals", label: "Remember goals & preferences" },
            { key: "storeSensitive", label: "Store sensitive content" },
            { key: "autoDeleteLogs", label: "Auto-delete chat logs" },
          ].map((setting) => {
            const value = data.sovereigntyProfile.memoryPolicy[setting.key as keyof typeof data.sovereigntyProfile.memoryPolicy];
            return (
              <div key={setting.key} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{setting.label}</span>
                <button
                  onClick={() => {
                    updateNestedData("sovereigntyProfile", "memoryPolicy", {
                      ...data.sovereigntyProfile.memoryPolicy,
                      [setting.key]: !value,
                    });
                  }}
                  className={`w-10 h-5 rounded-full transition-all duration-300 ${
                    value ? "bg-primary" : "bg-foreground/20"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-foreground transition-transform duration-300 ${
                      value ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Export Preview */}
      <GlassCard className="w-full p-4 mb-8 border-secondary/30">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5 text-secondary" />
          <div>
            <span className="text-sm font-medium text-foreground">Export Available Anytime</span>
            <p className="text-xs text-muted-foreground">
              Download or delete all your data with one click
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} className="gap-2">
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
