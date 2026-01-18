// State Reducer for Demo Simulator Engine
// Derives current state from events

import { DemoEvent, EventType } from "./eventStore";
import { Scenario, scenarios, ScenarioType, Metrics } from "./scenarioData";

export interface DerivedState {
  scenario: ScenarioType;
  metrics: Metrics;
  activeLeadsCount: number;
  activeDealsCount: number;
  unreadThreadsCount: number;
  pendingApprovalsCount: number;
  recentEvents: DemoEvent[];
  autonomyLevel: number;
  systemStatus: "stable" | "attention" | "critical";
  statusMessage: string;
}

export interface MetricsDelta {
  revenueVelocity?: number;
  recoveredRevenueWeek?: number;
  timeSavedHoursWeek?: number;
  autonomy?: number;
  growthReadiness?: number;
}

// Event impact on metrics
const eventImpacts: Partial<Record<EventType, MetricsDelta>> = {
  "lead.created": { growthReadiness: 0.01 },
  "lead.converted": { revenueVelocity: 500, autonomy: 0.01 },
  "order.placed": { revenueVelocity: 68, autonomy: 0.005 },
  "cart.recovered": { recoveredRevenueWeek: 85, autonomy: 0.01 },
  "invoice.paid": { revenueVelocity: 200, recoveredRevenueWeek: 200 },
  "message.sent": { timeSavedHoursWeek: 0.1, autonomy: 0.002 },
  "calendar.booked": { timeSavedHoursWeek: 0.25, autonomy: 0.01 },
  "pack.enabled": { autonomy: 0.05, timeSavedHoursWeek: 1 },
  "experiment.scaling": { growthReadiness: 0.02 },
};

export function deriveState(
  events: DemoEvent[],
  baseScenario: ScenarioType = "service"
): DerivedState {
  const scenario = scenarios[baseScenario];
  
  // Start with base metrics
  const metrics: Metrics = { ...scenario.metrics };
  
  // Apply event impacts
  events.forEach((event) => {
    const impact = eventImpacts[event.type];
    if (impact) {
      if (impact.revenueVelocity) {
        metrics.revenueVelocity += impact.revenueVelocity;
      }
      if (impact.recoveredRevenueWeek) {
        metrics.recoveredRevenueWeek += impact.recoveredRevenueWeek;
      }
      if (impact.timeSavedHoursWeek) {
        metrics.timeSavedHoursWeek += impact.timeSavedHoursWeek;
      }
      if (impact.autonomy) {
        metrics.autonomy = Math.min(0.99, metrics.autonomy + impact.autonomy);
      }
      if (impact.growthReadiness) {
        metrics.growthReadiness = Math.min(0.99, metrics.growthReadiness + impact.growthReadiness);
      }
    }
  });

  // Round metrics for display
  metrics.revenueVelocity = Math.round(metrics.revenueVelocity);
  metrics.recoveredRevenueWeek = Math.round(metrics.recoveredRevenueWeek);
  metrics.timeSavedHoursWeek = Math.round(metrics.timeSavedHoursWeek * 10) / 10;
  metrics.autonomy = Math.round(metrics.autonomy * 100) / 100;
  metrics.growthReadiness = Math.round(metrics.growthReadiness * 100) / 100;

  // Count escalations
  const escalations = events.filter((e) => e.type === "message.escalated").length;
  const pendingApprovalsCount = escalations;

  // Determine system status
  let systemStatus: "stable" | "attention" | "critical" = "stable";
  let statusMessage = "Systems stable. No action required.";

  if (pendingApprovalsCount > 0) {
    systemStatus = "attention";
    statusMessage = `${pendingApprovalsCount} item${pendingApprovalsCount > 1 ? "s" : ""} need${pendingApprovalsCount === 1 ? "s" : ""} approval.`;
  }

  if (metrics.risk === "high" || escalations > 3) {
    systemStatus = "critical";
    statusMessage = "Attention needed on critical items.";
  }

  return {
    scenario: baseScenario,
    metrics,
    activeLeadsCount: scenario.leads.length + events.filter((e) => e.type === "lead.created").length,
    activeDealsCount: scenario.deals.length,
    unreadThreadsCount: events.filter((e) => e.type === "message.received").length,
    pendingApprovalsCount,
    recentEvents: events.slice(-10),
    autonomyLevel: metrics.autonomy,
    systemStatus,
    statusMessage,
  };
}

// Action executor for packs
export function executePackAction(
  packId: string,
  scenario: ScenarioType
): DemoEvent[] {
  const generatedEvents: Omit<DemoEvent, "id" | "timestamp">[] = [];
  
  // Simulate pack effects based on pack type
  switch (packId) {
    case "lead-follow-up":
      generatedEvents.push({
        type: "message.sent",
        refId: `auto_msg_${Date.now()}`,
        scenario,
        data: { pack: packId },
      });
      generatedEvents.push({
        type: "calendar.suggested",
        refId: `cal_${Date.now()}`,
        scenario,
        data: { pack: packId },
      });
      break;
      
    case "abandoned-cart":
      generatedEvents.push({
        type: "cart.recovered",
        refId: `cart_${Date.now()}`,
        scenario,
        data: { pack: packId, value: 85 },
      });
      break;
      
    case "review-request":
      generatedEvents.push({
        type: "review.requested",
        refId: `review_${Date.now()}`,
        scenario,
        data: { pack: packId },
      });
      break;
      
    case "invoice-reminder":
      generatedEvents.push({
        type: "invoice.sent",
        refId: `inv_${Date.now()}`,
        scenario,
        data: { pack: packId },
      });
      break;
      
    default:
      generatedEvents.push({
        type: "flow.sent",
        refId: `flow_${Date.now()}`,
        scenario,
        data: { pack: packId },
      });
  }

  return generatedEvents as DemoEvent[];
}

// Time-based event simulation
export function simulateTimePassing(
  scenario: ScenarioType,
  minutes: number
): Omit<DemoEvent, "id" | "timestamp">[] {
  const events: Omit<DemoEvent, "id" | "timestamp">[] = [];
  
  // Random chance of events based on time and scenario
  const scenarioData = scenarios[scenario];
  
  // Lead generation (more likely for service/hybrid)
  if (Math.random() < 0.1 * (minutes / 60)) {
    events.push({
      type: "lead.created",
      refId: `lead_${Date.now()}`,
      scenario,
      data: { source: "organic" },
    });
  }
  
  // Message handling
  if (Math.random() < 0.15 * (minutes / 60)) {
    events.push({
      type: "message.sent",
      refId: `msg_${Date.now()}`,
      scenario,
      data: { automated: true },
    });
  }
  
  // E-commerce specific
  if (scenario === "ecom" && Math.random() < 0.2 * (minutes / 60)) {
    if (Math.random() < 0.3) {
      events.push({
        type: "cart.abandoned",
        refId: `cart_${Date.now()}`,
        scenario,
      });
      // 60% recovery rate
      if (Math.random() < 0.6) {
        events.push({
          type: "cart.recovered",
          refId: `cart_${Date.now()}`,
          scenario,
          data: { value: 68 },
        });
      }
    } else {
      events.push({
        type: "order.placed",
        refId: `order_${Date.now()}`,
        scenario,
        data: { value: scenarioData.businessProfile.avgTicket },
      });
    }
  }
  
  // Service-specific
  if ((scenario === "service" || scenario === "hybrid") && Math.random() < 0.12 * (minutes / 60)) {
    events.push({
      type: "calendar.booked",
      refId: `cal_${Date.now()}`,
      scenario,
    });
  }
  
  return events;
}
