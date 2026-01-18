import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { GlassCard } from "@/components/GlassCard";
import { MetricRing } from "@/components/MetricRing";
import { sovereigntyData } from "@/lib/demoData";
import { ArbitrageSignals } from "@/components/ArbitrageSignals";
import { ExitReadiness } from "@/components/ExitReadiness";
import { 
  Shield, 
  Database, 
  Lock, 
  Fingerprint, 
  Zap, 
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  Cloud,
  FileText,
  Image,
  Mail,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  Target,
  DollarSign,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "wealth", label: "Wealth Engine" },
  { id: "boundaries", label: "Boundaries" },
  { id: "data", label: "Data" },
  { id: "privacy", label: "Privacy" },
  { id: "identity", label: "Identity" },
  { id: "automation", label: "Automation" },
  { id: "freedom", label: "Freedom" },
];

export default function Sovereignty() {
  const [activeTab, setActiveTab] = useState("overview");
  const data = sovereigntyData;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab data={data} />;
      case "wealth":
        return <WealthTab />;
      case "boundaries":
        return <BoundariesTab />;
      case "data":
        return <DataTab data={data.data} />;
      case "privacy":
        return <PrivacyTab data={data.privacy} />;
      case "identity":
        return <IdentityTab data={data.identity} />;
      case "automation":
        return <AutomationTab data={data.automation} />;
      case "freedom":
        return <FreedomTab data={data.freedom} />;
      default:
        return <OverviewTab data={data} />;
    }
  };

  return (
    <ModuleLayout
      title="Sovereignty"
      subtitle="Your digital autonomy & data ownership"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </ModuleLayout>
  );
}

