"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCRMData } from "@/hooks/use-crm-data";

export default function ContactsPage(): React.JSX.Element {
  const { contacts } = useCRMData();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="page-eyebrow">Directory</p>
        <h1 className="text-3xl font-semibold tracking-tight">Contacts</h1>
        <p className="text-sm text-muted-foreground">
          Account stakeholders mapped to owners and roles.
        </p>
      </header>
      <Card>
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
                  <td className="px-4 py-3 font-medium tracking-tight">{contact.name}</td>
                  <td className="px-4 py-3">{contact.company}</td>
                  <td className="px-4 py-3">{contact.role}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground">
                    {contact.email}
                  </td>
                  <td className="px-4 py-3">{contact.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
}
