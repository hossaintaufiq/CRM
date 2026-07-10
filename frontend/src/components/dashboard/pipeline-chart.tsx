import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { PremiumBarChart } from "@/components/charts/premium-bar-chart";

const forecast = [
  { label: "W1", value: 42, secondary: 48 },
  { label: "W2", value: 55, secondary: 52 },
  { label: "W3", value: 61, secondary: 58 },
  { label: "W4", value: 58, secondary: 64 },
  { label: "W5", value: 72, secondary: 70 },
  { label: "W6", value: 76, secondary: 78 },
  { label: "W7", value: 84, secondary: 82 },
  { label: "W8", value: 91, secondary: 88 },
];

export function PipelineChart(): React.JSX.Element {
  return (
    <Card data-animate="stagger-in" className="overflow-hidden">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <p className="page-eyebrow mb-2">Forecast model</p>
          <CardTitle>Revenue pipeline</CardTitle>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Actual bookings vs. projected close for the next eight weeks.
          </p>
        </div>
        <div className="rounded-md border border-border/70 bg-muted/40 px-2.5 py-1.5 text-right">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Projected
          </p>
          <p className="font-mono text-sm font-semibold tabular-nums text-foreground">$539K</p>
        </div>
      </CardHeader>
      <CardContent>
        <PremiumBarChart
          data={forecast}
          height={280}
          primaryLabel="Booked"
          secondaryLabel="Target"
        />
      </CardContent>
      <CardMeta>
        <span>Confidence band · 92%</span>
        <span>Updated 42s ago</span>
      </CardMeta>
    </Card>
  );
}
