"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCRMData } from "@/hooks/use-crm-data";

export default function AutomationsPage(): React.JSX.Element {
  const { automations } = useCRMData();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Automations</h1>
      <Card>
        <CardHeader>
          <CardTitle>Workflow Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {automations.map((automation) => (
            <div
              key={automation.id}
              className="flex items-center justify-between rounded-md border border-border p-4"
            >
              <div>
                <p className="font-medium">{automation.name}</p>
                <p className="text-sm text-muted-foreground">{automation.trigger}</p>
              </div>
              <div className="text-right">
                <Badge variant={automation.status === "Active" ? "success" : "warning"}>
                  {automation.status}
                </Badge>
                <p className="mt-1 text-xs text-muted-foreground">
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
