"use client";

import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard";
import { useCRMData } from "@/hooks/use-crm-data";

export default function DashboardPage(): React.JSX.Element {
  const { kpis, activities, deals } = useCRMData();
  return <ExecutiveDashboard kpis={kpis} activities={activities} deals={deals} />;
}
