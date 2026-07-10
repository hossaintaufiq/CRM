"use client";

import { useMemo, useState, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Mail, NotebookPen, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Lead, LeadStatus } from "@/types/crm";

interface LeadManagementGridProps {
  leads: Lead[];
  selectedLead: Lead | null;
  onSelectLead: (leadId: string) => void;
  onCloseDetail: () => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
}

export function LeadManagementGrid({
  leads,
  selectedLead,
  onSelectLead,
  onCloseDetail,
  onUpdateLeadStatus,
}: LeadManagementGridProps): React.JSX.Element {
  const drawerRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "name" | "lastTouch">("score");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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
    <section className="relative space-y-4">
      <header className="space-y-2">
        <p className="page-eyebrow">Inbound engine</p>
        <h1 className="text-3xl font-semibold tracking-tight">Lead management</h1>
        <p className="text-sm text-muted-foreground">
          Score, qualify, and action high-intent accounts from one grid.
        </p>
      </header>
      <div className="surface relative rounded-lg p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search leads or companies"
            className="max-w-xs"
          />
          <select
            className="focus-ring h-9 rounded-md border border-border bg-background px-3 text-sm"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as "score" | "name" | "lastTouch")
            }
          >
            <option value="score">Sort by score</option>
            <option value="name">Sort by name</option>
            <option value="lastTouch">Sort by last touch</option>
          </select>
          <p className="font-mono text-[11px] text-muted-foreground">
            {selectedRows.length} selected
          </p>
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
                className="cursor-pointer border-t border-border hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(lead.id)}
                    onChange={() => toggleRow(lead.id)}
                    aria-label={`Select ${lead.name}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectLead(lead.id)}
                    className="text-left"
                  >
                    <p className="font-medium">{lead.name}</p>
                  </button>
                  <p className="text-xs text-muted-foreground">{lead.company}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    className="focus-ring h-8 rounded-md border border-border bg-background px-2 text-xs"
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
                <td className="px-4 py-3 font-mono tabular-nums">{lead.score}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                  {lead.lastTouch}
                </td>
                <td className="px-4 py-3">
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
            className="absolute inset-0 z-10 bg-black/30"
            aria-label="Close lead detail"
            onClick={onCloseDetail}
          />
          <aside
            ref={drawerRef}
            className="absolute right-0 top-0 z-20 h-full w-[380px] border-l border-border bg-card/95 p-5 shadow-2xl backdrop-blur-xl"
          >
            <p className="page-eyebrow">Lead dossier</p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">{selectedLead.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedLead.company}</p>
            <div className="mt-4 space-y-2">
              {selectedLead.timeline.map((item) => (
                <div
                  key={item}
                  data-lead-item
                  className="rounded-md border border-border/70 bg-muted/40 p-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </>
      ) : null}
      </div>
    </section>
  );
}
