import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { GlassCard } from "@/components/GlassCard";
import { MetricRing } from "@/components/MetricRing";
import { UnifiedInbox } from "@/components/UnifiedInbox";
import { WorkflowPacks } from "@/components/WorkflowPacks";
import { CommandBar } from "@/components/CommandBar";
import { ConversationConsole } from "@/components/ConversationConsole";
import { AvatarBubble } from "@/components/AvatarBubble";
import { WarRoom } from "@/components/WarRoom";
import { WakeUpReceipt } from "@/components/WakeUpReceipt";
import { ScenarioSwitcher } from "@/components/ScenarioSwitcher";
import { IntegrationsHub } from "@/components/IntegrationsHub";
import { BoundariesPanel } from "@/components/BoundariesPanel";
import { AdvisorPanel } from "@/components/AdvisorPanel";
import { MoneyFlow } from "@/components/MoneyFlow";
import bgParticles from "@/assets/bg-particles.jpg";
import { scenarios, ScenarioType } from "@/lib/scenarioData";
import {
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  AlertTriangle,
  Check,
  Sparkles,
  Target,
  Inbox,
  Workflow,
  Map,
  Sunrise,
  Shield,
  Zap,
  MessageSquare,
  Settings,
  Link2,
  Brain,
} from "lucide-react";

