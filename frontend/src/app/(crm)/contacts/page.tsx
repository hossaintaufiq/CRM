"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ContactFormModal } from "@/components/contacts/contact-form-modal";
import { useCRMData } from "@/hooks/use-crm-data";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export default function ContactsPage(): React.JSX.Element {
  const { contacts, createContact, deleteContact, deleteContacts } = useCRMData();
  const [selected, setSelected] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  function toggle(id: string): void {
    setSelected((current) =>
      current.includes(id) ? current.filter((row) => row !== id) : [...current, id],
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="page-eyebrow">Directory</p>
          <h1 className="text-3xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground">
            Add and delete account stakeholders. Demo ·{" "}
            <span className="font-mono text-[11px] text-foreground">
              POST/DELETE {API_ENDPOINTS.contacts}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Records
            </p>
            <p className="font-mono text-sm font-semibold tabular-nums">{contacts.length}</p>
          </div>
          {selected.length > 0 ? (
            <Button
              variant="outline"
              className="text-destructive"
              onClick={() => {
                if (window.confirm(`Delete ${selected.length} contacts?`)) {
                  deleteContacts(selected);
                  setSelected([]);
                }
              }}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete selected
            </Button>
          ) : null}
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add contact
          </Button>
        </div>
      </header>
      <Card className="overflow-hidden">
        <CardHeader>
          <p className="page-eyebrow mb-2">Roster</p>
          <CardTitle>Account contacts</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-border bg-muted/50 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Select</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-border/70 transition-colors last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.includes(contact.id)}
                      onChange={() => toggle(contact.id)}
                      aria-label={`Select ${contact.name}`}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        initials={contact.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                        className="h-7 w-7 text-[9px]"
                      />
                      <span className="font-medium tracking-tight">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">{contact.company}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{contact.role}</td>
                  <td className="px-4 py-3.5 font-mono text-[12px] text-muted-foreground">
                    {contact.email}
                  </td>
                  <td className="px-4 py-3.5">{contact.owner}</td>
                  <td className="px-4 py-3.5">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete contact"
                      onClick={() => {
                        if (window.confirm(`Delete “${contact.name}”?`)) {
                          deleteContact(contact.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
        <CardMeta>
          <span>POST {API_ENDPOINTS.contacts} · DELETE {API_ENDPOINTS.contactById(":id")}</span>
          <span>Active</span>
        </CardMeta>
      </Card>

      <ContactFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={createContact}
      />
    </section>
  );
}
