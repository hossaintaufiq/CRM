"use client";

import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import {
  Columns3,
  LayoutList,
  Plus,
  Search,
  Settings2,
  Trash2,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DealDetailDrawer } from "@/components/deals/deal-detail-drawer";
import { DealFormModal } from "@/components/deals/deal-form-modal";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";
import type {
  Deal,
  DealInput,
  DealStage,
  HealthScore,
  PipelinePreferences,
  PipelineStageConfig,
} from "@/types/crm";

gsap.registerPlugin(Flip);

interface DealsWorkspaceProps {
  deals: Deal[];
  selectedDeal: Deal | null;
  pipelineStages: PipelineStageConfig[];
  pipelinePreferences: PipelinePreferences;
  onSelectDeal: (dealId: string | null) => void;
  onMoveDeal: (dealId: string, stage: DealStage) => void;
  onCreateDeal: (input: DealInput) => void;
  onUpdateDeal: (dealId: string, patch: Partial<DealInput>) => void;
  onDeleteDeal: (dealId: string) => void;
  onDeleteDeals: (dealIds: string[]) => void;
  onUpdateStages: (stages: PipelineStageConfig[]) => void;
  onUpdatePreferences: (patch: Partial<PipelinePreferences>) => void;
}

type HealthFilter = "All" | HealthScore;

