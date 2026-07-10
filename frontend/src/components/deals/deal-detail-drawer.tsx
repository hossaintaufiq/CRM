"use client";

import { Trash2, X } from "lucide-react";
import type { Deal, DealInput, DealStage } from "@/types/crm";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface DealDetailDrawerProps {
  deal: Deal | null;
  stages: DealStage[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: (dealId: string) => void;
  onMoveStage: (dealId: string, stage: DealStage) => void;
  onQuickUpdate: (dealId: string, patch: Partial<DealInput>) => void;
}

export function DealDetailDrawer({
  deal,
  stages,
  onClose,
  onEdit,
  onDelete,
  onMoveStage,
  onQuickUpdate,
}: DealDetailDrawerProps): React.JSX.Element | null {
  if (!deal) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-30 bg-foreground/25 backdrop-blur-[2px]"
        aria-label="Close deal detail"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-border bg-card/98 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-border/70 p-5">
          <div>
            <p className="page-eyebrow">Opportunity</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">{deal.title}</h2>
            <p className="text-sm text-muted-foreground">{deal.companyName}</p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              GET/PATCH/DELETE {API_ENDPOINTS.dealById(deal.id)}
            </p>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-5 overflow-auto p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-border/70 bg-muted/25 p-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Value
              </p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums">
                ${deal.value.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md border border-border/70 bg-muted/25 p-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Weighted
              </p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums">
                ${Math.round(deal.value * (deal.probability / 100)).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar initials={deal.ownerInitials} />
              <div>
                <p className="text-sm font-medium">{deal.ownerName}</p>
                <p className="font-mono text-[10px] text-muted-foreground">Owner</p>
              </div>
            </div>
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
          </div>

          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Stage · PATCH {API_ENDPOINTS.dealStage(deal.id)}
            </span>
            <select
              className="focus-ring h-9 w-full rounded-md border border-border/80 bg-card/60 px-3 text-sm"
              value={deal.stage}
              onChange={(e) => onMoveStage(deal.id, e.target.value as DealStage)}
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Probability
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={deal.probability}
                className="w-full accent-[rgb(148_118_74)]"
                onChange={(e) =>
                  onQuickUpdate(deal.id, { probability: Number(e.target.value) })
                }
              />
              <p className="font-mono text-xs tabular-nums">{deal.probability}%</p>
            </label>
            <div className="rounded-md border border-border/70 bg-muted/20 p-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Close date
              </p>
              <p className="mt-1 font-mono text-sm">{deal.closeDate}</p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Priority
              </p>
              <p className="mt-1 text-sm font-medium">{deal.priority}</p>
            </div>
          </div>

          {deal.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {deal.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-border/70 bg-muted/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Notes
            </p>
            <p className="mt-2 rounded-md border border-border/70 bg-muted/20 p-3 text-sm leading-relaxed">
              {deal.notes || "No notes yet."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-muted-foreground">
            <p>Created {new Date(deal.createdAt).toLocaleDateString()}</p>
            <p className="text-right">Updated {new Date(deal.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex gap-2 border-t border-border/70 p-5">
          <Button className="flex-1" onClick={onEdit}>
            Edit deal
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (window.confirm(`Delete deal “${deal.companyName}”?`)) {
                onDelete(deal.id);
                onClose();
              }
            }}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            Delete
          </Button>
        </div>
      </aside>
    </>
  );
}
