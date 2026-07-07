"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function SiteSidebarAdminGroupSkeleton() {
  return (
    <SidebarGroup className="p-2">
      <SidebarGroupLabel>
        <div className="h-3 w-32 rounded-sm bg-muted" />
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <SidebarMenuSkeleton key={index} showIcon />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function SiteSidebarNavUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 rounded-[calc(var(--radius-sm)+2px)] p-2">
          <Skeleton className="size-8 rounded-lg" />
          <div className="grid flex-1 gap-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
          <Skeleton className="size-4 rounded-md" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
