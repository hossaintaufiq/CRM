"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage(): React.JSX.Element {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="page-eyebrow">Configuration</p>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Workspace defaults and organization preferences.
        </p>
      </header>
      <Card>
        <CardHeader>
          <p className="page-eyebrow mb-2">Workspace</p>
          <CardTitle>Organization preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Organization name
            </span>
            <Input defaultValue="Northstar Ventures" />
          </label>
          <label className="block space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Default currency
            </span>
            <Input defaultValue="USD" />
          </label>
          <div className="flex justify-end">
            <Button>Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
