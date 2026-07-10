"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { Activity, Deal, KPIValue } from "@/types/crm";
import { KPICard } from "@/components/dashboard/kpi-card";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { PipelineComposition } from "@/components/dashboard/pipeline-composition";
import { RecentActivity } from "@/components/dashboard/recent-activity";

interface ExecutiveDashboardProps {
  kpis: KPIValue[];
  activities: Activity[];
  deals: Deal[];
}

export function ExecutiveDashboard({
  kpis,
  activities,
  deals,
}: ExecutiveDashboardProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

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
          stagger: 0.06,
          duration: 0.5,
          delay: 0.05,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="space-y-6">
      <header data-animate="header" className="space-y-2">
        <p className="page-eyebrow">Revenue operations</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Executive overview</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Live pipeline health, forecast velocity, and GTM signal stream.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2 backdrop-blur-sm">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Sync
              </p>
              <p className="font-mono text-[11px] text-foreground">00:42 UTC</p>
            </div>
            <div className="rounded-md border border-success/25 bg-success/10 px-3 py-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-success">
                Latency
              </p>
              <p className="font-mono text-[11px] text-success">12ms</p>
            </div>
          </div>
        </div>
      </header>

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

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PipelineComposition deals={deals} />
        <CardConversionSnapshot deals={deals} />
      </section>
    </div>
  );
}

function CardConversionSnapshot({ deals }: { deals: Deal[] }): React.JSX.Element {
  const won = deals.filter((d) => d.stage === "Closed Won").length;
  const lost = deals.filter((d) => d.stage === "Closed Lost").length;
  const open = deals.length - won - lost;
  const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;

  return (
    <div data-animate="stagger-in" className="surface overflow-hidden rounded-lg">
      <div className="p-5 pb-4">
        <p className="page-eyebrow mb-2">Throughput</p>
        <h3 className="text-[15px] font-semibold tracking-tight">Conversion snapshot</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Closed outcomes against open opportunity load.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-px border-y border-border/70 bg-border/70">
        {[
          { label: "Open", value: open, tone: "text-foreground" },
          { label: "Won", value: won, tone: "text-success" },
          { label: "Lost", value: lost, tone: "text-destructive" },
        ].map((item) => (
          <div key={item.label} className="bg-card/95 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {item.label}
            </p>
            <p className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${item.tone}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Win rate</span>
          <span className="font-mono text-sm font-semibold tabular-nums">{winRate}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-success"
            style={{ width: `${winRate}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        <span>Closed set</span>
        <span>{won + lost} decisions</span>
      </div>
    </div>
  );
}
