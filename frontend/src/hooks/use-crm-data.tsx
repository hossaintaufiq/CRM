"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  buildDashboardSummary,
  createContactRecord,
  createDealRecord,
  createLeadRecord,
  getDemoSeed,
} from "@/lib/api/crm-client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  Activity,
  AutomationRule,
  Contact,
  ContactInput,
  DashboardSummary,
  Deal,
  DealInput,
  DealStage,
  KPIValue,
  Lead,
  LeadInput,
  LeadStatus,
  NotificationItem,
  PipelinePreferences,
  PipelineStageConfig,
  WorkspaceSettings,
} from "@/types/crm";

interface CRMDataState {
  /** `demo` until NEXT_PUBLIC_USE_DEMO_API=false and live fetches are wired */
  dataMode: "demo" | "live";
  /** Documented backend routes used by this client */
  apiEndpoints: typeof API_ENDPOINTS;
  kpis: KPIValue[];
  activities: Activity[];
  deals: Deal[];
  leads: Lead[];
  contacts: Contact[];
  notifications: NotificationItem[];
  automations: AutomationRule[];
  pipelineStages: PipelineStageConfig[];
  pipelinePreferences: PipelinePreferences;
  workspaceSettings: WorkspaceSettings;
  summary: DashboardSummary;
  selectedLead: Lead | null;
  selectedDeal: Deal | null;
  unreadNotifications: number;
  moveDeal: (dealId: string, nextStage: DealStage) => void;
  createDeal: (input: DealInput) => void;
  updateDeal: (dealId: string, patch: Partial<DealInput>) => void;
  deleteDeal: (dealId: string) => void;
  deleteDeals: (dealIds: string[]) => void;
  selectDeal: (dealId: string | null) => void;
  selectLead: (leadId: string) => void;
  clearLeadSelection: () => void;
  createLead: (input: LeadInput) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  deleteLead: (leadId: string) => void;
  deleteLeads: (leadIds: string[]) => void;
  createContact: (input: ContactInput) => void;
  updateContact: (contactId: string, patch: Partial<ContactInput>) => void;
  deleteContact: (contactId: string) => void;
  deleteContacts: (contactIds: string[]) => void;
  toggleAutomation: (automationId: string) => void;
  deleteAutomation: (automationId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  updatePipelineStages: (stages: PipelineStageConfig[]) => void;
  updatePipelinePreferences: (patch: Partial<PipelinePreferences>) => void;
  updateWorkspaceSettings: (patch: Partial<WorkspaceSettings>) => void;
}

const CRMDataContext = createContext<CRMDataState | null>(null);

function formatTimeAgo(timestamp: number): string {
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function pushActivity(
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>,
  actor: string,
  action: string,
  target: string,
): void {
  const now = Date.now();
  setActivities((current) => [
    {
      id: crypto.randomUUID(),
      actor,
      action,
      target,
      at: "Just now",
      timestamp: now,
    },
    ...current.slice(0, 19),
  ]);
}

export function CRMDataProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const seed = useMemo(() => getDemoSeed(), []);
  const [deals, setDeals] = useState<Deal[]>(seed.deals);
  const [leads, setLeads] = useState<Lead[]>(seed.leads);
  const [contacts, setContacts] = useState<Contact[]>(seed.contacts);
  const [automations, setAutomations] = useState<AutomationRule[]>(seed.automations);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(seed.notifications);
  const [activities, setActivities] = useState<Activity[]>(seed.activities);
  const [kpis, setKpis] = useState<KPIValue[]>(seed.kpis);
  const [pipelineStages, setPipelineStages] = useState<PipelineStageConfig[]>(
    seed.pipelineStages,
  );
  const [pipelinePreferences, setPipelinePreferences] =
    useState<PipelinePreferences>(seed.pipelinePreferences);
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>(
    seed.workspaceSettings,
  );
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const moveDeal = useCallback((dealId: string, nextStage: DealStage): void => {
    // Backend: PATCH /api/v1/deals/:id/stage
    setDeals((currentDeals) => {
      const movedDeal = currentDeals.find((deal) => deal.id === dealId) ?? null;
      const next = currentDeals.map((deal) =>
        deal.id === dealId
          ? {
              ...deal,
              stage: nextStage,
              lastActivity: "Just now",
              updatedAt: new Date().toISOString(),
              probability:
                nextStage === "Closed Won"
                  ? 100
                  : nextStage === "Closed Lost"
                    ? 0
                    : deal.probability,
            }
          : deal,
      );

      if (movedDeal) {
        pushActivity(
          setActivities,
          movedDeal.ownerName,
          "moved deal to",
          `${movedDeal.companyName} (${nextStage})`,
        );
        setNotifications((current) => [
          {
            id: crypto.randomUUID(),
            title: "Deal stage changed",
            description: `${movedDeal.companyName} moved to ${nextStage}.`,
            read: false,
            timestamp: Date.now(),
          },
          ...current.slice(0, 19),
        ]);
      }
      return next;
    });
  }, []);

  const createDeal = useCallback((input: DealInput): void => {
    // Backend: POST /api/v1/deals
    const deal = createDealRecord(input);
    setDeals((current) => [deal, ...current]);
    pushActivity(setActivities, deal.ownerName, "created deal", deal.companyName);
    setSelectedDealId(deal.id);
  }, []);

  const updateDeal = useCallback((dealId: string, patch: Partial<DealInput>): void => {
    // Backend: PATCH /api/v1/deals/:id
    setDeals((current) =>
      current.map((deal) =>
        deal.id === dealId
          ? {
              ...deal,
              ...patch,
              tags: patch.tags ? [...patch.tags] : deal.tags,
              lastActivity: "Just now",
              updatedAt: new Date().toISOString(),
              ownerInitials: patch.ownerName
                ? patch.ownerName
                    .split(" ")
                    .map((p) => p[0] ?? "")
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : deal.ownerInitials,
            }
          : deal,
      ),
    );
  }, []);

  const deleteDeal = useCallback((dealId: string): void => {
    // Backend: DELETE /api/v1/deals/:id
    setDeals((current) => {
      const removed = current.find((d) => d.id === dealId);
      if (removed) {
        pushActivity(setActivities, "System", "deleted deal", removed.companyName);
      }
      return current.filter((d) => d.id !== dealId);
    });
    setSelectedDealId((current) => (current === dealId ? null : current));
  }, []);

  const deleteDeals = useCallback((dealIds: string[]): void => {
    // Backend: POST /api/v1/deals/bulk-delete
    const idSet = new Set(dealIds);
    setDeals((current) => current.filter((d) => !idSet.has(d.id)));
    setSelectedDealId((current) => (current && idSet.has(current) ? null : current));
    pushActivity(setActivities, "System", "bulk deleted", `${dealIds.length} deals`);
  }, []);

  const selectDeal = useCallback((dealId: string | null): void => {
    setSelectedDealId(dealId);
  }, []);

  const selectLead = useCallback((leadId: string): void => {
    setSelectedLeadId(leadId);
  }, []);

  const clearLeadSelection = useCallback((): void => {
    setSelectedLeadId(null);
  }, []);

  const createLead = useCallback((input: LeadInput): void => {
    // Backend: POST /api/v1/leads
    const lead = createLeadRecord(input);
    setLeads((current) => [lead, ...current]);
    pushActivity(setActivities, "System", "created lead", lead.name);
  }, []);

  const updateLeadStatus = useCallback((leadId: string, status: LeadStatus): void => {
    // Backend: PATCH /api/v1/leads/:id/status
    setLeads((current) =>
      current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)),
    );
  }, []);

  const deleteLead = useCallback((leadId: string): void => {
    // Backend: DELETE /api/v1/leads/:id
    setLeads((current) => {
      const removed = current.find((l) => l.id === leadId);
      if (removed) {
        pushActivity(setActivities, "System", "deleted lead", removed.name);
      }
      return current.filter((l) => l.id !== leadId);
    });
    setSelectedLeadId((current) => (current === leadId ? null : current));
  }, []);

  const deleteLeads = useCallback((leadIds: string[]): void => {
    // Backend: POST /api/v1/leads/bulk-delete
    const idSet = new Set(leadIds);
    setLeads((current) => current.filter((l) => !idSet.has(l.id)));
    setSelectedLeadId((current) => (current && idSet.has(current) ? null : current));
  }, []);

  const createContact = useCallback((input: ContactInput): void => {
    // Backend: POST /api/v1/contacts
    const contact = createContactRecord(input);
    setContacts((current) => [contact, ...current]);
    pushActivity(setActivities, "System", "created contact", contact.name);
  }, []);

  const updateContact = useCallback(
    (contactId: string, patch: Partial<ContactInput>): void => {
      // Backend: PATCH /api/v1/contacts/:id
      setContacts((current) =>
        current.map((contact) =>
          contact.id === contactId ? { ...contact, ...patch } : contact,
        ),
      );
    },
    [],
  );

  const deleteContact = useCallback((contactId: string): void => {
    // Backend: DELETE /api/v1/contacts/:id
    setContacts((current) => {
      const removed = current.find((c) => c.id === contactId);
      if (removed) {
        pushActivity(setActivities, "System", "deleted contact", removed.name);
      }
      return current.filter((c) => c.id !== contactId);
    });
  }, []);

  const deleteContacts = useCallback((contactIds: string[]): void => {
    // Backend: POST /api/v1/contacts/bulk-delete
    const idSet = new Set(contactIds);
    setContacts((current) => current.filter((c) => !idSet.has(c.id)));
  }, []);

  const toggleAutomation = useCallback((automationId: string): void => {
    // Backend: PATCH /api/v1/automations/:id/status
    setAutomations((current) =>
      current.map((rule) =>
        rule.id === automationId
          ? { ...rule, status: rule.status === "Active" ? "Paused" : "Active" }
          : rule,
      ),
    );
  }, []);

  const deleteAutomation = useCallback((automationId: string): void => {
    // Backend: DELETE /api/v1/automations/:id
    setAutomations((current) => current.filter((a) => a.id !== automationId));
  }, []);

  const markNotificationRead = useCallback((notificationId: string): void => {
    // Backend: PATCH /api/v1/notifications/:id/read
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  }, []);

  const markAllNotificationsRead = useCallback((): void => {
    // Backend: POST /api/v1/notifications/read-all
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
  }, []);

  const updatePipelineStages = useCallback((stages: PipelineStageConfig[]): void => {
    // Backend: PUT /api/v1/pipeline/stages
    setPipelineStages(stages.map((s) => ({ ...s })));
  }, []);

  const updatePipelinePreferences = useCallback(
    (patch: Partial<PipelinePreferences>): void => {
      // Backend: PUT /api/v1/pipeline/preferences
      setPipelinePreferences((current) => ({ ...current, ...patch }));
    },
    [],
  );

  const updateWorkspaceSettings = useCallback(
    (patch: Partial<WorkspaceSettings>): void => {
      // Backend: PUT /api/v1/settings/workspace
      setWorkspaceSettings((current) => ({ ...current, ...patch }));
    },
    [],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActivities((current) =>
        current.map((activity) => ({
          ...activity,
          at: formatTimeAgo(activity.timestamp),
        })),
      );

      setKpis((current) =>
        current.map((kpi) => {
          const last = kpi.trend[kpi.trend.length - 1] ?? 0;
          const drift = Math.max(2, Math.round(last * 0.03));
          const nextPoint = Math.max(
            1,
            last + Math.floor(Math.random() * (drift * 2 + 1)) - drift,
          );
          return { ...kpi, trend: [...kpi.trend.slice(1), nextPoint] };
        }),
      );

      setAutomations((current) =>
        current.map((rule) =>
          rule.status === "Active"
            ? { ...rule, runsToday: rule.runsToday + Math.floor(Math.random() * 2) }
            : rule,
        ),
      );
    }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) ?? null,
    [leads, selectedLeadId],
  );

  const selectedDeal = useMemo(
    () => deals.find((deal) => deal.id === selectedDealId) ?? null,
    [deals, selectedDealId],
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const summary = useMemo(
    () =>
      buildDashboardSummary({
        deals,
        leads,
        contacts,
        automations,
        notifications,
      }),
    [deals, leads, contacts, automations, notifications],
  );

  const value = useMemo<CRMDataState>(
    () => ({
      dataMode: seed.mode,
      apiEndpoints: API_ENDPOINTS,
      kpis,
      activities,
      deals,
      leads,
      contacts,
      notifications,
      automations,
      pipelineStages,
      pipelinePreferences,
      workspaceSettings,
      summary,
      selectedLead,
      selectedDeal,
      unreadNotifications,
      moveDeal,
      createDeal,
      updateDeal,
      deleteDeal,
      deleteDeals,
      selectDeal,
      selectLead,
      clearLeadSelection,
      createLead,
      updateLeadStatus,
      deleteLead,
      deleteLeads,
      createContact,
      updateContact,
      deleteContact,
      deleteContacts,
      toggleAutomation,
      deleteAutomation,
      markNotificationRead,
      markAllNotificationsRead,
      updatePipelineStages,
      updatePipelinePreferences,
      updateWorkspaceSettings,
    }),
    [
      seed.mode,
      kpis,
      activities,
      deals,
      leads,
      contacts,
      notifications,
      automations,
      pipelineStages,
      pipelinePreferences,
      workspaceSettings,
      summary,
      selectedLead,
      selectedDeal,
      unreadNotifications,
      moveDeal,
      createDeal,
      updateDeal,
      deleteDeal,
      deleteDeals,
      selectDeal,
      selectLead,
      clearLeadSelection,
      createLead,
      updateLeadStatus,
      deleteLead,
      deleteLeads,
      createContact,
      updateContact,
      deleteContact,
      deleteContacts,
      toggleAutomation,
      deleteAutomation,
      markNotificationRead,
      markAllNotificationsRead,
      updatePipelineStages,
      updatePipelinePreferences,
      updateWorkspaceSettings,
    ],
  );

  return <CRMDataContext.Provider value={value}>{children}</CRMDataContext.Provider>;
}

export function useCRMData(): CRMDataState {
  const context = useContext(CRMDataContext);
  if (!context) {
    throw new Error("useCRMData must be used within CRMDataProvider");
  }
  return context;
}
