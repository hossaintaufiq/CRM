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
  demoActivities,
  demoAutomations,
  demoContacts,
  demoDeals,
  demoKpis,
  demoLeads,
  demoNotifications,
} from "@/data/crm-demo-data";
import type {
  Activity,
  AutomationRule,
  Contact,
  Deal,
  DealStage,
  KPIValue,
  Lead,
  LeadStatus,
  NotificationItem,
} from "@/types/crm";

interface CRMDataState {
  kpis: KPIValue[];
  activities: Activity[];
  deals: Deal[];
  leads: Lead[];
  contacts: Contact[];
  notifications: NotificationItem[];
  automations: AutomationRule[];
  selectedLead: Lead | null;
  unreadNotifications: number;
  moveDeal: (dealId: string, nextStage: DealStage) => void;
  selectLead: (leadId: string) => void;
  clearLeadSelection: () => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  markNotificationRead: (notificationId: string) => void;
}

const CRMDataContext = createContext<CRMDataState | null>(null);

function formatTimeAgo(timestamp: number): string {
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function CRMDataProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [deals, setDeals] = useState<Deal[]>(demoDeals);
  const [leads, setLeads] = useState<Lead[]>(demoLeads);
  const [contacts] = useState<Contact[]>(demoContacts);
  const [automations, setAutomations] = useState<AutomationRule[]>(demoAutomations);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(demoNotifications);
  const [activities, setActivities] = useState<Activity[]>(demoActivities);
  const [kpis, setKpis] = useState<KPIValue[]>(demoKpis);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const moveDeal = useCallback((dealId: string, nextStage: DealStage): void => {
    const movedDeal = deals.find((deal) => deal.id === dealId) ?? null;
    setDeals((currentDeals) =>
      currentDeals.map((deal) => {
        if (deal.id === dealId) {
          return { ...deal, stage: nextStage };
        }
        return deal;
      }),
    );

    if (movedDeal) {
      const now = Date.now();
      setActivities((current) => [
        {
          id: crypto.randomUUID(),
          actor: movedDeal.ownerName,
          action: "moved deal to",
          target: `${movedDeal.companyName} (${nextStage})`,
          at: "Just now",
          timestamp: now,
        },
        ...current.slice(0, 11),
      ]);
      setNotifications((current) => [
        {
          id: crypto.randomUUID(),
          title: "Deal stage changed",
          description: `${movedDeal.companyName} moved to ${nextStage}.`,
          read: false,
          timestamp: now,
        },
        ...current.slice(0, 9),
      ]);
    }
  }, [deals]);

  const selectLead = useCallback((leadId: string): void => {
    setSelectedLeadId(leadId);
  }, []);

  const clearLeadSelection = useCallback((): void => {
    setSelectedLeadId(null);
  }, []);

  const updateLeadStatus = useCallback((leadId: string, status: LeadStatus): void => {
    setLeads((current) =>
      current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)),
    );
  }, []);

  const markNotificationRead = useCallback((notificationId: string): void => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  }, []);

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
          const nextPoint = Math.max(1, last + Math.floor(Math.random() * (drift * 2 + 1)) - drift);
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

  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const value = useMemo<CRMDataState>(
    () => ({
      kpis,
      activities,
      deals,
      leads,
      contacts,
      notifications,
      automations,
      selectedLead,
      unreadNotifications,
      moveDeal,
      selectLead,
      clearLeadSelection,
      updateLeadStatus,
      markNotificationRead,
    }),
    [
      kpis,
      activities,
      deals,
      leads,
      contacts,
      notifications,
      automations,
      selectedLead,
      unreadNotifications,
      moveDeal,
      selectLead,
      clearLeadSelection,
      updateLeadStatus,
      markNotificationRead,
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
