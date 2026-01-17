// Demo data for all modules - simulated live data
// Following the "calm control room" design principle - signals over dashboards

export const businessData = {
  overview: {
    revenueVelocity: { value: "+$5,420", change: "+12%", status: "healthy" },
    growthReadiness: { value: "87%", status: "ready" },
    systemAutonomy: { value: "73%", goal: "90%" },
    riskLevel: { value: "Low", status: "green" },
  },
  pulse: {
    revenueVelocity: 84,
    growthReadiness: 87,
    autonomy: 73,
    risk: 12,
  },
  signals: [
    { type: "success", message: "$1,240 recovered in the last 24 hours.", time: "2h ago" },
    { type: "info", message: "2 experiments running · 1 scaling · 1 archived.", time: "4h ago" },
    { type: "success", message: "11.4 hours saved this week.", time: "1d ago" },
  ],
  activeExperiments: [
    { name: "Homepage CTA Test", status: "running", lift: "+8%", confidence: 0.72 },
    { name: "Email Subject Lines", status: "winner", lift: "+23%", confidence: 0.94 },
    { name: "Pricing Page Layout", status: "paused", lift: "-2%", confidence: 0.45 },
  ],
  recoveredRevenue: {
    value: "$1,240",
    source: "Lazarus Reactivation",
    leads: 12,
  },
  audienceGrowth: {
    subscribers: 312,
    trend: "+18%",
    channels: { email: 180, sms: 82, whatsapp: 50 },
  },
  engines: {
    demand: { status: "healthy", message: "Stable. Scaling winners within budget." },
    sales: { status: "healthy", message: "Following up automatically. 1 deal at risk." },
    operations: { status: "healthy", message: "Capacity at 78%. Safe to scale." },
  },
  needsYou: [] as { id: string; type: string; message: string; action: string; priority: "high" | "medium" | "low" }[],
};

export const wealthData = {
  overview: {
    sleepEarnings: 142.50,
    activeAssets: 3,
    arbitrageSignals: 2,
    capitalAllocated: "$24.8K",
    exitReadiness: "Not yet",
  },
  microbrands: [
    { name: "Alpha Templates", status: "scaling", revenue: "$3,200/mo", growth: "+24%" },
    { name: "Beta Presets", status: "active", revenue: "$1,100/mo", growth: "+8%" },
    { name: "Gamma Guides", status: "archived", revenue: "$0/mo", growth: "0%" },
  ],
  arbitrage: [
    { signal: "Domain resale opportunity", confidence: 0.78, potentialValue: "$2,400" },
    { signal: "Affiliate rate increase", confidence: 0.65, potentialValue: "$180/mo" },
  ],
  wakeUpReceipt: {
    earnings: 142.50,
    leadsRecovered: 3,
    invoicesCollected: 1,
    risksAvoided: 1,
    timeSaved: "2.4 hrs",
  },
};

export const lifeHealthData = {
  overview: {
    wellnessScore: 84,
    sleepQuality: 92,
    energyLevel: 78,
    stressLevel: "Low",
  },
  signals: [
    { type: "success", message: "Sleep quality excellent. Ready for high intensity.", time: "now" },
    { type: "info", message: "Recovery at 87%. Optimal for training.", time: "6h ago" },
  ],
  sleep: {
    duration: "7.5 hrs",
    quality: 92,
    remCycles: 3,
    deepSleep: "1.8 hrs",
    lightSleep: "4.2 hrs",
    awakeTime: "12 min",
  },
  fitness: {
    steps: 8420,
    goal: 12000,
    activeMinutes: 45,
    caloriesBurned: 2140,
    workoutsThisWeek: 4,
    streak: 12,
  },
  nutrition: {
    caloriesConsumed: 1850,
    calorieGoal: 2200,
    protein: 120,
    carbs: 180,
    fats: 65,
    hydration: "2.4L",
    hydrationGoal: "3L",
  },
  vitals: {
    heartRate: 68,
    hrv: 62,
    bloodPressure: "118/76",
    bodyTemp: "98.4°F",
    oxygenSaturation: 98,
  },
  recovery: {
    score: 87,
    readiness: "High",
    muscleRecovery: 92,
    mentalRecovery: 84,
    recommendation: "Ready for high-intensity training",
  },
};

export const mindGrowthData = {
  overview: {
    focusScore: 74,
    learningStreak: 12,
    habitsCompleted: 5,
    habitsTotal: 6,
    creativityIndex: 68,
  },
  signals: [
    { type: "success", message: "Deep work: 3.5 hrs today. Above average.", time: "now" },
    { type: "info", message: "Learning streak: 12 days. Keep it going.", time: "1d ago" },
  ],
  focus: {
    deepWorkToday: "3.5 hrs",
    focusWindows: [
      { time: "6:00 AM", duration: "2 hrs", quality: "High" },
      { time: "2:00 PM", duration: "1.5 hrs", quality: "Medium" },
    ],
    distractions: 4,
    avgFocusSession: "48 min",
  },
  learning: {
    currentCourses: [
      { name: "Advanced TypeScript", progress: 68, hoursLeft: 4 },
      { name: "Leadership Essentials", progress: 45, hoursLeft: 8 },
    ],
    booksReading: [
      { title: "Atomic Habits", progress: 72 },
      { title: "Deep Work", progress: 34 },
    ],
    skillsGained: 3,
    streak: 12,
  },
  habits: {
    today: [
      { name: "Morning Meditation", completed: true },
      { name: "Exercise", completed: true },
      { name: "Read 30 min", completed: true },
      { name: "Journal", completed: true },
      { name: "Cold Shower", completed: true },
      { name: "No Social Media", completed: false },
    ],
    weeklyCompletion: 89,
    longestStreak: 45,
  },
  creativity: {
    projectsActive: 3,
    ideasCaptured: 14,
    contentCreated: 8,
    creativityPeakTime: "Morning",
  },
  mindfulness: {
    meditationToday: 15,
    meditationStreak: 23,
    totalMinutes: 890,
    stressLevel: "Low",
    moodTrend: "Positive",
  },
};

