"use client";

import { LeadManagementGrid } from "@/components/leads/lead-management-grid";
import { useCRMData } from "@/hooks/use-crm-data";

export default function LeadsPage(): React.JSX.Element {
  const {
    leads,
    selectedLead,
    selectLead,
    clearLeadSelection,
    updateLeadStatus,
    createLead,
    deleteLead,
    deleteLeads,
  } = useCRMData();
  return (
    <LeadManagementGrid
      leads={leads}
      selectedLead={selectedLead}
      onSelectLead={selectLead}
      onCloseDetail={clearLeadSelection}
      onUpdateLeadStatus={updateLeadStatus}
      onCreateLead={createLead}
      onDeleteLead={deleteLead}
      onDeleteLeads={deleteLeads}
    />
  );
}
