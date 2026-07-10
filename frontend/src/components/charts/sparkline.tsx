"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  className?: string;
  height?: number;
  strokeWidth?: number;
  showArea?: boolean;
  tone?: "primary" | "success" | "warning";
}

const toneStroke: Record<NonNullable<SparklineProps["tone"]>, string> = {
  primary: "rgb(148 118 74)",
  success: "rgb(12 128 92)",
  warning: "rgb(168 108 24)",
};

export function Sparkline({
  data,
  className,
  height = 40,
  strokeWidth = 1.75,
  showArea = true,
  tone = "primary",
}: SparklineProps): React.JSX.Element {
  const reactId = useId().replace(/:/g, "");
  const width = 120;
  const pad = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(max - min, 1);

  const points = data.map((value, index) => {
    const x = pad + (index / Math.max(data.length - 1, 1)) * (width - pad * 2);
    const y = height - pad - ((value - min) / range) * (height - pad * 2);
    return { x, y };
  });

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${points[points.length - 1].x.toFixed(2)} ${height} L${points[0].x.toFixed(2)} ${height} Z`;
  const last = points[points.length - 1];
  const gradientId = `spark-${reactId}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={toneStroke[tone]} stopOpacity="0.28" />
          <stop offset="100%" stopColor={toneStroke[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showArea ? <path d={area} fill={`url(#${gradientId})`} /> : null}
      <path
        d={line}
        fill="none"
        stroke={toneStroke[tone]}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last.x} cy={last.y} r="2.5" fill={toneStroke[tone]} />
      <circle cx={last.x} cy={last.y} r="5" fill={toneStroke[tone]} opacity="0.18" />
    </svg>
  );
}
