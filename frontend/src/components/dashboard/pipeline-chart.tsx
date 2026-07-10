import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const forecast = [
  { label: "W1", value: 42 },
  { label: "W2", value: 55 },
  { label: "W3", value: 61 },
  { label: "W4", value: 58 },
  { label: "W5", value: 72 },
  { label: "W6", value: 76 },
  { label: "W7", value: 84 },
  { label: "W8", value: 91 },
];

export function PipelineChart(): React.JSX.Element {
  return (
    <Card data-animate="stagger-in">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <p className="page-eyebrow mb-2">Forecast</p>
          <CardTitle>Revenue pipeline</CardTitle>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">8-week horizon</p>
      </CardHeader>
      <CardContent>
        <div className="relative h-[260px] overflow-hidden rounded-md border border-border/70 bg-[linear-gradient(180deg,rgb(8_145_178_/_0.06),transparent_55%)] p-5">
          <div
            className="pointer-events-none absolute inset-x-5 top-5 bottom-10 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgb(100 116 139 / 0.25) 1px, transparent 1px)",
              backgroundSize: "100% 25%",
            }}
          />
          <div className="relative grid h-full grid-cols-8 gap-3">
            {forecast.map((bar, index) => (
              <div key={bar.label} className="flex flex-col items-center justify-end gap-2">
                <div
                  className="w-full rounded-sm bg-gradient-to-t from-primary/25 to-primary"
                  style={{ height: `${bar.value}%` }}
                  aria-label={`Forecast bar ${index + 1}`}
                />
                <span className="font-mono text-[10px] text-muted-foreground">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
