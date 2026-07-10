"use client";

import { AppShell } from "@/components/layout/app-shell";
import { CRMDataProvider, useCRMData } from "@/hooks/use-crm-data";

function ShellWithData({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { unreadNotifications, workspaceSettings } = useCRMData();
  return (
    <AppShell
      unreadNotifications={unreadNotifications}
      organizationName={workspaceSettings.organizationName}
    >
      {children}
    </AppShell>
  );
}

export function CRMAppLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <CRMDataProvider>
      <ShellWithData>{children}</ShellWithData>
    </CRMDataProvider>
  );
}
