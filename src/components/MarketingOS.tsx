import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scenario, Campaign, Experiment } from "@/lib/scenarioData";
import {
  TrendingUp,
  Zap,
  Target,
  Globe,
  Users,
  Sparkles,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Pause,
  Play,
  AlertCircle,
  Check,
  ChevronRight,
  Eye,
  Palette,
  Search,
  Share2,
} from "lucide-react";

interface MarketingOSProps {
  scenario: Scenario;
}

interface EngineCard {
  id: string;
  name: string;
  icon: any;
  status: "stable" | "optimizing" | "attention";
  statusText: string;
  metrics?: { label: string; value: string; trend?: "up" | "down" }[];
}

export function MarketingOS({ scenario }: MarketingOSProps) {
  const [activeEngine, setActiveEngine] = useState<string | null>(null);
  const { campaigns, experiments, metrics } = scenario;

  const engines: EngineCard[] = [
    {
      id: "demand",
      name: "Demand Engine",
      icon: Zap,
      status: "stable",
      statusText: "Stable. Scaling winners within budget.",
      metrics: [
        { label: "ROAS", value: campaigns[0]?.roas?.toFixed(1) || "—", trend: "up" },
        { label: "Daily Spend", value: `$${campaigns.reduce((sum, c) => sum + c.dailyBudget, 0)}` },
      ],
    },
    {
      id: "creative",
      name: "Creative Engine",
      icon: Palette,
      status: campaigns.some(c => c.fatigue === "high") ? "attention" : "stable",
      statusText: campaigns.some(c => c.fatigue === "high") 
        ? "Fatigue detected. Refreshing variants."
        : "Fatigue low. New variants deployed.",
      metrics: [
        { label: "Active Creatives", value: String(campaigns.length * 3) },
        { label: "Fatigue Level", value: campaigns.some(c => c.fatigue === "high") ? "High" : "Low" },
      ],
    },
    {
      id: "cro",
      name: "CRO Engine",
      icon: Target,
      status: "optimizing",
      statusText: "Drop-off reduced on landing page.",
      metrics: [
        { label: "Conversion Rate", value: "3.2%", trend: "up" },
        { label: "Tests Running", value: "2" },
      ],
    },
    {
      id: "seo",
      name: "SEO Engine",
      icon: Search,
      status: "stable",
      statusText: "2 pages published. 1 ranking improved.",
      metrics: [
        { label: "Organic Traffic", value: "+12%", trend: "up" },
        { label: "Keywords Ranking", value: "24" },
      ],
    },
    {
      id: "audience",
      name: "Audience Assets",
      icon: Users,
      status: "stable",
      statusText: "Owned reach increasing. Platform dependency down.",
      metrics: [
        { label: "Email List", value: "2,340" },
        { label: "SMS List", value: "890" },
      ],
    },
  ];

  const getStatusColor = (status: EngineCard["status"]) => {
    switch (status) {
      case "stable": return "bg-secondary/20 text-secondary";
      case "optimizing": return "bg-primary/20 text-primary";
      case "attention": return "bg-accent/20 text-accent";
    }
  };

  const getStatusIcon = (status: EngineCard["status"]) => {
    switch (status) {
      case "stable": return <Check className="h-3 w-3" />;
      case "optimizing": return <Sparkles className="h-3 w-3" />;
      case "attention": return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getExperimentStatus = (status: Experiment["status"]) => {
    switch (status) {
      case "testing": return { color: "bg-primary/20 text-primary", label: "Testing" };
      case "scaling": return { color: "bg-secondary/20 text-secondary", label: "Scaling" };
      case "killed": return { color: "bg-destructive/20 text-destructive", label: "Killed" };
      case "archived": return { color: "bg-muted text-muted-foreground", label: "Archived" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-display font-medium text-foreground">Growth Engine</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Demand, conversion, and retention — continuously optimized.
        </p>
      </div>

      {/* Engine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {engines.map((engine, index) => (
          <motion.div
            key={engine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard 
              className="p-5 cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => setActiveEngine(activeEngine === engine.id ? null : engine.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-foreground/5">
                    <engine.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-foreground">{engine.name}</h3>
                    <Badge 
                      variant="secondary" 
                      className={`mt-1 text-xs ${getStatusColor(engine.status)}`}
                    >
                      {getStatusIcon(engine.status)}
                      <span className="ml-1 capitalize">{engine.status}</span>
                    </Badge>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${
                  activeEngine === engine.id ? "rotate-90" : ""
                }`} />
              </div>

              <p className="text-xs text-muted-foreground mb-3">{engine.statusText}</p>

              {engine.metrics && (
                <div className="grid grid-cols-2 gap-2">
                  {engine.metrics.map((metric) => (
                    <div key={metric.label} className="p-2 rounded-lg bg-foreground/5">
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        {metric.value}
                        {metric.trend === "up" && <ArrowUpRight className="h-3 w-3 text-secondary" />}
                        {metric.trend === "down" && <ArrowDownRight className="h-3 w-3 text-destructive" />}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Active Campaigns */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Active Campaigns</h3>
          <Badge variant="secondary">{campaigns.filter(c => c.status === "active").length} running</Badge>
        </div>

        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-4 rounded-xl bg-foreground/5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  campaign.status === "active" ? "bg-secondary" :
                  campaign.status === "testing" ? "bg-primary" :
                  "bg-muted-foreground"
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground capitalize">{campaign.channel}</p>
                    <span className="text-xs text-muted-foreground">• {campaign.objective}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${campaign.dailyBudget}/day • ROAS {campaign.roas?.toFixed(1) || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary"
                  className={`text-xs ${
                    campaign.fatigue === "low" ? "bg-secondary/20 text-secondary" :
                    campaign.fatigue === "medium" ? "bg-primary/20 text-primary" :
                    "bg-destructive/20 text-destructive"
                  }`}
                >
                  Fatigue: {campaign.fatigue}
                </Badge>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {campaign.status === "active" ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Experiments */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Experiments</h3>
          <div className="flex gap-2">
            {["testing", "scaling", "killed"].map((status) => {
              const count = experiments.filter(e => e.status === status).length;
              if (count === 0) return null;
              const statusInfo = getExperimentStatus(status as Experiment["status"]);
              return (
                <Badge key={status} variant="secondary" className={`text-xs ${statusInfo.color}`}>
                  {count} {statusInfo.label}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          {experiments.map((experiment) => {
            const statusInfo = getExperimentStatus(experiment.status);
            return (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${statusInfo.color}`}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{experiment.name}</p>
                    <p className="text-xs text-muted-foreground">{experiment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary">{experiment.impact}</p>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-16 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${experiment.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(experiment.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
