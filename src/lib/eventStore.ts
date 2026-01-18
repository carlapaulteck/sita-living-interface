// Event Store for Demo Simulator Engine
// Append-only event log with real-time projections

import { ScenarioType, ScenarioEvent, Scenario, scenarios } from "./scenarioData";

export interface DemoEvent {
  id: string;
  timestamp: string;
  type: EventType;
  refId: string;
  data?: Record<string, any>;
  scenario: ScenarioType;
}

export type EventType =
  // Lead events
  | "lead.created"
  | "lead.qualified"
  | "lead.converted"
  | "lead.lost"
  // Message events
  | "message.received"
  | "message.sent"
  | "message.escalated"
  | "dm.received"
  // Order events
  | "cart.abandoned"
  | "cart.recovered"
  | "order.placed"
  | "order.fulfilled"
  // Payment events
  | "invoice.created"
  | "invoice.sent"
  | "invoice.paid"
  | "payment.received"
  // Calendar events
  | "calendar.suggested"
  | "calendar.booked"
  | "calendar.completed"
  // Marketing events
  | "campaign.started"
  | "campaign.paused"
  | "experiment.started"
  | "experiment.scaling"
  | "experiment.killed"
  // System events
  | "flow.sent"
  | "qr.captured"
  | "review.requested"
  | "pack.enabled"
  | "pack.disabled";

export interface EventStore {
  events: DemoEvent[];
  subscribe: (callback: (event: DemoEvent) => void) => () => void;
  push: (event: Omit<DemoEvent, "id" | "timestamp">) => DemoEvent;
  getEvents: (scenario?: ScenarioType) => DemoEvent[];
  getRecentEvents: (count: number, scenario?: ScenarioType) => DemoEvent[];
  clear: () => void;
  loadScenarioEvents: (scenario: ScenarioType) => void;
}

// Generate unique ID
const generateId = (): string => {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create event store
export function createEventStore(): EventStore {
  let events: DemoEvent[] = [];
  const subscribers: Set<(event: DemoEvent) => void> = new Set();

  return {
    events,

    subscribe(callback) {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },

    push(eventData) {
      const event: DemoEvent = {
        ...eventData,
        id: generateId(),
        timestamp: new Date().toISOString(),
      };
      events.push(event);
      
      // Notify subscribers
      subscribers.forEach((callback) => callback(event));
      
      return event;
    },

    getEvents(scenario) {
      if (scenario) {
        return events.filter((e) => e.scenario === scenario);
      }
      return [...events];
    },

    getRecentEvents(count, scenario) {
      const filtered = scenario ? events.filter((e) => e.scenario === scenario) : events;
      return filtered.slice(-count);
    },

    clear() {
      events = [];
    },

    loadScenarioEvents(scenario) {
      const scenarioData = scenarios[scenario];
      if (!scenarioData) return;

      // Convert scenario events to demo events
      scenarioData.events.forEach((se) => {
        this.push({
          type: se.type as EventType,
          refId: se.refId,
          scenario,
          data: { originalTimestamp: se.at },
        });
      });
    },
  };
}

// Singleton instance
let eventStoreInstance: EventStore | null = null;

export function getEventStore(): EventStore {
  if (!eventStoreInstance) {
    eventStoreInstance = createEventStore();
  }
  return eventStoreInstance;
}

// Event type display helpers
export const eventTypeLabels: Record<EventType, string> = {
  "lead.created": "New lead captured",
  "lead.qualified": "Lead qualified",
  "lead.converted": "Lead converted to customer",
  "lead.lost": "Lead marked as lost",
  "message.received": "Message received",
  "message.sent": "Reply sent",
  "message.escalated": "Escalated to human",
  "dm.received": "DM received",
  "cart.abandoned": "Cart abandoned",
  "cart.recovered": "Cart recovered",
  "order.placed": "Order placed",
  "order.fulfilled": "Order fulfilled",
  "invoice.created": "Invoice created",
  "invoice.sent": "Invoice sent",
  "invoice.paid": "Invoice paid",
  "payment.received": "Payment received",
  "calendar.suggested": "Appointment suggested",
  "calendar.booked": "Appointment booked",
  "calendar.completed": "Appointment completed",
  "campaign.started": "Campaign started",
  "campaign.paused": "Campaign paused",
  "experiment.started": "Experiment started",
  "experiment.scaling": "Experiment scaling",
  "experiment.killed": "Experiment ended",
  "flow.sent": "Automation triggered",
  "qr.captured": "QR code scanned",
  "review.requested": "Review requested",
  "pack.enabled": "Workflow pack enabled",
  "pack.disabled": "Workflow pack disabled",
};

export const eventTypeIcons: Record<EventType, string> = {
  "lead.created": "👤",
  "lead.qualified": "✅",
  "lead.converted": "🎉",
  "lead.lost": "❌",
  "message.received": "📨",
  "message.sent": "📤",
  "message.escalated": "🚨",
  "dm.received": "💬",
  "cart.abandoned": "🛒",
  "cart.recovered": "💰",
  "order.placed": "🛍️",
  "order.fulfilled": "📦",
  "invoice.created": "📄",
  "invoice.sent": "📧",
  "invoice.paid": "💵",
  "payment.received": "✨",
  "calendar.suggested": "📅",
  "calendar.booked": "✔️",
  "calendar.completed": "🏁",
  "campaign.started": "🚀",
  "campaign.paused": "⏸️",
  "experiment.started": "🧪",
  "experiment.scaling": "📈",
  "experiment.killed": "🔴",
  "flow.sent": "⚡",
  "qr.captured": "📱",
  "review.requested": "⭐",
  "pack.enabled": "✨",
  "pack.disabled": "🔌",
};
