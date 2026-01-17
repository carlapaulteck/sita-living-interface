import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { MetricRing } from "@/components/MetricRing";
import { SitaOrb3D } from "@/components/SitaOrb3D";
import bgParticles from "@/assets/bg-particles.jpg";
import { 
  ArrowLeft,
  TrendingUp,
  Zap,
  DollarSign,
  Settings,
  Brain,
  ChevronRight,
  Check,
  AlertCircle,
  Activity,
  Users,
  Target,
  Shield,
  BarChart3,
  Wallet
} from "lucide-react";

type Tab = "overview" | "growth" | "revenue" | "operations" | "intelligence" | "wealth";

// Signal Card Component
function SignalCard({ 
  title, 
  value, 
  subtitle, 
  status = "neutral",
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  subtitle?: string;
  status?: "positive" | "negative" | "neutral";
  icon?: typeof TrendingUp;
}) {
  const statusColors = {
    positive: "text-secondary",
    negative: "text-destructive",
    neutral: "text-muted-foreground"
  };

  return (
    <GlassCard className="p-5 group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{title}</span>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-foreground/5 group-hover:bg-primary/10 transition-colors">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <div className={`text-2xl font-semibold ${statusColors[status]}`}>
        {value}
      </div>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </GlassCard>
  );
}

// Insight Item Component
function InsightItem({ 
  text, 
  type = "info",
  action 
}: { 
  text: string; 
  type?: "success" | "info" | "warning";
  action?: string;
}) {
  const icons = {
    success: <Check className="h-4 w-4 text-secondary" />,
    info: <Activity className="h-4 w-4 text-primary" />,
    warning: <AlertCircle className="h-4 w-4 text-primary" />
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors cursor-pointer group">
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <p className="text-sm text-foreground/80">{text}</p>
        {action && (
          <button className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {action} →
          </button>
        )}
      </div>
    </div>
  );
}

