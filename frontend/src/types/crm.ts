export type DealStage =
  | "Lead"
  | "Qualified"
  | "Proposal"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export type HealthScore = "Hot" | "Warm" | "Cold";

export interface KPIValue {
  id: "mrr" | "conversion" | "activeDeals" | "winLoss";
  label: string;
  value: string;
  changeLabel: string;
  trend: number[];
}

export interface Activity {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
  timestamp: number;
}

export interface Deal {
  id: string;
  companyName: string;
  value: number;
  healthScore: HealthScore;
  ownerName: string;
  ownerInitials: string;
  lastActivity: string;
  stage: DealStage;
}

export type LeadStatus = "New" | "Working" | "Qualified" | "Disqualified";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: "Inbound" | "Outbound" | "Partner" | "Referral";
  status: LeadStatus;
  score: number;
  lastTouch: string;
  timeline: string[];
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  owner: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  read: boolean;
  timestamp: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  status: "Active" | "Paused";
  runsToday: number;
}
