// Demo Scenario Data - Service, E-commerce, Store, Hybrid

export type ScenarioType = "service" | "ecom" | "store" | "hybrid";

export interface BusinessProfile {
  name: string;
  type: ScenarioType;
  niche: string;
  location: string;
  brand: { tone: string; style: string; accent: string };
  avgTicket: number;
  salesCycleDays: number;
  capacity?: { weeklySlots: number; usedSlots: number };
  inventory?: { heroSku: string; stock: number; lowStockThreshold: number };
  footTraffic?: { today: number; baseline: number };
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  tags: string[];
  sentiment: "positive" | "neutral" | "negative";
}

export interface Lead {
  id: string;
  contactId: string;
  source: string;
  intent: string;
  urgency: "high" | "medium" | "low";
  status: "new" | "contacted" | "qualified" | "reactivation";
  createdAt: string;
}

export interface Deal {
  id: string;
  contactId: string;
  stage: string;
  value: number;
  confidence: number;
  nextBestAction: string;
  risk: "low" | "medium" | "high";
}

export interface Message {
  from: "customer" | "agent";
  at: string;
  text: string;
}

export interface Thread {
  id: string;
  contactId: string;
  channel: "sms" | "whatsapp" | "email" | "voice";
  messages: Message[];
  needsHuman: boolean;
}

export interface Quote {
  id: string;
  dealId: string;
  createdAt: string;
  status: "draft" | "sent" | "accepted" | "expired";
  total: number;
  expiresAt: string;
}

export interface Invoice {
  id: string;
  dealId: string;
  status: "draft" | "sent" | "paid" | "overdue";
  total: number;
  type: "deposit" | "full" | "installment";
  paymentLink: string;
}

export interface Campaign {
  id: string;
  channel: string;
  objective: string;
  status: "active" | "testing" | "paused" | "scheduled";
  dailyBudget: number;
  roas: number | null;
  fatigue: "low" | "medium" | "high";
}

export interface Experiment {
  id: string;
  type: string;
  name: string;
  status: "testing" | "scaling" | "killed" | "archived";
  confidence: number;
  impact: string;
}

export interface Metrics {
  revenueVelocity: number;
  autonomy: number;
  growthReadiness: number;
  risk: "low" | "medium" | "high";
  timeSavedHoursWeek: number;
  recoveredRevenueWeek: number;
  abandonedCartRecovered?: number;
}

export interface ScenarioEvent {
  at: string;
  type: string;
  refId: string;
}

export interface IntegrationStatus {
  [key: string]: "connected" | "pending_template" | "disconnected";
}

export interface Scenario {
  scenario: ScenarioType;
  businessProfile: BusinessProfile;
  integrations: IntegrationStatus;
  contacts: Contact[];
  leads: Lead[];
  deals: Deal[];
  threads: Thread[];
  quotes: Quote[];
  invoices: Invoice[];
  campaigns: Campaign[];
  experiments: Experiment[];
  metrics: Metrics;
  events: ScenarioEvent[];
}

