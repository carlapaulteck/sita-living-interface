import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  category: string;
  transaction_date: string;
  description: string | null;
  is_recurring: boolean;
}

export interface Budget {
  id: string;
  category: string;
  budget_amount: number;
  period: string;
  color: string;
  spent?: number;
}

export interface Investment {
  id: string;
  name: string;
  symbol: string | null;
  investment_type: string;
  current_value: number;
  cost_basis: number;
  shares: number | null;
  allocation_percentage: number | null;
}

const DEFAULT_BUDGETS = [
  { category: "Housing", budget_amount: 2500, color: "#8b5cf6" },
  { category: "Food & Dining", budget_amount: 800, color: "#22c55e" },
  { category: "Transportation", budget_amount: 400, color: "#ef4444" },
  { category: "Entertainment", budget_amount: 300, color: "#06b6d4" },
  { category: "Utilities", budget_amount: 200, color: "#a855f7" },
];

const DEFAULT_TRANSACTIONS = [
  { name: "Whole Foods Market", amount: -156.32, category: "Food & Dining", description: "Weekly groceries" },
  { name: "Salary Deposit", amount: 5200, category: "Income", description: "Monthly salary" },
  { name: "Netflix", amount: -15.99, category: "Entertainment", description: "Subscription" },
  { name: "Electric Bill", amount: -89.50, category: "Utilities", description: "Monthly utility" },
  { name: "Rent Payment", amount: -2400, category: "Housing", description: "Monthly rent" },
  { name: "Gas Station", amount: -45.00, category: "Transportation", description: "Fuel" },
];

const DEFAULT_INVESTMENTS = [
  { name: "S&P 500 Index", symbol: "VOO", investment_type: "ETF", current_value: 45000, cost_basis: 38000, shares: 120, allocation_percentage: 45 },
  { name: "Total Bond Market", symbol: "BND", investment_type: "ETF", current_value: 20000, cost_basis: 21000, shares: 250, allocation_percentage: 20 },
  { name: "Tech Growth Fund", symbol: "QQQ", investment_type: "ETF", current_value: 25000, cost_basis: 18000, shares: 60, allocation_percentage: 25 },
  { name: "Real Estate", symbol: "VNQ", investment_type: "REIT", current_value: 10000, cost_basis: 9500, shares: 110, allocation_percentage: 10 },
];

export function useFinance() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data for new users
  const initializeData = async () => {
    if (!user) return;

    // Check if user has budgets
    const { data: existingBudgets } = await supabase
      .from("finance_budgets")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    if (!existingBudgets || existingBudgets.length === 0) {
      const budgetsToInsert = DEFAULT_BUDGETS.map(b => ({
        user_id: user.id,
        category: b.category,
        budget_amount: b.budget_amount,
        color: b.color,
        period: "monthly",
      }));

      await supabase.from("finance_budgets").insert(budgetsToInsert);

      // Add default transactions
      const transactionsToInsert = DEFAULT_TRANSACTIONS.map((t, i) => ({
        user_id: user.id,
        name: t.name,
        amount: t.amount,
        category: t.category,
        description: t.description,
        transaction_date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
      }));

      await supabase.from("finance_transactions").insert(transactionsToInsert);

      // Add default investments
      const investmentsToInsert = DEFAULT_INVESTMENTS.map(inv => ({
        user_id: user.id,
        name: inv.name,
        symbol: inv.symbol,
        investment_type: inv.investment_type,
        current_value: inv.current_value,
        cost_basis: inv.cost_basis,
        shares: inv.shares,
        allocation_percentage: inv.allocation_percentage,
      }));

      await supabase.from("finance_investments").insert(investmentsToInsert);
    }
  };

  // Fetch all finance data
  const fetchTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("finance_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("transaction_date", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching transactions:", error);
      return;
    }

    setTransactions(data as Transaction[]);
  };

  const fetchBudgets = async () => {
    if (!user) return;

    const { data: budgetData, error: budgetError } = await supabase
      .from("finance_budgets")
      .select("*")
      .eq("user_id", user.id);

    if (budgetError) {
      console.error("Error fetching budgets:", budgetError);
      return;
    }

    // Calculate spent amounts from transactions
    const { data: transData } = await supabase
      .from("finance_transactions")
      .select("category, amount")
      .eq("user_id", user.id)
      .lt("amount", 0);

    const spentByCategory: Record<string, number> = {};
    transData?.forEach(t => {
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + Math.abs(Number(t.amount));
    });

    const budgetsWithSpent = (budgetData as Budget[]).map(b => ({
      ...b,
      spent: spentByCategory[b.category] || 0,
    }));

    setBudgets(budgetsWithSpent);
  };

  const fetchInvestments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("finance_investments")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching investments:", error);
      return;
    }

    setInvestments(data as Investment[]);
  };

  // Add transaction
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user) return;

    const { error } = await supabase.from("finance_transactions").insert({
      user_id: user.id,
      ...transaction,
    });

    if (error) {
      toast.error("Failed to add transaction");
      return;
    }

    toast.success("Transaction added");
    await Promise.all([fetchTransactions(), fetchBudgets()]);
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("finance_transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to delete transaction");
      return;
    }

    toast.success("Transaction deleted");
    await Promise.all([fetchTransactions(), fetchBudgets()]);
  };

  // Update budget
  const updateBudget = async (id: string, budget_amount: number) => {
    if (!user) return;

    const { error } = await supabase
      .from("finance_budgets")
      .update({ budget_amount })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update budget");
      return;
    }

    toast.success("Budget updated");
    fetchBudgets();
  };

  // Calculated totals
  const totalBalance = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
  const monthlyIncome = transactions.filter(t => Number(t.amount) > 0).reduce((acc, t) => acc + Number(t.amount), 0);
  const monthlySpending = transactions.filter(t => Number(t.amount) < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);
  const totalInvestments = investments.reduce((acc, i) => acc + Number(i.current_value), 0);
  const totalCostBasis = investments.reduce((acc, i) => acc + Number(i.cost_basis), 0);
  const investmentGain = totalInvestments - totalCostBasis;

  // Initial load
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await initializeData();
      await Promise.all([fetchTransactions(), fetchBudgets(), fetchInvestments()]);
      setIsLoading(false);
    };

    if (user) {
      load();
    }
  }, [user]);

  return {
    transactions,
    budgets,
    investments,
    isLoading,
    totalBalance,
    monthlyIncome,
    monthlySpending,
    totalInvestments,
    investmentGain,
    addTransaction,
    deleteTransaction,
    updateBudget,
    refetch: () => Promise.all([fetchTransactions(), fetchBudgets(), fetchInvestments()]),
  };
}
