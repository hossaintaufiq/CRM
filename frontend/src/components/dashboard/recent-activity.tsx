import { ArrowUpRight, FileText, Phone, UserRound } from "lucide-react";
import type { Activity } from "@/types/crm";
import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  activities: Activity[];
}

function activityIcon(action: string): React.ReactNode {
  if (action.includes("call")) return <Phone className="h-3.5 w-3.5" />;
  if (action.includes("proposal")) return <FileText className="h-3.5 w-3.5" />;
  if (action.includes("converted")) return <ArrowUpRight className="h-3.5 w-3.5" />;
  return <UserRound className="h-3.5 w-3.5" />;
}

export function RecentActivity({
  activities,
}: RecentActivityProps): React.JSX.Element {
  return (
    <Card data-animate="stagger-in" className="flex h-full flex-col overflow-hidden">
      <CardHeader>
        <p className="page-eyebrow mb-2">Signal stream</p>
        <CardTitle>Recent activity</CardTitle>
        <p className="mt-1.5 text-sm text-muted-foreground">
          High-signal GTM events across the workspace.
        </p>
      </CardHeader>
      <CardContent className="flex-1 space-y-0">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              "group relative flex gap-3 py-3.5",
              index < activities.length - 1 && "border-b border-border/60",
            )}
          >
            <div className="relative mt-0.5 flex flex-col items-center">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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
        ))}
      </CardContent>
      <CardMeta>
        <span>{activities.length} events</span>
        <span>Realtime</span>
      </CardMeta>
    </Card>
  );
}