const BusinessGrowth = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "inbox" | "packs" | "growth" | "money">("overview");
  const [showInbox, setShowInbox] = useState(false);
  const [showPacks, setShowPacks] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showWarRoom, setShowWarRoom] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(false);
  const [showAdvisors, setShowAdvisors] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<ScenarioType>("service");

  const scenario = scenarios[currentScenario];
  const { metrics, experiments, campaigns, deals } = scenario;

  const handleCommand = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("inbox") || lower.includes("message")) {
      setShowInbox(true);
    } else if (lower.includes("pack") || lower.includes("autopilot") || lower.includes("workflow")) {
      setShowPacks(true);
    } else if (lower.includes("war") || lower.includes("map") || lower.includes("system")) {
      setShowWarRoom(true);
    } else if (lower.includes("receipt") || lower.includes("wake")) {
      setShowReceipt(true);
    } else {
      setShowConsole(true);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "packs", label: "Autopilot", icon: Workflow },
    { id: "growth", label: "Growth", icon: TrendingUp },
    { id: "money", label: "Money", icon: DollarSign },
  ] as const;

  // System status message
  const getStatusMessage = () => {
    const riskLevel = metrics.risk;
    if (riskLevel === "low") return "Systems stable. No action required.";
    if (riskLevel === "medium") return "One item needs review.";
    return "Attention needed on critical items.";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="fixed inset-0 bg-background bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgParticles})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-secondary/5 via-background/80 to-primary/5" />
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <Header />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-medium text-foreground">
                Business Pulse
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Live status across revenue, demand, and risk.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ScenarioSwitcher 
                currentScenario={currentScenario} 
                onScenarioChange={setCurrentScenario} 
              />
              <button
                onClick={() => setShowIntegrations(true)}
                className="p-2 rounded-xl bg-card/50 border border-border/50 hover:bg-card/80 transition-colors"
                title="Connections"
              >
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => setShowBoundaries(true)}
                className="p-2 rounded-xl bg-card/50 border border-border/50 hover:bg-card/80 transition-colors"
                title="Boundaries"
              >
                <Shield className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => setShowAdvisors(true)}
                className="p-2 rounded-xl bg-card/50 border border-border/50 hover:bg-card/80 transition-colors"
                title="Advisory Council"
              >
                <Brain className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 mb-6 overflow-x-auto pb-2"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "inbox") setShowInbox(true);
                  else if (tab.id === "packs") setShowPacks(true);
                  else setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-card/50 text-muted-foreground hover:bg-card/80 border border-border/50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {activeTab === "overview" && (
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="col-span-12 lg:col-span-8"
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-foreground">System Health</h2>
                    <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                      All Systems Stable
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <MetricRing
                      label="Revenue Velocity"
                      value={`$${metrics.revenueVelocity.toLocaleString()}`}
                      percentage={75}
                      color="gold"
                      size={90}
                    />
                    <MetricRing
                      label="Growth Readiness"
                      value={`${Math.round(metrics.growthReadiness * 100)}%`}
                      percentage={metrics.growthReadiness * 100}
                      color="cyan"
                      size={90}
                    />
                    <MetricRing
                      label="Autonomy"
                      value={`${Math.round(metrics.autonomy * 100)}%`}
                      percentage={metrics.autonomy * 100}
                      color="purple"
                      size={90}
                    />
                    <MetricRing
                      label="Risk Level"
                      value={metrics.risk.toUpperCase()}
                      percentage={metrics.risk === "low" ? 20 : metrics.risk === "medium" ? 50 : 80}
                      color={metrics.risk === "low" ? "cyan" : "gold"}
                      size={90}
                    />
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="col-span-12 lg:col-span-4"
              >
                <GlassCard className="p-6 h-full">
                  <h2 className="text-lg font-medium text-foreground mb-4">Needs You</h2>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-secondary" />
                    </div>
                    <p className="text-muted-foreground text-sm">Nothing needs your attention.</p>
                    <p className="text-muted-foreground/60 text-xs mt-1">Everything important is handled.</p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="col-span-12 md:col-span-6 lg:col-span-3"
              >
                <GlassCard className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Recovered Revenue</p>
                      <p className="text-2xl font-display font-medium text-foreground mt-1">
                        ${metrics.recoveredRevenueWeek.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">in the last 24 hours</p>
                    </div>
                    <div className="p-2 rounded-xl bg-secondary/20">
                      <DollarSign className="h-5 w-5 text-secondary" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="col-span-12 md:col-span-6 lg:col-span-3"
              >
                <GlassCard className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Experiments</p>
                      <p className="text-2xl font-display font-medium text-foreground mt-1">
                        {experiments.length}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {experiments.filter(e => e.status === "scaling").length} scaling
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-primary/20">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="col-span-12 md:col-span-6 lg:col-span-3"
              >
                <GlassCard className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Time Returned</p>
                      <p className="text-2xl font-display font-medium text-foreground mt-1">
                        {metrics.timeSavedHoursWeek}h
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">saved this week</p>
                    </div>
                    <div className="p-2 rounded-xl bg-accent/20">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="col-span-12 md:col-span-6 lg:col-span-3"
              >
                <GlassCard className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="text-2xl font-display font-medium text-foreground mt-1">
                        {Math.round((scenario.businessProfile.capacity?.usedSlots || 0) / (scenario.businessProfile.capacity?.weeklySlots || 1) * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Safe to scale</p>
                    </div>
                    <div className="p-2 rounded-xl bg-secondary/20">
                      <Target className="h-5 w-5 text-secondary" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="col-span-12 lg:col-span-6"
              >
                <GlassCard className="p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4">Active Experiments</h2>
                  <div className="space-y-3">
                    {experiments.map((exp) => (
                      <div
                        key={exp.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-foreground/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            exp.status === "scaling" ? "bg-secondary" :
                            exp.status === "testing" ? "bg-primary" :
                            "bg-muted-foreground"
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{exp.name}</p>
                            <p className="text-xs text-muted-foreground">{exp.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-secondary">{exp.impact}</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(exp.confidence * 100)}% confidence
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="col-span-12 lg:col-span-6"
              >
                <GlassCard className="p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4">Pipeline</h2>
                  <div className="space-y-3">
                    {deals.map((deal) => {
                      const contact = scenario.contacts.find(c => c.id === deal.contactId);
                      return (
                        <div
                          key={deal.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-foreground/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                              <Users className="h-4 w-4 text-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{contact?.name}</p>
                              <p className="text-xs text-muted-foreground">{deal.stage}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-primary">${deal.value.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{deal.nextBestAction}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          )}

          {activeTab === "growth" && (
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-12"
              >
                <h2 className="text-lg font-medium text-foreground mb-4">Growth Engine</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Demand, conversion, and retention — continuously optimized.
                </p>
              </motion.div>

              {[
                { title: "Demand Engine", status: "Stable", desc: "Scaling winners within budget", icon: TrendingUp },
                { title: "Creative Engine", status: "Active", desc: "Fatigue low. New variants deployed.", icon: Sparkles },
                { title: "CRO Engine", status: "Optimizing", desc: "Drop-off reduced on landing page.", icon: Target },
                { title: "Audience Assets", status: "Growing", desc: "Owned reach increasing.", icon: Users },
              ].map((engine, i) => (
                <motion.div 
                  key={engine.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="col-span-12 md:col-span-6 lg:col-span-3"
                >
                  <GlassCard className="p-5 h-full">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-primary/20">
                        <engine.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{engine.title}</h3>
                        <span className="text-xs text-secondary">{engine.status}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{engine.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="col-span-12"
              >
                <GlassCard className="p-6">
                  <h3 className="font-medium text-foreground mb-4">Active Campaigns</h3>
                  <div className="space-y-3">
                    {campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-foreground/5"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            campaign.status === "active" ? "bg-secondary" :
                            campaign.status === "testing" ? "bg-primary" :
                            "bg-muted-foreground"
                          }`} />
                          <div>
                            <p className="font-medium text-foreground capitalize">{campaign.channel} • {campaign.objective}</p>
                            <p className="text-xs text-muted-foreground">
                              ${campaign.dailyBudget}/day • Fatigue: {campaign.fatigue}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {campaign.roas && (
                            <p className="text-lg font-medium text-secondary">{campaign.roas}x ROAS</p>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            campaign.status === "active" ? "bg-secondary/20 text-secondary" :
                            campaign.status === "testing" ? "bg-primary/20 text-primary" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          )}

          {activeTab === "money" && (
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-12"
              >
                <h2 className="text-lg font-medium text-foreground mb-4">Money Flow</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Earned, pending, and protected.
                </p>
              </motion.div>

              {[
                { title: "Earned", value: `$${(metrics.revenueVelocity * 4).toLocaleString()}`, change: "+12%", icon: DollarSign, color: "secondary" },
                { title: "Recovered", value: `$${metrics.recoveredRevenueWeek.toLocaleString()}`, change: "+8%", icon: TrendingUp, color: "secondary" },
                { title: "Pending", value: `$${deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}`, change: null, icon: Clock, color: "primary" },
                { title: "At Risk", value: "$0", change: null, icon: AlertTriangle, color: "muted" },
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="col-span-12 sm:col-span-6 lg:col-span-3"
                >
                  <GlassCard className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-xl ${
                        item.color === "secondary" ? "bg-secondary/20" :
                        item.color === "primary" ? "bg-primary/20" :
                        "bg-foreground/10"
                      }`}>
                        <item.icon className={`h-5 w-5 ${
                          item.color === "secondary" ? "text-secondary" :
                          item.color === "primary" ? "text-primary" :
                          "text-muted-foreground"
                        }`} />
                      </div>
                      {item.change && (
                        <span className="flex items-center text-xs text-secondary">
                          <ArrowUpRight className="h-3 w-3" />
                          {item.change}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                    <p className="text-2xl font-display font-medium text-foreground mt-1">
                      {item.value}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="col-span-12 lg:col-span-6"
              >
                <GlassCard className="p-6">
                  <h3 className="font-medium text-foreground mb-4">Quotes</h3>
                  <div className="space-y-3">
                    {scenario.quotes.map((quote) => {
                      const deal = deals.find(d => d.id === quote.dealId);
                      const contact = scenario.contacts.find(c => c.id === deal?.contactId);
                      return (
                        <div
                          key={quote.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-foreground/5"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{contact?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Expires {new Date(quote.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-primary">${quote.total}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              quote.status === "sent" ? "bg-primary/20 text-primary" :
                              quote.status === "accepted" ? "bg-secondary/20 text-secondary" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {quote.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="col-span-12 lg:col-span-6"
              >
                <GlassCard className="p-6">
                  <h3 className="font-medium text-foreground mb-4">Invoices</h3>
                  <div className="space-y-3">
                    {scenario.invoices.map((invoice) => {
                      const deal = deals.find(d => d.id === invoice.dealId);
                      const contact = scenario.contacts.find(c => c.id === deal?.contactId);
                      return (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-foreground/5"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{contact?.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{invoice.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-primary">${invoice.total}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              invoice.status === "paid" ? "bg-secondary/20 text-secondary" :
                              invoice.status === "sent" ? "bg-primary/20 text-primary" :
                              invoice.status === "overdue" ? "bg-destructive/20 text-destructive" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="fixed bottom-24 right-4 flex flex-col gap-2 z-30">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setShowReceipt(true)}
          className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm hover:scale-105 transition-transform"
          title="Wake-Up Receipt"
        >
          <Sunrise className="h-5 w-5 text-primary" />
        </motion.button>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          onClick={() => setShowWarRoom(true)}
          className="p-3 rounded-xl bg-card/80 border border-border/50 backdrop-blur-sm hover:scale-105 transition-transform"
          title="War Room"
        >
          <Map className="h-5 w-5 text-muted-foreground" />
        </motion.button>
      </div>

      <CommandBar onSubmit={handleCommand} />

      <div onClick={() => setShowConsole(true)}>
        <AvatarBubble />
      </div>

      <AnimatePresence>
        {showInbox && <UnifiedInbox isOpen={showInbox} onClose={() => setShowInbox(false)} />}
        {showPacks && <WorkflowPacks isOpen={showPacks} onClose={() => setShowPacks(false)} />}
        {showConsole && <ConversationConsole isOpen={showConsole} onClose={() => setShowConsole(false)} />}
        {showWarRoom && <WarRoom isOpen={showWarRoom} onClose={() => setShowWarRoom(false)} />}
        {showReceipt && <WakeUpReceipt isOpen={showReceipt} onClose={() => setShowReceipt(false)} />}
        {showIntegrations && <IntegrationsHub isOpen={showIntegrations} onClose={() => setShowIntegrations(false)} />}
        {showBoundaries && <BoundariesPanel isOpen={showBoundaries} onClose={() => setShowBoundaries(false)} />}
        {showAdvisors && <AdvisorPanel isOpen={showAdvisors} onClose={() => setShowAdvisors(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default BusinessGrowth;
