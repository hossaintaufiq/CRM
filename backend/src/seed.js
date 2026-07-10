import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { readDb, writeDb } from "./store/db.js";

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function seedIfEmpty() {
  const db = readDb();
  if (db.users.length > 0) return db;

  const orgId = uuid();
  const adminId = uuid();
  const salesId = uuid();
  const now = new Date().toISOString();

  db.organizations = [
    {
      id: orgId,
      name: "Northstar Ventures",
      defaultCurrency: "USD",
      fiscalYearStart: "January",
      createdAt: now,
    },
  ];

  db.users = [
    {
      id: adminId,
      email: "admin@nexus.crm",
      fullName: "Avery Blake",
      passwordHash: bcrypt.hashSync("Admin123!", 10),
      role: "Admin",
      department: "Operations",
      team: "Leadership",
      status: "active",
      organizationId: orgId,
      emailVerified: true,
      mfaEnabled: false,
      createdAt: now,
    },
    {
      id: salesId,
      email: "sales@nexus.crm",
      fullName: "Jules Tan",
      passwordHash: bcrypt.hashSync("Sales123!", 10),
      role: "Sales",
      department: "Sales",
      team: "Enterprise",
      status: "active",
      organizationId: orgId,
      emailVerified: true,
      mfaEnabled: false,
      createdAt: now,
    },
  ];

  db.pipelineStages = [
    { id: "Lead", label: "Lead", color: "#64748b", visible: true, order: 0 },
    { id: "Qualified", label: "Qualified", color: "#C9A227", visible: true, order: 1 },
    { id: "Proposal", label: "Proposal", color: "#0d9488", visible: true, order: 2 },
    { id: "Negotiation", label: "Negotiation", color: "#B8860B", visible: true, order: 3 },
    { id: "Closed Won", label: "Closed Won", color: "#059669", visible: true, order: 4 },
    { id: "Closed Lost", label: "Closed Lost", color: "#dc2626", visible: true, order: 5 },
  ];

  db.deals = [
    {
      id: uuid(),
      title: "Enterprise platform expansion",
      companyName: "Northwind Labs",
      value: 92000,
      currency: "USD",
      healthScore: "Hot",
      priority: "High",
      probability: 75,
      ownerName: "Avery Blake",
      ownerInitials: "AB",
      stage: "Negotiation",
      closeDate: daysFromNow(18),
      tags: ["Enterprise", "Expansion"],
      notes: "Legal review in progress.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuid(),
      title: "RevOps suite rollout",
      companyName: "Altair Cloud",
      value: 48000,
      currency: "USD",
      healthScore: "Warm",
      priority: "Medium",
      probability: 55,
      ownerName: "Jules Tan",
      ownerInitials: "JT",
      stage: "Proposal",
      closeDate: daysFromNow(36),
      tags: ["Mid-market"],
      notes: "Proposal v2 sent.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuid(),
      title: "AI copilots pilot",
      companyName: "ForgePoint AI",
      value: 64000,
      currency: "USD",
      healthScore: "Warm",
      priority: "Medium",
      probability: 20,
      ownerName: "Jules Tan",
      ownerInitials: "JT",
      stage: "Lead",
      closeDate: daysFromNow(50),
      tags: ["Pilot", "AI"],
      notes: "Inbound demo request.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuid(),
      title: "Annual data platform renewal",
      companyName: "Summit Dataworks",
      value: 210000,
      currency: "USD",
      healthScore: "Hot",
      priority: "Critical",
      probability: 100,
      ownerName: "Avery Blake",
      ownerInitials: "AB",
      stage: "Closed Won",
      closeDate: daysFromNow(0),
      tags: ["Renewal"],
      notes: "Signed.",
      createdAt: now,
      updatedAt: now,
    },
  ];

  db.leads = [
    {
      id: uuid(),
      name: "Maya Patel",
      company: "Nordic Forge",
      email: "maya@nordicforge.io",
      phone: "+1 415 555 0192",
      source: "Inbound",
      status: "Working",
      score: 82,
      ownerId: adminId,
      timeline: ["Downloaded whitepaper", "Booked qualification call"],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuid(),
      name: "Rafael Kim",
      company: "OrbitIQ",
      email: "rafael@orbitiq.dev",
      phone: "+1 415 555 0113",
      source: "Outbound",
      status: "New",
      score: 64,
      ownerId: salesId,
      timeline: ["Clicked campaign CTA"],
      createdAt: now,
      updatedAt: now,
    },
  ];

  db.contacts = [
    {
      id: uuid(),
      name: "Alicia Moore",
      company: "Northwind Labs",
      role: "VP Operations",
      email: "alicia@northwind.io",
      phone: "+1 415 555 0170",
      owner: "Avery Blake",
      createdAt: now,
    },
    {
      id: uuid(),
      name: "Derek Lin",
      company: "Altair Cloud",
      role: "Head of RevOps",
      email: "derek@altaircloud.com",
      phone: "+1 415 555 0178",
      owner: "Jules Tan",
      createdAt: now,
    },
  ];

  db.companies = [
    {
      id: uuid(),
      name: "Northwind Labs",
      industry: "SaaS",
      employees: 420,
      revenue: 48000000,
      website: "https://northwind.io",
      parentCompanyId: null,
      createdAt: now,
    },
    {
      id: uuid(),
      name: "Altair Cloud",
      industry: "Cloud Infrastructure",
      employees: 180,
      revenue: 22000000,
      website: "https://altaircloud.com",
      parentCompanyId: null,
      createdAt: now,
    },
  ];

  db.automations = [
    {
      id: uuid(),
      name: "Inbound lead routing",
      trigger: "New inbound lead",
      status: "Active",
      runsToday: 17,
    },
    {
      id: uuid(),
      name: "Proposal follow-up",
      trigger: "Proposal sent + 48h no reply",
      status: "Active",
      runsToday: 9,
    },
    {
      id: uuid(),
      name: "Dormant deal reminder",
      trigger: "No activity for 7 days",
      status: "Paused",
      runsToday: 0,
    },
  ];

  db.tasks = [
    {
      id: uuid(),
      title: "Send security packet to Northwind",
      description: "Include SOC2 + DPA",
      assignee: "Avery Blake",
      priority: "High",
      status: "Todo",
      dueDate: daysFromNow(2),
      createdAt: now,
    },
  ];

  db.activities = [
    {
      id: uuid(),
      actor: "Avery Blake",
      action: "seeded workspace",
      target: "Nexus CRM",
      timestamp: Date.now(),
    },
  ];

  db.notifications = [
    {
      id: uuid(),
      title: "Welcome to Nexus",
      description: "Express backend is live with demo seed data.",
      read: false,
      userId: adminId,
      timestamp: Date.now(),
    },
  ];

  writeDb(db);
  return db;
}

if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  seedIfEmpty();
  console.log("Seed complete");
}
