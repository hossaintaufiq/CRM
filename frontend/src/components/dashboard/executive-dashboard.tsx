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
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
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
