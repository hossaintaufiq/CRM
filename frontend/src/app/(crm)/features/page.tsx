"use client";

import { useMemo, useState } from "react";
import { Crown, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import {
  FEATURE_CATALOG,
  countByStatus,
  groupFeaturesByCategory,
  type FeatureStatus,
} from "@/data/feature-catalog";
import { API_BASE, API_ENDPOINTS } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";

const statusMeta: Record<
  FeatureStatus,
  { label: string; className: string; badge: "success" | "warning" | "neutral" | "destructive" }
> = {
  live: {
    label: "Live",
    className: "border-success/25 bg-success/10 text-success",
    badge: "success",
  },
  partial: {
    label: "Partial",
    className: "border-gold/35 bg-accent-soft text-foreground",
    badge: "warning",
  },
  stub: {
    label: "Stub",
    className: "border-border bg-muted text-muted-foreground",
    badge: "neutral",
  },
  needs_external: {
    label: "Needs keys",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
    badge: "destructive",
  },
};

export default function FeaturesPage(): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | FeatureStatus>("all");
  const counts = countByStatus();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FEATURE_CATALOG.filter((feature) => {
      const matchesStatus = statusFilter === "all" || feature.status === statusFilter;
      const matchesQuery =
        !q ||
        feature.name.toLowerCase().includes(q) ||
        feature.category.toLowerCase().includes(q) ||
        feature.notes.toLowerCase().includes(q) ||
        feature.requires.some((item) => item.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter]);

  const grouped = groupFeaturesByCategory(filtered);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="page-eyebrow">Enterprise platform</p>
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-gold" />
            <h1 className="text-3xl font-semibold tracking-tight">Feature catalog</h1>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Every planned CRM capability in one place — live modules, partial builds, stubs, and
            integrations that need external credentials.
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            GET {API_BASE}
            {API_ENDPOINTS.modulesFeatures}
          </p>
        </div>
        <div className="gold-chip">
          <Sparkles className="mr-1.5 h-3 w-3" />
          {FEATURE_CATALOG.length} capabilities tracked
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(
          [
            ["live", counts.live, "Ready to use"],
            ["partial", counts.partial, "Core path exists"],
            ["stub", counts.stub, "Scaffolded API/UI"],
            ["needs_external", counts.needs_external, "Needs provider keys"],
          ] as const
        ).map(([status, count, hint]) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            className={cn(
              "surface surface-interactive rounded-lg p-4 text-left",
              statusFilter === status && "border-gold/50",
            )}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {statusMeta[status].label}
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{count}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </button>
        ))}
      </div>

      <div className="surface rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70" />
            <Input
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search features, categories, env vars..."
            />
          </div>
          <Button
            size="sm"
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          {(Object.keys(statusMeta) as FeatureStatus[]).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
            >
              {statusMeta[status].label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {grouped.map(({ category, items }) => (
          <Card key={category} className="overflow-hidden">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <p className="page-eyebrow mb-2">Module</p>
                <CardTitle>{category}</CardTitle>
              </div>
              <span className="gold-chip">{items.length} items</span>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {items.map((feature) => (
                <div
                  key={feature.id}
                  className="rounded-md border border-border/70 bg-muted/20 p-4 transition-colors hover:border-gold/35"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium tracking-tight">{feature.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{feature.notes}</p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]",
                        statusMeta[feature.status].className,
                      )}
                    >
                      {statusMeta[feature.status].label}
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-[10px] text-muted-foreground">{feature.id}</p>
                  {feature.requires.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {feature.requires.map((req) => (
                        <Badge key={req} variant="neutral">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </CardContent>
            <CardMeta>
              <span>{category}</span>
              <span>
                {items.filter((i) => i.status === "live").length} live ·{" "}
                {items.filter((i) => i.status !== "live").length} remaining
              </span>
            </CardMeta>
          </Card>
        ))}
      </div>

      {grouped.length === 0 ? (
        <div className="surface rounded-lg p-8 text-center text-sm text-muted-foreground">
          No features match this filter.
        </div>
      ) : null}
    </section>
  );
}
