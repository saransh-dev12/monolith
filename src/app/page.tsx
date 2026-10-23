import Link from "next/link";
import { ArrowRight, Check, GitBranch } from "lucide-react";

import { Wordmark } from "@/components/brand/monolith-mark";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";

const principles = [
  {
    index: "01",
    title: "Plan with edges",
    body: "Turn a broad goal into milestones and tasks with dates, priority, and a clear finish line. No infinite backlog.",
    detail: "Projects → milestones → tasks",
  },
  {
    index: "02",
    title: "Execute in one place",
    body: "A compact board, a project ledger, and overdue signals that come from stored records rather than decorative charts.",
    detail: "Persistent status · keyboard movement",
  },
  {
    index: "03",
    title: "Review the truth",
    body: "Progress combines completed tasks and milestones. AI can draft a plan, but only you confirm what enters the workspace.",
    detail: "Derived progress · explicit confirmation",
  },
];

export default async function HomePage() {
  const user = await getSessionUser();
  const primaryHref = user ? "/app" : "/signup";
  const primaryLabel = user ? "Open workspace" : "Start with a project";

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border/50">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Wordmark />
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
        </div>
      </header>

      <main>
        <section className="border-b border-border/50">
          <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
            <div>
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>Project execution system</span>
                <span className="h-px w-10 bg-border" aria-hidden="true" />
              </div>

              <h1 className="mt-7 max-w-xl text-balance font-heading text-6xl leading-[0.92] tracking-[-0.02em] sm:text-7xl xl:text-8xl">
                Make the idea{" "}
                <span className="italic text-primary">real.</span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground">
                Monolith turns an idea into milestones and tasks, then keeps the
                work visible until it ships. A serious workspace for solo
                builders and small teams, without the noise of a generic
                dashboard.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={user ? "/app/planner" : "/login"}>
                    {user ? "Open the planner" : "See the workspace"}
                  </Link>
                </Button>
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <li className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" aria-hidden="true" />
                  Private by default
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" aria-hidden="true" />
                  Progress from real records
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" aria-hidden="true" />
                  AI drafts, you decide
                </li>
              </ul>

              <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-6">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Plan
                  </dt>
                  <dd className="mt-1 text-sm">Idea to milestones</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Execute
                  </dt>
                  <dd className="mt-1 text-sm">Board and task ledger</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Review
                  </dt>
                  <dd className="mt-1 text-sm">Progress you can trust</dd>
                </div>
              </dl>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -left-4 top-10 hidden h-24 w-px bg-primary/50 lg:block"
              />
              <div className="rounded-lg border border-border/70 bg-card/50 p-2 shadow-2xl shadow-black/25">
                <div className="rounded-md border border-border/60 bg-background">
                  <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Active project
                      </p>
                      <p className="mt-1 font-heading text-2xl leading-none">
                        Portfolio relaunch
                      </p>
                    </div>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                      Active
                    </span>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>3 of 7 items complete</span>
                        <span className="font-mono tabular-nums">43%</span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[43%] rounded-full bg-primary" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        {
                          title: "Draft case study outline",
                          meta: "Done · High",
                          done: true,
                        },
                        {
                          title: "Write the about page",
                          meta: "In progress · Due Fri",
                          done: false,
                          active: true,
                        },
                        {
                          title: "Review contact form accessibility",
                          meta: "Todo · Overdue",
                          done: false,
                          overdue: true,
                        },
                        {
                          title: "Set up analytics",
                          meta: "Todo · No due date",
                          done: false,
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="flex items-center gap-3 rounded-md border border-border/50 bg-card/40 px-3 py-2.5"
                        >
                          <span
                            className={
                              item.done
                                ? "grid size-4 shrink-0 place-items-center rounded-full border border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                                : "size-4 shrink-0 rounded-full border border-border"
                            }
                          >
                            {item.done ? (
                              <Check className="size-2.5" aria-hidden="true" />
                            ) : null}
                          </span>
                          <span
                            className={
                              item.done
                                ? "min-w-0 flex-1 truncate text-sm text-muted-foreground line-through"
                                : "min-w-0 flex-1 truncate text-sm"
                            }
                          >
                            {item.title}
                          </span>
                          <span
                            className={
                              item.overdue
                                ? "shrink-0 text-[10px] text-rose-300"
                                : item.active
                                  ? "shrink-0 text-[10px] text-amber-300"
                                  : "shrink-0 text-[10px] text-muted-foreground"
                            }
                          >
                            {item.meta}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      <span>Target · Nov 14</span>
                      <span className="font-mono">MNL / 001</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 px-1 text-[11px] text-muted-foreground">
                Product preview · illustrative workspace data
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                How it runs
              </p>
              <h2 className="mt-4 max-w-sm font-heading text-4xl leading-[1.02] tracking-[-0.01em] sm:text-5xl">
                One thread from idea to done.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                The product works without AI. Generation is an accelerator, not
                a dependency, and it never writes until you confirm.
              </p>
            </div>

            <div className="divide-y divide-border/60 border-y border-border/60">
              {principles.map((principle) => (
                <article
                  key={principle.index}
                  className="grid gap-3 py-7 sm:grid-cols-[3rem_1fr]"
                >
                  <span className="font-mono text-xs text-primary">
                    {principle.index}
                  </span>
                  <div>
                    <h3 className="font-heading text-2xl tracking-[-0.01em]">
                      {principle.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                      {principle.body}
                    </p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                      {principle.detail}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/50 bg-card/15">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                AI planning
              </p>
              <h2 className="mt-4 max-w-md font-heading text-4xl leading-[1.02] tracking-[-0.01em] sm:text-5xl">
                A draft plan, not an{" "}
                <span className="italic text-primary">autopilot.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Describe the idea and the horizon. Monolith proposes milestones
                and tasks. You edit the titles, dates, and priorities, then
                confirm. Saving is one transaction, and generation is quota
                limited per day.
              </p>
              <ol className="mt-7 space-y-3 text-sm">
                {[
                  "Describe the idea and constraints.",
                  "Review every proposed item.",
                  "Confirm to create the project.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-mono text-xs text-primary">
                      0{index + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-border/70 bg-background p-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <p className="text-sm font-medium">Draft · Community run club</p>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-300">
                  Not saved
                </span>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>3 milestones · 7 tasks</span>
                  <span>4 week horizon</span>
                </div>
                <div className="space-y-2">
                  {[
                    "Define the route publishing flow",
                    "Build the weekly schedule page",
                    "Publish the first club page",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-md border border-border/60 px-3 py-2.5 text-sm"
                    >
                      <span className="size-1.5 rounded-full bg-primary" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="text-xs text-muted-foreground">
                    Generation does not write
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                    Confirm and save
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-24">
          <div className="grid gap-8 border-t border-border/60 pt-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Start now
              </p>
              <h2 className="mt-4 max-w-2xl text-balance font-heading text-5xl leading-[0.98] tracking-[-0.02em] sm:text-6xl">
                Start with the work you actually have.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                One project is enough to see whether Monolith fits. Create an
                account, add the next real milestone, and decide from there.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Wordmark />
          <div className="flex flex-wrap items-center gap-4">
            <span>Project execution for focused builders.</span>
            <a
              href="https://github.com/saransh-dev12/monolith"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <GitBranch className="size-3.5" aria-hidden="true" />
              Source
            </a>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
              v1 · foundation
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
