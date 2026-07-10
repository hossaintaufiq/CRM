"use client";

import { useState } from "react";
import type { Deal, DealInput, DealPriority, DealStage, HealthScore } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface DealFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  initial?: Deal | null;
  stages: DealStage[];
  onClose: () => void;
  onSubmit: (input: DealInput) => void;
}

const priorities: DealPriority[] = ["Low", "Medium", "High", "Critical"];
const healthScores: HealthScore[] = ["Hot", "Warm", "Cold"];

function toInput(deal: Deal): DealInput {
  return {
    title: deal.title,
    companyName: deal.companyName,
    value: deal.value,
    currency: deal.currency,
    healthScore: deal.healthScore,
    priority: deal.priority,
    probability: deal.probability,
    ownerName: deal.ownerName,
    stage: deal.stage,
    closeDate: deal.closeDate,
    tags: deal.tags,
    notes: deal.notes,
  };
}

const emptyForm: DealInput = {
  title: "",
  companyName: "",
  value: 25000,
  currency: "USD",
  healthScore: "Warm",
  priority: "Medium",
  probability: 25,
  ownerName: "Avery Blake",
  stage: "Lead",
  closeDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
  tags: [],
  notes: "",
};

export function DealFormModal({
  open,
  mode,
  initial,
  stages,
  onClose,
  onSubmit,
}: DealFormModalProps): React.JSX.Element | null {
  const [form, setForm] = useState<DealInput>(initial ? toInput(initial) : emptyForm);
  const [tagsText, setTagsText] = useState(
    initial ? initial.tags.join(", ") : "",
  );

  if (!open) return null;

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    onSubmit({
      ...form,
      value: Number(form.value) || 0,
      probability: Math.min(100, Math.max(0, Number(form.probability) || 0)),
      tags: tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-foreground/30 px-4 pt-16 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="surface max-h-[85vh] w-full max-w-2xl overflow-auto rounded-lg p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="page-eyebrow">{mode === "create" ? "New opportunity" : "Edit opportunity"}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              {mode === "create" ? "Create deal" : "Update deal"}
            </h2>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              {mode === "create" ? `POST ${API_ENDPOINTS.deals}` : `PATCH ${API_ENDPOINTS.dealById(initial?.id ?? ":id")}`}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-1.5 md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Deal title
            </span>
            <Input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Enterprise expansion"
            />
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Company
            </span>
            <Input
              required
              value={form.companyName}
              onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Owner
            </span>
            <Input
              required
              value={form.ownerName}
              onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Value (USD)
            </span>
            <Input
              type="number"
              min={0}
              required
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Probability %
            </span>
            <Input
              type="number"
              min={0}
              max={100}
              value={form.probability}
              onChange={(e) =>
                setForm((f) => ({ ...f, probability: Number(e.target.value) }))
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Stage
            </span>
            <select
              className="focus-ring h-9 w-full rounded-md border border-border/80 bg-card/60 px-3 text-sm"
              value={form.stage}
              onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as DealStage }))}
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Close date
            </span>
            <Input
              type="date"
              value={form.closeDate}
              onChange={(e) => setForm((f) => ({ ...f, closeDate: e.target.value }))}
            />
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Priority
            </span>
            <select
              className="focus-ring h-9 w-full rounded-md border border-border/80 bg-card/60 px-3 text-sm"
              value={form.priority}
              onChange={(e) =>
                setForm((f) => ({ ...f, priority: e.target.value as DealPriority }))
              }
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Health
            </span>
            <select
              className="focus-ring h-9 w-full rounded-md border border-border/80 bg-card/60 px-3 text-sm"
              value={form.healthScore}
              onChange={(e) =>
                setForm((f) => ({ ...f, healthScore: e.target.value as HealthScore }))
              }
            >
              {healthScores.map((score) => (
                <option key={score} value={score}>
                  {score}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Tags (comma separated)
            </span>
            <Input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="Enterprise, Renewal"
            />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Notes
            </span>
            <textarea
              className="focus-ring min-h-[90px] w-full rounded-md border border-border/80 bg-card/60 px-3 py-2 text-sm"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{mode === "create" ? "Create deal" : "Save changes"}</Button>
        </div>
      </form>
    </div>
  );
}
