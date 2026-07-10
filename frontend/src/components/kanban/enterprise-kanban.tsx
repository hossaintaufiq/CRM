"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Deal, DealStage } from "@/types/crm";
import { cn } from "@/lib/utils";

gsap.registerPlugin(Flip);

interface EnterpriseKanbanProps {
  deals: Deal[];
  onMoveDeal: (dealId: string, nextStage: DealStage) => void;
}

const stages: DealStage[] = [
  "Lead",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

export function EnterpriseKanban({
  deals,
  onMoveDeal,
}: EnterpriseKanbanProps): React.JSX.Element {
  const boardRef = useRef<HTMLDivElement>(null);

  const groupedDeals = useMemo(() => {
    return stages.map((stage) => {
      const items = deals.filter((deal) => deal.stage === stage);
      const value = items.reduce((sum, deal) => sum + deal.value, 0);
      return { stage, items, value };
    });
  }, [deals]);

  const boardValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  function cycleStage(deal: Deal): void {
    const index = stages.indexOf(deal.stage);
    const nextStage = stages[(index + 1) % stages.length];
    const root = boardRef.current;
    if (!root) {
      onMoveDeal(deal.id, nextStage);
      return;
    }

    const state = Flip.getState("[data-deal-card]");
    onMoveDeal(deal.id, nextStage);
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.32,
        ease: "power2.inOut",
        absolute: false,
        nested: true,
      });
    });
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="page-eyebrow">Deal flow</p>
          <h1 className="text-3xl font-semibold tracking-tight">Sales pipeline</h1>
          <p className="text-sm text-muted-foreground">
            Stage progression with live health scoring. Click a card to advance.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Board value
            </p>
            <p className="font-mono text-sm font-semibold tabular-nums">
              ${boardValue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Cards
            </p>
            <p className="font-mono text-sm font-semibold tabular-nums">{deals.length}</p>
          </div>
        </div>
      </header>

      <div className="surface rounded-lg p-4 md:p-5">
        <div ref={boardRef} className="grid grid-cols-1 gap-3 2xl:grid-cols-6">
          {groupedDeals.map((column) => (
            <div
              key={column.stage}
              className="rounded-md border border-border/60 bg-muted/25 p-2.5"
            >
              <div className="mb-3 space-y-1.5 px-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold tracking-tight">{column.stage}</h3>
                  <span className="rounded border border-border/70 bg-card px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
                    {column.items.length}
                  </span>
                </div>
                <p className="font-mono text-[10px] tabular-nums text-muted-foreground">
                  ${column.value.toLocaleString()}
                </p>
              </div>
              <div className="min-h-[120px] space-y-2">
                {column.items.map((deal) => (
                  <button
                    type="button"
                    key={deal.id}
                    data-deal-card
                    onClick={() => cycleStage(deal)}
                    className={cn(
                      "focus-ring group w-full rounded-md border border-border/80 bg-card p-3 text-left shadow-[0_1px_0_rgb(15_23_32_/_0.03)] transition-all",
                      "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_24px_-14px_rgb(8_145_178_/_0.45)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium tracking-tight group-hover:text-primary">
                        {deal.companyName}
                      </p>
                      <Avatar initials={deal.ownerInitials} className="h-6 w-6 text-[9px]" />
                    </div>
                    <p className="mt-2 font-mono text-[15px] font-semibold tabular-nums">
                      ${deal.value.toLocaleString()}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <Badge
                        variant={
                          deal.healthScore === "Hot"
                            ? "success"
                            : deal.healthScore === "Warm"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {deal.healthScore}
                      </Badge>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {deal.lastActivity}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
