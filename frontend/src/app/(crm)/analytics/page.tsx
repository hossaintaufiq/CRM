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
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">${totalPipeline.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Lead Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{avgLeadScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Live KPI Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              KPI trends are refreshed in realtime from demo state.
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Metric Trend Monitor</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {kpis.map((kpi) => (
            <div key={kpi.id} className="rounded-md border border-border p-4">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-lg font-semibold">{kpi.value}</p>
              <div className="mt-3 flex items-end gap-1">
                {kpi.trend.map((point, index) => (
                  <span
                    key={`${kpi.id}-${index}`}
                    className="w-2 rounded-full bg-primary/50"
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
