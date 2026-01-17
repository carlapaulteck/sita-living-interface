// Demo data for all modules - simulated live data

export const businessData = {
  overview: {
    revenueVelocity: { value: "+$5,420", change: "+12%", status: "healthy" },
    growthReadiness: { value: "87%", status: "ready" },
    systemAutonomy: { value: "73%", goal: "90%" },
    riskLevel: { value: "Low", status: "green" },
  },
  activeExperiments: [
    { name: "Homepage CTA Test", status: "running", lift: "+8%" },
    { name: "Email Subject Lines", status: "winner", lift: "+23%" },
    { name: "Pricing Page Layout", status: "paused", lift: "-2%" },
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
};

export const lifeHealthData = {
  overview: {
    wellnessScore: 84,
    sleepQuality: 92,
    energyLevel: 78,
    stressLevel: "Low",
  },
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
