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
  {
    id: "sleep-low-adjust",
    name: "Sleep Score Recovery",
    trigger: "Sleep score drops below threshold",
    action: "Lighten schedule + earlier wind-down reminder",
    enabled: false,
  },
  {
    id: "focus-window-silence",
    name: "Focus Window Guard",
    trigger: "Focus window starting",
    action: "Silence distractions + open task list",
    enabled: false,
  },
  {
    id: "revenue-spike-alert",
    name: "Revenue Spike Analysis",
    trigger: "Revenue spike detected",
    action: "Summarize source + suggest next action",
    enabled: false,
  },
  {
    id: "stress-high-protocol",
    name: "Stress Response",
    trigger: "Stress level elevated",
    action: "Breathing protocol + reschedule non-urgent tasks",
    enabled: false,
  },
  {
    id: "device-disconnect",
    name: "Device Recovery",
    trigger: "Device disconnects unexpectedly",
    action: "Notify + attempt reconnection",
    enabled: false,
  },
  {
    id: "morning-briefing",
    name: "Morning Briefing",
    trigger: "Wake time + 15 minutes",
    action: "Deliver personalized morning summary",
    enabled: false,
  },
];
