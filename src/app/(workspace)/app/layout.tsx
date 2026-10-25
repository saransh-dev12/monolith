import Link from "next/link";
import { Plus } from "lucide-react";

import { Wordmark } from "@/components/brand/monolith-mark";

import { RouteTransition } from "@/components/motion/route-transition";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { CommandPalette } from "@/components/shell/command-palette";
import { ThemeSwitcher } from "@/components/shell/theme-switcher";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireUser } from "@/lib/auth/session";

export default async function WorkspaceLayout({
  children,
}: LayoutProps<"/app">) {
  const user = await requireUser();

  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <AppSidebar displayName={user.displayName} email={user.email} />
        <SidebarInset id="main" className="min-w-0 bg-background">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/75 px-3 backdrop-blur-xl sm:px-5">
            <SidebarTrigger className="-ml-1" />
            <Link href="/app" className="md:hidden" aria-label="Monolith workspace">
              <Wordmark />
            </Link>
            <span
              className="hidden h-4 w-px bg-border sm:block"
              aria-hidden="true"
            />
            <CommandPalette />
            <div className="ml-auto flex items-center gap-2">
              <ThemeSwitcher compact />
              <ProjectDialog
                trigger={
                  <Button size="sm" aria-label="New project">
                    <Plus className="size-4" aria-hidden="true" />
                    <span className="hidden sm:inline">New project</span>
                  </Button>
                }
              />
            </div>
          </header>
          <div className="relative flex-1">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(48rem_18rem_at_18%_-20%,var(--ember-glow),transparent_70%)]"
            />
            <div className="relative mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
              <RouteTransition>{children}</RouteTransition>
            </div>
          </div>
        </SidebarInset>
        <Toaster theme="system" position="top-right" />
      </SidebarProvider>
    </TooltipProvider>
  );
}
