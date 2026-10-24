import Link from "next/link";
import {
  ArrowRight,
  Check,
  GitBranch,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
  LayoutLines,
  Navbar,
  NavbarLeft,
  NavbarRight,
  Section,
} from "@/components/marketing/foundation";
import { Wordmark } from "@/components/brand/monolith-mark";
import { MarketingExecutionDemo } from "@/components/marketing/execution-demo";
import { ProjectStatusBadge, TaskStatusBadge } from "@/components/tasks/task-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getSessionUser } from "@/lib/auth/session";
import { HoverLift } from "@/components/motion/hover-lift";
import { ThemeSwitcher } from "@/components/shell/theme-switcher";
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/motion/reveal";

const workflow = [
  {
    number: "01",
    title: "Describe",
    body: "Write the idea in plain language. Add a horizon and constraints if they matter.",
  },
  {
    number: "02",
    title: "Review",
    body: "The planner proposes milestones and tasks. Edit titles, dates, and priorities before saving.",
  },
  {
    number: "03",
    title: "Confirm",
    body: "One explicit action writes the project, milestones, and tasks in a single transaction.",
  },
  {
    number: "04",
    title: "Execute",
    body: "Move work across the board, complete milestones, and read progress from stored records.",
  },
];

const guarantees = [
  ["Isolation", "Row level security on every owner-scoped table"],
  ["Ownership", "Owner id comes from verified claims, never the request body"],
  ["Plan writes", "Atomic Postgres function; no partial projects"],
  ["Secrets", "The OpenAI key stays server-side"],
  ["Validation", "Zod at the route boundary, constraints in the database"],
  ["AI writes", "Generation never persists; confirmation does"],
];

