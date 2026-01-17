import { supabase } from "@/integrations/supabase/client";

// Causality Graph Types
export interface CausalityChain {
  id: string;
  trigger: string;
  cascade: string[];
  confidence: number;
  occurrences: number;
  lastObserved: string;
}

// Motivation Fingerprint
export interface MotivationFingerprint {
  curiosity: number;      // Exploration drives action
  competence: number;     // Mastery drives action
  autonomy: number;       // Freedom drives action
  social: number;         // Impact drives action
  progress: number;       // Completion drives action
  novelty: number;        // Newness drives action
}

// Recovery Signature
export interface RecoverySignature {
  fastestInputs: string[];           // What helps recovery
  timeToBaseline: Record<string, number>; // Recovery times by type
  failedInterventions: string[];     // What doesn't work
}

// Time Perception Model
export interface TimePerception {
  timeBlindness: number;            // 0-1, how abstract future feels
  futureDiscounting: number;        // 0-1, preference for immediate rewards
  deadlineResponse: "paralysis" | "stress" | "action" | "moderate";
  planningHorizon: "short" | "medium" | "long";
}

// Emotional Grammar
export interface EmotionalGrammar {
  [word: string]: {
    response: "stress" | "calm" | "motivation" | "avoidance" | "engagement" | "disengagement";
    avoid?: boolean;
    prefer?: boolean;
    reframe?: string;
  };
}

// Trust Velocity
export interface TrustVelocity {
  acceptanceRate: number;   // 0-1
  overrideRate: number;     // 0-1
  ignoreRate: number;       // 0-1
}

// Full Personalization Profile
export interface PersonalizationProfile {
  userId: string;
  causalityGraph: CausalityChain[];
  recoverySignature: RecoverySignature;
  motivationFingerprint: MotivationFingerprint;
  timePerception: TimePerception;
  emotionalGrammar: EmotionalGrammar;
  thresholdMemory: {
    limits: Array<{ type: string; threshold: number; lastCrossed: string }>;
    warnings: string[];
    collapsePatterns: string[];
  };
  failureTaxonomy: Record<string, number>; // Type -> frequency
  identityModes: {
    work: { density: number; tone: string; pace: string };
    home: { density: number; tone: string; pace: string };
    social: { density: number; tone: string; pace: string };
    recovery: { density: number; tone: string; pace: string };
  };
  meaningAnchors: {
    phrases: string[];
    memories: string[];
    symbols: string[];
    values: string[];
  };
  doNotTouchZones: string[];
  trustVelocity: TrustVelocity;
  resistanceLog: Array<{ feature: string; count: number; lastAsked: string; reason?: string }>;
  silenceModel: {
    quietTriggers: string[];
    preferredSilenceDuration: number;
  };
}

// Load personalization profile
export async function loadPersonalizationProfile(userId: string): Promise<PersonalizationProfile | null> {
  const { data, error } = await supabase
    .from("personalization_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    userId: data.user_id,
    causalityGraph: (data.causality_graph as unknown) as CausalityChain[],
    recoverySignature: (data.recovery_signature as unknown) as RecoverySignature,
    motivationFingerprint: (data.motivation_fingerprint as unknown) as MotivationFingerprint,
    timePerception: (data.time_perception as unknown) as TimePerception,
    emotionalGrammar: (data.emotional_grammar as unknown) as EmotionalGrammar,
    thresholdMemory: (data.threshold_memory as unknown) as PersonalizationProfile["thresholdMemory"],
    failureTaxonomy: (data.failure_taxonomy as unknown) as Record<string, number>,
    identityModes: (data.identity_modes as unknown) as PersonalizationProfile["identityModes"],
    meaningAnchors: (data.meaning_anchors as unknown) as PersonalizationProfile["meaningAnchors"],
    doNotTouchZones: data.do_not_touch_zones || [],
    trustVelocity: (data.trust_velocity as unknown) as TrustVelocity,
    resistanceLog: (data.resistance_log as unknown) as PersonalizationProfile["resistanceLog"],
    silenceModel: (data.silence_model as unknown) as PersonalizationProfile["silenceModel"],
  };
}