function WealthTab() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Arbitrage Signals */}
      <div className="col-span-12 lg:col-span-7">
        <ArbitrageSignals />
      </div>
      
      {/* Exit Readiness */}
      <div className="col-span-12 lg:col-span-5">
        <ExitReadiness />
      </div>

      {/* Wealth Summary Cards */}
      <div className="col-span-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-secondary/10">
                <DollarSign className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Portfolio</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">$142.8K</p>
            <p className="text-xs text-secondary mt-1">+12.4% this month</p>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Active Microbrands</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">4</p>
            <p className="text-xs text-muted-foreground mt-1">2 scaling, 2 stable</p>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-secondary/10">
                <Target className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-sm text-muted-foreground">Opportunities</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">3</p>
            <p className="text-xs text-secondary mt-1">2 actionable now</p>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Risk Level</span>
            </div>
            <p className="text-2xl font-display font-bold text-secondary">Low</p>
            <p className="text-xs text-muted-foreground mt-1">Diversified portfolio</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function BoundariesTab() {
  const [autonomyLevel, setAutonomyLevel] = useState(2);
  const [budgetCap, setBudgetCap] = useState(500);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const autonomyLevels = [
    { level: 0, name: "Observe", desc: "Only watch and learn", color: "from-muted to-muted" },
    { level: 1, name: "Suggest", desc: "Recommend actions, wait for approval", color: "from-primary/40 to-primary/20" },
    { level: 2, name: "Act", desc: "Execute low-risk actions automatically", color: "from-secondary/40 to-secondary/20" },
    { level: 3, name: "Autopilot", desc: "Full autonomy within guardrails", color: "from-secondary to-primary" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header with ambient glow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <GlassCard className="p-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/15 rounded-full blur-2xl" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 backdrop-blur-sm">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-medium text-foreground">Boundaries Control</h2>
              <p className="text-sm text-muted-foreground">Configure how the system operates on your behalf</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Autonomy Level Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Autopilot Level
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {autonomyLevels.map((level) => (
              <motion.button
                key={level.level}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAutonomyLevel(level.level)}
                className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden group ${
                  autonomyLevel === level.level
                    ? "bg-gradient-to-br " + level.color + " border-2 border-primary/50 shadow-lg shadow-primary/10"
                    : "bg-foreground/5 hover:bg-foreground/10 border-2 border-transparent"
                }`}
              >
                {autonomyLevel === level.level && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                )}
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{level.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{level.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    autonomyLevel === level.level
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/50"
                  }`}>
                    {autonomyLevel === level.level && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Caps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-secondary" />
                Budget Caps
              </h3>
              <span className="text-lg font-display font-bold text-primary">${budgetCap}/mo</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={budgetCap}
                onChange={(e) => setBudgetCap(parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-secondary/20 via-primary/30 to-primary/50 rounded-full appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-primary 
                [&::-webkit-slider-thumb]:to-secondary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-3">
                <span>$100</span>
                <span>$1,000</span>
                <span>$2,000</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quiet Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 h-full">
            <button
              onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${
                    quietHoursEnabled ? "bg-primary/20" : "bg-foreground/5"
                  }`}>
                    {quietHoursEnabled ? (
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    ) : (
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Quiet Hours</h3>
                    <p className="text-sm text-muted-foreground">10pm - 7am · No notifications</p>
                  </div>
                </div>
                <div className={`w-14 h-8 rounded-full transition-all relative ${
                  quietHoursEnabled ? "bg-gradient-to-r from-primary to-secondary" : "bg-muted"
                }`}>
                  <motion.div 
                    animate={{ x: quietHoursEnabled ? 26 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                  />
                </div>
              </div>
            </button>
          </GlassCard>
        </motion.div>
      </div>

      {/* Approval Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-secondary" />
            Always Require Approval
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { text: "Spend over $50", icon: DollarSign },
              { text: "External messages to new contacts", icon: Globe },
              { text: "Calendar changes", icon: Clock },
              { text: "Posting public content", icon: Fingerprint }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/5 border border-secondary/20"
              >
                <div className="p-2 rounded-lg bg-secondary/20">
                  <item.icon className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Emergency Stop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setEmergencyMode(!emergencyMode)}
          className={`w-full p-6 rounded-2xl border-2 transition-all ${
            emergencyMode
              ? "bg-gradient-to-br from-destructive/30 to-destructive/10 border-destructive shadow-lg shadow-destructive/20"
              : "bg-card/50 border-destructive/30 hover:border-destructive/50 hover:bg-destructive/5"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${emergencyMode ? "bg-destructive/30" : "bg-destructive/10"}`}>
              <AlertTriangle className={`h-8 w-8 ${emergencyMode ? "text-destructive animate-pulse" : "text-destructive/70"}`} />
            </div>
            <div className="text-left flex-1">
              <p className={`text-xl font-display font-medium ${emergencyMode ? "text-destructive" : "text-foreground"}`}>
                {emergencyMode ? "⚠️ All Automation Paused" : "Emergency Stop"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {emergencyMode ? "Click again to resume all automated actions" : "Instantly pause all outbound actions"}
              </p>
            </div>
            {emergencyMode && (
              <div className="w-3 h-3 rounded-full bg-destructive animate-ping" />
            )}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}

function OverviewTab({ data }: { data: typeof sovereigntyData }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Data Ownership Score */}
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-medium text-muted-foreground mb-6">Data Ownership</h3>
          <MetricRing
            label="Owned"
            value={`${data.overview.dataOwnership}%`}
            percentage={data.overview.dataOwnership}
            color="gold"
            size={140}
          />
          <p className="text-sm text-muted-foreground mt-6">You control 94% of your digital footprint</p>
        </GlassCard>
      </div>

      {/* Quick Stats */}
      <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
        <StatCard
          icon={Lock}
          title="Privacy Score"
          value={`${data.overview.privacyScore}`}
          subtitle="/ 100"
          color="cyan"
        />
        <StatCard
          icon={Laptop}
          title="Sessions"
          value={`${data.overview.activeSessions}`}
          subtitle="active"
          color="gold"
        />
        <StatCard
          icon={Zap}
          title="Automation"
          value={`${data.overview.automationRules}`}
          subtitle="rules"
          color="cyan"
        />
        <StatCard
          icon={Globe}
          title="Independence"
          value={`${data.overview.platformIndependence}%`}
          subtitle="score"
          color="gold"
        />
      </div>

      {/* Active Sessions */}
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-secondary/10">
              <Fingerprint className="h-5 w-5 text-secondary" />
            </div>
            <h3 className="font-medium">Active Sessions</h3>
          </div>
          <div className="space-y-3">
            {data.identity.sessions.map((session, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3">
                  {session.device.includes("MacBook") ? (
                    <Laptop className="h-5 w-5 text-muted-foreground" />
                  ) : session.device.includes("iPhone") ? (
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Tablet className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{session.device}</p>
                    <p className="text-xs text-muted-foreground">{session.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Top Automation Rules */}
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Top Automation Rules</h3>
          </div>
          <div className="space-y-3">
            {data.automation.topRules.map((rule, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-foreground">{rule.name}</span>
                <span className="text-sm text-muted-foreground">{rule.triggers} triggers</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function DataTab({ data }: { data: typeof sovereigntyData.data }) {
  const getIcon = (name: string) => {
    if (name === "Documents") return FileText;
    if (name === "Media") return Image;
    if (name === "Emails") return Mail;
    return Cloud;
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-medium text-muted-foreground mb-4">Total Data</h3>
          <span className="text-5xl font-display font-bold text-foreground">{data.totalData}</span>
          <div className="flex items-center gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-secondary">{data.ownedData}</p>
              <p className="text-xs text-muted-foreground">Owned</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-semibold text-primary">{data.externalData}</p>
              <p className="text-xs text-muted-foreground">External</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Data Categories</h3>
          <div className="space-y-3">
            {data.categories.map((cat, i) => {
              const Icon = getIcon(cat.name);
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{cat.size}</span>
                    {cat.owned ? (
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    ) : (
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4">Last export: {data.lastExport}</p>
        </GlassCard>
      </div>
    </div>
  );
}

function PrivacyTab({ data }: { data: typeof sovereigntyData.privacy }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          <MetricRing
            label="Privacy Score"
            value={`${data.score}`}
            percentage={data.score}
            color="cyan"
            size={160}
          />
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-6 space-y-4">
        <StatCard icon={AlertTriangle} title="Exposures" value={`${data.exposures}`} subtitle="detected" color="gold" />
        <StatCard icon={Shield} title="VPN Status" value={data.vpnStatus} subtitle="secure" color="cyan" />
        <StatCard icon={Lock} title="Breach Monitor" value={data.dataBreachMonitoring} subtitle="status" color="gold" />
      </div>

      <div className="col-span-12">
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Recommendations</h3>
          <div className="space-y-3">
            {data.recommendations.map((rec, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <span className="text-foreground">{rec.action}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rec.priority === "High" 
                    ? "bg-destructive/20 text-destructive" 
                    : "bg-primary/20 text-primary"
                }`}>
                  {rec.priority}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function IdentityTab({ data }: { data: typeof sovereigntyData.identity }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8">
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Account Security</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 text-center">
              <p className="text-3xl font-display font-bold text-foreground">{data.accounts}</p>
              <p className="text-sm text-muted-foreground">Total Accounts</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/10 text-center">
              <p className="text-3xl font-display font-bold text-secondary">{data.securePasswords}</p>
              <p className="text-sm text-muted-foreground">Secure Passwords</p>
            </div>
            <div className="p-4 rounded-xl bg-destructive/10 text-center">
              <p className="text-3xl font-display font-bold text-destructive">{data.weakPasswords}</p>
              <p className="text-sm text-muted-foreground">Weak Passwords</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 text-center">
              <p className="text-3xl font-display font-bold text-primary">{data.mfaEnabled}</p>
              <p className="text-sm text-muted-foreground">MFA Enabled</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Active Sessions</h3>
          <div className="space-y-3">
            {data.sessions.map((session, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                {session.device.includes("MacBook") ? (
                  <Laptop className="h-4 w-4 text-muted-foreground" />
                ) : session.device.includes("iPhone") ? (
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Tablet className="h-4 w-4 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-foreground">{session.device}</p>
                  <p className="text-xs text-muted-foreground">{session.location}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function AutomationTab({ data }: { data: typeof sovereigntyData.automation }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-4">
        <GlassCard className="p-6 text-center">
          <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
          <p className="text-4xl font-display font-bold text-foreground">{data.activeRules}</p>
          <p className="text-sm text-muted-foreground">Active Rules</p>
        </GlassCard>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <GlassCard className="p-6 text-center">
          <CheckCircle2 className="h-8 w-8 text-secondary mx-auto mb-4" />
          <p className="text-4xl font-display font-bold text-foreground">{data.rulesTriggered}</p>
          <p className="text-sm text-muted-foreground">Total Triggers</p>
        </GlassCard>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <GlassCard className="p-6 text-center">
          <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
          <p className="text-4xl font-display font-bold text-foreground">{data.timeSaved}</p>
          <p className="text-sm text-muted-foreground">Time Saved</p>
        </GlassCard>
      </div>

      <div className="col-span-12">
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Top Automation Rules</h3>
          <div className="space-y-3">
            {data.topRules.map((rule, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{rule.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{rule.triggers} triggers</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function FreedomTab({ data }: { data: typeof sovereigntyData.freedom }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-6">
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Platform Dependency</h3>
          <div className="space-y-4">
            {data.platformDependency.map((platform, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{platform.platform}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    platform.risk === "Medium" 
                      ? "bg-primary/20 text-primary" 
                      : "bg-secondary/20 text-secondary"
                  }`}>
                    {platform.risk} Risk
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${platform.dependency}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      platform.risk === "Medium" ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
        <StatCard icon={Shield} title="Portability" value={`${data.portabilityScore}%`} subtitle="score" color="cyan" />
        <StatCard icon={CheckCircle2} title="Exit Ready" value={data.exitReadiness} subtitle="status" color="gold" />
        <StatCard icon={Globe} title="Alternatives" value={`${data.alternatives}`} subtitle="available" color="cyan" />
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: any; 
  title: string; 
  value: string; 
  subtitle: string; 
  color: "cyan" | "gold";
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl ${color === "cyan" ? "bg-secondary/10" : "bg-primary/10"}`}>
          <Icon className={`h-4 w-4 ${color === "cyan" ? "text-secondary" : "text-primary"}`} />
        </div>
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-display font-semibold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </GlassCard>
  );
}
