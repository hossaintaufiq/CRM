"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCRMData } from "@/hooks/use-crm-data";

export default function AnalyticsPage(): React.JSX.Element {
  const { kpis, deals, leads } = useCRMData();

  const totalPipeline = deals.reduce((sum, deal) => sum + deal.value, 0);
  const avgLeadScore =
    leads.length > 0
      ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length)
      : 0;

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
        <Card>
          <CardHeader>
            <p className="page-eyebrow mb-2">Aggregate</p>
            <CardTitle>Total pipeline value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="metric-value">${totalPipeline.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <p className="page-eyebrow mb-2">Quality</p>
            <CardTitle>Average lead score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="metric-value">{avgLeadScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <p className="page-eyebrow mb-2">Stream</p>
            <CardTitle>Live KPI feed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              KPI trends refresh from demo state in realtime.
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <p className="page-eyebrow mb-2">Monitor</p>
          <CardTitle>Metric trend board</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="rounded-md border border-border/70 bg-muted/20 p-4"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {kpi.label}
              </p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{kpi.value}</p>
              <div className="mt-3 flex items-end gap-1">
                {kpi.trend.map((point, index) => (
                  <span
                    key={`${kpi.id}-${index}`}
                    className="w-1.5 rounded-sm bg-primary/60"
                    style={{ height: `${Math.max(6, Math.floor(point / 2))}px` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
