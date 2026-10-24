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
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Link href="/" aria-label="Monolith home">
          <Wordmark inverted />
        </Link>
        <div className="max-w-md">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-primary-foreground/80">
            <span>Workspace access</span>
            <span className="h-px w-10 bg-border" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-balance font-heading text-5xl leading-[0.98] tracking-[-0.02em]">
            The work stays yours.
          </h2>
          <p className="mt-5 text-sm leading-6 text-primary-foreground/80">
            Projects, tasks, and milestones are scoped to the signed-in account
            in the database, not just in the interface.
          </p>
          <ul className="mt-8 divide-y divide-primary-foreground/20 border-y border-primary-foreground/20 text-sm">
            <li className="flex items-center justify-between py-3">
              <span className="text-primary-foreground/80">Isolation</span>
              <span>Owner-scoped RLS</span>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="text-primary-foreground/80">Board movement</span>
              <span>Pointer and keyboard</span>
            </li>
            <li className="flex items-center justify-between py-3">
              <span className="text-primary-foreground/80">Progress</span>
              <span>Derived from records</span>
            </li>
          </ul>
        </div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/80">
          Local seed · demo@monolith.local
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