// SERVICE BUSINESS
export const serviceScenario: Scenario = {
  scenario: "service",
  businessProfile: {
    name: "Northside Roofing & Gutters",
    type: "service",
    niche: "home-services-roofing",
    location: "Austin, TX",
    brand: { tone: "confident", style: "premium-dark", accent: "gold" },
    avgTicket: 3200,
    salesCycleDays: 7,
    capacity: { weeklySlots: 18, usedSlots: 14 }
  },
  integrations: {
    googleBusiness: "connected",
    gmail: "connected",
    whatsapp: "pending_template",
    twilio: "connected",
    stripe: "connected",
    metaAds: "connected",
    calendar: "connected"
  },
  contacts: [
    { id: "c1", name: "Jordan Lee", phone: "+15125550111", email: "jordan@example.com", tags: ["lead", "roofing"], sentiment: "neutral" },
    { id: "c2", name: "Maya Patel", phone: "+15125550112", email: "maya@example.com", tags: ["customer", "maintenance"], sentiment: "positive" }
  ],
  leads: [
    { id: "l1", contactId: "c1", source: "Google Business", intent: "estimate", urgency: "high", status: "new", createdAt: "2026-01-17T09:02:00Z" },
    { id: "l2", contactId: "c2", source: "Referral", intent: "gutter-cleaning", urgency: "medium", status: "reactivation", createdAt: "2026-01-10T13:25:00Z" }
  ],
  deals: [
    { id: "d1", contactId: "c1", stage: "Contacted", value: 4800, confidence: 0.72, nextBestAction: "Book inspection", risk: "low" },
    { id: "d2", contactId: "c2", stage: "Proposal Sent", value: 450, confidence: 0.61, nextBestAction: "Follow up on quote", risk: "medium" }
  ],
  threads: [
    {
      id: "t1",
      contactId: "c1",
      channel: "sms",
      messages: [
        { from: "customer", at: "2026-01-17T09:02:00Z", text: "Need a roof inspection. Can you come this week?" },
        { from: "agent", at: "2026-01-17T09:02:20Z", text: "Absolutely. I can book an inspection this week. What day works best—Tue or Thu?" }
      ],
      needsHuman: false
    }
  ],
  quotes: [
    { id: "q1", dealId: "d2", createdAt: "2026-01-15T16:10:00Z", status: "sent", total: 450, expiresAt: "2026-01-22T00:00:00Z" }
  ],
  invoices: [
    { id: "i1", dealId: "d1", status: "draft", total: 1200, type: "deposit", paymentLink: "https://pay.example/deposit/1" }
  ],
  campaigns: [
    { id: "m1", channel: "meta", objective: "leads", status: "active", dailyBudget: 60, roas: 2.1, fatigue: "low" }
  ],
  experiments: [
    { id: "e1", type: "offer", name: "Storm-damage same-week inspection", status: "scaling", confidence: 0.81, impact: "+18% lead-to-booking" }
  ],
  metrics: {
    revenueVelocity: 5420,
    autonomy: 0.84,
    growthReadiness: 0.77,
    risk: "low",
    timeSavedHoursWeek: 11.4,
    recoveredRevenueWeek: 1240
  },
  events: [
    { at: "2026-01-17T09:02:00Z", type: "lead.created", refId: "l1" },
    { at: "2026-01-17T09:02:20Z", type: "message.sent", refId: "t1" },
    { at: "2026-01-17T09:05:00Z", type: "calendar.suggested", refId: "d1" }
  ]
};

// E-COMMERCE
export const ecomScenario: Scenario = {
  scenario: "ecom",
  businessProfile: {
    name: "AURORA Skin",
    type: "ecom",
    niche: "beauty-skincare",
    location: "Online",
    brand: { tone: "warm-premium", style: "premium-dark", accent: "gold" },
    avgTicket: 68,
    salesCycleDays: 1,
    inventory: { heroSku: "Vitamin C Serum", stock: 420, lowStockThreshold: 80 }
  },
  integrations: {
    shopify: "connected",
    gmail: "connected",
    whatsapp: "connected",
    stripe: "connected",
    metaAds: "connected",
    tiktokAds: "connected"
  },
  contacts: [
    { id: "c10", name: "Ari Gomez", phone: "+14155550110", email: "ari@example.com", tags: ["subscriber"], sentiment: "neutral" }
  ],
  leads: [
    { id: "l10", contactId: "c10", source: "Popup", intent: "discount", urgency: "low", status: "new", createdAt: "2026-01-17T08:55:00Z" }
  ],
  deals: [],
  threads: [
    {
      id: "t10",
      contactId: "c10",
      channel: "whatsapp",
      messages: [
        { from: "agent", at: "2026-01-17T09:00:00Z", text: "Quick question—what's your main skin goal right now? Glow, acne, or texture?" }
      ],
      needsHuman: false
    }
  ],
  quotes: [],
  invoices: [],
  campaigns: [
    { id: "m10", channel: "meta", objective: "purchases", status: "active", dailyBudget: 120, roas: 1.6, fatigue: "medium" },
    { id: "m11", channel: "tiktok", objective: "purchases", status: "testing", dailyBudget: 50, roas: 1.2, fatigue: "low" }
  ],
  experiments: [
    { id: "e10", type: "creative", name: "UGC hook: 'I stopped wearing foundation'", status: "testing", confidence: 0.63, impact: "CTR +22%" },
    { id: "e11", type: "offer", name: "Bundle: Serum + Sunscreen", status: "scaling", confidence: 0.79, impact: "AOV +14%" }
  ],
  metrics: {
    revenueVelocity: 8120,
    autonomy: 0.88,
    growthReadiness: 0.83,
    risk: "low",
    timeSavedHoursWeek: 9.1,
    recoveredRevenueWeek: 1890,
    abandonedCartRecovered: 740
  },
  events: [
    { at: "2026-01-17T08:40:00Z", type: "cart.abandoned", refId: "cart_221" },
    { at: "2026-01-17T08:42:00Z", type: "flow.sent", refId: "abandoned_cart_sequence" },
    { at: "2026-01-17T09:05:00Z", type: "order.placed", refId: "order_8821" }
  ]
};

