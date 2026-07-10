export type DealStage =
  | "Lead"
  | "Qualified"
  | "Proposal"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export type HealthScore = "Hot" | "Warm" | "Cold";
export type DealPriority = "Low" | "Medium" | "High" | "Critical";

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
  title: string;
  companyName: string;
  value: number;
  currency: string;
  healthScore: HealthScore;
  priority: DealPriority;
  probability: number;
  ownerName: string;
  ownerInitials: string;
  lastActivity: string;
  stage: DealStage;
  closeDate: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
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

export interface PipelineStageConfig {
  id: DealStage;
  label: string;
  color: string;
  visible: boolean;
  order: number;
}

export interface PipelinePreferences {
  viewMode: "board" | "list";
  compactCards: boolean;
  showProbability: boolean;
  showCloseDate: boolean;
  showTags: boolean;
  defaultSort: "value" | "closeDate" | "priority" | "updatedAt";
}

export interface WorkspaceSettings {
  organizationName: string;
  defaultCurrency: string;
  fiscalYearStart: string;
}

export interface DashboardSummary {
  openPipelineValue: number;
  weightedPipelineValue: number;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  winRate: number;
  leadCount: number;
  avgLeadScore: number;
  contactCount: number;
  activeAutomations: number;
  automationRunsToday: number;
  unreadNotifications: number;
  hotDeals: number;
  closingThisMonth: number;
}

export type DealInput = Omit<
  Deal,
  "id" | "createdAt" | "updatedAt" | "lastActivity" | "ownerInitials"
> & { ownerInitials?: string };

export type LeadInput = Omit<Lead, "id" | "timeline" | "lastTouch"> & {
  timeline?: string[];
  lastTouch?: string;
};

export type ContactInput = Omit<Contact, "id">;
