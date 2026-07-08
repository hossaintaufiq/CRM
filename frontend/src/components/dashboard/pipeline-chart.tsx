import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PipelineChart(): React.JSX.Element {
  return (
    <Card data-animate="stagger-in">
      <CardHeader>
        <CardTitle>Revenue Pipeline Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] rounded-md border border-dashed border-border bg-muted/50 p-5">
          <div className="grid h-full grid-cols-8 gap-3">
            {[42, 55, 61, 58, 72, 76, 84, 91].map((value, index) => (
              <div key={index} className="flex items-end">
                <div
                  className="w-full rounded-md bg-primary/30"
                  style={{ height: `${value}%` }}
                  aria-label={`Forecast bar ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
