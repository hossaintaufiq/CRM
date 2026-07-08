"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard";
import { EnterpriseKanban } from "@/components/kanban/enterprise-kanban";
import { LeadManagementGrid } from "@/components/leads/lead-management-grid";
import { useCRMData } from "@/hooks/use-crm-data";

export function CRMWorkspace(): React.JSX.Element {
  const {
    kpis,
    activities,
    deals,
    leads,
    selectedLead,
    moveDeal,
    selectLead,
    clearLeadSelection,
  } = useCRMData();

  return (
    <AppShell>
      <div className="space-y-6">
        <ExecutiveDashboard kpis={kpis} activities={activities} />
        <EnterpriseKanban deals={deals} onMoveDeal={moveDeal} />
        <LeadManagementGrid
          leads={leads}
          selectedLead={selectedLead}
          onSelectLead={selectLead}
          onCloseDetail={clearLeadSelection}
        />
      </div>
    </AppShell>
  );
}
