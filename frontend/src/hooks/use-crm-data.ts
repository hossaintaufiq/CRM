"use client";

import { useCallback, useMemo, useState } from "react";
import type { Activity, Deal, DealStage, KPIValue, Lead } from "@/types/crm";

interface CRMDataState {
  kpis: KPIValue[];
  activities: Activity[];
  deals: Deal[];
  leads: Lead[];
  selectedLead: Lead | null;
  moveDeal: (dealId: string, nextStage: DealStage) => void;
  selectLead: (leadId: string) => void;
  clearLeadSelection: () => void;
}

const initialKpis: KPIValue[] = [
  {
    id: "mrr",
    label: "MRR / ARR",
    value: "$428K / $5.1M",
    changeLabel: "+12.4% MoM",
    trend: [52, 57, 61, 64, 66, 70, 76, 81, 83, 88],
  },
  {
    id: "conversion",
    label: "Conversion Rate",
    value: "18.6%",
    changeLabel: "+1.2 pts",
    trend: [8, 11, 12, 13, 12, 14, 16, 17, 17, 19],
  },
  {
    id: "activeDeals",
    label: "Active Deals",
    value: "143",
    changeLabel: "+9 this week",
    trend: [102, 109, 111, 115, 120, 128, 131, 138, 140, 143],
  },
  {
    id: "winLoss",
    label: "Win / Loss Ratio",
    value: "2.8x",
    changeLabel: "+0.3x QoQ",
    trend: [15, 16, 17, 18, 20, 21, 22, 24, 25, 28],
  },
];

const initialActivities: Activity[] = [
  {
    id: "act_01",
    actor: "Avery Blake",
    action: "converted lead",
    target: "Northwind Labs",
    at: "2m ago",
  },
  {
    id: "act_02",
    actor: "Jules Tan",
    action: "sent proposal",
    target: "Altair Cloud",
    at: "14m ago",
  },
  {
    id: "act_03",
    actor: "Nadia Cole",
    action: "logged discovery call",
    target: "RidgeCore Systems",
    at: "31m ago",
  },
  {
    id: "act_04",
    actor: "Liam Park",
    action: "registered email open",
    target: "Summit Dataworks",
    at: "1h ago",
  },
];

const initialDeals: Deal[] = [
  {
    id: "deal_1",
    companyName: "Northwind Labs",
    value: 92000,
    healthScore: "Hot",
    ownerName: "Avery Blake",
    ownerInitials: "AB",
    lastActivity: "Today",
    stage: "Negotiation",
  },
  {
    id: "deal_2",
    companyName: "Altair Cloud",
    value: 48000,
    healthScore: "Warm",
    ownerName: "Jules Tan",
    ownerInitials: "JT",
    lastActivity: "1d ago",
    stage: "Proposal",
  },
  {
    id: "deal_3",
    companyName: "RidgeCore Systems",
    value: 138000,
    healthScore: "Cold",
    ownerName: "Nadia Cole",
    ownerInitials: "NC",
    lastActivity: "3d ago",
    stage: "Qualified",
  },
  {
    id: "deal_4",
    companyName: "Summit Dataworks",
    value: 210000,
    healthScore: "Hot",
    ownerName: "Liam Park",
    ownerInitials: "LP",
    lastActivity: "Today",
    stage: "Closed Won",
  },
];

const initialLeads: Lead[] = [
  {
    id: "lead_1",
    name: "Maya Patel",
    company: "Nordic Forge",
    email: "maya@nordicforge.io",
    phone: "+1 415 555 0192",
    source: "Inbound",
    status: "Working",
    score: 82,
    lastTouch: "5m ago",
    timeline: [
      "Downloaded enterprise security whitepaper",
      "Replied to nurture sequence #3",
      "Booked 30-minute qualification call",
    ],
  },
  {
    id: "lead_2",
    name: "Rafael Kim",
    company: "OrbitIQ",
    email: "rafael@orbitiq.dev",
    phone: "+1 415 555 0113",
    source: "Outbound",
    status: "New",
    score: 64,
    lastTouch: "34m ago",
    timeline: [
      "Clicked outbound campaign CTA",
      "Visited pricing page twice",
      "Created chat request from website widget",
    ],
  },
  {
    id: "lead_3",
    name: "Zoey Carter",
    company: "Bluecrest Partners",
    email: "zoey@bluecrest.co",
    phone: "+1 415 555 0128",
    source: "Partner",
    status: "Qualified",
    score: 91,
    lastTouch: "2h ago",
    timeline: [
      "Introduced by referral partner",
      "Met at annual procurement summit",
      "Requested legal/security package",
    ],
  },
];

export function useCRMData(): CRMDataState {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [leads] = useState<Lead[]>(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const moveDeal = useCallback((dealId: string, nextStage: DealStage): void => {
    setDeals((currentDeals) =>
      currentDeals.map((deal) =>
        deal.id === dealId ? { ...deal, stage: nextStage } : deal,
      ),
    );
  }, []);

  const selectLead = useCallback((leadId: string): void => {
    setSelectedLeadId(leadId);
  }, []);

  const clearLeadSelection = useCallback((): void => {
    setSelectedLeadId(null);
  }, []);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) ?? null,
    [leads, selectedLeadId],
  );

  return {
    kpis: initialKpis,
    activities: initialActivities,
    deals,
    leads,
    selectedLead,
    moveDeal,
    selectLead,
    clearLeadSelection,
  };
}
