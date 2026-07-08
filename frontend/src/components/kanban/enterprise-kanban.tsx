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
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-4 text-lg font-semibold">Enterprise Sales Pipeline</h2>
      <div
        ref={boardRef}
        className="grid grid-cols-1 gap-4 2xl:grid-cols-6"
      >
        {groupedDeals.map((column) => (
          <div key={column.stage} className="rounded-md bg-muted/40 p-3">
            <h3 className="mb-3 text-sm font-semibold">{column.stage}</h3>
            <div className="space-y-2">
              {column.items.map((deal) => (
                <button
                  type="button"
                  key={deal.id}
                  data-deal-card
                  onClick={() => cycleStage(deal)}
                  className="focus-ring w-full rounded-md border border-border bg-card p-3 text-left"
                >
                  <p className="font-medium">{deal.companyName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
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
                  <p className="mt-2 text-xs text-muted-foreground">{deal.lastActivity}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