// Save personalization profile
export async function savePersonalizationProfile(profile: PersonalizationProfile): Promise<boolean> {
  // Convert typed objects to JSON-compatible format
  const jsonData = {
    user_id: profile.userId,
    causality_graph: JSON.parse(JSON.stringify(profile.causalityGraph)),
    recovery_signature: JSON.parse(JSON.stringify(profile.recoverySignature)),
    motivation_fingerprint: JSON.parse(JSON.stringify(profile.motivationFingerprint)),
    time_perception: JSON.parse(JSON.stringify(profile.timePerception)),
    emotional_grammar: JSON.parse(JSON.stringify(profile.emotionalGrammar)),
    threshold_memory: JSON.parse(JSON.stringify(profile.thresholdMemory)),
    failure_taxonomy: JSON.parse(JSON.stringify(profile.failureTaxonomy)),
    identity_modes: JSON.parse(JSON.stringify(profile.identityModes)),
    meaning_anchors: JSON.parse(JSON.stringify(profile.meaningAnchors)),
    do_not_touch_zones: profile.doNotTouchZones,
    trust_velocity: JSON.parse(JSON.stringify(profile.trustVelocity)),
    resistance_log: JSON.parse(JSON.stringify(profile.resistanceLog)),
    silence_model: JSON.parse(JSON.stringify(profile.silenceModel)),
  };

  const { error } = await supabase
    .from("personalization_profiles")
    .upsert([jsonData], { onConflict: "user_id" });

  return !error;
}

// Add a causality observation
export async function observeCausality(
  userId: string,
  trigger: string,
  cascade: string[]
): Promise<void> {
  const profile = await loadPersonalizationProfile(userId);
  if (!profile) return;

  const existingChain = profile.causalityGraph.find(
    c => c.trigger === trigger && JSON.stringify(c.cascade) === JSON.stringify(cascade)
  );

  if (existingChain) {
    existingChain.occurrences += 1;
    existingChain.confidence = Math.min(1, existingChain.confidence + 0.05);
    existingChain.lastObserved = new Date().toISOString();
  } else {
    profile.causalityGraph.push({
      id: crypto.randomUUID(),
      trigger,
      cascade,
      confidence: 0.3,
      occurrences: 1,
      lastObserved: new Date().toISOString(),
    });
  }

  await savePersonalizationProfile(profile);
}

// Track suggestion response for trust velocity
export async function trackSuggestionResponse(
  userId: string,
  response: "accept" | "override" | "ignore"
): Promise<void> {
  const profile = await loadPersonalizationProfile(userId);
  if (!profile) return;

  // Exponential moving average
  const alpha = 0.1;
  
  if (response === "accept") {
    profile.trustVelocity.acceptanceRate = profile.trustVelocity.acceptanceRate * (1 - alpha) + alpha;
  } else if (response === "override") {
    profile.trustVelocity.overrideRate = profile.trustVelocity.overrideRate * (1 - alpha) + alpha;
  } else {
    profile.trustVelocity.ignoreRate = profile.trustVelocity.ignoreRate * (1 - alpha) + alpha;
  }

  await savePersonalizationProfile(profile);
}

// Log resistance to a feature
export async function logResistance(
  userId: string,
  feature: string,
  reason?: string
): Promise<{ shouldAskWhy: boolean; totalResistances: number }> {
  const profile = await loadPersonalizationProfile(userId);
  if (!profile) return { shouldAskWhy: false, totalResistances: 0 };

  const existing = profile.resistanceLog.find(r => r.feature === feature);

  if (existing) {
    existing.count += 1;
    existing.lastAsked = new Date().toISOString();
    if (reason) existing.reason = reason;
  } else {
    profile.resistanceLog.push({
      feature,
      count: 1,
      lastAsked: new Date().toISOString(),
      reason,
    });
  }

  await savePersonalizationProfile(profile);

  const entry = profile.resistanceLog.find(r => r.feature === feature)!;
  
  // Ask why after 3 resistances, but only once
  return {
    shouldAskWhy: entry.count === 3 && !entry.reason,
    totalResistances: entry.count,
  };
}

