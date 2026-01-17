import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { GlassCard } from "@/components/GlassCard";
import { MetricRing } from "@/components/MetricRing";
import { sovereigntyData } from "@/lib/demoData";
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
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { id: "overview", label: "Overview" },
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
