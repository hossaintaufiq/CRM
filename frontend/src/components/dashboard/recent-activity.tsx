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
        <p className="page-eyebrow mb-2">Signal stream</p>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="relative border-b border-border/70 py-3 last:border-0 last:pb-0 first:pt-0"
          >
            <div className="flex gap-3">
              <div className="mt-1.5 flex flex-col items-center">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {index < activities.length - 1 ? (
                  <span className="mt-1 w-px flex-1 bg-border" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug">
                  <span className="font-semibold">{activity.actor}</span> {activity.action}{" "}
                  <span className="font-semibold text-primary">{activity.target}</span>
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {activity.at}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
