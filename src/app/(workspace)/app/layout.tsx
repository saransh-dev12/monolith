import Link from "next/link";
import { Blocks } from "lucide-react";

import { AccountMenu } from "@/components/shell/account-menu";
import { WorkspaceNav } from "@/components/shell/workspace-nav";
import { Toaster } from "@/components/ui/sonner";
import { requireUser } from "@/lib/auth/session";

export default async function WorkspaceLayout({
  children,
}: LayoutProps<"/app">) {
  const user = await requireUser();

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border/60 bg-card/20 p-4 lg:flex">
        <Link
          href="/app"
          className="mb-6 inline-flex items-center gap-2 px-2 pt-1 text-sm font-semibold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Blocks className="size-4" aria-hidden="true" />
          </span>
          Monolith
        </Link>
        <WorkspaceNav />
        <div className="mt-auto space-y-3">
          <p className="px-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Workspace
          </p>
          <AccountMenu displayName={user.displayName} email={user.email} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 text-sm font-semibold"
            >
              <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
                <Blocks className="size-4" aria-hidden="true" />
              </span>
              Monolith
            </Link>
            <div className="w-44">
              <AccountMenu displayName={user.displayName} email={user.email} />
            </div>
          </div>
          <WorkspaceNav variant="mobile" />
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>

      <Toaster theme="dark" position="top-right" />
    </div>
  );
}
