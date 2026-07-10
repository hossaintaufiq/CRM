"use client";

import { useMemo, useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Mail, NotebookPen, Phone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LeadFormModal } from "@/components/leads/lead-form-modal";
import type { Lead, LeadInput, LeadStatus } from "@/types/crm";
import { cn } from "@/lib/utils";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface LeadManagementGridProps {
  leads: Lead[];
  selectedLead: Lead | null;
  onSelectLead: (leadId: string) => void;
  onCloseDetail: () => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onCreateLead: (input: LeadInput) => void;
  onDeleteLead: (leadId: string) => void;
  onDeleteLeads: (leadIds: string[]) => void;
}

function scoreTone(score: number): "success" | "warning" | "destructive" {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "destructive";
}

export function LeadManagementGrid({
  leads,
  selectedLead,
  onSelectLead,
  onCloseDetail,
  onUpdateLeadStatus,
  onCreateLead,
  onDeleteLead,
  onDeleteLeads,
}: LeadManagementGridProps): React.JSX.Element {
  const drawerRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "name" | "lastTouch">("score");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  const sortedLeads = useMemo(() => {
    const filtered = leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(query.toLowerCase()) ||
        lead.company.toLowerCase().includes(query.toLowerCase()),
    );
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "lastTouch") return a.lastTouch.localeCompare(b.lastTouch);
      return b.score - a.score;
    });
  }, [leads, query, sortBy]);

  const avgScore =
    leads.length > 0
      ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length)
      : 0;

  function toggleRow(id: string): void {
    setSelectedRows((current) =>
      current.includes(id) ? current.filter((row) => row !== id) : [...current, id],
    );
  }

  useLayoutEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) {
      return;
    }

    const ctx = gsap.context(() => {
      if (selectedLead) {
        gsap.fromTo(
          "[data-lead-overlay]",
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: "power2.out" },
        );
        gsap.fromTo(
          drawer,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.3, ease: "power2.out" },
        );
        gsap.fromTo(
          "[data-lead-item]",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.2, delay: 0.08 },
        );
      } else {
        gsap.to(drawer, { xPercent: 100, duration: 0.25, ease: "power2.inOut" });
      }
    });

    return () => {
      ctx.revert();
    };
  }, [selectedLead]);

  return (
    <section className="relative space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="page-eyebrow">Inbound engine</p>
          <h1 className="text-3xl font-semibold tracking-tight">Lead management</h1>
        <p className="text-sm text-muted-foreground">
          Score, qualify, delete, and action high-intent accounts. Demo data ·{" "}
          <span className="font-mono text-[11px] text-foreground">
            GET/POST {API_ENDPOINTS.leads}
          </span>
        </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Leads
            </p>
            <p className="font-mono text-sm font-semibold tabular-nums">{leads.length}</p>
          </div>
          <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Avg score
            </p>
            <p className="font-mono text-sm font-semibold tabular-nums">{avgScore}</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add lead
          </Button>
        </div>
      </header>

      <div className="surface relative rounded-lg p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search leads or companies"
            className="max-w-xs"
          />
          <select
            className="focus-ring h-9 rounded-md border border-border/80 bg-card/60 px-3 text-sm"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as "score" | "name" | "lastTouch")
            }
          >
            <option value="score">Sort by score</option>
            <option value="name">Sort by name</option>
            <option value="lastTouch">Sort by last touch</option>
          </select>
          <p className="ml-auto font-mono text-[11px] text-muted-foreground">
            {selectedRows.length} selected · {sortedLeads.length} shown
          </p>
          {selectedRows.length > 0 ? (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive"
              onClick={() => {
                if (window.confirm(`Delete ${selectedRows.length} leads?`)) {
                  onDeleteLeads(selectedRows);
                  setSelectedRows([]);
                }
              }}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete selected
            </Button>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-md border border-border/80">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Select</th>
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Last Touch</th>
              <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
            <tbody>
              {sortedLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className={cn(
                    "border-t border-border/70 transition-colors hover:bg-muted/35",
                    selectedLead?.id === lead.id && "bg-primary/5",
                  )}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(lead.id)}
                      onChange={() => toggleRow(lead.id)}
                      aria-label={`Select ${lead.name}`}
                      className="accent-[rgb(8_145_178)]"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onSelectLead(lead.id)}
                      className="text-left"
                    >
                      <p className="font-medium tracking-tight hover:text-primary">
                        {lead.name}
                      </p>
                    </button>
                    <p className="text-xs text-muted-foreground">{lead.company}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      {lead.source}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <select
                      value={lead.status}
                      className="focus-ring h-8 rounded-md border border-border/80 bg-card/60 px-2 text-xs"
                      onChange={(event) =>
                        onUpdateLeadStatus(lead.id, event.target.value as LeadStatus)
                      }
                    >
                      <option value="New">New</option>
                      <option value="Working">Working</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Disqualified">Disqualified</option>
                    </select>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold tabular-nums">
                        {lead.score}
                      </span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            scoreTone(lead.score) === "success" && "bg-success",
                            scoreTone(lead.score) === "warning" && "bg-warning",
                            scoreTone(lead.score) === "destructive" && "bg-destructive",
                          )}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                    {lead.lastTouch}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" aria-label="Email lead">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" aria-label="Call lead">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" aria-label="Log note">
                        <NotebookPen className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Delete lead"
                        onClick={() => {
                          if (window.confirm(`Delete lead “${lead.name}”?`)) {
                            onDeleteLead(lead.id);
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

        {selectedLead ? (
          <>
            <button
              type="button"
              data-lead-overlay
              className="absolute inset-0 z-10 bg-foreground/25 backdrop-blur-[2px]"
              aria-label="Close lead detail"
              onClick={onCloseDetail}
            />
            <aside
              ref={drawerRef}
              className="absolute right-0 top-0 z-20 h-full w-[400px] border-l border-border bg-card/98 p-5 shadow-2xl backdrop-blur-xl"
            >
              <p className="page-eyebrow">Lead dossier</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                DELETE {API_ENDPOINTS.leadById(selectedLead.id)}
              </p>
              <div className="mt-2 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{selectedLead.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedLead.company}</p>
                </div>
                <Badge variant={scoreTone(selectedLead.score)}>{selectedLead.score}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md border border-border/70 bg-muted/25 p-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-medium">{selectedLead.status}</p>
                </div>
                <div className="rounded-md border border-border/70 bg-muted/25 p-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    Source
                  </p>
                  <p className="mt-1 text-sm font-medium">{selectedLead.source}</p>
                </div>
              </div>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Timeline
              </p>
              <div className="mt-2 space-y-2">
                {selectedLead.timeline.map((item, index) => (
                  <div
                    key={item}
                    data-lead-item
                    className="relative rounded-md border border-border/70 bg-muted/30 p-3 pl-4 text-sm"
                  >
                    <span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-primary" />
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Event {index + 1}
                    </p>
                    <p className="mt-1">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full text-destructive"
                  onClick={() => {
                    if (window.confirm(`Delete lead “${selectedLead.name}”?`)) {
                      onDeleteLead(selectedLead.id);
                      onCloseDetail();
                    }
                  }}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete lead
                </Button>
              </div>
            </aside>
          </>
        ) : null}
      </div>

      <LeadFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={onCreateLead}
      />
    </section>
  );
}
