export type FeatureStatus = "live" | "partial" | "stub" | "needs_external";

export interface CatalogFeature {
  id: string;
  name: string;
  category: string;
  status: FeatureStatus;
  notes: string;
  requires: string[];
}

export const FEATURE_CATALOG: CatalogFeature[] = [
  { id: "auth.email_password", name: "Email & Password", category: "Authentication", status: "live", notes: "JWT login/register working", requires: [] },
  { id: "auth.google", name: "Google Login", category: "Authentication", status: "needs_external", notes: "Stub endpoint", requires: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"] },
  { id: "auth.microsoft", name: "Microsoft Login", category: "Authentication", status: "needs_external", notes: "Stub endpoint", requires: ["MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET"] },
  { id: "auth.apple", name: "Apple Login", category: "Authentication", status: "needs_external", notes: "Stub endpoint", requires: ["APPLE_CLIENT_ID", "APPLE_CLIENT_SECRET"] },
  { id: "auth.github", name: "GitHub Login", category: "Authentication", status: "needs_external", notes: "Stub endpoint", requires: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"] },
  { id: "auth.magic_link", name: "Magic Link Login", category: "Authentication", status: "needs_external", notes: "Needs SMTP", requires: ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"] },
  { id: "auth.phone_otp", name: "Phone OTP Login", category: "Authentication", status: "needs_external", notes: "Needs Twilio", requires: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"] },
  { id: "auth.password_reset", name: "Password Reset", category: "Authentication", status: "partial", notes: "API stub; email needs SMTP", requires: ["SMTP_HOST"] },
  { id: "auth.email_verification", name: "Email Verification", category: "Authentication", status: "partial", notes: "Flag on user; mail needs SMTP", requires: ["SMTP_HOST"] },
  { id: "auth.mfa", name: "Multi-Factor Authentication", category: "Authentication", status: "stub", notes: "Flag stored; TOTP not implemented", requires: [] },
  { id: "auth.sso", name: "Single Sign-On (SSO)", category: "Authentication", status: "needs_external", notes: "Needs IdP metadata", requires: ["SSO_METADATA_URL"] },
  { id: "auth.ldap", name: "LDAP Authentication", category: "Authentication", status: "needs_external", notes: "Stub", requires: ["LDAP_SERVER"] },
  { id: "auth.ad", name: "Active Directory Integration", category: "Authentication", status: "needs_external", notes: "Stub", requires: ["LDAP_SERVER"] },
  { id: "users.profiles", name: "User Profiles", category: "User Management", status: "live", notes: "User directory + profile fields", requires: [] },
  { id: "users.teams", name: "Teams", category: "User Management", status: "partial", notes: "Team field on user", requires: [] },
  { id: "users.departments", name: "Departments", category: "User Management", status: "partial", notes: "Department field on user", requires: [] },
  { id: "users.organizations", name: "Organizations", category: "User Management", status: "live", notes: "Org + workspace settings", requires: [] },
  { id: "users.directory", name: "Employee Directory", category: "User Management", status: "live", notes: "List users", requires: [] },
  { id: "users.status", name: "User Status", category: "User Management", status: "live", notes: "active/suspended/invited", requires: [] },
  { id: "users.invite", name: "Invite Members", category: "User Management", status: "partial", notes: "Creates invited user", requires: ["SMTP_HOST"] },
  { id: "users.remove", name: "Remove Members", category: "User Management", status: "live", notes: "Delete user", requires: [] },
  { id: "users.suspend", name: "Suspend User", category: "User Management", status: "live", notes: "Status update", requires: [] },
  { id: "users.activity", name: "User Activity Tracking", category: "User Management", status: "partial", notes: "Activity + audit writes", requires: [] },
  { id: "rbac.roles", name: "Built-in Roles", category: "RBAC", status: "live", notes: "Admin/Manager/Sales/HR/Marketing/Finance/Support", requires: [] },
  { id: "rbac.custom_roles", name: "Custom Roles", category: "RBAC", status: "stub", notes: "Listed only", requires: [] },
  { id: "rbac.permissions", name: "Custom Permissions", category: "RBAC", status: "stub", notes: "Role gate helper only", requires: [] },
  { id: "rbac.field", name: "Field Level Permissions", category: "RBAC", status: "stub", notes: "Not implemented", requires: [] },
  { id: "rbac.module", name: "Module Permissions", category: "RBAC", status: "stub", notes: "Not implemented", requires: [] },
  { id: "rbac.ownership", name: "Data Ownership", category: "RBAC", status: "partial", notes: "Owner fields exist", requires: [] },
  { id: "rbac.team_access", name: "Team Access", category: "RBAC", status: "stub", notes: "Not implemented", requires: [] },
  { id: "rbac.territory", name: "Territory Access", category: "RBAC", status: "stub", notes: "Not implemented", requires: [] },
  { id: "dashboard.executive", name: "Executive Dashboard", category: "Dashboard", status: "live", notes: "Summary API + UI", requires: [] },
  { id: "dashboard.sales", name: "Sales Dashboard", category: "Dashboard", status: "partial", notes: "Shares executive summary", requires: [] },
  { id: "dashboard.marketing", name: "Marketing Dashboard", category: "Dashboard", status: "stub", notes: "Planned", requires: [] },
  { id: "dashboard.customer", name: "Customer Dashboard", category: "Dashboard", status: "stub", notes: "Planned", requires: [] },
  { id: "dashboard.custom", name: "Custom Dashboard", category: "Dashboard", status: "stub", notes: "Planned", requires: [] },
  { id: "dashboard.kpi", name: "KPI Widgets", category: "Dashboard", status: "live", notes: "Live widgets", requires: [] },
  { id: "dashboard.charts", name: "Revenue & Performance Charts", category: "Dashboard", status: "live", notes: "Premium charts", requires: [] },
  { id: "dashboard.live", name: "Live Updates", category: "Dashboard", status: "partial", notes: "Polling", requires: [] },
  { id: "dashboard.activity", name: "Recent Activities", category: "Dashboard", status: "live", notes: "Activity feed", requires: [] },
  { id: "dashboard.ai", name: "AI Insights", category: "Dashboard", status: "needs_external", notes: "Needs OpenAI", requires: ["OPENAI_API_KEY"] },
  { id: "customers.contacts", name: "Contacts", category: "Customer Management", status: "live", notes: "Full CRUD", requires: [] },
  { id: "customers.companies", name: "Companies", category: "Customer Management", status: "live", notes: "CRUD", requires: [] },
  { id: "customers.groups", name: "Customer Groups", category: "Customer Management", status: "stub", notes: "Planned", requires: [] },
  { id: "customers.tags", name: "Customer Tags", category: "Customer Management", status: "partial", notes: "Deal tags live", requires: [] },
  { id: "customers.segments", name: "Customer Segments", category: "Customer Management", status: "stub", notes: "Planned", requires: [] },
  { id: "customers.timeline", name: "Customer Timeline", category: "Customer Management", status: "partial", notes: "Lead timeline live", requires: [] },
  { id: "customers.notes", name: "Customer Notes", category: "Customer Management", status: "partial", notes: "Deal notes live", requires: [] },
  { id: "customers.documents", name: "Customer Documents", category: "Customer Management", status: "stub", notes: "Planned", requires: [] },
  { id: "customers.social", name: "Social Profiles", category: "Customer Management", status: "stub", notes: "Planned", requires: [] },
  { id: "customers.addresses", name: "Multiple Addresses", category: "Customer Management", status: "stub", notes: "Planned", requires: [] },
  { id: "leads.crud", name: "Lead Management", category: "Lead Management", status: "live", notes: "Add/delete/status/score", requires: [] },
  { id: "leads.import", name: "Import Leads", category: "Lead Management", status: "stub", notes: "Endpoint stub", requires: [] },
  { id: "leads.export", name: "Export Leads", category: "Lead Management", status: "stub", notes: "Endpoint stub", requires: [] },
  { id: "leads.assign", name: "Assign / Auto Assign", category: "Lead Management", status: "stub", notes: "Planned", requires: [] },
  { id: "leads.scoring", name: "Lead Scoring", category: "Lead Management", status: "live", notes: "Score field + UI", requires: [] },
  { id: "leads.qualification", name: "Lead Qualification", category: "Lead Management", status: "partial", notes: "Status workflow", requires: [] },
  { id: "leads.convert", name: "Lead Conversion", category: "Lead Management", status: "stub", notes: "Planned", requires: [] },
  { id: "leads.duplicates", name: "Duplicate Detection", category: "Lead Management", status: "stub", notes: "Planned", requires: [] },
  { id: "leads.timeline", name: "Lead Timeline", category: "Lead Management", status: "live", notes: "Timeline in drawer", requires: [] },
  { id: "deals.pipeline", name: "Opportunities / Deals / Pipeline", category: "Opportunity Management", status: "live", notes: "Board + list CRUD", requires: [] },
  { id: "deals.probability", name: "Win Probability", category: "Opportunity Management", status: "live", notes: "Probability field", requires: [] },
  { id: "deals.close_date", name: "Closing Date", category: "Opportunity Management", status: "live", notes: "Close date field", requires: [] },
  { id: "deals.value", name: "Deal Value / Expected Revenue", category: "Opportunity Management", status: "live", notes: "Value + weighted", requires: [] },
  { id: "deals.competitors", name: "Competitor Tracking", category: "Opportunity Management", status: "stub", notes: "Planned", requires: [] },
  { id: "deals.history", name: "Deal History", category: "Opportunity Management", status: "partial", notes: "Activity stream", requires: [] },
  { id: "pipeline.kanban", name: "Kanban Pipeline", category: "Sales Pipeline", status: "live", notes: "Board + stage moves", requires: [] },
  { id: "pipeline.dnd", name: "Drag and Drop Kanban", category: "Sales Pipeline", status: "partial", notes: "Stage select + Flip", requires: [] },
  { id: "pipeline.multi", name: "Multiple Pipelines", category: "Sales Pipeline", status: "stub", notes: "Single pipeline", requires: [] },
  { id: "pipeline.forecast", name: "Sales Forecast", category: "Sales Pipeline", status: "partial", notes: "Weighted pipeline", requires: [] },
  { id: "pipeline.targets", name: "Sales Targets / Quotas", category: "Sales Pipeline", status: "stub", notes: "Planned", requires: [] },
  { id: "pipeline.analytics", name: "Pipeline Analytics", category: "Sales Pipeline", status: "partial", notes: "Composition charts", requires: [] },
  { id: "tasks.crud", name: "Task Management", category: "Task Management", status: "live", notes: "Basic CRUD", requires: [] },
  { id: "tasks.recurring", name: "Recurring Tasks / Dependencies", category: "Task Management", status: "stub", notes: "Planned", requires: [] },
  { id: "tasks.kanban", name: "Task Kanban / Calendar", category: "Task Management", status: "stub", notes: "Planned", requires: [] },
  { id: "calendar", name: "Calendar + Meeting Sync", category: "Calendar", status: "needs_external", notes: "Needs Google/Microsoft", requires: ["GOOGLE_CLIENT_ID", "MICROSOFT_CLIENT_ID"] },
  { id: "email", name: "Email System", category: "Email System", status: "needs_external", notes: "Needs SMTP/OAuth", requires: ["SMTP_HOST", "GOOGLE_CLIENT_ID"] },
  { id: "comms", name: "Omnichannel Communication", category: "Communication", status: "needs_external", notes: "WhatsApp/SMS/Chat", requires: ["TWILIO_ACCOUNT_SID"] },
  { id: "marketing", name: "Marketing Automation", category: "Marketing Automation", status: "stub", notes: "Module stub", requires: [] },
  { id: "support", name: "Customer Support / Tickets", category: "Customer Support", status: "stub", notes: "Module stub", requires: [] },
  { id: "workflow", name: "Workflow Automation", category: "Workflow Automation", status: "partial", notes: "Automation rules CRUD", requires: [] },
  { id: "ai", name: "AI Features", category: "AI Features", status: "needs_external", notes: "Needs OpenAI", requires: ["OPENAI_API_KEY"] },
  { id: "documents", name: "Document Management", category: "Document Management", status: "stub", notes: "Module stub", requires: [] },
  { id: "quotes", name: "Quotation System", category: "Quotation System", status: "stub", notes: "Module stub", requires: [] },
  { id: "invoices", name: "Invoice Management", category: "Invoice Management", status: "stub", notes: "Module stub", requires: [] },
  { id: "products", name: "Product Management", category: "Product Management", status: "stub", notes: "Module stub", requires: [] },
  { id: "subscriptions", name: "Subscription Management", category: "Subscription Management", status: "needs_external", notes: "Needs Stripe", requires: ["STRIPE_SECRET_KEY"] },
  { id: "reporting", name: "Reporting", category: "Reporting", status: "partial", notes: "Analytics + summary", requires: [] },
  { id: "analytics", name: "Analytics (LTV/CAC/Churn)", category: "Analytics", status: "stub", notes: "Module stub", requires: [] },
  { id: "notifications", name: "In-App Notifications + Activity", category: "Notifications", status: "live", notes: "Alerts + activity hub", requires: [] },
  { id: "notifications.external", name: "Email/SMS/Push/Slack/Teams Notify", category: "Notifications", status: "needs_external", notes: "Needs providers", requires: ["SMTP_HOST", "TWILIO_ACCOUNT_SID"] },
  { id: "integrations", name: "Integrations Hub", category: "Integrations", status: "needs_external", notes: "Catalog stub", requires: [] },
  { id: "api.rest", name: "REST API", category: "API", status: "live", notes: "Express REST", requires: [] },
  { id: "api.graphql", name: "GraphQL", category: "API", status: "stub", notes: "Not implemented", requires: [] },
  { id: "api.webhooks", name: "Webhooks", category: "API", status: "stub", notes: "Module stub", requires: [] },
  { id: "import_export", name: "Import & Export", category: "Import & Export", status: "stub", notes: "Module stub", requires: [] },
  { id: "mobile", name: "Mobile CRM", category: "Mobile CRM", status: "stub", notes: "Out of scope", requires: [] },
  { id: "security.audit", name: "Audit Logs", category: "Audit & Security", status: "partial", notes: "Basic writes", requires: [] },
  { id: "security.gdpr", name: "GDPR / Encryption / Backup", category: "Audit & Security", status: "stub", notes: "Not implemented", requires: [] },
  { id: "hr", name: "HR Features", category: "HR Features", status: "stub", notes: "Module stub", requires: [] },
  { id: "finance", name: "Finance", category: "Finance", status: "stub", notes: "Module stub", requires: [] },
  { id: "portal", name: "Customer Portal", category: "Customer Portal", status: "stub", notes: "Module stub", requires: [] },
  { id: "kb", name: "Knowledge Base", category: "Knowledge Base", status: "stub", notes: "Module stub", requires: [] },
  { id: "forms", name: "Forms", category: "Forms", status: "stub", notes: "Module stub", requires: [] },
  { id: "surveys", name: "Surveys", category: "Surveys", status: "stub", notes: "Module stub", requires: [] },
  { id: "inventory", name: "Inventory", category: "Inventory", status: "stub", notes: "Module stub", requires: [] },
  { id: "projects", name: "Project Management", category: "Project Management", status: "stub", notes: "Module stub", requires: [] },
  { id: "time", name: "Time Tracking", category: "Time Tracking", status: "stub", notes: "Module stub", requires: [] },
  { id: "collab", name: "Collaboration", category: "Collaboration", status: "stub", notes: "Module stub", requires: [] },
  { id: "search", name: "Global / AI Search", category: "Search", status: "partial", notes: "Client filters", requires: [] },
  { id: "customization", name: "Customization Platform", category: "Customization", status: "partial", notes: "Pipeline prefs live", requires: [] },
  { id: "i18n", name: "Localization", category: "Localization", status: "stub", notes: "Currency field only", requires: [] },
  { id: "saas", name: "Multi-Tenant SaaS", category: "Multi-Tenant SaaS", status: "partial", notes: "Single org seeded", requires: [] },
  { id: "bi", name: "Business Intelligence", category: "Business Intelligence", status: "stub", notes: "Module stub", requires: [] },
  { id: "ecommerce", name: "E-commerce Integration", category: "E-commerce Integration", status: "needs_external", notes: "Stub", requires: [] },
  { id: "social", name: "Social CRM", category: "Social CRM", status: "needs_external", notes: "Stub", requires: [] },
  { id: "events", name: "Event Management", category: "Event Management", status: "stub", notes: "Module stub", requires: [] },
  { id: "loyalty", name: "Loyalty Program", category: "Loyalty Program", status: "stub", notes: "Module stub", requires: [] },
  { id: "enterprise", name: "Advanced Enterprise Features", category: "Advanced Enterprise Features", status: "stub", notes: "Catalog only", requires: [] },
];

export function groupFeaturesByCategory(features: CatalogFeature[] = FEATURE_CATALOG) {
  const map = new Map<string, CatalogFeature[]>();
  for (const feature of features) {
    const list = map.get(feature.category) ?? [];
    list.push(feature);
    map.set(feature.category, list);
  }
  return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
}

export function countByStatus(features: CatalogFeature[] = FEATURE_CATALOG) {
  return features.reduce(
    (acc, feature) => {
      acc[feature.status] += 1;
      return acc;
    },
    { live: 0, partial: 0, stub: 0, needs_external: 0 },
  );
}
