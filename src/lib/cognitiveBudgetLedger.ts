// Cognitive Budget Ledger - Tracks energy across life domains
// Prevents overcommitment by automatic expectation softening

import { supabase } from "@/integrations/supabase/client";

export type CognitiveDomain = "work" | "health" | "social" | "learning";

export interface BudgetEntry {
  domain: CognitiveDomain;
  activity: string;
  energyCost: number;
  timestamp: Date;
}

export interface DomainBudget {
  domain: CognitiveDomain;
  spent: number;
  capacity: number;
  remaining: number;
  status: "healthy" | "depleted" | "overdrawn";
}

export interface CognitiveBudgetState {
  total: {
    spent: number;
    capacity: number;
    remaining: number;
  };
  domains: Record<CognitiveDomain, DomainBudget>;
  lastUpdated: Date;
  recommendations: string[];
}

// Default energy costs for common activities
const ACTIVITY_COSTS: Record<string, { domain: CognitiveDomain; cost: number }> = {
  // Work activities
  "deep_work": { domain: "work", cost: 0.3 },
  "meeting": { domain: "work", cost: 0.15 },
  "email": { domain: "work", cost: 0.05 },
  "decision": { domain: "work", cost: 0.2 },
  "presentation": { domain: "work", cost: 0.25 },
  "review": { domain: "work", cost: 0.1 },
  
  // Health activities
  "workout": { domain: "health", cost: 0.2 },
  "meal_planning": { domain: "health", cost: 0.1 },
  "meditation": { domain: "health", cost: -0.1 }, // Restorative
  "sleep_tracking": { domain: "health", cost: 0.02 },
  
  // Social activities
  "social_call": { domain: "social", cost: 0.15 },
  "collaboration": { domain: "social", cost: 0.2 },
  "messaging": { domain: "social", cost: 0.05 },
  "networking": { domain: "social", cost: 0.25 },
  
  // Learning activities
  "reading": { domain: "learning", cost: 0.15 },
  "course": { domain: "learning", cost: 0.25 },
  "skill_practice": { domain: "learning", cost: 0.2 },
  "reflection": { domain: "learning", cost: 0.05 },
};

// Domain capacity weights (can be personalized)
const DEFAULT_DOMAIN_CAPACITIES: Record<CognitiveDomain, number> = {
  work: 0.4,      // 40% of total budget
  health: 0.2,    // 20%
  social: 0.2,    // 20%
  learning: 0.2,  // 20%
};

class CognitiveBudgetLedger {
  private userId: string | null = null;
  private entries: BudgetEntry[] = [];
  private totalCapacity = 1.0;
  private domainCapacities = DEFAULT_DOMAIN_CAPACITIES;
  
  setUser(userId: string) {
    this.userId = userId;
  }
  
  // Log an activity
  async logActivity(
    activity: string,
    domain?: CognitiveDomain,
    customCost?: number
  ): Promise<void> {
    if (!this.userId) return;
    
    const knownActivity = ACTIVITY_COSTS[activity];
    const finalDomain = domain || knownActivity?.domain || "work";
    const finalCost = customCost ?? knownActivity?.cost ?? 0.1;
    
    const entry: BudgetEntry = {
      domain: finalDomain,
      activity,
      energyCost: finalCost,
      timestamp: new Date(),
    };
    
    this.entries.push(entry);
    
    // Persist to database
    await supabase.from("cognitive_budget_log").insert({
      user_id: this.userId,
      domain: finalDomain,
      activity,
      energy_cost: finalCost,
    });
  }
  
