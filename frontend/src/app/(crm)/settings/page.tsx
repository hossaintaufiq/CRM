"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCRMData } from "@/hooks/use-crm-data";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export default function SettingsPage(): React.JSX.Element {
  const {
    workspaceSettings,
    updateWorkspaceSettings,
    pipelineStages,
    updatePipelineStages,
    pipelinePreferences,
    updatePipelinePreferences,
  } = useCRMData();

  const [orgName, setOrgName] = useState(workspaceSettings.organizationName);
  const [currency, setCurrency] = useState(workspaceSettings.defaultCurrency);
  const [fiscal, setFiscal] = useState(workspaceSettings.fiscalYearStart);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="page-eyebrow">Configuration</p>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Workspace, pipeline stages, and board preferences. Demo ·{" "}
          <span className="font-mono text-[11px] text-foreground">
            PUT {API_ENDPOINTS.workspaceSettings}
          </span>
        </p>
      </header>

      <Card className="overflow-hidden">
        <CardHeader>
          <p className="page-eyebrow mb-2">Workspace</p>
          <CardTitle>Organization preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Organization name
            </span>
            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Default currency
            </span>
            <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Fiscal year start
            </span>
            <Input value={fiscal} onChange={(e) => setFiscal(e.target.value)} />
          </label>
          <div className="flex justify-end pt-1">
            <Button
              onClick={() =>
                updateWorkspaceSettings({
                  organizationName: orgName,
                  defaultCurrency: currency,
                  fiscalYearStart: fiscal,
                })
              }
            >
              Save changes
            </Button>
          </div>
        </CardContent>
        <CardMeta>
          <span>PUT {API_ENDPOINTS.workspaceSettings}</span>
          <span>{workspaceSettings.organizationName}</span>
        </CardMeta>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <p className="page-eyebrow mb-2">Pipeline</p>
          <CardTitle>Stage visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pipelineStages.map((stage) => (
            <label
              key={stage.id}
              className="flex items-center justify-between rounded-md border border-border/70 bg-muted/20 px-3 py-2.5 text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                {stage.label}
              </span>
              <input
                type="checkbox"
                checked={stage.visible}
                onChange={(e) =>
                  updatePipelineStages(
                    pipelineStages.map((s) =>
                      s.id === stage.id ? { ...s, visible: e.target.checked } : s,
                    ),
                  )
                }
              />
            </label>
          ))}
        </CardContent>
        <CardMeta>
          <span>PUT {API_ENDPOINTS.pipelineStages}</span>
          <span>{pipelineStages.filter((s) => s.visible).length} visible</span>
        </CardMeta>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <p className="page-eyebrow mb-2">Board</p>
          <CardTitle>Deal display preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              ["compactCards", "Compact cards"],
              ["showProbability", "Show probability"],
              ["showCloseDate", "Show close date"],
              ["showTags", "Show tags"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-md border border-border/70 bg-muted/20 px-3 py-2.5 text-sm"
            >
              {label}
              <input
                type="checkbox"
                checked={pipelinePreferences[key]}
                onChange={(e) => updatePipelinePreferences({ [key]: e.target.checked })}
              />
            </label>
          ))}
        </CardContent>
        <CardMeta>
          <span>PUT {API_ENDPOINTS.pipelinePreferences}</span>
          <span>{pipelinePreferences.viewMode} view</span>
        </CardMeta>
      </Card>
    </section>
  );
}