export const sovereigntyData = {
  overview: {
    dataOwnership: 94,
    privacyScore: 87,
    activeSessions: 3,
    automationRules: 12,
    platformIndependence: 76,
  },
  boundaries: {
    autopilotLevel: "Balanced",
    budgetCaps: "$500/mo",
    quietHours: "10pm - 7am",
    approvalRequired: ["Spend over $50", "External messages"],
  },
  data: {
    totalData: "24.6 GB",
    ownedData: "23.1 GB",
    externalData: "1.5 GB",
    categories: [
      { name: "Documents", size: "8.2 GB", owned: true },
      { name: "Media", size: "12.4 GB", owned: true },
      { name: "Emails", size: "2.5 GB", owned: true },
      { name: "Cloud Sync", size: "1.5 GB", owned: false },
    ],
    lastExport: "3 days ago",
  },
  privacy: {
    score: 87,
    exposures: 2,
    recommendations: [
      { action: "Enable 2FA on banking", priority: "High" },
      { action: "Review app permissions", priority: "Medium" },
    ],
    dataBreachMonitoring: "Active",
    vpnStatus: "Connected",
  },
  identity: {
    accounts: 24,
    securePasswords: 22,
    weakPasswords: 2,
    mfaEnabled: 18,
    sessions: [
      { device: "MacBook Pro", location: "Home", active: true },
      { device: "iPhone 15", location: "Mobile", active: true },
      { device: "iPad", location: "Home", active: true },
    ],
  },
  automation: {
    activeRules: 12,
    rulesTriggered: 847,
    timeSaved: "24.5 hrs/week",
    topRules: [
      { name: "Email Auto-Sort", triggers: 312 },
      { name: "Invoice Processing", triggers: 45 },
      { name: "Calendar Blocking", triggers: 89 },
    ],
  },
  freedom: {
    platformDependency: [
      { platform: "Google", dependency: 34, risk: "Medium" },
      { platform: "Apple", dependency: 28, risk: "Low" },
      { platform: "Microsoft", dependency: 14, risk: "Low" },
    ],
    portabilityScore: 82,
    exitReadiness: "High",
    alternatives: 8,
  },
};

// Advisor council data
export const advisorData = {
  advisors: [
    { 
      role: "CEO", 
      name: "Strategic Vision",
      insight: "Focus on one offer for 7 days.",
      confidence: 0.88
    },
    { 
      role: "CFO", 
      name: "Financial Intelligence",
      insight: "Scale spend +10% safely.",
      confidence: 0.82
    },
    { 
      role: "CMO", 
      name: "Growth Engine",
      insight: "Refresh creative angle. Fatigue rising.",
      confidence: 0.75
    },
    { 
      role: "COO", 
      name: "Operations",
      insight: "Capacity supports growth until Friday.",
      confidence: 0.91
    },
    { 
      role: "CRO", 
      name: "Revenue",
      insight: "Pipeline healthy. Focus on closing.",
      confidence: 0.79
    },
  ],
  recommendation: "Scale conservatively. Capacity and cashflow aligned.",
};

// Workflow packs
export const workflowPacks = [
  {
    id: "lead-response",
    name: "Lead Response Engine",
    description: "Instant responses to new leads across all channels",
    status: "ready",
    channels: ["SMS", "WhatsApp", "Email"],
    actions: [
      "Instant acknowledgment within 60 seconds",
      "Qualification questions",
      "Calendar booking suggestion",
    ],
    costPerAction: "$0.02",
    autopilotLevel: "balanced",
  },
  {
    id: "revenue-recovery",
    name: "Revenue Recovery",
    description: "Automated follow-ups on abandoned carts and cold leads",
    status: "ready",
    channels: ["Email", "SMS"],
    actions: [
      "Cart abandonment sequence",
      "Cold lead reactivation",
      "Quote follow-up reminders",
    ],
    costPerAction: "$0.01",
    autopilotLevel: "conservative",
  },
  {
    id: "reputation-guardian",
    name: "Reputation Guardian",
    description: "Monitor and respond to reviews automatically",
    status: "needs_connection",
    channels: ["Google Business", "Yelp"],
    actions: [
      "Review response within 2 hours",
      "Negative review escalation",
      "Review request after positive interactions",
    ],
    costPerAction: "$0.00",
    autopilotLevel: "balanced",
  },
  {
    id: "collections-autopilot",
    name: "Collections Autopilot",
    description: "Gentle but persistent payment follow-ups",
    status: "ready",
    channels: ["Email", "SMS"],
    actions: [
      "Payment reminder sequence",
      "Escalation tiers",
      "Payment plan offers",
    ],
    costPerAction: "$0.01",
    autopilotLevel: "conservative",
  },
];

// Time-based greeting
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Generate realistic fluctuations
export function getFluctuatingValue(base: number, variance: number): number {
  return Math.round(base + (Math.random() - 0.5) * variance * 2);
}

// Get system status message (calm control room style)
export function getSystemStatus(): { message: string; type: "calm" | "attention" | "action" } {
  const needsAttention = businessData.needsYou.length;
  if (needsAttention === 0) {
    return { message: "Everything important is handled.", type: "calm" };
  } else if (needsAttention === 1) {
    return { message: "One item needs approval.", type: "attention" };
  }
  return { message: `${needsAttention} items need your attention.`, type: "action" };
}
