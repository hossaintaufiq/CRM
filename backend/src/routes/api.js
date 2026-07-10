import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { config } from "../config.js";
import { featuresByCategory, featuresByStatus, FEATURES } from "../data/features.js";
import { publicUser, requireAuth, requireRoles, signToken } from "../middleware/auth.js";
import { readDb, updateDb, writeDb } from "../store/db.js";

const router = Router();

function pushActivity(db, actor, action, target) {
  db.activities.unshift({
    id: uuid(),
    actor,
    action,
    target,
    timestamp: Date.now(),
  });
  db.activities = db.activities.slice(0, 50);
}

function ago(ts) {
  const minutes = Math.max(1, Math.floor((Date.now() - ts) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function dealOut(deal) {
  return {
    id: deal.id,
    title: deal.title,
    companyName: deal.companyName,
    value: deal.value,
    currency: deal.currency,
    healthScore: deal.healthScore,
    priority: deal.priority,
    probability: deal.probability,
    ownerName: deal.ownerName,
    ownerInitials: deal.ownerInitials,
    lastActivity: "Just now",
    stage: deal.stage,
    closeDate: deal.closeDate,
    tags: deal.tags || [],
    notes: deal.notes || "",
    createdAt: deal.createdAt,
    updatedAt: deal.updatedAt,
  };
}

function leadOut(lead) {
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    status: lead.status,
    score: lead.score,
    lastTouch: "Just now",
    timeline: lead.timeline || [],
  };
}

// ── Auth ──────────────────────────────────────────────────────────
router.post("/auth/register", (req, res) => {
  const { email, password, full_name: fullName, role = "Sales" } = req.body || {};
  if (!email || !password || !fullName) {
    return res.status(400).json({ detail: "Missing fields" });
  }
  const db = readDb();
  if (db.users.some((u) => u.email === String(email).toLowerCase())) {
    return res.status(400).json({ detail: "Email already registered" });
  }
  const user = {
    id: uuid(),
    email: String(email).toLowerCase(),
    fullName,
    passwordHash: bcrypt.hashSync(password, 10),
    role,
    department: "Sales",
    team: "GTM",
    status: "active",
    organizationId: db.organizations[0]?.id || null,
    emailVerified: false,
    mfaEnabled: false,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  return res.json({ access_token: signToken(user), token_type: "bearer", user: publicUser(user) });
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const db = readDb();
  const user = db.users.find((u) => u.email === String(email || "").toLowerCase());
  if (!user || !bcrypt.compareSync(password || "", user.passwordHash)) {
    return res.status(401).json({ detail: "Invalid credentials" });
  }
  if (user.status === "suspended") return res.status(403).json({ detail: "User suspended" });
  return res.json({ access_token: signToken(user), token_type: "bearer", user: publicUser(user) });
});

router.get("/auth/me", requireAuth, (req, res) => res.json(publicUser(req.user)));

router.post("/auth/password-reset/request", (req, res) => {
  res.json({
    status: "accepted",
    message: "If SMTP is configured, a reset email would be sent.",
    requires: ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"],
    configured: Boolean(config.smtpHost),
  });
});

router.post("/auth/oauth/:provider/start", (req, res) => {
  const provider = String(req.params.provider || "").toLowerCase();
  const map = {
    google: config.googleClientId,
    microsoft: config.microsoftClientId,
    apple: config.appleClientId,
    github: config.githubClientId,
  };
  if (!(provider in map)) return res.status(404).json({ detail: "Unknown provider" });
  res.json({
    status: map[provider] ? "ready" : "needs_external",
    provider,
    configured: Boolean(map[provider]),
    message: `${provider} OAuth is scaffolded. Configure secrets to enable.`,
  });
});

router.post("/auth/magic-link", (req, res) => {
  res.json({
    status: "needs_external",
    requires: ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"],
    configured: Boolean(config.smtpHost),
  });
});

router.post("/auth/otp/send", (req, res) => {
  res.json({
    status: "needs_external",
    requires: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"],
    configured: Boolean(config.twilioSid),
  });
});

router.post("/auth/sso/start", (_req, res) => {
  res.json({
    status: "needs_external",
    requires: ["SSO_METADATA_URL"],
    configured: Boolean(config.ssoMetadataUrl),
  });
});

router.post("/auth/ldap/login", (_req, res) => {
  res.json({
    status: "needs_external",
    requires: ["LDAP_SERVER"],
    configured: Boolean(config.ldapServer),
  });
});

// ── Users / Roles / Orgs ──────────────────────────────────────────
router.get("/users", requireAuth, (_req, res) => {
  const db = readDb();
  res.json(db.users.map(publicUser));
});

router.post("/users/invite", requireAuth, requireRoles("Admin", "Manager"), (req, res) => {
  const { email, full_name: fullName, role = "Sales", department = "Sales", team = "GTM" } = req.body || {};
  const db = readDb();
  if (db.users.some((u) => u.email === String(email).toLowerCase())) {
    return res.status(400).json({ detail: "User exists" });
  }
  const user = {
    id: uuid(),
    email: String(email).toLowerCase(),
    fullName,
    passwordHash: bcrypt.hashSync(uuid(), 10),
    role,
    department,
    team,
    status: "invited",
    organizationId: db.organizations[0]?.id || null,
    emailVerified: false,
    mfaEnabled: false,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  res.json(publicUser(user));
});

router.patch("/users/:id/status", requireAuth, requireRoles("Admin"), (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ detail: "User not found" });
  user.status = req.body?.status || user.status;
  writeDb(db);
  res.json(publicUser(user));
});

router.delete("/users/:id", requireAuth, requireRoles("Admin"), (req, res) => {
  updateDb((db) => {
    db.users = db.users.filter((u) => u.id !== req.params.id);
  });
  res.json({ ok: true });
});

router.get("/roles", requireAuth, (_req, res) => {
  res.json({
    builtin: [
      { id: "Admin", permissions: ["*"] },
      { id: "Manager", permissions: ["deals.*", "leads.*", "contacts.*", "reports.read"] },
      { id: "Sales", permissions: ["deals.own", "leads.own", "contacts.own"] },
      { id: "HR", permissions: ["users.read", "hr.*"] },
      { id: "Marketing", permissions: ["campaigns.*", "leads.read"] },
      { id: "Finance", permissions: ["invoices.*", "reports.finance"] },
      { id: "Customer Support", permissions: ["tickets.*", "contacts.read"] },
    ],
    custom_roles: [],
    field_level_permissions: { status: "stub" },
    module_permissions: { status: "stub" },
    territory_access: { status: "stub" },
  });
});

router.get("/organizations", requireAuth, (_req, res) => {
  const db = readDb();
  res.json(
    db.organizations.map((o) => ({
      id: o.id,
      name: o.name,
      default_currency: o.defaultCurrency,
      fiscal_year_start: o.fiscalYearStart,
    })),
  );
});

// ── Dashboard ─────────────────────────────────────────────────────
router.get("/dashboard/summary", requireAuth, (_req, res) => {
  const db = readDb();
  const openDeals = db.deals.filter((d) => !["Closed Won", "Closed Lost"].includes(d.stage));
  const won = db.deals.filter((d) => d.stage === "Closed Won");
  const lost = db.deals.filter((d) => d.stage === "Closed Lost");
  const closed = won.length + lost.length;
  const openValue = openDeals.reduce((s, d) => s + d.value, 0);
  const weighted = openDeals.reduce((s, d) => s + d.value * (d.probability / 100), 0);

  res.json({
    openPipelineValue: openValue,
    weightedPipelineValue: Math.round(weighted),
    openDeals: openDeals.length,
    wonDeals: won.length,
    lostDeals: lost.length,
    winRate: closed ? Math.round((won.length / closed) * 100) : 0,
    leadCount: db.leads.length,
    avgLeadScore: db.leads.length
      ? Math.round(db.leads.reduce((s, l) => s + l.score, 0) / db.leads.length)
      : 0,
    contactCount: db.contacts.length,
    activeAutomations: db.automations.filter((a) => a.status === "Active").length,
    automationRunsToday: db.automations.reduce((s, a) => s + a.runsToday, 0),
    unreadNotifications: db.notifications.filter((n) => !n.read).length,
    hotDeals: openDeals.filter((d) => d.healthScore === "Hot").length,
    closingThisMonth: openDeals.length,
    kpis: [
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
        value: String(openDeals.length),
        changeLabel: "+9 this week",
        trend: [102, 109, 111, 115, 120, 128, 131, 138, 140, openDeals.length || 1],
      },
      {
        id: "winLoss",
        label: "Win / Loss Ratio",
        value: lost.length ? `${(won.length / lost.length).toFixed(1)}x` : "n/a",
        changeLabel: "+0.3x QoQ",
        trend: [15, 16, 17, 18, 20, 21, 22, 24, 25, 28],
      },
    ],
  });
});

// ── Deals ─────────────────────────────────────────────────────────
router.get("/deals", requireAuth, (_req, res) => {
  const db = readDb();
  res.json([...db.deals].sort((a, b) => b.value - a.value).map(dealOut));
});

router.post("/deals", requireAuth, (req, res) => {
  const body = req.body || {};
  const now = new Date().toISOString();
  const deal = {
    id: uuid(),
    title: body.title,
    companyName: body.companyName,
    value: Number(body.value) || 0,
    currency: body.currency || "USD",
    healthScore: body.healthScore || "Warm",
    priority: body.priority || "Medium",
    probability: Number(body.probability) || 25,
    ownerName: body.ownerName,
    ownerInitials: body.ownerInitials || initials(body.ownerName),
    stage: body.stage || "Lead",
    closeDate: body.closeDate || "",
    tags: body.tags || [],
    notes: body.notes || "",
    createdAt: now,
    updatedAt: now,
  };
  updateDb((db) => {
    db.deals.unshift(deal);
    pushActivity(db, req.user.fullName, "created deal", deal.companyName);
  });
  res.json(dealOut(deal));
});

router.patch("/deals/:id", requireAuth, (req, res) => {
  const body = req.body || {};
  let updated = null;
  updateDb((db) => {
    const deal = db.deals.find((d) => d.id === req.params.id);
    if (!deal) return;
    Object.assign(deal, {
      title: body.title ?? deal.title,
      companyName: body.companyName ?? deal.companyName,
      value: body.value ?? deal.value,
      currency: body.currency ?? deal.currency,
      healthScore: body.healthScore ?? deal.healthScore,
      priority: body.priority ?? deal.priority,
      probability: body.probability ?? deal.probability,
      ownerName: body.ownerName ?? deal.ownerName,
      ownerInitials: body.ownerInitials || initials(body.ownerName || deal.ownerName),
      stage: body.stage ?? deal.stage,
      closeDate: body.closeDate ?? deal.closeDate,
      tags: body.tags ?? deal.tags,
      notes: body.notes ?? deal.notes,
      updatedAt: new Date().toISOString(),
    });
    updated = deal;
  });
  if (!updated) return res.status(404).json({ detail: "Deal not found" });
  res.json(dealOut(updated));
});

router.patch("/deals/:id/stage", requireAuth, (req, res) => {
  const stage = req.body?.stage;
  let updated = null;
  updateDb((db) => {
    const deal = db.deals.find((d) => d.id === req.params.id);
    if (!deal) return;
    deal.stage = stage;
    if (stage === "Closed Won") deal.probability = 100;
    if (stage === "Closed Lost") deal.probability = 0;
    deal.updatedAt = new Date().toISOString();
    pushActivity(db, req.user.fullName, "moved deal to", `${deal.companyName} (${stage})`);
    db.notifications.unshift({
      id: uuid(),
      title: "Deal stage changed",
      description: `${deal.companyName} moved to ${stage}.`,
      read: false,
      userId: req.user.id,
      timestamp: Date.now(),
    });
    updated = deal;
  });
  if (!updated) return res.status(404).json({ detail: "Deal not found" });
  res.json(dealOut(updated));
});

router.delete("/deals/:id", requireAuth, (req, res) => {
  updateDb((db) => {
    const deal = db.deals.find((d) => d.id === req.params.id);
    if (deal) pushActivity(db, req.user.fullName, "deleted deal", deal.companyName);
    db.deals = db.deals.filter((d) => d.id !== req.params.id);
  });
  res.json({ ok: true });
});

router.post("/deals/bulk-delete", requireAuth, (req, res) => {
  const ids = new Set(req.body?.ids || []);
  updateDb((db) => {
    db.deals = db.deals.filter((d) => !ids.has(d.id));
  });
  res.json({ ok: true, deleted: ids.size });
});

// ── Leads ─────────────────────────────────────────────────────────
router.get("/leads", requireAuth, (_req, res) => {
  const db = readDb();
  res.json([...db.leads].sort((a, b) => b.score - a.score).map(leadOut));
});

router.post("/leads", requireAuth, (req, res) => {
  const body = req.body || {};
  const lead = {
    id: uuid(),
    name: body.name,
    company: body.company,
    email: body.email,
    phone: body.phone || "",
    source: body.source || "Inbound",
    status: body.status || "New",
    score: Number(body.score) || 50,
    ownerId: req.user.id,
    timeline: body.timeline || ["Lead created"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  updateDb((db) => {
    db.leads.unshift(lead);
    pushActivity(db, req.user.fullName, "created lead", lead.name);
  });
  res.json(leadOut(lead));
});

router.patch("/leads/:id/status", requireAuth, (req, res) => {
  let updated = null;
  updateDb((db) => {
    const lead = db.leads.find((l) => l.id === req.params.id);
    if (!lead) return;
    lead.status = req.body?.status || req.query.status || lead.status;
    pushActivity(db, req.user.fullName, "updated lead status", `${lead.name} → ${lead.status}`);
    updated = lead;
  });
  if (!updated) return res.status(404).json({ detail: "Lead not found" });
  res.json(leadOut(updated));
});

router.delete("/leads/:id", requireAuth, (req, res) => {
  updateDb((db) => {
    const lead = db.leads.find((l) => l.id === req.params.id);
    if (lead) pushActivity(db, req.user.fullName, "deleted lead", lead.name);
    db.leads = db.leads.filter((l) => l.id !== req.params.id);
  });
  res.json({ ok: true });
});

router.post("/leads/bulk-delete", requireAuth, (req, res) => {
  const ids = new Set(req.body?.ids || []);
  updateDb((db) => {
    db.leads = db.leads.filter((l) => !ids.has(l.id));
    pushActivity(db, req.user.fullName, "bulk deleted", `${ids.size} leads`);
  });
  res.json({ ok: true, deleted: ids.size });
});

router.post("/leads/import", requireAuth, (_req, res) => {
  res.json({ status: "stub", message: "CSV/Excel import planned" });
});

router.get("/leads/export", requireAuth, (_req, res) => {
  res.json({ status: "stub", message: "CSV/Excel export planned" });
});

// ── Contacts / Companies / Tasks ──────────────────────────────────
router.get("/contacts", requireAuth, (_req, res) => res.json(readDb().contacts));
router.post("/contacts", requireAuth, (req, res) => {
  const body = req.body || {};
  const contact = {
    id: uuid(),
    name: body.name,
    company: body.company,
    role: body.role || "",
    email: body.email,
    phone: body.phone || "",
    owner: body.owner || req.user.fullName,
    createdAt: new Date().toISOString(),
  };
  updateDb((db) => {
    db.contacts.unshift(contact);
    pushActivity(db, req.user.fullName, "created contact", contact.name);
  });
  res.json(contact);
});
router.delete("/contacts/:id", requireAuth, (req, res) => {
  updateDb((db) => {
    const contact = db.contacts.find((c) => c.id === req.params.id);
    if (contact) pushActivity(db, req.user.fullName, "deleted contact", contact.name);
    db.contacts = db.contacts.filter((c) => c.id !== req.params.id);
  });
  res.json({ ok: true });
});
router.post("/contacts/bulk-delete", requireAuth, (req, res) => {
  const ids = new Set(req.body?.ids || []);
  updateDb((db) => {
    db.contacts = db.contacts.filter((c) => !ids.has(c.id));
  });
  res.json({ ok: true, deleted: ids.size });
});

router.get("/companies", requireAuth, (_req, res) => res.json(readDb().companies));
router.post("/companies", requireAuth, (req, res) => {
  const body = req.body || {};
  const company = {
    id: uuid(),
    name: body.name,
    industry: body.industry || "",
    employees: Number(body.employees) || 0,
    revenue: Number(body.revenue) || 0,
    website: body.website || "",
    parentCompanyId: body.parent_company_id || null,
    createdAt: new Date().toISOString(),
  };
  updateDb((db) => db.companies.unshift(company));
  res.json(company);
});
router.delete("/companies/:id", requireAuth, (req, res) => {
  updateDb((db) => {
    db.companies = db.companies.filter((c) => c.id !== req.params.id);
  });
  res.json({ ok: true });
});

router.get("/tasks", requireAuth, (_req, res) => res.json(readDb().tasks));
router.post("/tasks", requireAuth, (req, res) => {
  const body = req.body || {};
  const task = {
    id: uuid(),
    title: body.title,
    description: body.description || "",
    assignee: body.assignee || "",
    priority: body.priority || "Medium",
    status: body.status || "Todo",
    dueDate: body.due_date || body.dueDate || "",
    createdAt: new Date().toISOString(),
  };
  updateDb((db) => db.tasks.unshift(task));
  res.json(task);
});
router.delete("/tasks/:id", requireAuth, (req, res) => {
  updateDb((db) => {
    db.tasks = db.tasks.filter((t) => t.id !== req.params.id);
  });
  res.json({ ok: true });
});

// ── Activities / Notifications / Automations ──────────────────────
router.get("/activities", requireAuth, (_req, res) => {
  const db = readDb();
  res.json(
    db.activities.slice(0, 50).map((a) => ({
      id: a.id,
      actor: a.actor,
      action: a.action,
      target: a.target,
      at: ago(a.timestamp),
      timestamp: a.timestamp,
    })),
  );
});

router.get("/notifications", requireAuth, (_req, res) => {
  res.json(
    readDb().notifications.slice(0, 50).map((n) => ({
      id: n.id,
      title: n.title,
      description: n.description,
      read: n.read,
      timestamp: n.timestamp,
    })),
  );
});

router.patch("/notifications/:id/read", requireAuth, (req, res) => {
  updateDb((db) => {
    const row = db.notifications.find((n) => n.id === req.params.id);
    if (row) row.read = true;
  });
  res.json({ ok: true });
});

router.post("/notifications/read-all", requireAuth, (_req, res) => {
  updateDb((db) => {
    db.notifications.forEach((n) => {
      n.read = true;
    });
  });
  res.json({ ok: true });
});

router.get("/automations", requireAuth, (_req, res) => {
  res.json(
    readDb().automations.map((a) => ({
      id: a.id,
      name: a.name,
      trigger: a.trigger,
      status: a.status,
      runsToday: a.runsToday,
    })),
  );
});

router.patch("/automations/:id/status", requireAuth, (req, res) => {
  let updated = null;
  updateDb((db) => {
    const row = db.automations.find((a) => a.id === req.params.id);
    if (!row) return;
    row.status = row.status === "Active" ? "Paused" : "Active";
    updated = row;
  });
  if (!updated) return res.status(404).json({ detail: "Not found" });
  res.json({
    id: updated.id,
    name: updated.name,
    trigger: updated.trigger,
    status: updated.status,
    runsToday: updated.runsToday,
  });
});

router.delete("/automations/:id", requireAuth, (req, res) => {
  updateDb((db) => {
    db.automations = db.automations.filter((a) => a.id !== req.params.id);
  });
  res.json({ ok: true });
});

// ── Pipeline / Settings ───────────────────────────────────────────
router.get("/pipeline/stages", requireAuth, (_req, res) => {
  res.json([...readDb().pipelineStages].sort((a, b) => a.order - b.order));
});

router.put("/pipeline/stages", requireAuth, (req, res) => {
  const stages = req.body || [];
  updateDb((db) => {
    for (const item of stages) {
      const stage = db.pipelineStages.find((s) => s.id === item.id);
      if (stage) Object.assign(stage, item);
    }
  });
  res.json([...readDb().pipelineStages].sort((a, b) => a.order - b.order));
});

router.get("/pipeline/preferences", requireAuth, (_req, res) => {
  res.json(readDb().pipelinePreferences);
});

router.put("/pipeline/preferences", requireAuth, (req, res) => {
  updateDb((db) => {
    db.pipelinePreferences = { ...db.pipelinePreferences, ...req.body };
  });
  res.json(readDb().pipelinePreferences);
});

router.get("/settings/workspace", requireAuth, (_req, res) => {
  const org = readDb().organizations[0];
  res.json({
    organizationName: org?.name || "Nexus CRM",
    defaultCurrency: org?.defaultCurrency || "USD",
    fiscalYearStart: org?.fiscalYearStart || "January",
  });
});

router.put("/settings/workspace", requireAuth, (req, res) => {
  updateDb((db) => {
    const org = db.organizations[0];
    if (org) {
      org.name = req.body?.organizationName ?? org.name;
      org.defaultCurrency = req.body?.defaultCurrency ?? org.defaultCurrency;
      org.fiscalYearStart = req.body?.fiscalYearStart ?? org.fiscalYearStart;
    }
  });
  res.json(req.body);
});

// ── Modules / Features catalog ────────────────────────────────────
router.get("/modules/features", requireAuth, (_req, res) => {
  const grouped = featuresByStatus();
  res.json({
    total: FEATURES.length,
    counts: Object.fromEntries(Object.entries(grouped).map(([k, v]) => [k, v.length])),
    features: FEATURES,
    categories: featuresByCategory(),
  });
});

router.get("/modules/features/summary", requireAuth, (_req, res) => {
  const grouped = featuresByStatus();
  res.json({
    live: grouped.live.map((f) => f.name),
    partial: grouped.partial.map((f) => f.name),
    stub: grouped.stub.map((f) => f.name),
    needs_external: grouped.needs_external.map((f) => ({
      name: f.name,
      requires: f.requires,
    })),
    categories: featuresByCategory(),
  });
});

router.get("/modules/features/:featureId", requireAuth, (req, res) => {
  const feature = FEATURES.find((f) => f.id === req.params.featureId);
  if (!feature) return res.status(404).json({ detail: "Feature not found" });
  res.json(feature);
});

router.get("/modules/:moduleName", requireAuth, (req, res) => {
  const moduleName = req.params.moduleName;
  const hints = {
    calendar: ["GOOGLE_CLIENT_ID", "MICROSOFT_CLIENT_ID"],
    email: ["SMTP_HOST", "GOOGLE_CLIENT_ID"],
    communication: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"],
    ai: ["OPENAI_API_KEY"],
    subscriptions: ["STRIPE_SECRET_KEY"],
  };
  const requires = hints[moduleName] || [];
  res.json({
    module: moduleName,
    status: requires.length ? "needs_external" : "stub",
    message: `Module '${moduleName}' is scaffolded for the enterprise roadmap.`,
    requires,
    docs: "/api/v1/modules/features",
  });
});

export default router;
