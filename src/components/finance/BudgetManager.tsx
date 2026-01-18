import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { MetricSignalCard } from "@/components/MetricSignalCard";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, AlertCircle, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const CATEGORIES = [
  "Housing", "Food & Dining", "Transportation", "Entertainment", 
  "Utilities", "Healthcare", "Shopping", "Income", "Other"
];

export function BudgetManager() {
  const { 
    transactions, 
    budgets, 
    isLoading,
    totalBalance,
    monthlyIncome,
    monthlySpending,
    addTransaction,
    deleteTransaction,
  } = useFinance();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: "",
    category: "Other",
    description: "",
  });

  const handleAddTransaction = async () => {
    if (!newTransaction.name || !newTransaction.amount) return;

    await addTransaction({
      name: newTransaction.name,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description || null,
      transaction_date: new Date().toISOString().split("T")[0],
      is_recurring: false,
    });

    setNewTransaction({ name: "", amount: "", category: "Other", description: "" });
    setIsAddOpen(false);
  };

  const savingsRate = monthlyIncome > 0 
    ? Math.round(((monthlyIncome - monthlySpending) / monthlyIncome) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricSignalCard
          title="Total Balance"
          value={`$${Math.abs(totalBalance).toLocaleString()}`}
          subtitle={totalBalance >= 0 ? "Positive flow" : "Negative flow"}
          icon={Wallet}
          status={totalBalance >= 0 ? "healthy" : "critical"}
          trend={totalBalance >= 0 ? "up" : "down"}
        />
        <MetricSignalCard
          title="Monthly Income"
          value={`$${monthlyIncome.toLocaleString()}`}
          subtitle="This period"
          icon={TrendingUp}
          status="healthy"
        />
        <MetricSignalCard
          title="Monthly Spending"
          value={`$${monthlySpending.toLocaleString()}`}
          subtitle={budgets.length > 0 ? `${Math.round((monthlySpending / budgets.reduce((a, b) => a + Number(b.budget_amount), 0)) * 100)}% of budget` : "No budgets set"}
          icon={TrendingDown}
          status={monthlySpending > monthlyIncome ? "critical" : "neutral"}
        />
        <MetricSignalCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          subtitle={savingsRate >= 20 ? "Above target" : "Below target"}
          icon={PiggyBank}
          status={savingsRate >= 20 ? "healthy" : "warning"}
          trend={savingsRate >= 20 ? "up" : "down"}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Budget by Category</h3>
          <div className="space-y-4">
            {budgets.map((budget, index) => {
              const percentage = budget.spent ? (budget.spent / Number(budget.budget_amount)) * 100 : 0;
              const isOverBudget = percentage > 100;
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{budget.category}</span>
                    <span className={`text-sm ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                      ${(budget.spent || 0).toLocaleString()} / ${Number(budget.budget_amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${isOverBudget ? 'bg-destructive' : 'bg-primary'}`}
                      style={{ backgroundColor: isOverBudget ? undefined : budget.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    />
                  </div>
                  {isOverBudget && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 text-destructive" />
                      <span className="text-xs text-destructive">
                        Over budget by ${((budget.spent || 0) - Number(budget.budget_amount)).toLocaleString()}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
            {budgets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No budgets configured</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Recent Transactions */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Transaction name"
                    value={newTransaction.name}
                    onChange={e => setNewTransaction(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Amount (negative for expense)"
                    value={newTransaction.amount}
                    onChange={e => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  <Select
                    value={newTransaction.category}
                    onValueChange={value => setNewTransaction(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Description (optional)"
                    value={newTransaction.description}
                    onChange={e => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Button onClick={handleAddTransaction} className="w-full">
                    Add Transaction
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <AnimatePresence>
              {transactions.slice(0, 10).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{transaction.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.transaction_date), "MMM d")} • {transaction.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${Number(transaction.amount) > 0 ? 'text-secondary' : 'text-foreground'}`}>
                      {Number(transaction.amount) > 0 ? '+' : ''}
                      ${Math.abs(Number(transaction.amount)).toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteTransaction(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No transactions yet</p>
                <p className="text-xs opacity-70">Add your first transaction above</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
