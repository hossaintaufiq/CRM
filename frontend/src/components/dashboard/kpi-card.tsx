import { ArrowUpRight } from "lucide-react";
import type { KPIValue } from "@/types/crm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPICardProps {
  metric: KPIValue;
}

export function KPICard({ metric }: KPICardProps): React.JSX.Element {
  return (
    <Card data-animate="stagger-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-2xl font-semibold">{metric.value}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
            <ArrowUpRight className="h-3 w-3" />
            {metric.changeLabel}
          </span>
        </div>
        <div className="flex items-end gap-1">
          {metric.trend.map((point, index) => (
            <span
              key={`${metric.id}-${index}`}
              className="w-2 rounded-full bg-primary/55"
              style={{ height: `${Math.max(8, Math.floor(point / 2))}px` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
