"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { PremiumAreaChart } from "@/components/charts/premium-area-chart";
import { Sparkline } from "@/components/charts/sparkline";
import { HorizontalMeter } from "@/components/charts/horizontal-meter";
import { useCRMData } from "@/hooks/use-crm-data";

export default function AnalyticsPage(): React.JSX.Element {
  const { kpis, deals, leads } = useCRMData();

  const totalPipeline = deals.reduce((sum, deal) => sum + deal.value, 0);
  const avgLeadScore =
    leads.length > 0
      ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length)
      : 0;

  const leadSources = useMemo(() => {
    const counts = new Map<string, number>();
    for (const lead of leads) {
      counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1);
    }
    const tones = ["primary", "success", "warning", "muted"] as const;
    return Array.from(counts.entries()).map(([label, value], index) => ({
      label,
      value,
      tone: tones[index % tones.length],
    }));
  }, [leads]);

  const velocitySeries = useMemo(
    () =>
      [38, 42, 40, 51, 49, 58, 62, 67, 71, 76, 74, 82].map((value, index) => ({
        label: `M${index + 1}`,
        value,
      })),
    [],
  );

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="page-eyebrow">Telemetry</p>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Pipeline value, lead quality, and KPI trend instrumentation.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card interactive>
          <CardHeader>
            <p className="page-eyebrow mb-2">Aggregate</p>
            <CardTitle>Total pipeline value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="metric-value">${totalPipeline.toLocaleString()}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Across {deals.length} active opportunities
            </p>
          </CardContent>
          <CardMeta>
            <span>USD</span>
            <span>Open book</span>
          </CardMeta>
        </Card>
        <Card interactive>
          <CardHeader>
            <p className="page-eyebrow mb-2">Quality</p>
            <CardTitle>Average lead score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="metric-value">{avgLeadScore}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(avgLeadScore, 100)}%` }}
              />
            </div>
          </CardContent>
          <CardMeta>
            <span>0–100 index</span>
            <span>{leads.length} leads</span>
          </CardMeta>
        </Card>
        <Card interactive>
          <CardHeader>
            <p className="page-eyebrow mb-2">Velocity</p>
            <CardTitle>Close velocity index</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="metric-value">82</p>
            <Sparkline
              data={velocitySeries.map((p) => p.value)}
              className="mt-3 h-10 w-full"
              tone="success"
            />
          </CardContent>
          <CardMeta>
            <span>+9.4% QoQ</span>
            <span>Indexed</span>
          </CardMeta>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader>
            <p className="page-eyebrow mb-2">Trajectory</p>
            <CardTitle>Revenue velocity</CardTitle>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Twelve-month close velocity index with interactive inspection.
            </p>
          </CardHeader>
          <CardContent>
            <PremiumAreaChart data={velocitySeries} height={190} />
          </CardContent>
          <CardMeta>
            <span>Normalized index</span>
            <span>Monthly</span>
          </CardMeta>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <p className="page-eyebrow mb-2">Acquisition</p>
            <CardTitle>Lead source mix</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalMeter segments={leadSources} />
          </CardContent>
          <CardMeta>
            <span>Channel mix</span>
            <span>{leads.length} total</span>
          </CardMeta>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <p className="page-eyebrow mb-2">Monitor</p>
          <CardTitle>Metric trend board</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="rounded-md border border-border/70 bg-muted/20 p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{kpi.value}</p>
                  <p className="mt-1 font-mono text-[11px] text-success">{kpi.changeLabel}</p>
                </div>
                <Sparkline data={kpi.trend} className="h-12 w-28" />
              </div>
            </div>
          ))}
        </CardContent>
        <CardMeta>
          <span>KPI stream</span>
          <span>Demo state</span>
        </CardMeta>
      </Card>
    </section>
  );
}
