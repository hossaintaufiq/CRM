"use client";

import { useState } from "react";
import { ArrowUpRight, Bell, FileText, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { useCRMData } from "@/hooks/use-crm-data";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";

type HubTab = "alerts" | "activity";

function activityIcon(action: string): React.ReactNode {
  if (action.includes("call")) return <Phone className="h-3.5 w-3.5" />;
  if (action.includes("proposal")) return <FileText className="h-3.5 w-3.5" />;
  if (action.includes("converted") || action.includes("moved") || action.includes("created")) {
    return <ArrowUpRight className="h-3.5 w-3.5" />;
  }
  return <UserRound className="h-3.5 w-3.5" />;
}

export default function NotificationsPage(): React.JSX.Element {
  const {
    notifications,
    activities,
    markNotificationRead,
    markAllNotificationsRead,
    summary,
  } = useCRMData();
  const [tab, setTab] = useState<HubTab>("alerts");

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="page-eyebrow">Inbox</p>
          <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Alerts and live activity in one hub. Demo ·{" "}
            <span className="font-mono text-[11px] text-foreground">
              GET {API_ENDPOINTS.notifications} · GET {API_ENDPOINTS.activities}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-md border border-border/80 bg-card/80 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Unread
            </p>
            <p className="font-mono text-sm font-semibold tabular-nums">
              {summary.unreadNotifications}
            </p>
          </div>
          {tab === "alerts" ? (
            <Button variant="outline" onClick={markAllNotificationsRead}>
              Mark all read
            </Button>
          ) : null}
        </div>
      </header>

      <div className="inline-flex rounded-md border border-border/80 bg-muted/30 p-1">
        <Button
          size="sm"
          variant={tab === "alerts" ? "default" : "ghost"}
          onClick={() => setTab("alerts")}
        >
          <Bell className="mr-1.5 h-3.5 w-3.5" />
          Alerts
        </Button>
        <Button
          size="sm"
          variant={tab === "activity" ? "default" : "ghost"}
          onClick={() => setTab("activity")}
        >
          <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
          Activity
        </Button>
      </div>

      {tab === "alerts" ? (
        <Card className="overflow-hidden">
          <CardHeader>
            <p className="page-eyebrow mb-2">Hub</p>
            <CardTitle>Alert feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No alerts yet.</p>
            ) : (
              notifications.map((notification) => (
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
              ))
            )}
          </CardContent>
          <CardMeta>
            <span>POST {API_ENDPOINTS.notificationsReadAll}</span>
            <span>{notifications.length} alerts</span>
          </CardMeta>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader>
            <p className="page-eyebrow mb-2">Signal stream</p>
            <CardTitle>Recent activity</CardTitle>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Deal moves, lead changes, and system events across the workspace.
            </p>
          </CardHeader>
          <CardContent className="space-y-0">
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={cn(
                    "flex gap-3 py-3.5",
                    index < activities.length - 1 && "border-b border-border/60",
                  )}
                >
                  <div className="relative mt-0.5 flex flex-col items-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                      {activityIcon(activity.action)}
                    </span>
                    {index < activities.length - 1 ? (
                      <span className="mt-2 w-px flex-1 bg-gradient-to-b from-border to-transparent" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm leading-snug tracking-tight">
                      <span className="font-semibold">{activity.actor}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-semibold text-primary">{activity.target}</span>
                    </p>
                    <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                      {activity.at}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardMeta>
            <span>GET {API_ENDPOINTS.activities}</span>
            <span>{activities.length} events</span>
          </CardMeta>
        </Card>
      )}
    </section>
  );
}
