import type { Activity } from "@/types/crm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({
  activities,
}: RecentActivityProps): React.JSX.Element {
  return (
    <Card data-animate="stagger-in">
      <CardHeader>
        <CardTitle>Recent Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="rounded-md border border-border bg-background p-3"
          >
            <p className="text-sm">
              <span className="font-semibold">{activity.actor}</span> {activity.action}{" "}
              <span className="font-semibold">{activity.target}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{activity.at}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
