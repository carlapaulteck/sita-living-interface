import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Target, Calendar, TrendingUp, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const projectionData = [
  { age: 35, savings: 150000 },
  { age: 40, savings: 350000 },
  { age: 45, savings: 620000 },
  { age: 50, savings: 980000 },
  { age: 55, savings: 1450000 },
  { age: 60, savings: 2100000 },
  { age: 65, savings: 2850000 },
];

const retirementAccounts = [
  { name: "401(k)", balance: 180000, contribution: 22500, maxContribution: 23000 },
  { name: "Roth IRA", balance: 45000, contribution: 6500, maxContribution: 7000 },
  { name: "HSA", balance: 12000, contribution: 3200, maxContribution: 4150 },
  { name: "Brokerage", balance: 85000, contribution: 15000, maxContribution: null },
];

export function RetirementPlanning() {
  const totalBalance = retirementAccounts.reduce((acc, a) => acc + a.balance, 0);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Retirement Savings"
          value={`$${(totalBalance / 1000).toFixed(0)}K`}
          subtitle="Across all accounts"
          icon={Landmark}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="Target Age"
          value="65"
          subtitle="30 years away"
          icon={Calendar}
          status="neutral"
        />
        <MetricSignalCard
          title="On Track"
          value="112%"
          subtitle="Ahead of schedule"
          icon={Target}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="Monthly Savings"
          value="$3,850"
          subtitle="23% of income"
          icon={TrendingUp}
          status="healthy"
        />
      </div>

      {/* Projection Chart */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Retirement Projection</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="age" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickFormatter={(value) => `Age ${value}`}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Projected Savings']}
                labelFormatter={(label) => `Age ${label}`}
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#D4AF37"
                fillOpacity={1}
                fill="url(#colorSavings)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Account Breakdown */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Retirement Accounts</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {retirementAccounts.map((account, index) => (
            <motion.div
              key={account.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-muted/20"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-foreground">{account.name}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    ${account.balance.toLocaleString()}
                  </p>
                </div>
                <Landmark className="h-5 w-5 text-primary" />
              </div>
              {account.maxContribution && (
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Contribution Progress</span>
                    <span>${account.contribution.toLocaleString()} / ${account.maxContribution.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(account.contribution / account.maxContribution) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
