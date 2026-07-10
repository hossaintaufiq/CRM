"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCRMData } from "@/hooks/use-crm-data";

export default function NotificationsPage(): React.JSX.Element {
  const { notifications, markNotificationRead } = useCRMData();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="page-eyebrow">Inbox</p>
        <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Realtime alerts from deals, leads, and automation runs.
        </p>
      </header>
      <Card>
        <CardHeader>
          <p className="page-eyebrow mb-2">Hub</p>
          <CardTitle>Event feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between gap-4 rounded-md border border-border/70 bg-muted/15 p-4"
            >
              <div>
                <p className="font-medium tracking-tight">{notification.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
              <Button
                variant={notification.read ? "secondary" : "default"}
                size="sm"
                onClick={() => markNotificationRead(notification.id)}
              >
                {notification.read ? "Read" : "Mark as read"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