export default async function HomePage() {
  const user = await getSessionUser();
  const primaryHref = user ? "/app" : "/signup";
  const primaryLabel = user ? "Open workspace" : "Start a project";
  const secondaryHref = user ? "/app/planner" : "/login";

  return (
    <div className="relative min-h-dvh">
      <LayoutLines />

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto w-full max-w-container px-4 sm:px-6">
          <Navbar>
            <NavbarLeft>
              <Link href="/" aria-label="Monolith home">
                <Wordmark />
              </Link>
              <nav
                className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"
                aria-label="Product sections"
              >
                <a href="#workflow" className="transition-colors hover:text-foreground">
                  Workflow
                </a>
                <a href="#planner" className="transition-colors hover:text-foreground">
                  AI planner
                </a>
                <a href="#security" className="transition-colors hover:text-foreground">
                  Security
                </a>
              </nav>
            </NavbarLeft>
            <NavbarRight>
              <span className="hidden sm:inline-flex">
                <ThemeSwitcher compact />
              </span>
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
            </NavbarRight>
          </Navbar>
        </div>
      </header>

      <main>
        <section className="border-b border-border/70">
          <div className="mx-auto grid w-full max-w-container gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:py-24">
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                Project execution, end to end
              </div>

              <h1 className="mt-6 max-w-2xl text-balance font-heading text-5xl leading-[0.96] tracking-[-0.03em] sm:text-6xl xl:text-[4.75rem]">
                From a sentence to{" "}
                <span className="italic text-primary">shipped work.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
                Monolith turns a rough idea into an executable project.
                Describe it, let the planner draft milestones and tasks, review
                and confirm the plan, execute on a reliable board, and read
                progress derived from your real rows. The planner drafts; you
                keep the judgment.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={secondaryHref}>
                    {user ? "Open the planner" : "Sign in to explore"}
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
                  Useful without AI
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" aria-hidden="true" />
                  No fabricated analytics
                </li>
              </ul>

              <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-border/80 pt-5">
                {[
                  ["Plan", "Milestones & tasks"],
                  ["Execute", "Board & status"],
                  ["Review", "Derived progress"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 text-xs">{value}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="relative" delay={0.12}>
              <div
                className="absolute -right-3 -top-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground lg:-right-6"
                aria-hidden="true"
              >
                01 / Workspace
              </div>

              <HoverLift className="rounded-md border border-border/80 bg-card p-2 shadow-[0_1px_0_0_rgba(21,25,26,0.04),0_20px_50px_-30px_rgba(21,25,26,0.25)]">
                <div className="rounded-sm border border-border/70">
                  <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="grid size-6 place-items-center rounded-sm bg-foreground text-background">
                        <LayoutDashboard className="size-3" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        Project dossier
                      </span>
                    </div>
                    <ProjectStatusBadge status="active" />
                  </div>

                  <div className="px-4 pb-4 pt-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      MNL / 001
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <h2 className="font-heading text-3xl leading-none tracking-[-0.01em]">
                        Portfolio relaunch
                      </h2>
                      <span className="pb-1 font-mono text-xs tabular-nums text-muted-foreground">
                        43%
                      </span>
                    </div>
                    <Progress
                      value={43}
                      aria-label="Project progress"
                      className="mt-4"
                    />

                    <div className="mt-4 grid grid-cols-3 gap-3 border-y border-border/70 py-3">
                      {[
                        ["Target", "Nov 14"],
                        ["Open", "4 tasks"],
                        ["Milestones", "1 / 3"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                            {label}
                          </p>
                          <p className="mt-1 text-xs">{value}</p>
                        </div>
                      ))}
                    </div>

                    <ul className="mt-3 divide-y divide-border/70">
                      {[
                        {
                          title: "Write the about page",
                          status: "in_progress" as const,
                          meta: "Medium · Due Oct 27",
                        },
                        {
                          title: "Export project screenshots",
                          status: "todo" as const,
                          meta: "Low · Due Nov 1",
                        },
                        {
                          title: "Draft case study outline",
                          status: "done" as const,
                          meta: "High · Completed",
                        },
                      ].map((task) => (
                        <li
                          key={task.title}
                          className="flex items-center justify-between gap-3 py-2.5"
                        >
                          <span
                            className={
                              task.status === "done"
                                ? "truncate text-xs text-muted-foreground line-through"
                                : "truncate text-xs"
                            }
                          >
                            {task.title}
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="hidden font-mono text-[9px] text-muted-foreground sm:inline">
                              {task.meta}
                            </span>
                            <TaskStatusBadge status={task.status} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </HoverLift>

              <div className="mt-3 flex items-center justify-between px-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                <span>Illustrative workspace · shared product components</span>
                <span>Monolith v1</span>
              </div>
            </Reveal>
          </div>
        </section>

        <Section id="proof" className="border-b border-border/70">
          <Reveal className="mx-auto grid max-w-container items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                Trustworthy progress
              </p>
              <h2 className="mt-3 max-w-md text-balance font-heading text-4xl leading-[0.98] tracking-[-0.02em] sm:text-5xl">
                Every chart reads your rows.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                The Command Center charts tasks you actually completed, with
                range controls that redraw the line and tooltips that name the
                day. No sample data, no vanity metrics — switch ranges above
                and the totals follow the same rows.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {[
                  "7 / 14 / 30-day ranges with animated redraw",
                  "Daily numbers available as text, not just pixels",
                  "Completions dated honestly by last update",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <MarketingExecutionDemo />
          </Reveal>
        </Section>

        <Section id="workflow" className="border-b border-border/70">
          <Reveal className="mx-auto max-w-container">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div className="lg:sticky lg:top-24">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                  The workflow
                </p>
                <h2 className="mt-3 max-w-md text-balance font-heading text-4xl leading-[0.98] tracking-[-0.02em] sm:text-5xl">
                  Structure that survives contact with the week.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                  The product is built around the work that actually ships, not
                  a dashboard that looks busy. AI is a drafting aid, not a
                  dependency.
                </p>
              </div>

              <ol className="grid gap-x-8 gap-y-0 border-t border-border/80 sm:grid-cols-2">
                {workflow.map((step) => (
                  <li
                    key={step.number}
                    className="border-b border-border/80 py-6 sm:py-8"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-primary">
                        {step.number}
                      </span>
                      <h3 className="font-heading text-2xl tracking-[-0.01em]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-3">
              <RevealItem className="rounded-md border border-border/80 bg-card/60 p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Board state
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    ["Todo", "3"],
                    ["Doing", "1"],
                    ["Done", "1"],
                  ].map(([label, count]) => (
                    <div
                      key={label}
                      className="rounded-sm border border-border/70 bg-background px-2 py-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px]">{label}</span>
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {count}
                        </span>
                      </div>
                      <div className="mt-2 h-1 rounded-full bg-muted">
                        <div
                          className="h-1 rounded-full bg-primary"
                          style={{ width: label === "Todo" ? "70%" : label === "Doing" ? "35%" : "20%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </RevealItem>

              <RevealItem className="rounded-md border border-border/80 bg-card/60 p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Milestone
                </p>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium">Content complete</p>
                    <p className="mt-1 font-mono text-[9px] text-muted-foreground">
                      Due Nov 2
                    </p>
                  </div>
                  <span className="size-2 rounded-full bg-emerald-600" />
                </div>
                <div className="mt-4 h-px bg-border" />
                <p className="mt-3 font-mono text-[9px] text-muted-foreground">
                  Progress derives from completed records
                </p>
              </RevealItem>

              <RevealItem className="rounded-md border border-border/80 bg-card/60 p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Today
                </p>
                <p className="mt-3 font-heading text-3xl leading-none">4 open</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  One overdue · one due this week
                </p>
                <div className="mt-4 flex gap-1">
                  {[1, 1, 0, 1, 1, 0, 0].map((filled, index) => (
                    <span
                      key={index}
                      className={
                        filled
                          ? "h-1.5 flex-1 rounded-full bg-primary"
                          : "h-1.5 flex-1 rounded-full bg-muted"
                      }
                    />
                  ))}
                </div>
              </RevealItem>
            </RevealGroup>
          </Reveal>
        </Section>

        <section
          id="planner"
          className="border-b border-border/70 bg-[var(--accent-panel)] text-foreground"
        >
          <div className="mx-auto grid w-full max-w-container gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-24">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                AI planner
              </p>
              <h2 className="mt-3 max-w-md text-balance font-heading text-4xl leading-[0.98] tracking-[-0.02em] sm:text-5xl">
                A draft plan, not an{" "}
                <span className="italic">autopilot.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-foreground/70">
                Give the planner an idea and a horizon. It proposes milestones
                and tasks. Every field is editable, generation never writes, and
                saving requires one explicit confirmation.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-foreground/85">
                {[
                  "Structured output validated at runtime",
                  "Per-user daily generation quota",
                  "Atomic save; a failed insert saves nothing",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href={user ? "/app/planner" : "/login"}>
                    {user ? "Open planner" : "Sign in to try it"}
                    <Sparkles className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-foreground/20 bg-transparent text-foreground hover:bg-foreground/5 hover:text-foreground"
                >
                  <Link href={user ? "/app/projects" : "/signup"}>
                    {user ? "Browse projects" : "Create an account"}
                  </Link>
                </Button>
              </div>
            </Reveal>

            <HoverLift className="rounded-lg bg-card p-2 text-foreground shadow-2xl shadow-black/20 ring-1 ring-border dark:shadow-black/40">
              <div className="rounded-sm border border-border/70">
                <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                    <p className="text-xs font-medium">Draft · Community run club</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-amber-600/30 bg-amber-500/10 font-normal text-amber-700 dark:text-amber-300"
                  >
                    Not saved
                  </Badge>
                </div>
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                        Project
                      </p>
                      <p className="mt-1 text-sm">Community run club</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                        Horizon
                      </p>
                      <p className="mt-1 text-sm">4 weeks</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                        Milestones
                      </p>
                      <span className="font-mono text-[9px] text-muted-foreground">
                        2
                      </span>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {[
                        "Route library live",
                        "Weekly schedule live",
                      ].map((title, index) => (
                        <li
                          key={title}
                          className="flex items-center justify-between gap-3 rounded-sm border border-border/70 px-3 py-2"
                        >
                          <span className="text-xs">{title}</span>
                          <span className="font-mono text-[9px] text-muted-foreground">
                            W{index + 1}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                        Tasks
                      </p>
                      <span className="font-mono text-[9px] text-muted-foreground">
                        3
                      </span>
                    </div>
                    <ul className="mt-2 divide-y divide-border/70 rounded-sm border border-border/70">
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

                  <div className="flex items-center justify-between border-t border-border/70 pt-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      Generation never writes
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                      Confirm and save
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </div>
            </HoverLift>
          </div>
        </section>

        <Section id="security" className="border-b border-border/70">
          <Reveal className="mx-auto grid max-w-container gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                Security & data
              </p>
              <h2 className="mt-3 max-w-md text-balance font-heading text-4xl leading-[0.98] tracking-[-0.02em] sm:text-5xl">
                Serious where it counts.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                A project tool stores sensitive plans. Monolith enforces
                ownership at the database boundary and keeps provider secrets on
                the server, not in the presentation layer.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/60 px-3 py-2 font-mono text-[10px] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
                auth.uid() → RLS → owner-scoped rows
              </div>
            </div>

            <dl className="divide-y divide-border/80 border-y border-border/80">
              {guarantees.map(([term, description]) => (
                <div
                  key={term}
                  className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {term}
                  </dt>
                  <dd className="text-sm leading-6">{description}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Section>

        <Section className="pb-24">
          <Reveal className="mx-auto grid max-w-container gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                Start now
              </p>
              <h2 className="mt-3 max-w-2xl text-balance font-heading text-5xl leading-[0.95] tracking-[-0.02em] sm:text-6xl">
                Start with the work you actually have.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                One project is enough to test the fit. Add a real milestone,
                move one task, and read the progress from stored records.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              {!user ? (
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign in</Link>
                </Button>
              ) : null}
            </div>
          </Reveal>
        </Section>
      </main>

      <Footer className="border-t border-border/70">
        <div className="mx-auto max-w-container">
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-1">
              <Wordmark />
              <p className="max-w-xs text-xs leading-5 text-muted-foreground">
                A project execution workspace for focused builders. Plans,
                boards, and progress without invented metrics.
              </p>
              <div className="mt-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Appearance
                </p>
                <ThemeSwitcher />
              </div>
            </FooterColumn>
            <FooterColumn>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Product
              </h3>
              <Link href={user ? "/app" : "/login"} className="text-sm hover:text-primary">
                Command Center
              </Link>
              <Link href={user ? "/app/projects" : "/login"} className="text-sm hover:text-primary">
                Projects
              </Link>
              <Link href={user ? "/app/board" : "/login"} className="text-sm hover:text-primary">
                Board
              </Link>
              <Link href={user ? "/app/planner" : "/login"} className="text-sm hover:text-primary">
                Planner
              </Link>
            </FooterColumn>
            <FooterColumn>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Account
              </h3>
              <Link href="/signup" className="text-sm hover:text-primary">
                Create account
              </Link>
              <Link href="/login" className="text-sm hover:text-primary">
                Sign in
              </Link>
              <a
                href="https://github.com/saransh-dev12/monolith"
                className="inline-flex items-center gap-1.5 text-sm hover:text-primary"
              >
                <GitBranch className="size-3.5" aria-hidden="true" />
                Source
              </a>
            </FooterColumn>
          </FooterContent>
          <FooterBottom>
            <p>© 2026 Monolith. Built with Next.js, Supabase, and OpenAI.</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em]">
              v1 · local verification complete
            </p>
          </FooterBottom>
        </div>
      </Footer>
    </div>
  );
}