// Advisor Card Component
function AdvisorCard({ 
  role, 
  insight,
  status = "confident"
}: { 
  role: string; 
  insight: string;
  status?: "confident" | "cautious" | "alert";
}) {
  const statusColors = {
    confident: "border-secondary/30 bg-secondary/5",
    cautious: "border-primary/30 bg-primary/5",
    alert: "border-destructive/30 bg-destructive/5"
  };

  return (
    <GlassCard className={`p-4 ${statusColors[status]}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center">
          <Brain className="h-4 w-4 text-foreground" />
        </div>
        <span className="text-sm font-medium text-foreground">{role}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">"{insight}"</p>
    </GlassCard>
  );
}

// Tab Navigation
function TabNav({ activeTab, onTabChange }: { activeTab: Tab; onTabChange: (tab: Tab) => void }) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "growth", label: "Growth" },
    { id: "revenue", label: "Revenue" },
    { id: "operations", label: "Operations" },
    { id: "intelligence", label: "Intelligence" },
    { id: "wealth", label: "Wealth" },
  ];

  return (
    <div className="flex gap-1 p-1 rounded-2xl bg-foreground/5 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
            activeTab === tab.id
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Overview Tab Content
function OverviewTab() {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      {/* Left: What's Happening */}
      <div className="col-span-12 lg:col-span-4 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">What's Happening</h3>
        
        <GlassCard className="p-4">
          <InsightItem 
            text="Recovered $1,240 from dormant leads this week"
            type="success"
            action="View details"
          />
          <InsightItem 
            text="2 offers testing · 1 scaling · 1 paused"
            type="info"
            action="Manage experiments"
          />
          <InsightItem 
            text="+312 owned subscribers this week"
            type="success"
          />
        </GlassCard>
      </div>

      {/* Center: Business Pulse */}
      <div className="col-span-12 lg:col-span-4">
        <GlassCard className="p-6 flex flex-col items-center">
          <div className="w-full h-40 mb-6">
            <SitaOrb3D state="idle" />
          </div>
          
          <h2 className="text-lg font-display font-medium text-foreground mb-6">Business Pulse</h2>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center p-3 rounded-xl bg-foreground/5">
              <div className="text-2xl font-semibold text-secondary">+$5,420</div>
              <div className="text-xs text-muted-foreground">Revenue Velocity</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-foreground/5">
              <div className="text-2xl font-semibold text-primary">87%</div>
              <div className="text-xs text-muted-foreground">Growth Ready</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-foreground/5">
              <div className="text-2xl font-semibold text-secondary">72%</div>
              <div className="text-xs text-muted-foreground">Autonomy</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-foreground/5">
              <div className="text-2xl font-semibold text-secondary">Low</div>
              <div className="text-xs text-muted-foreground">Risk Level</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Right: Needs You */}
      <div className="col-span-12 lg:col-span-4 space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Needs You (If Anything)</h3>
        
        <GlassCard className="p-6 flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
            <Check className="h-6 w-6 text-secondary" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Everything is handled.<br />
            No decisions required.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

// Growth Tab Content
function GrowthTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GlassCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Demand Engine</h3>
            <p className="text-xs text-secondary">Active · No action required</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          3 channels active · ROAS stable at 4.2x · Budget optimization running
        </p>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Creative Engine</h3>
            <p className="text-xs text-secondary">Healthy · Fatigue low</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          New creatives deployed 3h ago · Performance tracking · 2 variants testing
        </p>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">SEO & Content</h3>
            <p className="text-xs text-secondary">Growing</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          2 pages published · 1 ranking improved · Authority score: 42
        </p>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Audience Engine</h3>
            <p className="text-xs text-secondary">Expanding</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Email/SMS ownership increasing · Dependency risk ↓ · List health: 94%
        </p>
      </GlassCard>
    </div>
  );
}

// Revenue Tab Content
function RevenueTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SignalCard 
          title="Earned"
          value="$12,840"
          subtitle="This month"
          status="positive"
          icon={DollarSign}
        />
        <SignalCard 
          title="Recovered"
          value="$1,240"
          subtitle="From dormant leads"
          status="positive"
          icon={TrendingUp}
        />
        <SignalCard 
          title="Pending"
          value="$3,200"
          subtitle="Awaiting payment"
          status="neutral"
          icon={Activity}
        />
        <SignalCard 
          title="At Risk"
          value="$420"
          subtitle="1 invoice overdue"
          status="negative"
          icon={AlertCircle}
        />
      </div>

      <GlassCard className="p-5">
        <h3 className="text-sm font-medium text-foreground mb-4">Money Flow Status</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-4xl font-display font-medium text-secondary mb-2">Revenue is healthy.</div>
            <p className="text-muted-foreground">All systems operating normally. No intervention required.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// Operations Tab Content
function OperationsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <GlassCard className="p-5 flex flex-col items-center text-center">
        <MetricRing label="Capacity" value="78%" percentage={78} color="cyan" size={100} />
        <p className="text-sm text-muted-foreground mt-4">Operating safely · Room to scale</p>
      </GlassCard>

      <GlassCard className="p-5 flex flex-col items-center text-center">
        <MetricRing label="Team Load" value="65%" percentage={65} color="cyan" size={100} />
        <p className="text-sm text-muted-foreground mt-4">No burnout risk detected</p>
      </GlassCard>

      <GlassCard className="p-5 flex flex-col items-center text-center">
        <MetricRing label="Delivery" value="100%" percentage={100} color="gold" size={100} />
        <p className="text-sm text-muted-foreground mt-4">0 SLA breaches this week</p>
      </GlassCard>
    </div>
  );
}

// Intelligence Tab Content
function IntelligenceTab() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <AdvisorCard 
        role="CEO"
        insight="Overall trajectory is positive. Focus on scaling what's working before expanding into new areas."
        status="confident"
      />
      <AdvisorCard 
        role="CFO"
        insight="Cashflow supports scaling ads by +15% safely. Reserve runway is at 4.2 months."
        status="confident"
      />
      <AdvisorCard 
        role="CMO"
        insight="Creative fatigue is low. Consider increasing ad spend on top performers."
        status="confident"
      />
      <AdvisorCard 
        role="COO"
        insight="Capacity supports growth until next week. Consider pre-hiring for Q2."
        status="cautious"
      />
      <AdvisorCard 
        role="CRO"
        insight="Pipeline is healthy. Focus on closing existing deals before adding more leads."
        status="confident"
      />
      <AdvisorCard 
        role="R&D"
        insight="Current product iteration stable. User feedback suggests minor UX improvements."
        status="confident"
      />
    </div>
  );
}

// Wealth Tab Content
function WealthTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GlassCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-foreground">Active Microbrands</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          3 running · 1 scaling · 2 archived
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Brand Alpha</span>
            <span className="text-secondary">Scaling +24%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Brand Beta</span>
            <span className="text-muted-foreground">Stable</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Brand Gamma</span>
            <span className="text-muted-foreground">Testing</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-foreground">Arbitrage Signals</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          1 opportunity detected · 63% margin
        </p>
        <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
          <p className="text-sm text-foreground">New arbitrage opportunity in niche market</p>
          <button className="text-xs text-secondary mt-2 flex items-center gap-1">
            Review opportunity <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-foreground">Capital Allocation</h3>
        </div>
        <div className="flex items-center gap-3">
          <Check className="h-5 w-5 text-secondary" />
          <p className="text-sm text-muted-foreground">Reinvestment optimal · No action required</p>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium text-foreground">Exit Readiness</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          1 asset approaching sell threshold
        </p>
        <div className="mt-3 h-2 rounded-full bg-foreground/10 overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-primary to-secondary rounded-full" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">75% to optimal exit window</p>
      </GlassCard>
    </div>
  );
}

export default function BusinessGrowth() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const navigate = useNavigate();

  const tabContent = {
    overview: <OverviewTab />,
    growth: <GrowthTab />,
    revenue: <RevenueTab />,
    operations: <OperationsTab />,
    intelligence: <IntelligenceTab />,
    wealth: <WealthTab />,
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-background bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgParticles})` }}
      />
      <div className="fixed inset-0 bg-background/70" />

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/")}
                className="p-2 rounded-xl border border-foreground/10 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-2xl font-display font-medium text-foreground">Business Growth</h1>
                <p className="text-sm text-muted-foreground">The control room of your living company</p>
              </div>
            </div>
            <button className="p-2 rounded-xl border border-foreground/10 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
