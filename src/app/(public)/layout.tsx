import Link from "next/link";
import { Blocks } from "lucide-react";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[1.1fr_1fr]">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border/60 p-12 lg:flex">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,var(--color-primary),transparent_35%)] opacity-10" />
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Blocks className="size-4" aria-hidden="true" />
          </span>
          Monolith
        </Link>
        <div className="max-w-md space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Project execution, without the noise
          </p>
          <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight">
            A quiet workspace for the work that actually ships.
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Plans, projects, and tasks stay in one place. Every account sees
            only its own rows, enforced in the database.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Owner-scoped projects and tasks</li>
            <li>Keyboard-accessible board movement</li>
            <li>Progress derived from real records</li>
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          Built for focused individuals and small teams.
        </p>
      </div>
      <div className="flex flex-col">
        <header className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Blocks className="size-4" aria-hidden="true" />
            </span>
            Monolith
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign in
          </Link>
        </header>
        <main id="main" className="flex flex-1 items-center justify-center px-6 pb-16 lg:px-12">
          {children}
        </main>
      </div>
    </div>
  );
}
