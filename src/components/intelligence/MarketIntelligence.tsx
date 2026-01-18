import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { TrendingUp, Target, Users, Zap, Eye, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const marketShare = [
  { competitor: "Your Brand", share: 28, growth: 3.2 },
  { competitor: "Competitor A", share: 24, growth: 1.1 },
  { competitor: "Competitor B", share: 18, growth: -0.5 },
  { competitor: "Competitor C", share: 15, growth: 2.8 },
  { competitor: "Others", share: 15, growth: -1.2 },
];

const competitorMoves = [
  { competitor: "Competitor A", action: "Launched new pricing tier", impact: "medium", date: "Jan 15" },
  { competitor: "Competitor B", action: "Acquired startup in adjacent market", impact: "high", date: "Jan 12" },
  { competitor: "Competitor C", action: "Expanded to European market", impact: "low", date: "Jan 8" },
];

const opportunities = [
  { name: "Enterprise Segment", potential: "$2.4M", confidence: 78, timeframe: "Q1 2025" },
  { name: "Mobile App Market", potential: "$1.8M", confidence: 65, timeframe: "Q2 2025" },
  { name: "Partner Channel", potential: "$3.2M", confidence: 82, timeframe: "Q1-Q2 2025" },
];

const trends = [
  { trend: "AI Integration", relevance: 92, direction: "up" },
  { trend: "Sustainability", relevance: 78, direction: "up" },
  { trend: "Remote Work Tools", relevance: 85, direction: "stable" },
  { trend: "Privacy-First", relevance: 88, direction: "up" },
];

export function MarketIntelligence() {
  const yourShare = marketShare.find(m => m.competitor === 'Your Brand');
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Market Share"
          value={`${yourShare?.share}%`}
          subtitle={`+${yourShare?.growth}% YoY`}
          icon={Target}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="Market Rank"
          value="#1"
          subtitle="In primary segment"
          icon={TrendingUp}
          status="healthy"
        />
        <MetricSignalCard
          title="Competitors Tracked"
          value="12"
          subtitle="Active monitoring"
          icon={Eye}
          status="neutral"
        />
        <MetricSignalCard
          title="Opportunity Value"
          value="$7.4M"
          subtitle="Pipeline identified"
          icon={Zap}
          status="healthy"
          trend="up"
        />
      </div>

      {/* Market Share Chart */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Market Share Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketShare} layout="vertical">
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="competitor" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value}%`, 'Market Share']}
              />
              <Bar 
                dataKey="share" 
                fill="#D4AF37" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Competitor Activity */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Competitor Activity</h3>
          <div className="space-y-3">
            {competitorMoves.map((move, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${
                  move.impact === 'high' ? 'bg-destructive/5 border border-destructive/20' :
                  move.impact === 'medium' ? 'bg-primary/5 border border-primary/20' :
                  'bg-muted/20'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-foreground">{move.competitor}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    move.impact === 'high' ? 'bg-destructive/10 text-destructive' :
                    move.impact === 'medium' ? 'bg-primary/10 text-primary' :
                    'bg-muted/30 text-muted-foreground'
                  }`}>
                    {move.impact} impact
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{move.action}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{move.date}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          {/* Opportunities */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Opportunities</h3>
            <div className="space-y-3">
              {opportunities.map((opp, index) => (
                <motion.div
                  key={opp.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl bg-muted/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{opp.name}</span>
                    <span className="text-sm font-bold text-secondary">{opp.potential}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{opp.confidence}% confidence</span>
                    <span>{opp.timeframe}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Market Trends */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Market Trends</h3>
            <div className="space-y-3">
              {trends.map((trend, index) => (
                <motion.div
                  key={trend.trend}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{trend.trend}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{trend.relevance}%</span>
                      <TrendingUp className={`h-3 w-3 ${
                        trend.direction === 'up' ? 'text-secondary' :
                        trend.direction === 'down' ? 'text-destructive rotate-180' :
                        'text-muted-foreground'
                      }`} />
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${trend.relevance}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
