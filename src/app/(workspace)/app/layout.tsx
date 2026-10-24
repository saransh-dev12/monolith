import Link from "next/link";
import { Plus } from "lucide-react";

import { Wordmark } from "@/components/brand/monolith-mark";

import { AppSidebar } from "@/components/shell/app-sidebar";
import { CommandPalette } from "@/components/shell/command-palette";
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
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/70 bg-background/85 px-3 backdrop-blur sm:px-4">
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
          <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-10">
            {children}
          </div>
        </SidebarInset>
        <Toaster theme="light" position="top-right" />
      </SidebarProvider>
    </TooltipProvider>
  );
}
