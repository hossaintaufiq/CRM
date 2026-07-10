"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Deal, DealStage } from "@/types/crm";

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
    return stages.map((stage) => ({
      stage,
      items: deals.filter((deal) => deal.stage === stage),
    }));
  }, [deals]);

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
    <section className="space-y-4">
      <header className="space-y-2">
        <p className="page-eyebrow">Deal flow</p>
        <h1 className="text-3xl font-semibold tracking-tight">Sales pipeline</h1>
        <p className="text-sm text-muted-foreground">
          Stage progression with live health scoring. Click a card to advance.
        </p>
      </header>
      <div className="surface rounded-lg p-5">
        <div ref={boardRef} className="grid grid-cols-1 gap-4 2xl:grid-cols-6">
          {groupedDeals.map((column) => (
            <div
              key={column.stage}
              className="rounded-md border border-border/60 bg-muted/30 p-3"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold tracking-tight">{column.stage}</h3>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {column.items.length}
                </span>
              </div>
              <div className="space-y-2">
                {column.items.map((deal) => (
                  <button
                    type="button"
                    key={deal.id}
                    data-deal-card
                    onClick={() => cycleStage(deal)}
                    className="focus-ring w-full rounded-md border border-border/80 bg-card p-3 text-left transition-colors hover:border-primary/35"
                  >
                    <p className="font-medium tracking-tight">{deal.companyName}</p>
                    <p className="mt-1 font-mono text-sm tabular-nums text-foreground">
                      ${deal.value.toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
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
                      <Avatar initials={deal.ownerInitials} className="h-7 w-7 text-[10px]" />
                    </div>
                    <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                      {deal.lastActivity}
                    </p>
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
