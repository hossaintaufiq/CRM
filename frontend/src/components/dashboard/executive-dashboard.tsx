"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { Activity, KPIValue } from "@/types/crm";
import { KPICard } from "@/components/dashboard/kpi-card";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

interface ExecutiveDashboardProps {
  kpis: KPIValue[];
  activities: Activity[];
}

export function ExecutiveDashboard({
  kpis,
  activities,
}: ExecutiveDashboardProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='stagger-in']",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.55,
          ease: "power2.out",
          clearProps: "all",
        },
      );
      gsap.fromTo(
        "[data-animate='header']",
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", clearProps: "all" },
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
          <div className="rounded-md border border-border/80 bg-card/70 px-3 py-2 font-mono text-[11px] text-muted-foreground backdrop-blur-sm">
            SYNC <span className="text-foreground">00:42</span> · LATENCY{" "}
            <span className="text-success">12ms</span>
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
    </div>
  );
}
