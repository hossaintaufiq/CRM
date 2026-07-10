"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCRMData } from "@/hooks/use-crm-data";

export default function AutomationsPage(): React.JSX.Element {
  const { automations } = useCRMData();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="page-eyebrow">Orchestration</p>
        <h1 className="text-3xl font-semibold tracking-tight">Automations</h1>
        <p className="text-sm text-muted-foreground">
          Event-driven workflows keeping pipeline motion hands-free.
        </p>
      </header>
      <Card>
        <CardHeader>
          <p className="page-eyebrow mb-2">Rules</p>
          <CardTitle>Workflow engine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {automations.map((automation) => (
            <div
              key={automation.id}
              className="flex items-center justify-between rounded-md border border-border/70 bg-muted/15 p-4 transition-colors hover:border-primary/30"
            >
              <div>
                <p className="font-medium tracking-tight">{automation.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {automation.trigger}
                </p>
              </div>
              <div className="text-right">
                <Badge variant={automation.status === "Active" ? "success" : "warning"}>
                  {automation.status}
                </Badge>
                <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                  {automation.runsToday} runs today
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
