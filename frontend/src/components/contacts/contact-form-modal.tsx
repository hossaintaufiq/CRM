"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ContactInput } from "@/types/crm";

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: ContactInput) => void;
}

export function ContactFormModal({
  open,
  onClose,
  onSubmit,
}: ContactFormModalProps): React.JSX.Element | null {
  const [form, setForm] = useState<ContactInput>({
    name: "",
    company: "",
    role: "",
    email: "",
    phone: "",
    owner: "Avery Blake",
  });

  if (!open) return null;

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    onSubmit(form);
    setForm({
      name: "",
      company: "",
      role: "",
      email: "",
      phone: "",
      owner: "Avery Blake",
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
            <p className="page-eyebrow">New contact</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">Add contact</h2>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              POST {API_ENDPOINTS.contacts}
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
              Role
            </span>
            <Input
              required
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
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
          <label className="space-y-1.5 sm:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Owner
            </span>
            <Input
              required
              value={form.owner}
              onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add contact</Button>
        </div>
      </form>
    </div>
  );
}
