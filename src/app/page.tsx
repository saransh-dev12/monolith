import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  CheckCircle2,
  Columns3,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";

const features = [
  {
    icon: Target,
    title: "Plans with edges",
    description:
      "Turn a broad goal into milestones and tasks that have owners, dates, and a clear finish line.",
  },
  {
    icon: Columns3,
    title: "A board that remembers",
    description:
      "Move work between todo, in progress, and done. Status changes persist and stay keyboard accessible.",
  },
  {
    icon: ShieldCheck,
    title: "Private by construction",
    description:
      "Row level security scopes every read and write to the signed-in owner. No client-supplied owner IDs.",
  },
];

export default async function HomePage() {
  const user = await getSessionUser();
  const primaryHref = user ? "/app" : "/signup";
  const primaryLabel = user ? "Open workspace" : "Start planning";

  return (
    <div className="min-h-dvh bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Blocks className="size-4" aria-hidden="true" />
          </span>
          Monolith
        </Link>
        <nav className="flex items-center gap-2" aria-label="Main">
          {user ? (
            <Button asChild size="sm">
              <Link href="/app">Open workspace</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Create account</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
              MVP v1.0 in progress
            </span>
            <h1 className="max-w-2xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Turn a vague idea into a plan you can execute.
            </h1>
            <p className="max-w-xl text-lg leading-7 text-muted-foreground">
              Monolith keeps projects, milestones, and tasks in one restrained
              workspace, so the next action is always obvious. No dashboards
              that exist only to look busy.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">I already have an account</Link>
              </Button>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                Private projects
              </li>
              <li className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                Derived progress
              </li>
              <li className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                Accessible board
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 p-4 shadow-2xl shadow-black/20">
            <div className="rounded-lg border border-border/60 bg-background/80">
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <p className="text-sm font-medium">Portfolio relaunch</p>
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  47% complete
                </span>
              </div>
              <div className="space-y-3 p-4">
                {[
                  { title: "Draft case study outline", status: "Done", tone: "text-emerald-400" },
                  { title: "Write the about page", status: "In progress", tone: "text-amber-400" },
                  { title: "Review contact form accessibility", status: "Overdue", tone: "text-rose-400" },
                  { title: "Set up analytics", status: "Todo", tone: "text-muted-foreground" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-4 rounded-md border border-border/50 bg-card/40 px-3 py-2.5"
                  >
                    <span className="text-sm">{item.title}</span>
                    <span className={`text-xs ${item.tone}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="px-2 pt-3 text-xs text-muted-foreground">
              Illustrative workspace · every row scoped to its owner
            </p>
          </div>
        </section>

        <section className="grid gap-4 border-t border-border/60 pt-12 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-lg border border-border/60 bg-card/30 p-6"
            >
              <feature.icon className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-base font-medium">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Monolith · AI-assisted planning and execution for individuals.</p>
          <p>Day 1 foundation · no AI features shipped yet.</p>
        </div>
      </footer>
    </div>
  );
}
