// Service layer barrel export
// Provides clean API for interacting with backend services

export { agentService } from "./agent.service";
export type { Agent, AgentTask, TaskRecord, WorkflowStep } from "./agent.service";

export { organizationService } from "./organization.service";
export type { Organization, OrganizationMember } from "./organization.service";

export { webhookService } from "./webhook.service";
export type { Webhook, WebhookLog } from "./webhook.service";

export { integrationService } from "./integration.service";
export type { Integration, SyncLog, IntegrationProvider, ProviderInfo } from "./integration.service";