export function DealsWorkspace({
  deals,
  selectedDeal,
  pipelineStages,
  pipelinePreferences,
  onSelectDeal,
  onMoveDeal,
  onCreateDeal,
  onUpdateDeal,
  onDeleteDeal,
  onDeleteDeals,
  onUpdateStages,
  onUpdatePreferences,
}: DealsWorkspaceProps): React.JSX.Element {
  const boardRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const visibleStages = useMemo(
    () =>
      [...pipelineStages]
        .filter((stage) => stage.visible)
        .sort((a, b) => a.order - b.order),
    [pipelineStages],
  );

  const owners = useMemo(
    () => ["All", ...Array.from(new Set(deals.map((d) => d.ownerName))).sort()],
    [deals],
  );

  const filteredDeals = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = deals.filter((deal) => {
      const matchesQuery =
        !q ||
        deal.companyName.toLowerCase().includes(q) ||
        deal.title.toLowerCase().includes(q) ||
        deal.ownerName.toLowerCase().includes(q) ||
        deal.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesOwner = ownerFilter === "All" || deal.ownerName === ownerFilter;
      const matchesHealth = healthFilter === "All" || deal.healthScore === healthFilter;
      return matchesQuery && matchesOwner && matchesHealth;
    });

    next = [...next].sort((a, b) => {
      switch (pipelinePreferences.defaultSort) {
        case "closeDate":
          return a.closeDate.localeCompare(b.closeDate);
        case "priority": {
          const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
          return rank[a.priority] - rank[b.priority];
        }
        case "updatedAt":
          return b.updatedAt.localeCompare(a.updatedAt);
        default:
          return b.value - a.value;
      }
    });

    return next;
  }, [deals, query, ownerFilter, healthFilter, pipelinePreferences.defaultSort]);

  const grouped = useMemo(
    () =>
      visibleStages.map((stage) => {
        const items = filteredDeals.filter((deal) => deal.stage === stage.id);
        return {
          stage,
          items,
          value: items.reduce((sum, deal) => sum + deal.value, 0),
          weighted: items.reduce(
            (sum, deal) => sum + deal.value * (deal.probability / 100),
            0,
          ),
        };
      }),
    [visibleStages, filteredDeals],
  );

  const boardValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = filteredDeals.reduce(
    (sum, deal) => sum + deal.value * (deal.probability / 100),
    0,
  );

  function animateMove(dealId: string, nextStage: DealStage): void {
    const root = boardRef.current;
    if (!root || pipelinePreferences.viewMode !== "board") {
      onMoveDeal(dealId, nextStage);
      return;
    }
    const state = Flip.getState("[data-deal-card]");
    onMoveDeal(dealId, nextStage);
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.32,
        ease: "power2.inOut",
        absolute: false,
        nested: true,
      });
    });
  }

  function toggleRow(id: string): void {
    setSelectedRows((current) =>
      current.includes(id) ? current.filter((row) => row !== id) : [...current, id],
    );
  }

  function openCreate(): void {
    setFormMode("create");
    setFormOpen(true);
  }

  function openEdit(): void {
    setFormMode("edit");
    setFormOpen(true);
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="page-eyebrow">Revenue pipeline</p>
          <h1 className="text-3xl font-semibold tracking-tight">Deals</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Board and list views, stage control, filters, bulk delete, and pipeline
            customization. Demo data now — wired to{" "}
            <span className="font-mono text-[11px] text-foreground">
              {API_ENDPOINTS.deals}
            </span>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Pipeline
            </p>
            <p className="font-mono text-sm font-semibold tabular-nums">
              ${boardValue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Weighted
            </p>
            <p className="font-mono text-sm font-semibold tabular-nums">
              ${Math.round(weightedValue).toLocaleString()}
            </p>
          </div>
          <Button variant="outline" onClick={() => setCustomizeOpen(true)}>
            <Settings2 className="mr-1.5 h-4 w-4" />
            Customize
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            New deal
          </Button>
        </div>
      </header>

      <div className="surface rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company, title, owner, tags..."
            />
          </div>
          <select
            className="focus-ring h-9 rounded-md border border-border/80 bg-card/60 px-3 text-sm"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
          >
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner === "All" ? "All owners" : owner}
              </option>
            ))}
          </select>
          <select
            className="focus-ring h-9 rounded-md border border-border/80 bg-card/60 px-3 text-sm"
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value as HealthFilter)}
          >
            <option value="All">All health</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </select>
          <div className="ml-auto flex items-center gap-1 rounded-md border border-border/80 bg-muted/30 p-1">
            <Button
              size="sm"
              variant={pipelinePreferences.viewMode === "board" ? "default" : "ghost"}
              onClick={() => onUpdatePreferences({ viewMode: "board" })}
            >
              <Columns3 className="mr-1 h-3.5 w-3.5" />
              Board
            </Button>
            <Button
              size="sm"
              variant={pipelinePreferences.viewMode === "list" ? "default" : "ghost"}
              onClick={() => onUpdatePreferences({ viewMode: "list" })}
            >
              <LayoutList className="mr-1 h-3.5 w-3.5" />
              List
            </Button>
          </div>
        </div>

        {selectedRows.length > 0 ? (
          <div className="mt-3 flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2">
            <p className="font-mono text-[11px] text-muted-foreground">
              {selectedRows.length} selected · POST {API_ENDPOINTS.dealsBulkDelete}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive"
              onClick={() => {
                if (window.confirm(`Delete ${selectedRows.length} deals?`)) {
                  onDeleteDeals(selectedRows);
                  setSelectedRows([]);
                }
              }}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete selected
            </Button>
          </div>
        ) : null}
      </div>

      {pipelinePreferences.viewMode === "board" ? (
        <div className="surface rounded-lg p-4 md:p-5">
          <div
            ref={boardRef}
            className="grid grid-cols-1 gap-3 xl:grid-cols-2 2xl:grid-cols-3 min-[1600px]:grid-cols-6"
          >
            {grouped.map((column) => (
              <div
                key={column.stage.id}
                className="rounded-md border border-border/60 bg-muted/25 p-2.5"
              >
                <div className="mb-3 space-y-1.5 px-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: column.stage.color }}
                      />
                      <h3 className="text-sm font-semibold tracking-tight">
                        {column.stage.label}
                      </h3>
                    </div>
                    <span className="rounded border border-border/70 bg-card px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
                      {column.items.length}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    ${column.value.toLocaleString()} · w $
                    {Math.round(column.weighted).toLocaleString()}
                  </p>
                </div>
                <div className="min-h-[140px] space-y-2">
                  {column.items.map((deal) => (
                    <article
                      key={deal.id}
                      data-deal-card
                      className={cn(
                        "group rounded-md border border-border/80 bg-card p-3 shadow-[0_1px_0_rgb(15_23_32_/_0.03)] transition-all",
                        "hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_10px_24px_-14px_rgb(15_20_25_/_0.18)]",
                        pipelinePreferences.compactCards && "p-2.5",
                        selectedDeal?.id === deal.id && "border-primary/50 ring-1 ring-primary/20",
                      )}
                    >
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => onSelectDeal(deal.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium tracking-tight group-hover:text-primary">
                              {deal.companyName}
                            </p>
                            {!pipelinePreferences.compactCards ? (
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {deal.title}
                              </p>
                            ) : null}
                          </div>
                          <Avatar initials={deal.ownerInitials} className="h-6 w-6 text-[9px]" />
                        </div>
                        <p className="mt-2 font-mono text-[15px] font-semibold tabular-nums">
                          ${deal.value.toLocaleString()}
                        </p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
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
                          <span className="rounded border border-border/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                            {deal.priority}
                          </span>
                          {pipelinePreferences.showProbability ? (
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {deal.probability}%
                            </span>
                          ) : null}
                        </div>
                        {pipelinePreferences.showCloseDate ? (
                          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                            Close {deal.closeDate}
                          </p>
                        ) : null}
                        {pipelinePreferences.showTags && deal.tags.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {deal.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </button>
                      <div className="mt-2 border-t border-border/60 pt-2">
                        <select
                          className="focus-ring h-7 w-full rounded border border-border/70 bg-muted/30 px-2 text-[11px]"
                          value={deal.stage}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            animateMove(deal.id, e.target.value as DealStage)
                          }
                        >
                          {pipelineStages.map((stage) => (
                            <option key={stage.id} value={stage.id}>
                              Move to {stage.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="surface overflow-hidden rounded-lg">
          <div className="overflow-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-muted/50 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Select</th>
                  <th className="px-4 py-3">Deal</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Prob.</th>
                  <th className="px-4 py-3">Health</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Close</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => (
                  <tr
                    key={deal.id}
                    className="border-t border-border/70 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(deal.id)}
                        onChange={() => toggleRow(deal.id)}
                        aria-label={`Select ${deal.companyName}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-left"
                        onClick={() => onSelectDeal(deal.id)}
                      >
                        <p className="font-medium tracking-tight hover:text-primary">
                          {deal.companyName}
                        </p>
                        <p className="text-xs text-muted-foreground">{deal.title}</p>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="focus-ring h-8 rounded-md border border-border/80 bg-card/60 px-2 text-xs"
                        value={deal.stage}
                        onChange={(e) =>
                          onMoveDeal(deal.id, e.target.value as DealStage)
                        }
                      >
                        {pipelineStages.map((stage) => (
                          <option key={stage.id} value={stage.id}>
                            {stage.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      ${deal.value.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">{deal.probability}%</td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3">{deal.ownerName}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                      {deal.closeDate}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => onSelectDeal(deal.id)}>
                          Open
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Delete deal"
                          onClick={() => {
                            if (window.confirm(`Delete “${deal.companyName}”?`)) {
                              onDeleteDeal(deal.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>
              {filteredDeals.length} deals · GET {API_ENDPOINTS.deals}
            </span>
            <span>List view</span>
          </div>
        </div>
      )}

      <DealDetailDrawer
        deal={selectedDeal}
        stages={pipelineStages.map((s) => s.id)}
        onClose={() => onSelectDeal(null)}
        onEdit={openEdit}
        onDelete={onDeleteDeal}
        onMoveStage={animateMove}
        onQuickUpdate={onUpdateDeal}
      />

      <DealFormModal
        key={`${formMode}-${selectedDeal?.id ?? "new"}-${formOpen}`}
        open={formOpen}
        mode={formMode}
        initial={formMode === "edit" ? selectedDeal : null}
        stages={pipelineStages.map((s) => s.id)}
        onClose={() => setFormOpen(false)}
        onSubmit={(input) => {
          if (formMode === "edit" && selectedDeal) {
            onUpdateDeal(selectedDeal.id, input);
          } else {
            onCreateDeal(input);
          }
        }}
      />

      {customizeOpen ? (
        <CustomizePanel
          stages={pipelineStages}
          preferences={pipelinePreferences}
          onClose={() => setCustomizeOpen(false)}
          onUpdateStages={onUpdateStages}
          onUpdatePreferences={onUpdatePreferences}
        />
      ) : null}
    </section>
  );
}

function CustomizePanel({
  stages,
  preferences,
  onClose,
  onUpdateStages,
  onUpdatePreferences,
}: {
  stages: PipelineStageConfig[];
  preferences: PipelinePreferences;
  onClose: () => void;
  onUpdateStages: (stages: PipelineStageConfig[]) => void;
  onUpdatePreferences: (patch: Partial<PipelinePreferences>) => void;
}): React.JSX.Element {
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-foreground/30 px-4 pt-16 backdrop-blur-sm">
      <div className="surface w-full max-w-xl rounded-lg p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="page-eyebrow">Pipeline settings</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">Customize deals</h2>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              PUT {API_ENDPOINTS.pipelineStages} · PUT {API_ENDPOINTS.pipelinePreferences}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Visible stages
            </p>
            <div className="space-y-2">
              {stages.map((stage) => (
                <label
                  key={stage.id}
                  className="flex items-center justify-between rounded-md border border-border/70 bg-muted/20 px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    {stage.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={stage.visible}
                    onChange={(e) =>
                      onUpdateStages(
                        stages.map((s) =>
                          s.id === stage.id ? { ...s, visible: e.target.checked } : s,
                        ),
                      )
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              [
                ["compactCards", "Compact cards"],
                ["showProbability", "Show probability"],
                ["showCloseDate", "Show close date"],
                ["showTags", "Show tags"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center justify-between rounded-md border border-border/70 bg-muted/20 px-3 py-2 text-sm"
              >
                {label}
                <input
                  type="checkbox"
                  checked={preferences[key]}
                  onChange={(e) => onUpdatePreferences({ [key]: e.target.checked })}
                />
              </label>
            ))}
          </div>

          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Default sort
            </span>
            <select
              className="focus-ring h-9 w-full rounded-md border border-border/80 bg-card/60 px-3 text-sm"
              value={preferences.defaultSort}
              onChange={(e) =>
                onUpdatePreferences({
                  defaultSort: e.target.value as PipelinePreferences["defaultSort"],
                })
              }
            >
              <option value="value">Deal value</option>
              <option value="closeDate">Close date</option>
              <option value="priority">Priority</option>
              <option value="updatedAt">Recently updated</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}
