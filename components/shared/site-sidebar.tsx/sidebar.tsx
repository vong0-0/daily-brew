import { Coffee, List, Plus, Minus, History as HistoryIcon, LayoutDashboard, ChartBarStacked, Boxes, BookText, Users, Cable } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "../../ui/sidebar";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { getCurrentSessionUser, isAdmin } from "@/lib/auth";

const GENERAL = {
  group_info: {
    group_label: "General"
  },
  items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/products", label: "Product List", icon: List },
    { href: "/stock-in", label: "Stock In", icon: Plus },
    { href: "/stock-out", label: "Stock Out", icon: Minus },
    { href: "/history", label: "History", icon: HistoryIcon },
  ]
}

const ADMIN = {
  group_info: {
    group_label: "Master Data Management"
  },
  items: [
    { href: "/admin/categories", label: "Categories", icon: ChartBarStacked },
    { href: "/admin/units", label: "Units", icon: Boxes },
    { href: "/admin/reason-types", label: "Reason Types", icon: BookText },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: Cable }
  ]
}

export async function SiteSidebar() {
  const sessionUser = await getCurrentSessionUser()
  const adminUser = await isAdmin()
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 p-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Coffee className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">DailyBrew</span>
              <span className="truncate text-xs">Inventory menagement</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="p-2">
          <SidebarGroupLabel>{GENERAL.group_info.group_label}</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {GENERAL.items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  className="hover:bg-bg-base transition-all duration-300"
                  asChild
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="size-4 shrink-0" />
                    <span className="truncate text-sm">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {adminUser && (
          <SidebarGroup className="p-2">
            <SidebarGroupLabel>{ADMIN.group_info.group_label}</SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              {ADMIN.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    className="hover:bg-bg-base transition-all duration-300"
                    asChild
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate text-sm">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      {sessionUser && (
        <SidebarFooter>
          <NavUser user={sessionUser} />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}