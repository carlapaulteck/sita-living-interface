// Advanced Onboarding Data Types

export type SetupMode = "quick" | "guided" | "deep";

export type PrimaryIntent = 
  | "increase-income"
  | "improve-sleep"
  | "build-focus"
  | "automate-life"
  | "track-privately"
  | "digital-twin";

export type AssistantStyle = "executive" | "coach" | "muse" | "analyst";

export type AutonomyLevel = "observe" | "suggest" | "act" | "autopilot";

export type DataMode = "local-first" | "cloud" | "hybrid";

export type VoiceGender = "male" | "female" | "androgynous";

export type AvatarStyle = "orb" | "human" | "abstract";

export type PresenceStyle = "calm" | "sharp" | "playful" | "mysterious";

export type RhythmTemplate = "early-bird" | "night-owl" | "split-schedule" | "rotating" | "custom";

export type RiskTolerance = "low" | "medium" | "high";

export type IncomeType = "salary" | "business" | "creator" | "trading" | "mixed";

export type TrainingType = "strength" | "cardio" | "mixed" | "none";

export type LearningStyle = "visual" | "practice" | "reading" | "mentor";

export interface NorthStarMetric {
  id: string;
  label: string;
  category: "wealth" | "health" | "focus" | "time";
}

export interface VoiceProfile {
  gender: VoiceGender;
  speed: number; // 0.5 - 2.0
  warmth: number; // 0 - 100
}

export interface SensoryPrefs {
  ambientSound: boolean;
  haptics: "subtle" | "medium" | "off";
}

export interface FrictionProfile {
  pushIntensity: "hard" | "gentle";
  actionMode: "ask-first" | "act-automatically";
  verbosity: "minimal" | "detailed";
  alertFrequency: "daily-summary" | "critical-only";
}

export interface DailyRhythm {
  template: RhythmTemplate;
  wakeTime: string;
  sleepTime: string;
  workStart: string;
  workEnd: string;
  focusBlocks: { start: string; end: string }[];
  trainingTime?: string;
  mealWindows: { start: string; end: string }[];
}

export interface IntegrationScope {
  provider: string;
  status: "connected" | "pending" | "disconnected";
  scope: "minimal" | "standard" | "full";
  automationRights: "view" | "suggest" | "act";
}

export interface WealthProfile {
  incomeType: IncomeType;
  revenueSources: string[];
  riskTolerance: RiskTolerance;
  primaryLever: "increase-revenue" | "reduce-burn" | "invest" | "automate-ops";
  wealthMeaning: "stability" | "freedom" | "status" | "mission";
  automations: {
    trackDaily: boolean;
    alertAnomalies: boolean;
    weeklySummary: boolean;
    revenueExperiments: boolean;
  };
}

export interface HealthProfile {
  topGoal: "sleep" | "recovery" | "stress" | "training" | "longevity";
  constraints: string[];
  trainingType: TrainingType;
  interventions: string[];
  baselineMetrics?: {
    chronotype?: string;
    hrvBaseline?: number;
    stressThreshold?: number;
  };
}

export interface FocusProfile {
  objective: "learn-skill" | "build-habit" | "read-more" | "ship-product";
  learningStyle: LearningStyle;
  dailyCapacity: number; // 1-5
  distractors: string[];
  deepWorkWindows: { start: string; end: string }[];
}

export interface SovereigntyProfile {
  dataMode: DataMode;
  retentionDays: number;
  memoryPolicy: {
    rememberGoals: boolean;
    storeSensitive: boolean;
    autoDeleteLogs: boolean;
  };
}

export interface Guardrails {
  neverSpendWithoutApproval: boolean;
  neverMessageWithoutApproval: boolean;
  canAdjustCalendar: boolean;
  canEnableFocusMode: boolean;
}

export interface AutomationTemplate {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  description: string;
  category: "health" | "focus" | "wealth" | "system";
}

export interface OnboardingData {
  // Setup
  setupMode: SetupMode;
  
  // Identity & Intent
  name: string;
  primaryIntents: PrimaryIntent[];
  northStarMetrics: string[];
  
  // Personality & Communication
  assistantStyle: AssistantStyle;
  frictionProfile: FrictionProfile;
  voiceProfile: VoiceProfile;
  sensoryPrefs: SensoryPrefs;
  
  // Time & Rhythm
  dailyRhythm: DailyRhythm;
  calendarConnected: boolean;
  
  // Devices & Integrations
  integrations: IntegrationScope[];
  
