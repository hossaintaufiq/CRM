import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { KPIValue } from "@/types/crm";
import { Card, CardContent, CardMeta } from "@/components/ui/card";
import { Sparkline } from "@/components/charts/sparkline";
import { cn } from "@/lib/utils";

interface KPICardProps {
  metric: KPIValue;
}

const metricTone: Record<KPIValue["id"], "primary" | "success" | "warning"> = {
  mrr: "primary",
  conversion: "success",
  activeDeals: "primary",
  winLoss: "warning",
};

export function KPICard({ metric }: KPICardProps): React.JSX.Element {
  const isPositive = metric.changeLabel.trim().startsWith("+");
  const tone = metricTone[metric.id];

  return (
    <Card data-animate="stagger-in" interactive className="overflow-hidden">
      <CardContent className="pt-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {metric.label}
            </p>
            <p className="metric-value mt-2.5">{metric.value}</p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium",
              isPositive
                ? "border-success/20 bg-success/10 text-success"
                : "border-destructive/20 bg-destructive/10 text-destructive",
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {metric.changeLabel}
          </span>
        </div>
        <Sparkline data={metric.trend} className="h-11 w-full" tone={tone} />
      </CardContent>
      <CardMeta>
        <span>Rolling 10 periods</span>
        <span className="text-foreground/70">Live</span>
      </CardMeta>
    </Card>
  );
}
