import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { TrendingUp, Briefcase, BarChart3, Coins } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const portfolioAllocation = [
  { name: "Stocks", value: 45, color: "#D4AF37" },
  { name: "Bonds", value: 20, color: "#22c55e" },
  { name: "Real Estate", value: 15, color: "#06b6d4" },
  { name: "Crypto", value: 10, color: "#a855f7" },
  { name: "Cash", value: 10, color: "#64748b" },
];

const holdings = [
  { symbol: "VTI", name: "Vanguard Total Stock", value: 125000, change: 2.4, allocation: 25 },
  { symbol: "AAPL", name: "Apple Inc.", value: 45000, change: -0.8, allocation: 9 },
  { symbol: "BND", name: "Vanguard Bond Index", value: 100000, change: 0.3, allocation: 20 },
  { symbol: "VNQ", name: "Vanguard Real Estate", value: 75000, change: 1.2, allocation: 15 },
  { symbol: "BTC", name: "Bitcoin", value: 50000, change: 5.6, allocation: 10 },
];

export function InvestmentPortfolio() {
  const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Portfolio Value"
          value="$500,000"
          subtitle="+$12,450 (2.5%)"
          icon={Briefcase}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="YTD Return"
          value="+18.4%"
          subtitle="vs S&P +15.2%"
          icon={TrendingUp}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="Dividend Yield"
          value="2.8%"
          subtitle="$14,000/year"
          icon={Coins}
          status="neutral"
        />
        <MetricSignalCard
          title="Risk Score"
          value="Moderate"
          subtitle="Well diversified"
          icon={BarChart3}
          status="neutral"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Asset Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {portfolioAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {portfolioAllocation.map((asset) => (
              <div key={asset.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: asset.color }} />
                <span className="text-xs text-muted-foreground">{asset.name}</span>
                <span className="text-xs font-medium text-foreground ml-auto">{asset.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Top Holdings */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Holdings</h3>
          <div className="space-y-3">
            {holdings.map((holding, index) => (
              <motion.div
                key={holding.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{holding.symbol}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{holding.name}</p>
                    <p className="text-xs text-muted-foreground">{holding.allocation}% of portfolio</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    ${holding.value.toLocaleString()}
                  </p>
                  <p className={`text-xs ${holding.change >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                    {holding.change >= 0 ? '+' : ''}{holding.change}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
