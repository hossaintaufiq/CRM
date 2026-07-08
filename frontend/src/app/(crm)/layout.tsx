import { CRMAppLayout } from "@/components/layout/crm-app-layout";

export default function CRMLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return <CRMAppLayout>{children}</CRMAppLayout>;
}
