import type { ReactNode } from "react";

import { SiteSidebar } from "@/components/shared/site-sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { verifySession } from "@/lib/dal";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await verifySession();

  return (
    <SidebarProvider>
      <SiteSidebar />
      <SidebarInset className="bg-bg-base text-text-primary">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
