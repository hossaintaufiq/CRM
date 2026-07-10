"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { useCRMData } from "@/hooks/use-crm-data";

export default function AutomationsPage(): React.JSX.Element {
  const { automations } = useCRMData();
  const activeCount = automations.filter((item) => item.status === "Active").length;
  const runsToday = automations.reduce((sum, item) => sum + item.runsToday, 0);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="page-eyebrow">Orchestration</p>
          <h1 className="text-3xl font-semibold tracking-tight">Automations</h1>
          <p className="text-sm text-muted-foreground">
            Event-driven workflows keeping pipeline motion hands-free.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Active
            </p>
            <p className="font-mono text-sm font-semibold tabular-nums">{activeCount}</p>
          </div>
          <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Runs today
            </p>
            <p className="font-mono text-sm font-semibold tabular-nums">{runsToday}</p>
          </div>
        </div>
      </header>
      <Card className="overflow-hidden">
        <CardHeader>
          <p className="page-eyebrow mb-2">Rules</p>
          <CardTitle>Workflow engine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {automations.map((automation) => (
            <div
              key={automation.id}
              className="flex items-center justify-between gap-4 rounded-md border border-border/70 bg-muted/15 p-4 transition-all hover:border-primary/30 hover:bg-muted/25"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      automation.status === "Active"
                        ? "h-1.5 w-1.5 rounded-full bg-success"
                        : "h-1.5 w-1.5 rounded-full bg-warning"
                    }
                  />
                  <p className="font-medium tracking-tight">{automation.name}</p>
                </div>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  Trigger · {automation.trigger}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <Badge variant={automation.status === "Active" ? "success" : "warning"}>
                  {automation.status}
                </Badge>
                <p className="mt-1.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                  {automation.runsToday} runs today
                </p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardMeta>
          <span>Event bus</span>
          <span>Healthy</span>
        </CardMeta>
      </Card>
    </section>
  );
}