  // Get current budget state
  async getBudgetState(): Promise<CognitiveBudgetState> {
    if (!this.userId) {
      return this.getEmptyState();
    }
    
    // Fetch today's entries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: entries } = await supabase
      .from("cognitive_budget_log")
      .select("*")
      .eq("user_id", this.userId)
      .gte("created_at", today.toISOString());
    
    // Calculate totals
    const domainSpent: Record<CognitiveDomain, number> = {
      work: 0,
      health: 0,
      social: 0,
      learning: 0,
    };
    
    for (const entry of entries || []) {
      const domain = entry.domain as CognitiveDomain;
      domainSpent[domain] = (domainSpent[domain] || 0) + Number(entry.energy_cost);
    }
    
    const totalSpent = Object.values(domainSpent).reduce((a, b) => a + b, 0);
    
    // Build domain budgets
    const domains: Record<CognitiveDomain, DomainBudget> = {} as any;
    
    for (const domain of Object.keys(this.domainCapacities) as CognitiveDomain[]) {
      const capacity = this.domainCapacities[domain] * this.totalCapacity;
      const spent = domainSpent[domain] || 0;
      const remaining = capacity - spent;
      
      domains[domain] = {
        domain,
        spent,
        capacity,
        remaining,
        status: remaining > 0.1 ? "healthy" : remaining > 0 ? "depleted" : "overdrawn",
      };
    }
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(domains, totalSpent);
    
    return {
      total: {
        spent: totalSpent,
        capacity: this.totalCapacity,
        remaining: this.totalCapacity - totalSpent,
      },
      domains,
      lastUpdated: new Date(),
      recommendations,
    };
  }
  
  // Generate cross-domain recommendations
  private generateRecommendations(
    domains: Record<CognitiveDomain, DomainBudget>,
    totalSpent: number
  ): string[] {
    const recommendations: string[] = [];
    
    // Check for overdrawn domains
    for (const [domain, budget] of Object.entries(domains) as [CognitiveDomain, DomainBudget][]) {
      if (budget.status === "overdrawn") {
        recommendations.push(`${domain} budget exceeded - consider lighter activities`);
      }
    }
    
    // Cross-domain balancing
    if (domains.work.status === "depleted" && domains.health.status === "healthy") {
      recommendations.push("Work energy depleted - a short walk could help recovery");
    }
    
    if (totalSpent > 0.8) {
      recommendations.push("Approaching daily limit - protect remaining energy");
    }
    
    if (totalSpent < 0.3 && new Date().getHours() > 14) {
      recommendations.push("Plenty of energy remaining - good time for challenging work");
    }
    
    // Restorative suggestions
    if (domains.social.spent === 0 && domains.work.status === "depleted") {
      recommendations.push("A brief social break might restore work energy");
    }
    
    return recommendations.slice(0, 3);
  }
  
  // Get suggestion for next activity based on budget
  getSuggestion(intendedDomain: CognitiveDomain, budgetState: CognitiveBudgetState): {
    proceed: boolean;
    alternative?: string;
    reason?: string;
  } {
    const domainBudget = budgetState.domains[intendedDomain];
    
    if (domainBudget.status === "healthy") {
      return { proceed: true };
    }
    
    if (domainBudget.status === "depleted") {
      return {
        proceed: true,
        reason: "Budget is low - keep this light",
      };
    }
    
    // Overdrawn - suggest alternative
    const healthyDomains = Object.entries(budgetState.domains)
      .filter(([_, b]) => b.status === "healthy")
      .map(([d]) => d);
    
    if (healthyDomains.length > 0) {
      return {
        proceed: false,
        alternative: healthyDomains[0],
        reason: `${intendedDomain} energy depleted. Consider ${healthyDomains[0]} instead?`,
      };
    }
    
    return {
      proceed: false,
      reason: "All domains depleted - rest recommended",
    };
  }
  
  // Reset for new day
  async resetDaily(): Promise<void> {
    this.entries = [];
  }
  
  private getEmptyState(): CognitiveBudgetState {
    return {
      total: { spent: 0, capacity: 1, remaining: 1 },
      domains: {
        work: { domain: "work", spent: 0, capacity: 0.4, remaining: 0.4, status: "healthy" },
        health: { domain: "health", spent: 0, capacity: 0.2, remaining: 0.2, status: "healthy" },
        social: { domain: "social", spent: 0, capacity: 0.2, remaining: 0.2, status: "healthy" },
        learning: { domain: "learning", spent: 0, capacity: 0.2, remaining: 0.2, status: "healthy" },
      },
      lastUpdated: new Date(),
      recommendations: [],
    };
  }
}

export const cognitiveBudgetLedger = new CognitiveBudgetLedger();
