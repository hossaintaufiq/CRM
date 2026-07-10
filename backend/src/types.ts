export type UserRole =
  | "Admin"
  | "Manager"
  | "Sales"
  | "HR"
  | "Marketing"
  | "Finance"
  | "Customer Support";

export type UserStatus = "active" | "suspended" | "invited";

export type FeatureStatus = "live" | "partial" | "stub" | "needs_external";

export interface Organization {
  id: string;
  name: string;
  defaultCurrency: string;
  fiscalYearStart: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: UserRole | string;
  department: string;
  team: string;
  status: UserStatus | string;
  organizationId: string | null;
  emailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  companyName: string;
  value: number;
  currency: string;
  healthScore: string;
  priority: string;
  probability: number;
  ownerName: string;
  ownerInitials: string;
  stage: string;
  closeDate: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  score: number;
  ownerId: string;
  timeline: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  owner: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  revenue: number;
  website: string;
  parentCompanyId: string | null;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: string;
  status: string;
  dueDate: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  userId?: string;
  timestamp: number;
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  status: "Active" | "Paused" | string;
  runsToday: number;
}

export interface PipelineStage {
  id: string;
  label: string;
  color: string;
  visible: boolean;
  order: number;
}

export interface PipelinePreferences {
  viewMode: string;
  compactCards: boolean;
  showProbability: boolean;
  showCloseDate: boolean;
  showTags: boolean;
  defaultSort: string;
}

export interface Feature {
  id: string;
  name: string;
  category: string;
  status: FeatureStatus;
  notes: string;
  requires: string[];
}

export interface Database {
  organizations: Organization[];
  users: User[];
  leads: Lead[];
  deals: Deal[];
  contacts: Contact[];
  companies: Company[];
  tasks: Task[];
  activities: Activity[];
  notifications: Notification[];
  automations: Automation[];
  pipelineStages: PipelineStage[];
  pipelinePreferences: PipelinePreferences;
  auditLogs: unknown[];
}

export interface PublicUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department: string;
  team: string;
  status: string;
  email_verified: boolean;
  mfa_enabled: boolean;
}

export interface JwtPayload {
  sub: string;
  role: string;
}
