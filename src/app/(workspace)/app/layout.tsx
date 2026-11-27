import Link from "next/link";
import { Plus } from "lucide-react";
import { Wordmark } from "@/components/brand/monolith-mark";
import { RouteTransition } from "@/components/motion/route-transition";
import { WorkspaceNavigation } from "@/components/shell/workspace-navigation";
import { AccountMenu } from "@/components/shell/account-menu";
import { CommandPalette } from "@/components/shell/command-palette";
import { WorkspaceShortcuts } from "@/components/shell/workspace-shortcuts";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireUser } from "@/lib/auth/session";

export default async function WorkspaceLayout({
  children,
}: LayoutProps<"/app">) {
  const user = await requireUser();
  return (
    <TooltipProvider delayDuration={200}>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <WorkspaceShortcuts />
      <div
        data-workspace
        className="min-h-screen bg-background"
        style={{ "--radius": "0.625rem" } as React.CSSProperties}
      >
        <header className="relative z-30 mx-auto w-full max-w-[1600px] px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 pb-4">
            <Link
              href="/app"
              aria-label="Monolith workspace"
              className="shrink-0"
            >
              <Wordmark className="[&>span:last-child]:hidden sm:[&>span:last-child]:inline" />
            </Link>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <CommandPalette />
              <ProjectDialog
                trigger={
                  <Button
                    size="sm"
                    aria-label="New project"
                    className="h-10 gap-2 rounded-xl px-3 transition-transform hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    <span className="hidden sm:inline">New project</span>
                  </Button>
                }
              />
              <AccountMenu
                displayName={user.displayName}
                email={user.email}
                compact
              />
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/75 px-1 shadow-sm backdrop-blur-xl">
            <WorkspaceNavigation />
          </div>
        </header>
        <main
          id="main"
          className="relative mx-auto w-full max-w-[1600px] px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8"
        >
          <RouteTransition>{children}</RouteTransition>
        </main>
      </div>
      <Toaster theme="system" position="top-right" />
    </TooltipProvider>
  );
}
