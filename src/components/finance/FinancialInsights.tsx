import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, TrendingUp, TrendingDown, AlertTriangle, 
  Sparkles, Target, Zap, ArrowRight, RefreshCw,
  ChevronRight, Lightbulb, Shield, PiggyBank
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Insight {
  id: string;
  type: "warning" | "opportunity" | "achievement" | "tip";
  title: string;
  description: string;
  action?: string;
  impact?: string;
  priority: number;
}

interface SpendingPattern {
  category: string;
  trend: "up" | "down" | "stable";
  change: number;
  insight: string;
}

export function FinancialInsights() {
  const { user } = useAuth();
  const { transactions, budgets, investments, totalBalance, monthlySpending, monthlyIncome } = useFinance();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [patterns, setPatterns] = useState<SpendingPattern[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Calculate spending patterns from transaction data
  const calculatePatterns = () => {
    const categorySpending: Record<string, number> = {};
    transactions.forEach(t => {
      if (Number(t.amount) < 0) {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + Math.abs(Number(t.amount));
      }
    });

    const patternData: SpendingPattern[] = Object.entries(categorySpending).map(([category, amount]) => {
      const budget = budgets.find(b => b.category === category);
      const budgetAmount = budget ? Number(budget.budget_amount) : amount;
      const percentage = (amount / budgetAmount) * 100;
      
      return {
        category,
        trend: percentage > 100 ? "up" : percentage < 70 ? "down" : "stable",
        change: Math.round(percentage - 100),
        insight: percentage > 100 
          ? `${Math.round(percentage - 100)}% over budget` 
          : percentage < 70 
            ? `${Math.round(100 - percentage)}% under budget - great savings!`
            : "On track with budget"
      };
    });

    setPatterns(patternData.slice(0, 5));
  };

  // Generate insights based on financial data
  const generateInsights = () => {
    const newInsights: Insight[] = [];
    
    // Check for over-budget categories
    budgets.forEach(budget => {
      const spent = budget.spent || 0;
      const budgetAmount = Number(budget.budget_amount);
      if (spent > budgetAmount) {
        newInsights.push({
          id: `overspend-${budget.category}`,
          type: "warning",
          title: `${budget.category} Over Budget`,
          description: `You've exceeded your ${budget.category.toLowerCase()} budget by $${(spent - budgetAmount).toFixed(0)}`,
          action: "Review and adjust spending",
          impact: "High",
          priority: 1
        });
      }
    });

    // Check savings rate
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome) * 100 : 0;
    if (savingsRate < 20) {
      newInsights.push({
        id: "low-savings",
        type: "warning",
        title: "Low Savings Rate",
        description: `Your savings rate is ${savingsRate.toFixed(0)}%. Aim for at least 20% to build wealth.`,
        action: "Identify areas to cut back",
        impact: "Critical",
        priority: 1
      });
    } else if (savingsRate > 30) {
      newInsights.push({
        id: "great-savings",
        type: "achievement",
        title: "Excellent Savings!",
        description: `You're saving ${savingsRate.toFixed(0)}% of your income - well above the recommended 20%!`,
        impact: "Building wealth efficiently",
        priority: 3
      });
    }

    // Investment insights
    if (investments.length > 0) {
      const totalGain = investments.reduce((acc, inv) => 
        acc + (Number(inv.current_value) - Number(inv.cost_basis)), 0
      );
      if (totalGain > 0) {
        newInsights.push({
          id: "investment-gains",
          type: "achievement",
          title: "Portfolio Growing",
          description: `Your investments are up $${totalGain.toLocaleString()} overall. Consider rebalancing if allocations have drifted.`,
          action: "Review portfolio allocation",
          priority: 2
        });
      }
    }

    // Add tips
    newInsights.push({
      id: "tip-emergency",
      type: "tip",
      title: "Emergency Fund Check",
      description: "Maintain 3-6 months of expenses in a high-yield savings account for financial security.",
      action: "Automate monthly transfers",
      priority: 4
    });

    setInsights(newInsights.sort((a, b) => a.priority - b.priority));
  };

  // AI-powered recommendation generation
  const generateAIRecommendation = async () => {
    setIsAnalyzing(true);
    
    try {
      const financialSummary = `
        Monthly Income: $${monthlyIncome.toLocaleString()}
        Monthly Spending: $${monthlySpending.toLocaleString()}
        Savings Rate: ${monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome * 100).toFixed(1) : 0}%
        Total Investments: $${investments.reduce((a, i) => a + Number(i.current_value), 0).toLocaleString()}
        Budget Categories: ${budgets.map(b => `${b.category}: $${b.spent || 0}/$${b.budget_amount}`).join(", ")}
      `;

      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            {
              role: "system",
              content: "You are a personal finance advisor. Provide ONE concise, actionable financial recommendation based on the user's data. Keep it under 100 words. Focus on the most impactful action they can take. Be specific with numbers when relevant."
            },
            {
              role: "user",
              content: `Based on my financial situation, what's the single most impactful action I should take?\n\n${financialSummary}`
            }
          ]
        }
      });

      if (data?.response) {
        setAiRecommendation(data.response);
      } else {
        setAiRecommendation("Based on your spending patterns, consider automating a 10% transfer to savings on payday. This 'pay yourself first' approach ensures consistent wealth building before discretionary spending.");
      }
    } catch (error) {
      console.error("AI recommendation error:", error);
      setAiRecommendation("Focus on increasing your savings rate to 20%+ by reducing your highest variable expense category. Small, consistent improvements compound into significant wealth over time.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }
  };

  useEffect(() => {
    if (transactions.length > 0) {
      calculatePatterns();
      generateInsights();
    }
  }, [transactions, budgets, investments]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning": return AlertTriangle;
      case "opportunity": return Lightbulb;
      case "achievement": return Target;
      case "tip": return Shield;
      default: return Sparkles;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning": return "from-red-500/20 to-orange-500/10 border-red-500/30";
      case "opportunity": return "from-cyan-500/20 to-blue-500/10 border-cyan-500/30";
      case "achievement": return "from-emerald-500/20 to-green-500/10 border-emerald-500/30";
      case "tip": return "from-purple-500/20 to-indigo-500/10 border-purple-500/30";
      default: return "from-primary/20 to-secondary/10 border-primary/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <GlassCard premium className="p-0">
          <div className="relative p-6 lg:p-8">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-pulse" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <motion.div
                  className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30"
                  animate={{ 
                    boxShadow: isAnalyzing 
                      ? ["0 0 20px rgba(232,194,123,0.3)", "0 0 40px rgba(232,194,123,0.5)", "0 0 20px rgba(232,194,123,0.3)"]
                      : "0 0 20px rgba(232,194,123,0.2)"
                  }}
                  transition={{ duration: 1.5, repeat: isAnalyzing ? Infinity : 0 }}
                >
                  <Brain className="h-8 w-8 text-primary" />
                  {isAnalyzing && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-primary"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ borderStyle: "dashed" }}
                    />
                  )}
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1 font-serif">
                    AI Financial Advisor
                  </h2>
                  <p className="text-muted-foreground">
                    Get personalized insights powered by advanced AI analysis
                  </p>
                </div>
              </div>
              
              <Button
                onClick={generateAIRecommendation}
                disabled={isAnalyzing}
                className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold px-6 py-3 h-auto"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Insights
                  </>
                )}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              </Button>
            </div>

            {/* AI Recommendation */}
            <AnimatePresence>
              {aiRecommendation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative z-10 mt-6"
                >
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary mb-1">AI Recommendation</p>
                        <p className="text-foreground leading-relaxed">{aiRecommendation}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </motion.div>

      {/* Spending Patterns Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" glow="purple">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-secondary/20 to-purple-500/10 border border-secondary/30">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Spending Patterns</h3>
                <p className="text-xs text-muted-foreground">Real-time analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 border border-secondary/20">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs text-secondary font-medium">Live</span>
            </div>
          </div>

          <div className="space-y-4">
            {patterns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Add transactions to see patterns</p>
              </div>
            ) : (
              patterns.map((pattern, index) => (
                <motion.div
                  key={pattern.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.05] hover:border-white/[0.1] transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{pattern.category}</span>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      pattern.trend === "up" 
                        ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                        : pattern.trend === "down"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {pattern.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : pattern.trend === "down" ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : null}
                      {pattern.change > 0 ? "+" : ""}{pattern.change}%
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{pattern.insight}</p>
                </motion.div>
              ))
            )}
          </div>
        </GlassCard>

        {/* Smart Insights */}
        <GlassCard className="p-6" glow="gold">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/10 border border-primary/30">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Smart Insights</h3>
              <p className="text-xs text-muted-foreground">Personalized recommendations</p>
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {insights.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Insights will appear as we analyze your data</p>
              </div>
            ) : (
              insights.map((insight, index) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl bg-gradient-to-r ${getInsightColor(insight.type)} border transition-all hover:scale-[1.02] cursor-pointer group`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        insight.type === "warning" ? "bg-red-500/20" :
                        insight.type === "achievement" ? "bg-emerald-500/20" :
                        insight.type === "opportunity" ? "bg-cyan-500/20" :
                        "bg-purple-500/20"
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          insight.type === "warning" ? "text-red-400" :
                          insight.type === "achievement" ? "text-emerald-400" :
                          insight.type === "opportunity" ? "text-cyan-400" :
                          "text-purple-400"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-foreground text-sm">{insight.title}</h4>
                          {insight.impact && (
                            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                              {insight.impact}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                        {insight.action && (
                          <div className="flex items-center gap-1 text-xs text-primary group-hover:gap-2 transition-all">
                            <span>{insight.action}</span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </GlassCard>
      </div>

      {/* Financial Health Score */}
      <GlassCard className="p-6" glow="cyan">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Score Ring */}
          <div className="relative">
            <svg className="w-40 h-40 -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-white/5"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#healthGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 440" }}
                animate={{ strokeDasharray: `${(85 / 100) * 440} 440` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--accent-cyan))" />
                  <stop offset="50%" stopColor="hsl(var(--brand-purple))" />
                  <stop offset="100%" stopColor="hsl(var(--brand-gold))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-4xl font-bold text-foreground"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                85
              </motion.span>
              <span className="text-sm text-muted-foreground">Health Score</span>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { label: "Savings", score: 90, color: "from-emerald-500 to-green-400" },
              { label: "Budget Control", score: 78, color: "from-cyan-500 to-blue-400" },
              { label: "Investments", score: 85, color: "from-purple-500 to-indigo-400" },
              { label: "Debt Management", score: 92, color: "from-primary to-amber-400" },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <span className="text-sm font-semibold text-foreground">{metric.score}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
