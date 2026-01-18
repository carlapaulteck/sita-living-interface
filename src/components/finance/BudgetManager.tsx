import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const spendingCategories = [
  { name: "Housing", spent: 2400, budget: 2500, color: "bg-primary" },
  { name: "Food & Dining", spent: 680, budget: 800, color: "bg-secondary" },
  { name: "Transportation", spent: 450, budget: 400, color: "bg-destructive" },
  { name: "Entertainment", spent: 120, budget: 300, color: "bg-cyan-500" },
  { name: "Utilities", spent: 180, budget: 200, color: "bg-purple-500" },
];

const recentTransactions = [
  { name: "Whole Foods Market", amount: -156.32, date: "Today", category: "Groceries" },
  { name: "Salary Deposit", amount: 5200, date: "Jan 15", category: "Income" },
  { name: "Netflix", amount: -15.99, date: "Jan 14", category: "Entertainment" },
  { name: "Electric Bill", amount: -89.50, date: "Jan 12", category: "Utilities" },
];

export function BudgetManager() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Total Balance"
          value="$48,230"
          subtitle="+$2,340 this month"
          icon={Wallet}
          status="healthy"
          trend="up"
        />
        <MetricSignalCard
          title="Monthly Income"
          value="$12,500"
          subtitle="On track"
          icon={TrendingUp}
          status="healthy"
        />
        <MetricSignalCard
          title="Monthly Spending"
          value="$3,830"
          subtitle="76% of budget"
          icon={TrendingDown}
          status="neutral"
        />
        <MetricSignalCard
          title="Savings Rate"
          value="34%"
          subtitle="Above target"
          icon={PiggyBank}
          status="healthy"
          trend="up"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Budget by Category</h3>
          <div className="space-y-4">
            {spendingCategories.map((category, index) => {
              const percentage = (category.spent / category.budget) * 100;
              const isOverBudget = percentage > 100;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{category.name}</span>
                    <span className={`text-sm ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                      ${category.spent} / ${category.budget}
                    </span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${isOverBudget ? 'bg-destructive' : category.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    />
                  </div>
                  {isOverBudget && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 text-destructive" />
                      <span className="text-xs text-destructive">Over budget by ${category.spent - category.budget}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* Recent Transactions */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction.name}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date} • {transaction.category}</p>
                </div>
                <span className={`text-sm font-semibold ${transaction.amount > 0 ? 'text-secondary' : 'text-foreground'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
