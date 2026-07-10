"use client";

import { DealsWorkspace } from "@/components/deals/deals-workspace";
import { useCRMData } from "@/hooks/use-crm-data";

export default function DealsPage(): React.JSX.Element {
  const {
    deals,
    selectedDeal,
    pipelineStages,
    pipelinePreferences,
    selectDeal,
    moveDeal,
    createDeal,
    updateDeal,
    deleteDeal,
    deleteDeals,
    updatePipelineStages,
    updatePipelinePreferences,
  } = useCRMData();

  return (
    <DealsWorkspace
      deals={deals}
      selectedDeal={selectedDeal}
      pipelineStages={pipelineStages}
      pipelinePreferences={pipelinePreferences}
      onSelectDeal={selectDeal}
      onMoveDeal={moveDeal}
      onCreateDeal={createDeal}
      onUpdateDeal={updateDeal}
      onDeleteDeal={deleteDeal}
      onDeleteDeals={deleteDeals}
      onUpdateStages={updatePipelineStages}
      onUpdatePreferences={updatePipelinePreferences}
    />
  );
}
