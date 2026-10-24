import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  GitBranch,
  GripVertical,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Wordmark } from "@/components/brand/monolith-mark";
import { BoardDemo } from "@/components/marketing/board-demo";
import { CommandDemo } from "@/components/marketing/command-demo";
import { SiteHeader } from "@/components/marketing/site-header";
import { StudioHero } from "@/components/marketing/studio-hero";
import { WorkflowStory } from "@/components/marketing/workflow-story";
import { Reveal } from "@/components/motion/reveal";
import { ThemeSwitcher } from "@/components/shell/theme-switcher";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";

const guarantees = [
  ["Isolation", "Row level security on every owner-scoped table"],
  ["Ownership", "Owner id comes from verified claims, never the request body"],
  ["Plan writes", "Atomic Postgres function; no partial projects"],
  ["Secrets", "The OpenAI key stays server-side"],
  ["Validation", "Zod at the route boundary, constraints in the database"],
  ["AI writes", "Generation never persists; confirmation does"],
];

const workflow = [
  ["01", "Describe", "A sentence and a horizon. No wizard."],
  ["02", "Review", "Editable milestones and tasks, drafted by AI."],
  ["03", "Confirm", "One explicit action writes the plan atomically."],
  ["04", "Execute", "The board persists status; progress follows records."],
];