  // Module-specific personalization
  wealthProfile?: WealthProfile;
  healthProfile?: HealthProfile;
  focusProfile?: FocusProfile;
  sovereigntyProfile: SovereigntyProfile;
  
  // Automation
  autonomyLevel: AutonomyLevel;
  guardrails: Guardrails;
  automations: AutomationTemplate[];
  
  // Emotional personalization
  avatarStyle: AvatarStyle;
  presenceStyle: PresenceStyle;
  signaturePhrase?: string;
  morningRitual: boolean;
  
  // Theme
  theme: "dark" | "light" | "auto";
  
  // Meta
  completedAt?: string;
  onboardingVersion: number;
}

export const defaultOnboardingData: OnboardingData = {
  setupMode: "guided",
  name: "",
  primaryIntents: [],
  northStarMetrics: [],
  assistantStyle: "executive",
  frictionProfile: {
    pushIntensity: "gentle",
    actionMode: "ask-first",
    verbosity: "minimal",
    alertFrequency: "daily-summary",
  },
  voiceProfile: {
    gender: "female",
    speed: 1.0,
    warmth: 70,
  },
  sensoryPrefs: {
    ambientSound: false,
    haptics: "subtle",
  },
  dailyRhythm: {
    template: "early-bird",
    wakeTime: "06:30",
    sleepTime: "22:30",
    workStart: "09:00",
    workEnd: "18:00",
    focusBlocks: [{ start: "09:30", end: "11:00" }],
    mealWindows: [
      { start: "07:00", end: "08:00" },
      { start: "12:30", end: "13:30" },
      { start: "19:00", end: "20:00" },
    ],
  },
  calendarConnected: false,
  integrations: [],
  sovereigntyProfile: {
    dataMode: "hybrid",
    retentionDays: 90,
    memoryPolicy: {
      rememberGoals: true,
      storeSensitive: false,
      autoDeleteLogs: true,
    },
  },
  autonomyLevel: "suggest",
  guardrails: {
    neverSpendWithoutApproval: true,
    neverMessageWithoutApproval: true,
    canAdjustCalendar: false,
    canEnableFocusMode: true,
  },
  automations: [],
  avatarStyle: "orb",
  presenceStyle: "calm",
  morningRitual: true,
  theme: "dark",
  onboardingVersion: 1,
};

export const NORTH_STAR_METRICS: NorthStarMetric[] = [
  { id: "energy-10am", label: "More energy by 10am", category: "health" },
  { id: "revenue-increase", label: "+$X/mo revenue", category: "wealth" },
  { id: "deep-work-blocks", label: "2 deep work blocks/day", category: "focus" },
  { id: "admin-time", label: "<30 min admin/day", category: "time" },
  { id: "sleep-avg", label: "7.5h sleep avg", category: "health" },
  { id: "consistent-workouts", label: "Consistent workouts", category: "health" },
  { id: "zero-overdue", label: "Zero overdue tasks", category: "focus" },
  { id: "weekly-review", label: "Weekly progress reviews", category: "focus" },
];

