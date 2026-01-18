// Evolution Engine - Long-term learning without resetting identity
// Tracks recovery patterns, motivation sources, failure modes, preference drift

import { supabase } from "@/integrations/supabase/client";

export interface RecoveryPattern {
  trigger: string;           // What caused the need for recovery
  intervention: string;      // What was attempted
  effectiveness: number;     // 0-1 how well it worked
  timeToBaseline: number;    // Minutes to recover
  context: Record<string, unknown>;
}

export interface MotivationSource {
  type: "social" | "novelty" | "autonomy" | "progress" | "curiosity" | "competence";
  strength: number;          // 0-1
  examples: string[];        // Specific instances
  lastObserved: Date;
}

export interface FailureMode {
  type: "boredom" | "novelty_decay" | "overextension" | "perfection_freeze" | "emotional_overload";
  frequency: number;         // How often it occurs
  precursors: string[];      // Warning signs
  mitigations: string[];     // What has helped
}

export interface PreferenceDrift {
  dimension: string;         // What changed
  fromValue: unknown;
  toValue: unknown;
  detectedAt: Date;
  confidence: number;
}

export interface EvolutionState {
  recoveryPatterns: RecoveryPattern[];
  motivationSources: MotivationSource[];
  failureModes: FailureMode[];
  preferenceDrift: PreferenceDrift[];
  baselineImprovements: {
    dimension: string;
    improvement: number;
    since: Date;
  }[];
}

class EvolutionEngine {
  private userId: string | null = null;
  
  setUser(userId: string) {
    this.userId = userId;
  }
  
  // Record a recovery attempt and its outcome
  async recordRecovery(pattern: RecoveryPattern): Promise<void> {
    if (!this.userId) return;
    
    await this.upsertPattern("recovery", pattern);
  }
  
  // Record an observed motivation driver
  async recordMotivation(source: Omit<MotivationSource, "lastObserved">): Promise<void> {
    if (!this.userId) return;
    
    await this.upsertPattern("motivation", {
      ...source,
      lastObserved: new Date(),
    });
  }
  
  // Record a failure mode occurrence
  async recordFailure(mode: Omit<FailureMode, "frequency">): Promise<void> {
    if (!this.userId) return;
    
    // Get existing pattern to increment frequency
    const { data: existing } = await supabase
      .from("evolution_patterns")
      .select("*")
      .eq("user_id", this.userId)
      .eq("pattern_type", "failure")
      .single();
    
    const existingData = existing?.pattern_data as unknown as FailureMode | undefined;
    const frequency = (existingData?.frequency || 0) + 1;
    
    await this.upsertPattern("failure", {
      ...mode,
      frequency,
    });
  }
  
  // Detect and record preference drift
  async detectDrift(
    dimension: string,
    oldValue: unknown,
    newValue: unknown,
    confidence: number
  ): Promise<void> {
    if (!this.userId) return;
    
    if (oldValue !== newValue && confidence > 0.7) {
      const drift: PreferenceDrift = {
        dimension,
        fromValue: oldValue,
        toValue: newValue,
        detectedAt: new Date(),
        confidence,
      };
      
      await this.upsertPattern("preference_drift", drift);
    }
  }
  
  // Get what recovery methods work best for this user
  async getEffectiveRecoveryMethods(): Promise<string[]> {
    if (!this.userId) return [];
    
    const { data } = await supabase
      .from("evolution_patterns")
      .select("pattern_data")
      .eq("user_id", this.userId)
      .eq("pattern_type", "recovery")
      .order("confidence", { ascending: false })
      .limit(5);
    
    return (data || [])
      .map(d => (d.pattern_data as unknown as RecoveryPattern)?.intervention)
      .filter(Boolean);
  }
  
  // Get primary motivation drivers
  async getMotivationProfile(): Promise<Record<string, number>> {
    if (!this.userId) return {};
    
    const { data } = await supabase
      .from("evolution_patterns")
      .select("pattern_data")
      .eq("user_id", this.userId)
      .eq("pattern_type", "motivation");
    
    const profile: Record<string, number> = {};
    
    for (const item of data || []) {
      const source = item.pattern_data as unknown as MotivationSource;
      if (source?.type) {
        profile[source.type] = source.strength || 0;
      }
    }
    
    return profile;
  }
  
  // Get warning signs for failure modes
  async getFailurePrecursors(): Promise<{ type: string; precursors: string[] }[]> {
    if (!this.userId) return [];
    
    const { data } = await supabase
      .from("evolution_patterns")
      .select("pattern_data")
      .eq("user_id", this.userId)
      .eq("pattern_type", "failure")
      .order("confidence", { ascending: false });
    
    return (data || [])
      .map(d => {
        const mode = d.pattern_data as unknown as FailureMode;
        return {
          type: mode?.type || "unknown",
          precursors: mode?.precursors || [],
        };
      })
      .filter(m => m.precursors.length > 0);
  }
  
  // Get recent preference changes
  async getRecentDrift(): Promise<PreferenceDrift[]> {
    if (!this.userId) return [];
    
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const { data } = await supabase
      .from("evolution_patterns")
      .select("pattern_data")
      .eq("user_id", this.userId)
      .eq("pattern_type", "preference_drift")
      .gte("last_observed", weekAgo.toISOString());
    
    return (data || []).map(d => d.pattern_data as unknown as PreferenceDrift);
  }
  
  // Generate evolution insights for user
  async generateInsights(): Promise<string[]> {
    if (!this.userId) return [];
    
    const insights: string[] = [];
    
    // Check for effective recovery methods
    const recoveryMethods = await this.getEffectiveRecoveryMethods();
    if (recoveryMethods.length > 0) {
      insights.push(`"${recoveryMethods[0]}" has been most effective for recovery`);
    }
    
    // Check motivation profile
    const motivations = await this.getMotivationProfile();
    const topMotivation = Object.entries(motivations)
      .sort(([, a], [, b]) => b - a)[0];
    
    if (topMotivation && topMotivation[1] > 0.7) {
      insights.push(`Strong ${topMotivation[0]} driver detected in your patterns`);
    }
    
    // Check for preference drift
    const drift = await this.getRecentDrift();
    if (drift.length > 0) {
      insights.push(`Noticed some preference changes recently - want to review?`);
    }
    
    return insights;
  }
  
  // Private helper to upsert patterns
  private async upsertPattern(
    type: string,
    patternData: unknown
  ): Promise<void> {
    if (!this.userId) return;
    
    // Convert to JSON-compatible format
    const jsonData = JSON.parse(JSON.stringify(patternData));
    
    await supabase.from("evolution_patterns").insert({
      user_id: this.userId,
      pattern_type: type,
      pattern_data: jsonData,
      confidence: 0.5,
      last_observed: new Date().toISOString(),
    });
  }
  
  // Celebrate progress relative to user's own baseline
  async celebrateProgress(dimension: string, currentValue: number): Promise<string | null> {
    if (!this.userId) return null;
    
    // Get baseline from 30 days ago
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const { data: baseline } = await supabase
      .from("evolution_patterns")
      .select("pattern_data")
      .eq("user_id", this.userId)
      .eq("pattern_type", "baseline")
      .lte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    if (!baseline) return null;
    
    const baselineData = baseline.pattern_data as Record<string, number>;
    const baselineValue = baselineData?.[dimension];
    
    if (baselineValue && currentValue > baselineValue) {
      const improvement = ((currentValue - baselineValue) / baselineValue * 100).toFixed(0);
      return `${improvement}% improvement in ${dimension} since last month`;
    }
    
    return null;
  }
}

export const evolutionEngine = new EvolutionEngine();
