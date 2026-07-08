"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage(): React.JSX.Element {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Organization Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm text-muted-foreground">Organization Name</span>
            <Input defaultValue="Northstar Ventures" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-muted-foreground">Default Currency</span>
            <Input defaultValue="USD" />
          </label>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
