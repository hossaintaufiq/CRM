/**
 * Nexus CRM — Backend API contract
 * --------------------------------
 * The UI currently uses demo data via `crmClient` in `src/lib/api/crm-client.ts`.
 * When the backend is ready, replace demo adapters with real `fetch` calls to these
 * endpoints. Keep path strings in sync with this file.
 *
 * Base URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8001";

export const API_ENDPOINTS = {
  /** POST — email/password login */
  authLogin: "/api/v1/auth/login",
  /** POST — register */
  authRegister: "/api/v1/auth/register",
  /** GET — current user */
  authMe: "/api/v1/auth/me",
  /** POST — OAuth start `/api/v1/auth/oauth/:provider/start` */
  authOAuthStart: (provider: string) => `/api/v1/auth/oauth/${provider}/start`,

  /** GET — dashboard KPIs + summary aggregates */
  dashboardSummary: "/api/v1/dashboard/summary",

  /** GET — activity feed (paginated) */
  activities: "/api/v1/activities",

  /** GET list | POST create */
  deals: "/api/v1/deals",
  /** GET | PATCH | DELETE — `/api/v1/deals/:id` */
  dealById: (id: string) => `/api/v1/deals/${id}`,
  /** PATCH — `{ stage }` body — `/api/v1/deals/:id/stage` */
  dealStage: (id: string) => `/api/v1/deals/${id}/stage`,
  /** POST — bulk delete `{ ids: string[] }` */
  dealsBulkDelete: "/api/v1/deals/bulk-delete",

  /** GET | PUT — pipeline stage configuration */
  pipelineStages: "/api/v1/pipeline/stages",
  /** GET | PUT — board display preferences (compact cards, hidden stages, etc.) */
  pipelinePreferences: "/api/v1/pipeline/preferences",

  /** GET list | POST create */
  leads: "/api/v1/leads",
  /** GET | PATCH | DELETE */
  leadById: (id: string) => `/api/v1/leads/${id}`,
  /** PATCH — `{ status }` */
  leadStatus: (id: string) => `/api/v1/leads/${id}/status`,
  /** POST — bulk delete */
  leadsBulkDelete: "/api/v1/leads/bulk-delete",

  /** GET list | POST create */
  contacts: "/api/v1/contacts",
  /** GET | PATCH | DELETE */
  contactById: (id: string) => `/api/v1/contacts/${id}`,
  /** POST — bulk delete */
  contactsBulkDelete: "/api/v1/contacts/bulk-delete",

  /** GET list | POST create */
  automations: "/api/v1/automations",
  /** PATCH | DELETE */
  automationById: (id: string) => `/api/v1/automations/${id}`,
  /** PATCH — `{ status: "Active" | "Paused" }` */
  automationStatus: (id: string) => `/api/v1/automations/${id}/status`,

  /** GET list */
  notifications: "/api/v1/notifications",
  /** PATCH — mark read */
  notificationRead: (id: string) => `/api/v1/notifications/${id}/read`,
  /** POST — mark all read */
  notificationsReadAll: "/api/v1/notifications/read-all",

  /** GET | PUT — org / workspace settings */
  workspaceSettings: "/api/v1/settings/workspace",

  /** GET — enterprise feature matrix */
  modulesFeatures: "/api/v1/modules/features",
  modulesFeaturesSummary: "/api/v1/modules/features/summary",
} as const;

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;
