"use client";

import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard";
import { useCRMData } from "@/hooks/use-crm-data";

export default function DashboardPage(): React.JSX.Element {
  const {
    kpis,
    activities,
    deals,
    leads,
    contacts,
    automations,
    notifications,
    summary,
    dataMode,
  } = useCRMData();

  return (
    <ExecutiveDashboard
      kpis={kpis}
      activities={activities}
      deals={deals}
      leads={leads}
      contacts={contacts}
      automations={automations}
      notifications={notifications}
      summary={summary}
      dataMode={dataMode}
    />
  );
}