export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  // Health & Recovery
  {
    id: "sleep-low-adjust",
    name: "Sleep Score Recovery",
    trigger: "Sleep score drops below 70%",
    action: "Lighten tomorrow's schedule + earlier wind-down reminder",
    enabled: false,
    description: "When your sleep quality dips, SITA automatically adjusts your next day's workload and sends a gentle reminder to wind down earlier. Protects your recovery without you having to think about it.",
    category: "health",
  },
  {
    id: "stress-high-protocol",
    name: "Stress Response Protocol",
    trigger: "HRV drops or stress markers spike",
    action: "Breathing exercise + reschedule non-urgent tasks",
    enabled: false,
    description: "Detects physiological stress signals from your wearables and automatically offers a 2-minute breathing protocol while moving non-critical tasks to calmer time slots.",
    category: "health",
  },
  {
    id: "energy-dip-alert",
    name: "Energy Dip Protection",
    trigger: "Predicted energy crash in 30 minutes",
    action: "Suggest break + hydration + light movement",
    enabled: false,
    description: "Based on your historical patterns and current activity, SITA predicts energy dips before they happen and proactively suggests micro-breaks to maintain peak performance.",
    category: "health",
  },
  {
    id: "recovery-day-mode",
    name: "Recovery Day Mode",
    trigger: "3+ consecutive high-intensity days detected",
    action: "Block focus slots + suggest recovery activities",
    enabled: false,
    description: "Monitors your cumulative load across work and exercise. When you've been pushing hard, it automatically creates space for recovery to prevent burnout.",
    category: "health",
  },
  
  // Focus & Productivity
  {
    id: "focus-window-silence",
    name: "Focus Window Guard",
    trigger: "Scheduled focus block starting",
    action: "Enable DND + silence notifications + surface priority tasks",
    enabled: false,
    description: "When your designated deep work time begins, SITA automatically silences all distractions and presents your most important tasks. Pure focus, zero friction.",
    category: "focus",
  },
  {
    id: "task-pile-intervention",
    name: "Task Pile Intervention",
    trigger: "Overdue tasks exceed threshold",
    action: "Triage assistant + reschedule or delegate suggestions",
    enabled: false,
    description: "When tasks start piling up, SITA steps in to help you triage. It suggests what to reschedule, what to delegate, and what truly needs your attention today.",
    category: "focus",
  },
  {
    id: "context-switch-guard",
    name: "Context Switch Guardian",
    trigger: "Rapid task switching detected",
    action: "Gentle pause + single-task suggestion",
    enabled: false,
    description: "Detects when you're bouncing between too many things and gently suggests focusing on one task. Protects your cognitive budget from fragmentation.",
    category: "focus",
  },
  {
    id: "deep-work-streak",
    name: "Deep Work Streak Tracker",
    trigger: "90-minute focus block completed",
    action: "Log achievement + suggest break + celebrate win",
    enabled: false,
    description: "Celebrates your focus wins! When you complete a deep work session, SITA logs your streak, suggests a restorative break, and adds it to your accomplishments.",
    category: "focus",
  },
  
  // Wealth & Business
  {
    id: "revenue-spike-alert",
    name: "Revenue Spike Analysis",
    trigger: "Unusual revenue increase detected",
    action: "Analyze source + summarize + suggest amplification",
    enabled: false,
    description: "When money flows in unexpectedly, SITA investigates the source and suggests how to replicate or amplify it. Turn happy accidents into repeatable systems.",
    category: "wealth",
  },
  {
    id: "revenue-drop-alert",
    name: "Revenue Drop Warning",
    trigger: "Revenue 20% below weekly average",
    action: "Diagnostic report + suggest recovery actions",
    enabled: false,
    description: "Early warning when revenue dips. SITA analyzes potential causes and suggests concrete actions to investigate and recover before it becomes a trend.",
    category: "wealth",
  },
  {
    id: "expense-anomaly",
    name: "Expense Anomaly Detection",
    trigger: "Unusual charge or subscription increase",
    action: "Alert + show context + suggest action",
    enabled: false,
    description: "Catches unexpected charges, subscription price hikes, or duplicate payments. Get alerted before small leaks become big problems.",
    category: "wealth",
  },
  {
    id: "opportunity-scout",
    name: "Opportunity Scout",
    trigger: "New lead or high-value opportunity detected",
    action: "Priority notification + background research + suggested response",
    enabled: false,
    description: "When a promising opportunity comes in, SITA does the research for you—company background, relevant context—and drafts a personalized response strategy.",
    category: "wealth",
  },
  
  // System & Daily Flow
  {
    id: "morning-briefing",
    name: "Morning Briefing",
    trigger: "15 minutes after wake time",
    action: "Personalized daily summary + energy forecast + priorities",
    enabled: false,
    description: "Start your day with clarity. SITA delivers a personalized briefing covering overnight wins, today's cognitive weather, and your top 3 priorities—optionally read aloud.",
    category: "system",
  },
  {
    id: "evening-wind-down",
    name: "Evening Wind-Down",
    trigger: "2 hours before sleep time",
    action: "Tomorrow prep + inbox zero + win celebration",
    enabled: false,
    description: "Transition gracefully from work mode. SITA helps you prep tomorrow, celebrate today's wins, and clear mental clutter before rest.",
    category: "system",
  },
  {
    id: "device-disconnect",
    name: "Device Recovery",
    trigger: "Wearable or connected device goes offline",
    action: "Notify + attempt reconnection + log gap",
    enabled: false,
    description: "When your devices disconnect unexpectedly, SITA notifies you and attempts automatic reconnection. Gaps in data are logged so your insights stay accurate.",
    category: "system",
  },
  {
    id: "weekly-review-prep",
    name: "Weekly Review Prep",
    trigger: "Sunday evening (configurable)",
    action: "Compile week summary + next week preview + suggest adjustments",
    enabled: false,
    description: "Every week, SITA prepares a comprehensive review: what worked, what didn't, patterns detected, and suggestions for the coming week. Make every week better than the last.",
    category: "system",
  },
];
