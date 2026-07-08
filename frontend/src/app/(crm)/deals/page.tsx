"use client";

import { EnterpriseKanban } from "@/components/kanban/enterprise-kanban";
import { useCRMData } from "@/hooks/use-crm-data";

export default function DealsPage(): React.JSX.Element {
  const { deals, moveDeal } = useCRMData();
  return <EnterpriseKanban deals={deals} onMoveDeal={moveDeal} />;
}
