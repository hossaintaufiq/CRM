"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { LeadInput, LeadStatus } from "@/types/crm";

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: LeadInput) => void;
}

const sources: LeadInput["source"][] = ["Inbound", "Outbound", "Partner", "Referral"];
const statuses: LeadStatus[] = ["New", "Working", "Qualified", "Disqualified"];

export function LeadFormModal({
  open,
  onClose,
  onSubmit,
}: LeadFormModalProps): React.JSX.Element | null {
  const [form, setForm] = useState<LeadInput>({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "Inbound",
    status: "New",
    score: 50,
  });

  if (!open) return null;

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    onSubmit({
      ...form,
      score: Math.min(100, Math.max(0, Number(form.score) || 0)),
    });
    setForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      source: "Inbound",
      status: "New",
      score: 50,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-foreground/30 px-4 pt-16 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="surface w-full max-w-lg rounded-lg p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="page-eyebrow">New lead</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">Add lead</h2>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              POST {API_ENDPOINTS.leads}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Full name
            </span>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Company
            </span>
            <Input
              required
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Score
            </span>
            <Input
              type="number"
              min={0}
              max={100}
              value={form.score}
              onChange={(e) => setForm((f) => ({ ...f, score: Number(e.target.value) }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Email
            </span>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Phone
            </span>
            <Input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Source
            </span>
            <select
              className="focus-ring h-9 w-full rounded-md border border-border/80 bg-card/60 px-3 text-sm"
              value={form.source}
              onChange={(e) =>
                setForm((f) => ({ ...f, source: e.target.value as LeadInput["source"] }))
              }
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Status
            </span>
            <select
              className="focus-ring h-9 w-full rounded-md border border-border/80 bg-card/60 px-3 text-sm"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as LeadStatus }))
              }
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add lead</Button>
        </div>
      </form>
    </div>
  );
}
