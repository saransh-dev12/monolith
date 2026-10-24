import Link from "next/link";

import { Wordmark } from "@/components/brand/monolith-mark";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[1.1fr_1fr]">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <div className="atelier-aurora relative hidden flex-col justify-between overflow-hidden border-r border-border/60 bg-[var(--accent-panel)] p-12 text-foreground lg:flex">
        <Link href="/" aria-label="Monolith home">
          <Wordmark />
        </Link>
        <div className="max-w-md">
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.22em] text-primary">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" aria-hidden="true" />
            <span>Workspace access</span>
          </div>
          <h2 className="mt-6 text-balance font-display text-6xl leading-[0.95] tracking-[-0.02em]">
            The work stays{" "}
            <span className="italic text-primary">yours.</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-foreground/70">
            Projects, tasks, and milestones are scoped to the signed-in account
            in the database, not just in the interface.
          </p>
          <ul className="mt-8 divide-y divide-border/70 border-y border-border/70 text-sm">
            <li className="flex items-center justify-between py-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/50">Isolation</span>
              <span>Owner-scoped RLS</span>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/50">Board movement</span>
              <span>Pointer and keyboard</span>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/50">Progress</span>
              <span>Derived from records</span>
            </li>
          </ul>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/40">
          {process.env.NODE_ENV === "production"
            ? "Project execution for focused builders"
            : "Local seed · demo@monolith.local"}
        </p>
      </div>
      <div className="flex flex-col">
        <header className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" aria-label="Monolith home">
            <Wordmark />
          </Link>
        </header>
        <main id="main" className="flex flex-1 items-center justify-center px-6 pb-16 lg:px-12">
          {children}
        </main>
      </div>
    </div>
  );
}
