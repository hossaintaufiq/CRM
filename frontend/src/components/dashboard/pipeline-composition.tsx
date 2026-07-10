"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { HorizontalMeter } from "@/components/charts/horizontal-meter";
import type { Deal } from "@/types/crm";

interface PipelineCompositionProps {
  deals: Deal[];
}

export function PipelineComposition({
  deals,
}: PipelineCompositionProps): React.JSX.Element {
  const segments = useMemo(() => {
    const byStage = new Map<string, number>();
    for (const deal of deals) {
      byStage.set(deal.stage, (byStage.get(deal.stage) ?? 0) + deal.value);
    }

    const tones = ["primary", "success", "warning", "muted", "primary", "muted"] as const;
    return Array.from(byStage.entries()).map(([label, value], index) => ({
      label,
      value,
      tone: tones[index % tones.length] as "primary" | "success" | "warning" | "muted",
    }));
  }, [deals]);

  const total = deals.reduce((sum, deal) => sum + deal.value, 0);
  const hotCount = deals.filter((d) => d.healthScore === "Hot").length;

  return (
    <Card data-animate="stagger-in" className="overflow-hidden">
      <CardHeader>
        <p className="page-eyebrow mb-2">Composition</p>
        <CardTitle>Pipeline by stage</CardTitle>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Weighted deal value across the active funnel.
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-md border border-border/70 bg-muted/25 p-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Open value
            </p>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums">
              ${total.toLocaleString()}
            </p>
          </div>
          <div className="rounded-md border border-border/70 bg-muted/25 p-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Hot deals
            </p>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums">
              {hotCount}
              <span className="ml-1 text-sm text-muted-foreground">/ {deals.length}</span>
            </p>
          </div>
        </div>
        <HorizontalMeter
          segments={segments}
          totalLabel={`${deals.length} opportunities in motion`}
        />
      </CardContent>
      <CardMeta>
        <span>Value-weighted</span>
        <span>Stage mix</span>
      </CardMeta>
    </Card>
  );
}
