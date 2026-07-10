"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { useCRMData } from "@/hooks/use-crm-data";
import { cn } from "@/lib/utils";

export default function NotificationsPage(): React.JSX.Element {
  const { notifications, markNotificationRead } = useCRMData();
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="page-eyebrow">Inbox</p>
          <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Realtime alerts from deals, leads, and automation runs.
          </p>
        </div>
        <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Unread
          </p>
          <p className="font-mono text-sm font-semibold tabular-nums">{unread}</p>
        </div>
      </header>
      <Card className="overflow-hidden">
        <CardHeader>
          <p className="page-eyebrow mb-2">Hub</p>
          <CardTitle>Event feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-center justify-between gap-4 rounded-md border p-4 transition-colors",
                notification.read
                  ? "border-border/70 bg-muted/10"
                  : "border-primary/25 bg-primary/5",
              )}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {!notification.read ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  ) : null}
                  <p className="font-medium tracking-tight">{notification.title}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
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
        <CardMeta>
          <span>Push channel</span>
          <span>Connected</span>
        </CardMeta>
      </Card>
    </section>
  );
}
