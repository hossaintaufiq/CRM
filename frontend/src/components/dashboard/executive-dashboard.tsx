"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Bot,
  Contact2,
  Flame,
  LayoutDashboard,
  Target,
  Workflow,
} from "lucide-react";
import type {
  Activity,
  AutomationRule,
  Contact,
  DashboardSummary,
  Deal,
  KPIValue,
  Lead,
  NotificationItem,
} from "@/types/crm";
import { KPICard } from "@/components/dashboard/kpi-card";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { PipelineComposition } from "@/components/dashboard/pipeline-composition";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface ExecutiveDashboardProps {
  kpis: KPIValue[];
  activities: Activity[];
  deals: Deal[];
  leads: Lead[];
  contacts: Contact[];
  automations: AutomationRule[];
  notifications: NotificationItem[];
  summary: DashboardSummary;
  dataMode: "demo" | "live";
}

export function ExecutiveDashboard({
  kpis,
  activities,
  deals,
  leads,
  contacts,
  automations,
  notifications,
  summary,
  dataMode,
}: ExecutiveDashboardProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='header']",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", clearProps: "all" },
      );
      gsap.fromTo(
        "[data-animate='stagger-in']",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.45,
          delay: 0.05,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const topDeals = [...deals]
    .filter((d) => d.stage !== "Closed Lost")
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const topLeads = [...leads].sort((a, b) => b.score - a.score).slice(0, 4);

  return (
    <div ref={rootRef} className="space-y-6">
      <header data-animate="header" className="space-y-2">
        <p className="page-eyebrow">Command center</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">CRM summary</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              One view of pipeline, leads, contacts, automations, and alerts.
              Data mode:{" "}
              <span className="font-mono text-foreground">{dataMode}</span> ·{" "}
              <span className="font-mono text-[11px]">
                GET {API_ENDPOINTS.dashboardSummary}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Open pipeline
              </p>
              <p className="font-mono text-sm font-semibold tabular-nums">
                ${summary.openPipelineValue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md border border-success/25 bg-success/10 px-3 py-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-success">
                Win rate
              </p>
              <p className="font-mono text-sm font-semibold tabular-nums text-success">
                {summary.winRate}%
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        {[
          {
            label: "Open deals",
            value: summary.openDeals,
            icon: Workflow,
            href: "/deals",
          },
          {
            label: "Weighted $",
            value: `$${Math.round(summary.weightedPipelineValue / 1000)}K`,
            icon: Target,
            href: "/deals",
          },
          {
            label: "Hot deals",
            value: summary.hotDeals,
            icon: Flame,
            href: "/deals",
          },
          {
            label: "Closing Mo",
            value: summary.closingThisMonth,
            icon: LayoutDashboard,
            href: "/deals",
          },
          {
            label: "Leads",
            value: summary.leadCount,
            icon: Contact2,
            href: "/leads",
          },
          {
            label: "Avg score",
            value: summary.avgLeadScore,
            icon: Target,
            href: "/leads",
          },
          {
            label: "Contacts",
            value: summary.contactCount,
            icon: Contact2,
            href: "/contacts",
          },
          {
            label: "Automations",
            value: summary.activeAutomations,
            icon: Bot,
            href: "/automations",
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            data-animate="stagger-in"
            className="surface-interactive surface rounded-lg p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <item.icon className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                {item.label}
              </span>
            </div>
            <p className="font-mono text-lg font-semibold tabular-nums tracking-tight">
              {item.value}
            </p>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {kpis.map((metric) => (
          <KPICard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PipelineChart />
        </div>
        <RecentActivity activities={activities} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <PipelineComposition deals={deals} />
        <Card data-animate="stagger-in" className="overflow-hidden">
          <CardHeader>
            <p className="page-eyebrow mb-2">Opportunities</p>
            <CardTitle>Top deals by value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topDeals.map((deal) => (
              <Link
                key={deal.id}
                href="/deals"
                className="flex items-center justify-between rounded-md border border-border/70 bg-muted/15 px-3 py-2.5 transition-colors hover:border-primary/30"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{deal.companyName}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {deal.stage} · {deal.probability}%
                  </p>
                </div>
                <p className="font-mono text-sm font-semibold tabular-nums">
                  ${deal.value.toLocaleString()}
                </p>
              </Link>
            ))}
          </CardContent>
          <CardMeta>
            <span>GET {API_ENDPOINTS.deals}</span>
            <Link href="/deals" className="text-primary">
              Open pipeline
            </Link>
          </CardMeta>
        </Card>

        <Card data-animate="stagger-in" className="overflow-hidden">
          <CardHeader>
            <p className="page-eyebrow mb-2">Inbound</p>
            <CardTitle>Highest intent leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topLeads.map((lead) => (
              <Link
                key={lead.id}
                href="/leads"
                className="flex items-center justify-between rounded-md border border-border/70 bg-muted/15 px-3 py-2.5 transition-colors hover:border-primary/30"
              >
                <div>
                  <p className="text-sm font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.company}</p>
                </div>
                <Badge variant={lead.score >= 80 ? "success" : "warning"}>
                  {lead.score}
                </Badge>
              </Link>
            ))}
          </CardContent>
          <CardMeta>
            <span>GET {API_ENDPOINTS.leads}</span>
            <Link href="/leads" className="text-primary">
              Manage leads
            </Link>
          </CardMeta>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card data-animate="stagger-in" className="overflow-hidden">
          <CardHeader>
            <p className="page-eyebrow mb-2">Directory</p>
            <CardTitle>Contacts snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contacts.slice(0, 4).map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contact.role} · {contact.company}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardMeta>
            <span>{summary.contactCount} total</span>
            <Link href="/contacts" className="text-primary">
              Directory
            </Link>
          </CardMeta>
        </Card>

        <Card data-animate="stagger-in" className="overflow-hidden">
          <CardHeader>
            <p className="page-eyebrow mb-2">Orchestration</p>
            <CardTitle>Automation health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {automations.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{rule.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {rule.runsToday} runs today
                  </p>
                </div>
                <Badge variant={rule.status === "Active" ? "success" : "warning"}>
                  {rule.status}
                </Badge>
              </div>
            ))}
          </CardContent>
          <CardMeta>
            <span>{summary.automationRunsToday} runs</span>
            <Link href="/automations" className="text-primary">
              Rules
            </Link>
          </CardMeta>
        </Card>

        <Card data-animate="stagger-in" className="overflow-hidden">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <p className="page-eyebrow mb-2">Inbox</p>
              <CardTitle>Alerts</CardTitle>
            </div>
            <Badge variant={summary.unreadNotifications > 0 ? "warning" : "success"}>
              {summary.unreadNotifications} unread
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="rounded-md border border-border/70 px-3 py-2"
              >
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
          <CardMeta>
            <span>GET {API_ENDPOINTS.notifications}</span>
            <Link href="/notifications" className="text-primary">
              Open hub
            </Link>
          </CardMeta>
        </Card>
      </section>
    </div>
  );
}