export default async function HomePage() {
  const user = await getSessionUser();
  const primaryHref = user ? "/app" : "/signup";
  const primaryLabel = user ? "Open workspace" : "Start a project";
  const secondaryHref = user ? "/app/planner" : "/login";
  const secondaryLabel = user ? "Open the planner" : "Sign in to explore";

  return (
    <div className="atelier-aurora min-h-dvh overflow-x-clip">
      <SiteHeader signedIn={Boolean(user)} />

      <main>
        {/* HERO */}
        <section className="relative mx-auto w-full max-w-[1240px] px-4 pb-14 pt-10 sm:px-6 lg:pb-24 lg:pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-10 -z-10 size-[30rem] rounded-full bg-chart-1/15 blur-[130px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-52 -z-10 size-[26rem] rounded-full bg-chart-2/15 blur-[120px]"
          />

          <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3 py-1.5 backdrop-blur">
                  <Sparkles className="size-3.5 text-chart-2" aria-hidden="true" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Project execution, end to end
                  </span>
                </div>

                <h1 className="mt-6 font-display text-[17vw] leading-[0.82] tracking-[-0.035em] text-balance sm:text-[12vw] lg:text-[6.6rem]">
                  Ideas,
                  <br />
                  <span className="italic text-chart-2">given form.</span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
                  Monolith turns a rough idea into a project you can actually
                  run. Describe it, review the plan it drafts, confirm the save,
                  then move work on a board that reports progress from your own
                  records.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button asChild className="h-11 rounded-full px-5 text-sm">
                    <Link href={primaryHref}>
                      {primaryLabel}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-full border-border/80 px-5 text-sm"
                  >
                    <Link href={secondaryHref}>{secondaryLabel}</Link>
                  </Button>
                </div>

                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  {[
                    "Private by default",
                    "RLS on every row",
                    "No fabricated analytics",
                  ].map((item) => (
                    <li key={item} className="inline-flex items-center gap-1.5">
                      <Check className="size-3.5 text-chart-3" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <StudioHero />
            </Reveal>
          </div>

          <div className="mt-12 flex items-center gap-4 border-t border-border/50 pt-5 lg:mt-16">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Scroll
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-border via-border/50 to-transparent" />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Follow one idea through the product
            </span>
          </div>
        </section>

        {/* WORKFLOW BAND */}
        <div className="border-y border-border/60 bg-card/25">
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4">
            {workflow.map(([number, title, body]) => (
              <div
                key={number}
                className="flex items-start gap-3 border-b border-border/40 py-5 lg:border-b-0 lg:border-r lg:pr-6 lg:last:border-r-0"
              >
                <span className="font-mono text-[10px] text-primary">{number}</span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <WorkflowStory />

        {/* COMMAND CENTER */}
        <section id="command" className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                Command Center
              </p>
              <h2 className="mt-3 font-display text-5xl leading-[0.9] tracking-[-0.02em] sm:text-6xl">
                Read the room,{" "}
                <span className="italic">not a mood board.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Active projects, open and overdue work, upcoming milestones, and
                a completion trend built from your task rows. The range control
                changes the window; it never invents data.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "7 / 14 / 30-day ranges with animated redraw",
                  "Daily totals available as text, not only pixels",
                  "Completions dated honestly by last update",
                  "Focus week and overdue work surfaced first",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-chart-2" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-chart-3" />
                Derived from stored records
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <CommandDemo />
            </Reveal>
          </div>
        </section>

        {/* BOARD */}
        <section
          id="board"
          className="border-y border-border/60 bg-card/20 py-16 lg:py-24"
        >
          <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Reveal className="order-2 lg:order-1">
              <BoardDemo />
            </Reveal>
            <Reveal className="order-1 lg:order-2" delay={0.08}>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                Board
              </p>
              <h2 className="mt-3 font-display text-5xl leading-[0.9] tracking-[-0.02em] sm:text-6xl">
                Move work,{" "}
                <span className="italic text-chart-2">not pixels.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Three columns, real status changes. Drag a card by its grip or
                use the status menu, which is fully keyboard-operable. A failed
                update rolls the card back and tells you why.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Drag overlay and clear drop targets",
                  "Status menu fallback for keyboard and touch",
                  "Optimistic movement with rollback on failure",
                  "Progress updates after the write succeeds",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-chart-1" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <GripVertical className="size-3.5" aria-hidden="true" />
                Pointer and keyboard
              </div>
            </Reveal>
          </div>
        </section>

        {/* PLANNER */}
        <section id="planner" className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                AI planner
              </p>
              <h2 className="mt-3 font-display text-5xl leading-[0.9] tracking-[-0.02em] sm:text-6xl">
                A draft plan,{" "}
                <span className="italic">not an autopilot.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                Give the planner an idea and a horizon. It proposes milestones
                and tasks. Every field is editable, generation never writes, and
                saving requires one explicit confirmation.
              </p>
              <ul className="mt-7 space-y-3 text-sm">
                {[
                  "Structured output validated at runtime",
                  "Per-user daily generation quota",
                  "Atomic save; a failed insert saves nothing",
                  "Missing configuration and errors are reported honestly",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-chart-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="h-11 rounded-full px-5 text-sm">
                  <Link href={user ? "/app/planner" : "/login"}>
                    {user ? "Open planner" : "Sign in to try it"}
                    <Sparkles className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-border/80 px-5 text-sm"
                >
                  <Link href={user ? "/app/projects" : "/signup"}>
                    {user ? "Browse projects" : "Create an account"}
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-chart-1/12 via-transparent to-chart-2/15 blur-2xl"
                />
                <div className="rounded-[1.75rem] border border-border/70 bg-card/70 p-4 shadow-[0_40px_100px_-60px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-chart-2" aria-hidden="true" />
                      <p className="text-xs font-medium">Draft · Community run club</p>
                    </div>
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-primary">
                      Not saved
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {[
                      ["Project", "Community run club"],
                      ["Horizon", "4 weeks"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-1 text-sm">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        Milestones
                      </p>
                      <span className="font-mono text-[9px] text-muted-foreground">2</span>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {["Route library live", "Weekly schedule live"].map((title, index) => (
                        <li
                          key={title}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2"
                        >
                          <span className="text-xs">{title}</span>
                          <span className="font-mono text-[9px] text-muted-foreground">
                            W{index + 1}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        Tasks
                      </p>
                      <span className="font-mono text-[9px] text-muted-foreground">3</span>
                    </div>
                    <ul className="mt-2 divide-y divide-border/50 rounded-xl border border-border/60 bg-background/40">
                      {[
                        ["Draft three route pages", "High"],
                        ["Build the weekly schedule", "Medium"],
                        ["Write the club introduction", "Low"],
                      ].map(([title, priority]) => (
                        <li
                          key={title}
                          className="flex items-center justify-between gap-3 px-3 py-2"
                        >
                          <span className="truncate text-xs">{title}</span>
                          <span className="font-mono text-[9px] text-muted-foreground">
                            {priority}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
                    <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                      Generation never writes
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-medium text-primary-foreground">
                      Confirm and save
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </span>
                  </div>
                </div>
                <p className="mt-3 px-1 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground/60">
                  Illustrative review surface · no database writes
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECURITY */}
        <section id="security" className="border-y border-border/60 bg-card/20">
          <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                Security &amp; data
              </p>
              <h2 className="mt-3 font-display text-5xl leading-[0.9] tracking-[-0.02em] sm:text-6xl">
                Serious where{" "}
                <span className="italic">it counts.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                A project tool stores sensitive plans. Monolith enforces
                ownership at the database boundary and keeps provider secrets on
                the server, not in the presentation layer.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3 py-2 font-mono text-[10px] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-chart-3" aria-hidden="true" />
                auth.uid() → RLS → owner-scoped rows
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <dl className="divide-y divide-border/60 border-y border-border/60">
                {guarantees.map(([term, description]) => (
                  <div
                    key={term}
                    className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {term}
                    </dt>
                    <dd className="text-sm leading-6">{description}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-[1240px] px-4 py-20 sm:px-6 lg:py-28">
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-card via-card to-accent/40 p-8 sm:p-12 lg:p-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-chart-1/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-16 size-80 rounded-full bg-chart-2/20 blur-3xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                  Start now
                </p>
                <h2 className="mt-3 max-w-2xl font-display text-5xl leading-[0.88] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
                  Start with the work you{" "}
                  <span className="italic text-chart-2">actually have.</span>
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                  One project is enough to test the fit. Add a real milestone,
                  move one task, and read progress from stored records.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="h-11 rounded-full px-5 text-sm">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                {!user ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-full border-border/80 px-5 text-sm"
                  >
                    <Link href="/login">Sign in</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border/60 px-4 pb-8 pt-12 sm:px-6">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <Wordmark />
              <p className="mt-4 max-w-xs text-xs leading-5 text-muted-foreground">
                A project execution workspace for focused builders. Plans,
                boards, and progress without invented metrics.
              </p>
              <div className="mt-4">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  Appearance
                </p>
                <ThemeSwitcher />
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                Product
              </h3>
              {[
                ["Command Center", user ? "/app" : "/login"],
                ["Projects", user ? "/app/projects" : "/login"],
                ["Board", user ? "/app/board" : "/login"],
                ["Planner", user ? "/app/planner" : "/login"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <h3 className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                Account
              </h3>
              <Link href="/signup" className="text-sm text-foreground/80 hover:text-primary">
                Create account
              </Link>
              <Link href="/login" className="text-sm text-foreground/80 hover:text-primary">
                Sign in
              </Link>
              <a
                href="https://github.com/saransh-dev12/monolith"
                className="inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-primary"
              >
                <GitBranch className="size-3.5" aria-hidden="true" />
                Source
              </a>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <p>© 2026 Monolith. Built with Next.js, Supabase, and OpenAI.</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em]">
              Idea → plan → board → progress
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
