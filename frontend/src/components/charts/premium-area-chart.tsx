"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface AreaSeriesPoint {
  label: string;
  value: number;
}

interface PremiumAreaChartProps {
  data: AreaSeriesPoint[];
  className?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
}

export function PremiumAreaChart({
  data,
  className,
  height = 180,
  valueFormatter = (v) => String(v),
}: PremiumAreaChartProps): React.JSX.Element {
  const gradientId = useId();
  const [active, setActive] = useState<number | null>(null);
  const width = 560;
  const padX = 8;
  const padY = 12;
  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const range = Math.max(max - min, 1);

  const points = useMemo(() => {
    return data.map((point, index) => {
      const x = padX + (index / Math.max(data.length - 1, 1)) * (width - padX * 2);
      const y = height - padY - ((point.value - min) / range) * (height - padY * 2);
      return { ...point, x, y };
    });
  }, [data, height, min, range]);

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${points[points.length - 1].x.toFixed(2)} ${height} L${points[0].x.toFixed(2)} ${height} Z`;
  const activePoint = active !== null ? points[active] : null;

  return (
    <div className={cn("chart-panel relative p-3", className)}>
      <div className="relative z-[1] mb-2 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Trend
        </p>
        <p className="font-mono text-[11px] tabular-nums text-foreground">
          {activePoint
            ? `${activePoint.label} · ${valueFormatter(activePoint.value)}`
            : valueFormatter(data[data.length - 1]?.value ?? 0)}
        </p>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="relative z-[1] h-[160px] w-full overflow-visible"
        onMouseLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(148 118 74)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="rgb(148 118 74)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={padX}
            x2={width - padX}
            y1={padY + ratio * (height - padY * 2)}
            y2={padY + ratio * (height - padY * 2)}
            stroke="rgb(100 116 139 / 0.25)"
            strokeDasharray="3 4"
          />
        ))}
        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          stroke="rgb(148 118 74)"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <g key={point.label}>
            <circle
              cx={point.x}
              cy={point.y}
              r={active === index ? 4.5 : 3}
              fill="rgb(148 118 74)"
              className="transition-all"
            />
            <rect
              x={point.x - (width / data.length) / 2}
              y={0}
              width={width / data.length}
              height={height}
              fill="transparent"
              onMouseEnter={() => setActive(index)}
            />
          </g>
        ))}
      </svg>
      <div className="relative z-[1] mt-1 flex justify-between px-1 font-mono text-[10px] text-muted-foreground">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
