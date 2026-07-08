import type {
  Activity,
  AutomationRule,
  Contact,
  Deal,
  KPIValue,
  Lead,
  NotificationItem,
} from "@/types/crm";

export const demoKpis: KPIValue[] = [
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

export const demoActivities: Activity[] = [
  {
    id: "act_01",
    actor: "Avery Blake",
    action: "converted lead",
    target: "Northwind Labs",
    at: "2m ago",
    timestamp: Date.now() - 2 * 60 * 1000,
  },
  {
    id: "act_02",
    actor: "Jules Tan",
    action: "sent proposal",
    target: "Altair Cloud",
    at: "14m ago",
    timestamp: Date.now() - 14 * 60 * 1000,
  },
  {
    id: "act_03",
    actor: "Nadia Cole",
    action: "logged discovery call",
    target: "RidgeCore Systems",
    at: "31m ago",
    timestamp: Date.now() - 31 * 60 * 1000,
  },
];

export const demoDeals: Deal[] = [
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
  {
    id: "deal_5",
    companyName: "ForgePoint AI",
    value: 64000,
    healthScore: "Warm",
    ownerName: "Liam Park",
    ownerInitials: "LP",
    lastActivity: "2h ago",
    stage: "Lead",
  },
];

export const demoLeads: Lead[] = [
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

export const demoContacts: Contact[] = [
  {
    id: "contact_1",
    name: "Alicia Moore",
    company: "Northwind Labs",
    role: "VP Operations",
    email: "alicia@northwind.io",
    phone: "+1 415 555 0170",
    owner: "Avery Blake",
  },
  {
    id: "contact_2",
    name: "Derek Lin",
    company: "Altair Cloud",
    role: "Head of RevOps",
    email: "derek@altaircloud.com",
    phone: "+1 415 555 0178",
    owner: "Jules Tan",
  },
  {
    id: "contact_3",
    name: "Priya Anand",
    company: "Summit Dataworks",
    role: "CFO",
    email: "priya@summitdw.com",
    phone: "+1 415 555 0133",
    owner: "Liam Park",
  },
];

export const demoNotifications: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Pipeline update",
    description: "Northwind Labs moved to Negotiation.",
    read: false,
    timestamp: Date.now() - 4 * 60 * 1000,
  },
  {
    id: "notif_2",
    title: "Lead engagement spike",
    description: "OrbitIQ opened your email sequence twice.",
    read: false,
    timestamp: Date.now() - 15 * 60 * 1000,
  },
];

export const demoAutomations: AutomationRule[] = [
  {
    id: "auto_1",
    name: "Inbound lead routing",
    trigger: "New inbound lead",
    status: "Active",
    runsToday: 17,
  },
  {
    id: "auto_2",
    name: "Proposal follow-up",
    trigger: "Proposal sent + 48h no reply",
    status: "Active",
    runsToday: 9,
  },
  {
    id: "auto_3",
    name: "Dormant deal reminder",
    trigger: "No activity for 7 days",
    status: "Paused",
    runsToday: 0,
  },
];
