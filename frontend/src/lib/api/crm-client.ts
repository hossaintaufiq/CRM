/**
 * CRM API client
 * --------------
 * DEMO MODE: returns / mutates in-memory demo data.
 * PRODUCTION: swap each method body with `fetch(`${API_BASE}${API_ENDPOINTS...}`)`.
 *
 * Endpoint map lives in `./endpoints.ts` — keep that file as the source of truth.
 */

import {
  demoActivities,
  demoAutomations,
  demoContacts,
  demoDeals,
  demoKpis,
  demoLeads,
  demoNotifications,
  demoPipelinePreferences,
  demoPipelineStages,
  demoWorkspaceSettings,
} from "@/data/crm-demo-data";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  Contact,
  ContactInput,
  DashboardSummary,
  Deal,
  DealInput,
  DealStage,
  Lead,
  LeadInput,
  LeadStatus,
  PipelinePreferences,
  PipelineStageConfig,
  WorkspaceSettings,
} from "@/types/crm";

const USE_DEMO = process.env.NEXT_PUBLIC_USE_DEMO_API !== "false";

function initialsFromName(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function cloneDeal(deal: Deal): Deal {
  return { ...deal, tags: [...deal.tags] };
}

/** Documents which backend route each client method will call. */
export const CRM_CLIENT_ROUTES = {
  getDashboardSummary: `GET ${API_ENDPOINTS.dashboardSummary}`,
  listDeals: `GET ${API_ENDPOINTS.deals}`,
  createDeal: `POST ${API_ENDPOINTS.deals}`,
  updateDeal: `PATCH ${API_ENDPOINTS.dealById(":id")}`,
  deleteDeal: `DELETE ${API_ENDPOINTS.dealById(":id")}`,
  moveDealStage: `PATCH ${API_ENDPOINTS.dealStage(":id")}`,
  bulkDeleteDeals: `POST ${API_ENDPOINTS.dealsBulkDelete}`,
  getPipelineStages: `GET ${API_ENDPOINTS.pipelineStages}`,
  updatePipelineStages: `PUT ${API_ENDPOINTS.pipelineStages}`,
  getPipelinePreferences: `GET ${API_ENDPOINTS.pipelinePreferences}`,
  updatePipelinePreferences: `PUT ${API_ENDPOINTS.pipelinePreferences}`,
  listLeads: `GET ${API_ENDPOINTS.leads}`,
  createLead: `POST ${API_ENDPOINTS.leads}`,
  updateLead: `PATCH ${API_ENDPOINTS.leadById(":id")}`,
  deleteLead: `DELETE ${API_ENDPOINTS.leadById(":id")}`,
  updateLeadStatus: `PATCH ${API_ENDPOINTS.leadStatus(":id")}`,
  listContacts: `GET ${API_ENDPOINTS.contacts}`,
  createContact: `POST ${API_ENDPOINTS.contacts}`,
  updateContact: `PATCH ${API_ENDPOINTS.contactById(":id")}`,
  deleteContact: `DELETE ${API_ENDPOINTS.contactById(":id")}`,
  getWorkspaceSettings: `GET ${API_ENDPOINTS.workspaceSettings}`,
  updateWorkspaceSettings: `PUT ${API_ENDPOINTS.workspaceSettings}`,
} as const;

export function buildDashboardSummary(input: {
  deals: Deal[];
  leads: Lead[];
  contacts: Contact[];
  automations: typeof demoAutomations;
  notifications: typeof demoNotifications;
}): DashboardSummary {
  const { deals, leads, contacts, automations, notifications } = input;
  const openDeals = deals.filter(
    (d) => d.stage !== "Closed Won" && d.stage !== "Closed Lost",
  );
  const wonDeals = deals.filter((d) => d.stage === "Closed Won");
  const lostDeals = deals.filter((d) => d.stage === "Closed Lost");
  const openPipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipelineValue = openDeals.reduce(
    (sum, d) => sum + d.value * (d.probability / 100),
    0,
  );
  const closed = wonDeals.length + lostDeals.length;
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const closingThisMonth = openDeals.filter((d) => {
    const close = new Date(d.closeDate);
    return close.getMonth() === month && close.getFullYear() === year;
  }).length;

  return {
    openPipelineValue,
    weightedPipelineValue: Math.round(weightedPipelineValue),
    openDeals: openDeals.length,
    wonDeals: wonDeals.length,
    lostDeals: lostDeals.length,
    winRate: closed > 0 ? Math.round((wonDeals.length / closed) * 100) : 0,
    leadCount: leads.length,
    avgLeadScore:
      leads.length > 0
        ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
        : 0,
    contactCount: contacts.length,
    activeAutomations: automations.filter((a) => a.status === "Active").length,
    automationRunsToday: automations.reduce((sum, a) => sum + a.runsToday, 0),
    unreadNotifications: notifications.filter((n) => !n.read).length,
    hotDeals: openDeals.filter((d) => d.healthScore === "Hot").length,
    closingThisMonth,
  };
}

/**
 * Seed snapshot for the provider. In production, hydrate from:
 * GET /api/v1/dashboard/summary + resource list endpoints.
 */
export function getDemoSeed() {
  return {
    mode: USE_DEMO ? ("demo" as const) : ("live" as const),
    endpoints: CRM_CLIENT_ROUTES,
    kpis: demoKpis.map((k) => ({ ...k, trend: [...k.trend] })),
    activities: demoActivities.map((a) => ({ ...a })),
    deals: demoDeals.map(cloneDeal),
    leads: demoLeads.map((l) => ({ ...l, timeline: [...l.timeline] })),
    contacts: demoContacts.map((c) => ({ ...c })),
    notifications: demoNotifications.map((n) => ({ ...n })),
    automations: demoAutomations.map((a) => ({ ...a })),
    pipelineStages: demoPipelineStages.map((s) => ({ ...s })),
    pipelinePreferences: { ...demoPipelinePreferences },
    workspaceSettings: { ...demoWorkspaceSettings },
  };
}

export function createDealRecord(input: DealInput): Deal {
  const now = new Date().toISOString();
  return {
    ...input,
    id: `deal_${crypto.randomUUID().slice(0, 8)}`,
    ownerInitials: input.ownerInitials ?? initialsFromName(input.ownerName),
    lastActivity: "Just now",
    tags: [...input.tags],
    createdAt: now,
    updatedAt: now,
  };
}

export function createLeadRecord(input: LeadInput): Lead {
  return {
    ...input,
    id: `lead_${crypto.randomUUID().slice(0, 8)}`,
    lastTouch: input.lastTouch ?? "Just now",
    timeline: input.timeline ?? ["Lead created in Nexus"],
  };
}

export function createContactRecord(input: ContactInput): Contact {
  return {
    ...input,
    id: `contact_${crypto.randomUUID().slice(0, 8)}`,
  };
}

export type { DealStage, LeadStatus, PipelinePreferences, PipelineStageConfig, WorkspaceSettings };
