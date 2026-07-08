"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCRMData } from "@/hooks/use-crm-data";

export default function NotificationsPage(): React.JSX.Element {
  const { notifications, markNotificationRead } = useCRMData();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Realtime Notification Hub</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between rounded-md border border-border p-4"
            >
              <div>
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
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
