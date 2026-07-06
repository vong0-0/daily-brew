import type { ReactNode } from "react";

import { SiteSidebar } from "@/components/shared/site-sidebar.tsx/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { verifySession } from "@/lib/dal";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await verifySession();

  return (
    <SidebarProvider>
      <SiteSidebar />
      <SidebarInset className="bg-bg-base text-text-primary">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-bg-surface px-4">
          <SidebarTrigger />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">
              Daily Brew
            </p>
            <p className="truncate text-sm text-text-primary">
              Signed in as {session.user.username}
            </p>
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
