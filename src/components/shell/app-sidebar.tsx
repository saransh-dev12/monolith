"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Archive,
  Columns3,
  FolderKanban,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

import { AccountMenu } from "@/components/shell/account-menu";
import { MonolithMark } from "@/components/brand/monolith-mark";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigation = [
  {
    href: "/app",
    label: "Command Center",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/app/projects", label: "Projects", icon: FolderKanban, exact: false },
  { href: "/app/board", label: "Board", icon: Columns3, exact: false },
  { href: "/app/planner", label: "Planner", icon: Sparkles, exact: false },
] as const;

export function AppSidebar({
  displayName,
  email,
}: {
  displayName: string;
  email: string | null;
}) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="Monolith">
              <Link href="/app">
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                  <MonolithMark />
                </span>
                <span className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Monolith
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Project workspace
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label="Workspace">
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href} className="relative">
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className="relative"
                      >
                        <Link href={item.href} aria-current={active ? "page" : undefined}>
                          {active ? (
                            <motion.span
                              layoutId="workspace-nav-active"
                              transition={{ type: "spring", stiffness: 500, damping: 36 }}
                              className="absolute inset-0 rounded-md bg-primary/12 ring-1 ring-primary/25"
                              aria-hidden="true"
                            />
                          ) : null}
                          <item.icon aria-hidden="true" className="relative" />
                          <span className="relative group-data-[collapsible=icon]:hidden">
                            {item.label}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Library</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Archived projects">
                    <Link href="/app/projects?archived=1">
                      <Archive aria-hidden="true" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        Archived
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <AccountMenu displayName={displayName} email={email} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
