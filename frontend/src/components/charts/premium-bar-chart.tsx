"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export interface ChartSeriesPoint {
  label: string;
  value: number;
  secondary?: number;
}

interface PremiumBarChartProps {
  data: ChartSeriesPoint[];
  className?: string;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export function PremiumBarChart({
  data,
  className,
  height = 260,
  valuePrefix = "$",
  valueSuffix = "K",
  primaryLabel = "Actual",
  secondaryLabel = "Forecast",
}: PremiumBarChartProps): React.JSX.Element {
  const [active, setActive] = useState<number | null>(null);
  const gradientId = useId();
  const max = Math.max(...data.flatMap((d) => [d.value, d.secondary ?? 0]), 1);
  const chartHeight = height - 48;

  const ticks = useMemo(() => {
    return [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(max * ratio));
  }, [max]);

  const activePoint = active !== null ? data[active] : null;

  return (
    <div className={cn("chart-panel relative p-4 pt-5", className)} style={{ height }}>
      <div className="relative z-[1] mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-sm bg-primary" />
            {primaryLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-sm bg-primary/25" />
            {secondaryLabel}
          </span>
        </div>
        {activePoint ? (
          <p className="font-mono text-[11px] text-foreground">
            {activePoint.label}: {valuePrefix}
            {activePoint.value}
            {valueSuffix}
            {activePoint.secondary !== undefined ? (
              <span className="text-muted-foreground">
                {" "}
                / {valuePrefix}
                {activePoint.secondary}
                {valueSuffix}
              </span>
            ) : null}
          </p>
        ) : (
          <p className="font-mono text-[11px] text-muted-foreground">Hover for detail</p>
        )}
      </div>

      <div className="relative z-[1] flex h-[calc(100%-2rem)] gap-3">
        <div className="flex w-8 flex-col justify-between pb-6 text-right font-mono text-[9px] text-muted-foreground">
          {[...ticks].reverse().map((tick) => (
            <span key={tick}>
              {valuePrefix}
              {tick}
              {valueSuffix}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          <div className="absolute inset-x-0 top-0 bottom-6">
            {ticks.map((tick) => (
              <div
                key={tick}
                className="absolute inset-x-0 border-t border-border/40"
                style={{ bottom: `${(tick / max) * 100}%` }}
              />
            ))}
          </div>

          <div
            className="absolute inset-x-0 top-0 bottom-6 grid items-end gap-2"
            style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
          >
            {data.map((point, index) => {
              const primaryH = (point.value / max) * chartHeight;
              const secondaryH = ((point.secondary ?? 0) / max) * chartHeight;
              const isActive = active === index;

              return (
                <button
                  type="button"
                  key={point.label}
                  className="group relative flex h-full items-end justify-center gap-1 focus:outline-none"
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(index)}
                  onBlur={() => setActive(null)}
                  aria-label={`${point.label}: ${point.value}`}
                >
                  {point.secondary !== undefined ? (
                    <span
                      className={cn(
                        "w-[38%] rounded-t-sm bg-primary/20 transition-all duration-300",
                        isActive && "bg-primary/35",
                      )}
                      style={{ height: Math.max(secondaryH, 4) }}
                    />
                  ) : null}
                  <span
                    className={cn(
                      "w-[42%] rounded-t-sm bg-gradient-to-t from-primary/70 to-primary shadow-[0_-6px_16px_-8px_rgb(148_118_74_/_0.35)] transition-all duration-300",
                      isActive && "from-primary to-gold brightness-105",
                    )}
                    style={{
                      height: Math.max(primaryH, 4),
                      backgroundImage: `linear-gradient(180deg, rgb(148 118 74), rgb(15 20 25 / 0.75))`,
                    }}
                  />
                </button>
              );
            })}
          </div>

          <div
            className="absolute inset-x-0 bottom-0 grid gap-2"
            style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
          >
            {data.map((point) => (
              <span
                key={point.label}
                className="text-center font-mono text-[11px] font-medium text-muted-foreground"
              >
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <svg width="0" height="0" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(148 118 74)" />
            <stop offset="100%" stopColor="rgb(148 118 74)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