// Get personalized language based on emotional grammar
export function personalizeLanguage(
  text: string,
  grammar: EmotionalGrammar
): string {
  let result = text;

  for (const [word, config] of Object.entries(grammar)) {
    if (config.reframe && result.toLowerCase().includes(word.toLowerCase())) {
      const regex = new RegExp(word, "gi");
      result = result.replace(regex, config.reframe);
    }
  }

  return result;
}

// Get motivation-aligned framing
export function getMotivationFrame(
  fingerprint: MotivationFingerprint,
  taskType: string
): string {
  const dominant = Object.entries(fingerprint)
    .sort(([, a], [, b]) => b - a)[0][0] as keyof MotivationFingerprint;

  const frames: Record<keyof MotivationFingerprint, (task: string) => string> = {
    curiosity: (t) => `Explore what happens when you ${t}`,
    competence: (t) => `Master this: ${t}`,
    autonomy: (t) => `Your choice: ${t}`,
    social: (t) => `Your impact: ${t}`,
    progress: (t) => `Complete: ${t} ✓`,
    novelty: (t) => `Something new: ${t}`,
  };

  return frames[dominant](taskType);
}

// Check if topic is protected
export function isProtectedTopic(
  profile: PersonalizationProfile,
  topic: string
): boolean {
  return profile.doNotTouchZones.some(
    zone => topic.toLowerCase().includes(zone.toLowerCase())
  );
}

// Get current identity mode based on time and context
export function inferIdentityMode(
  profile: PersonalizationProfile,
  hour: number,
  dayOfWeek: number,
  context?: { location?: string; calendar?: string }
): keyof PersonalizationProfile["identityModes"] {
  // Simple heuristics - can be made more sophisticated
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isWorkHours = hour >= 9 && hour < 18;
  const isEvening = hour >= 18 && hour < 22;
  const isNight = hour >= 22 || hour < 6;

  if (context?.calendar?.toLowerCase().includes("meeting")) {
    return "work";
  }

  if (isNight) {
    return "recovery";
  }

  if (isWeekend) {
    return isEvening ? "social" : "home";
  }

  if (isWorkHours) {
    return "work";
  }

  if (isEvening) {
    return "social";
  }

  return "home";
}

// Adapt time framing based on time perception
export function adaptTimeFrame(
  perception: TimePerception,
  dueDate: Date
): string {
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  // For time-blind users, use concrete units
  if (perception.timeBlindness > 0.6) {
    if (diffHours < 24) {
      return `${Math.round(diffHours)} hours remaining`;
    } else if (diffDays < 7) {
      return `${Math.round(diffDays)} days remaining`;
    } else {
      return dueDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    }
  }

  // For deadline-paralyzed users, avoid "urgent" language
  if (perception.deadlineResponse === "paralysis") {
    if (diffHours < 24) {
      return "Due soon - you've got this";
    } else {
      return `Available until ${dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    }
  }

  // For stress-responsive users, standard urgency is fine
  if (perception.deadlineResponse === "stress" || perception.deadlineResponse === "action") {
    if (diffHours < 4) {
      return "Due in a few hours";
    } else if (diffHours < 24) {
      return "Due today";
    } else if (diffDays < 2) {
      return "Due tomorrow";
    } else {
      return `Due ${dueDate.toLocaleDateString("en-US", { weekday: "long" })}`;
    }
  }

  // Default moderate framing
  return `Due ${dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}