// BRICK & MORTAR
export const storeScenario: Scenario = {
  scenario: "store",
  businessProfile: {
    name: "Cedar & Stone Coffee",
    type: "store",
    niche: "local-cafe",
    location: "Miami, FL",
    brand: { tone: "friendly-premium", style: "premium-dark", accent: "gold" },
    avgTicket: 14,
    salesCycleDays: 0,
    footTraffic: { today: 187, baseline: 230 }
  },
  integrations: {
    googleBusiness: "connected",
    square: "connected",
    sms: "connected",
    email: "connected"
  },
  contacts: [
    { id: "c20", name: "Noah Kim", phone: "+13055550120", email: "noah@example.com", tags: ["walk-in", "vip"], sentiment: "positive" }
  ],
  leads: [
    { id: "l20", contactId: "c20", source: "QR In-Store", intent: "loyalty", urgency: "low", status: "new", createdAt: "2026-01-17T10:12:00Z" }
  ],
  deals: [],
  threads: [],
  quotes: [],
  invoices: [],
  campaigns: [
    { id: "m20", channel: "sms", objective: "foot-traffic", status: "scheduled", dailyBudget: 0, roas: null, fatigue: "low" }
  ],
  experiments: [
    { id: "e20", type: "local-offer", name: "2pm–4pm slow hours: iced latte + cookie", status: "testing", confidence: 0.58, impact: "Foot traffic +9% target" }
  ],
  metrics: {
    revenueVelocity: 2140,
    autonomy: 0.76,
    growthReadiness: 0.66,
    risk: "low",
    timeSavedHoursWeek: 6.3,
    recoveredRevenueWeek: 320
  },
  events: [
    { at: "2026-01-17T10:12:00Z", type: "qr.captured", refId: "l20" },
    { at: "2026-01-17T10:20:00Z", type: "review.requested", refId: "review_flow_1" }
  ]
};

// HYBRID
export const hybridScenario: Scenario = {
  scenario: "hybrid",
  businessProfile: {
    name: "ELEVATE Fitness Studio",
    type: "hybrid",
    niche: "fitness-studio-plus-supplements",
    location: "San Diego, CA",
    brand: { tone: "high-energy-premium", style: "premium-dark", accent: "gold" },
    avgTicket: 129,
    salesCycleDays: 3,
    capacity: { weeklySlots: 42, usedSlots: 34 }
  },
  integrations: {
    instagram: "connected",
    whatsapp: "connected",
    stripe: "connected",
    calendar: "connected",
    shopify: "connected"
  },
  contacts: [
    { id: "c30", name: "Sam Rivera", phone: "+16195550130", email: "sam@example.com", tags: ["lead", "trial"], sentiment: "neutral" }
  ],
  leads: [
    { id: "l30", contactId: "c30", source: "Instagram DM", intent: "trial-class", urgency: "medium", status: "new", createdAt: "2026-01-17T07:45:00Z" }
  ],
  deals: [
    { id: "d30", contactId: "c30", stage: "Qualified", value: 199, confidence: 0.69, nextBestAction: "Book trial + offer membership", risk: "low" }
  ],
  threads: [
    {
      id: "t30",
      contactId: "c30",
      channel: "whatsapp",
      messages: [
        { from: "customer", at: "2026-01-17T07:45:00Z", text: "How much is a trial class?" },
        { from: "agent", at: "2026-01-17T07:45:18Z", text: "Trial is $19. Want today at 6pm or tomorrow at 7am? If you join after, we credit the $19." }
      ],
      needsHuman: false
    }
  ],
  quotes: [],
  invoices: [],
  campaigns: [],
  experiments: [
    { id: "e30", type: "retention", name: "Day-7 check-in + supplement offer", status: "testing", confidence: 0.62, impact: "Churn -8% target" }
  ],
  metrics: {
    revenueVelocity: 6340,
    autonomy: 0.82,
    growthReadiness: 0.74,
    risk: "low",
    timeSavedHoursWeek: 8.7,
    recoveredRevenueWeek: 910
  },
  events: [
    { at: "2026-01-17T07:45:00Z", type: "dm.received", refId: "t30" },
    { at: "2026-01-17T07:45:18Z", type: "message.sent", refId: "t30" },
    { at: "2026-01-17T07:47:00Z", type: "calendar.suggested", refId: "d30" }
  ]
};

export const scenarios: Record<ScenarioType, Scenario> = {
  service: serviceScenario,
  ecom: ecomScenario,
  store: storeScenario,
  hybrid: hybridScenario,
};

export const getScenario = (type: ScenarioType): Scenario => scenarios[type];
