import { ArrowUpRight } from "lucide-react";
import type { KPIValue } from "@/types/crm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPICardProps {
  metric: KPIValue;
}

export function KPICard({ metric }: KPICardProps): React.JSX.Element {
  return (
    <Card data-animate="stagger-in" className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {metric.label}
          </CardTitle>
          <span className="inline-flex items-center gap-0.5 rounded border border-success/20 bg-success/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-success">
            <ArrowUpRight className="h-3 w-3" />
            {metric.changeLabel}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="metric-value mb-4">{metric.value}</p>
        <div className="flex items-end gap-1">
          {metric.trend.map((point, index) => (
            <span
              key={`${metric.id}-${index}`}
              className="w-1.5 rounded-sm bg-primary/70 transition-colors"
              style={{ height: `${Math.max(8, Math.floor(point / 2))}px` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
