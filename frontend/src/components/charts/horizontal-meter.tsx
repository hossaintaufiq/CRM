import { cn } from "@/lib/utils";

export type MeterTone = "primary" | "success" | "warning" | "muted";

interface Segment {
  label: string;
  value: number;
  tone?: MeterTone;
}

interface HorizontalMeterProps {
  segments: Segment[];
  className?: string;
  totalLabel?: string;
}

const toneClass: Record<NonNullable<Segment["tone"]>, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  muted: "bg-muted-foreground/35",
};

export function HorizontalMeter({
  segments,
  className,
  totalLabel,
}: HorizontalMeterProps): React.JSX.Element {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-muted/70">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={cn("h-full first:rounded-l-full last:rounded-r-full", toneClass[segment.tone ?? "primary"])}
            style={{ width: `${(segment.value / total) * 100}%` }}
            title={`${segment.label}: ${segment.value}`}
          />
        ))}
      </div>
      <div className="grid gap-2">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-sm", toneClass[segment.tone ?? "primary"])} />
              <span className="text-muted-foreground">{segment.label}</span>
            </div>
            <span className="font-mono text-[12px] tabular-nums text-foreground">
              {segment.value.toLocaleString()}
              <span className="ml-2 text-muted-foreground">
                {Math.round((segment.value / total) * 100)}%
              </span>
            </span>
          </div>
        ))}
      </div>
      {totalLabel ? (
        <p className="font-mono text-[11px] text-muted-foreground">{totalLabel}</p>
      ) : null}
    </div>
  );
}
