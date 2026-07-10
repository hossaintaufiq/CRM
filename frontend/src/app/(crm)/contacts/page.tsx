"use client";

import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useCRMData } from "@/hooks/use-crm-data";

export default function ContactsPage(): React.JSX.Element {
  const { contacts } = useCRMData();

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="page-eyebrow">Directory</p>
          <h1 className="text-3xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground">
            Account stakeholders mapped to owners and roles.
          </p>
        </div>
        <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Records
          </p>
          <p className="font-mono text-sm font-semibold tabular-nums">{contacts.length}</p>
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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Owner</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-border/70 transition-colors last:border-0 hover:bg-muted/30"
                >
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
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
        <CardMeta>
          <span>Directory sync</span>
          <span>Active</span>
        </CardMeta>
      </Card>
    </section>
  );
}
