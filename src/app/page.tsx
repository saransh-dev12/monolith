import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  GitBranch,
  ShieldCheck,
} from "lucide-react";

import { Wordmark } from "@/components/brand/monolith-mark";
import { PrinciplesMarquee } from "@/components/marketing/principles-marquee";
import { ProductTour } from "@/components/marketing/product-tour";
import { SiteHeader } from "@/components/marketing/site-header";
import { StudioHero } from "@/components/marketing/studio-hero";
import { WorkflowStory } from "@/components/marketing/workflow-story";
import { Magnetic } from "@/components/motion/magnetic";
import { MonolithCanvas } from "@/components/motion/monolith-canvas";
import { Reveal } from "@/components/motion/reveal";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SplitHeading } from "@/components/motion/split-heading";
import { ClickSpark } from "@/components/reactbits/click-spark";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ShineBorder } from "@/components/ui/shine-border";
import { Spotlight } from "@/components/ui/spotlight";
import { getSessionUser } from "@/lib/auth/session";

const trust = ["Auth covered", "RLS enforced", "CSRF guarded"];

export default async function HomePage() {
  const user = await getSessionUser();
  const primaryHref = user ? "/app" : "/signup";
  const primaryLabel = user ? "Open workspace" : "Start a project";
  const secondaryHref = user ? "/app/planner" : "/login";
  const secondaryLabel = user ? "Open the planner" : "Sign in to explore";

  return (
    <SmoothScroll lerp={0.08}>
      <div className="ember-field min-h-dvh overflow-x-clip">
        <MonolithCanvas />
        <div className="grain-overlay" aria-hidden="true" />
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader signedIn={Boolean(user)} />

        <main id="main" className="relative z-10">
          <section className="relative mx-auto w-full max-w-[1240px] px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-24">
            <Spotlight
              className="-top-56 left-0 opacity-60 sm:-top-40 md:left-1/4"
              fill="#ff5429"
            />

            <div className="grid gap-14 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:gap-12">
              <div className="relative z-10 min-w-0">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card px-3 py-1.5">
                  <span
                    className="size-1.5 animate-ember-breathe rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span className="eyebrow text-muted-foreground">
                    Project execution system
                  </span>
                </div>

                <SplitHeading
                  label="Ideas don't ship. Execution does."
                  className="mt-7 display-xl"
                >
                  Ideas don&apos;t ship.
                  <br />
                  <span className="display-em">Execution</span> does.
                </SplitHeading>

                <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
                  Monolith turns a rough idea into a reviewed plan, a working
                  board, and progress you can defend. One system from the first
                  sentence to the last shipped task.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Magnetic strength={7}>
                    <ClickSpark color="var(--color-chart-2)">
                      <Button
                        asChild
                        className="h-11 rounded-full px-6 text-sm"
                      >
                        <Link href={primaryHref}>
                          {primaryLabel}
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </ClickSpark>
                  </Magnetic>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-full border-border px-6 text-sm"
                  >
                    <Link href={secondaryHref}>{secondaryLabel}</Link>
                  </Button>
                </div>

                <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                  {trust.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <Check
                        className="size-3.5 text-primary"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Reveal delay={0.08} className="relative z-10 min-w-0">
                <div className="relative rounded-3xl">
                  <ShineBorder
                    borderWidth={1}
                    duration={18}
                    shineColor={["#ff5429", "#a92316", "#ff9c76"]}
                  />
                  <StudioHero />
                </div>
              </Reveal>
            </div>

            <div className="mt-14 flex items-center gap-4 border-t border-border/70 pt-5 lg:mt-20">
              <span className="eyebrow flex items-center gap-2 text-muted-foreground/70">
                <span
                  className="size-1.5 animate-ember-breathe rounded-full bg-primary"
                  aria-hidden="true"
                />
                Scroll
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-border via-border/50 to-transparent" />
              <span className="eyebrow text-muted-foreground/70">
                Idea → plan → tasks → execution → progress
              </span>
            </div>
          </section>

          <PrinciplesMarquee />

          <WorkflowStory />

          <ProductTour />

          <section
            id="start"
            className="mx-auto w-full max-w-[1240px] px-4 py-20 sm:px-6 lg:py-28"
          >
            <Reveal>
              <Panel className="overflow-hidden p-8 sm:p-12 lg:p-16">
                <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <p className="eyebrow text-primary">Start now</p>
                    <h2 className="mt-4 max-w-2xl display-lg">
                      Start with the work you{" "}
                      <span className="display-em">actually have.</span>
                    </h2>
                    <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                      One project is enough to test the fit. Add a real
                      milestone, move one task, and read progress from stored
                      records.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Magnetic strength={7}>
                      <ClickSpark color="var(--color-chart-2)">
                        <Button
                          asChild
                          className="h-11 rounded-full px-6 text-sm"
                        >
                          <Link href={primaryHref}>
                            {primaryLabel}
                            <ArrowUpRight
                              className="size-4"
                              aria-hidden="true"
                            />
                          </Link>
                        </Button>
                      </ClickSpark>
                    </Magnetic>
                    {!user ? (
                      <Button
                        asChild
                        variant="outline"
                        className="h-11 rounded-full border-border px-6 text-sm"
                      >
                        <Link href="/login">Sign in</Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Panel>
            </Reveal>
          </section>
        </main>

        <footer className="relative z-10 border-t border-border px-4 pb-8 pt-10 sm:px-6">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="grid gap-8 sm:grid-cols-[1.2fr_0.8fr_0.8fr]">
              <div>
                <Wordmark />
                <p className="mt-4 max-w-xs text-xs leading-5 text-muted-foreground">
                  A project execution workspace for focused builders. Plans,
                  boards, and progress without invented metrics.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 eyebrow text-muted-foreground">
                  <ShieldCheck
                    className="size-3.5 text-primary"
                    aria-hidden="true"
                  />
                  RLS on every owner-scoped row
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <h3 className="eyebrow text-muted-foreground">Product</h3>
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
                <h3 className="eyebrow text-muted-foreground">Account</h3>
                <Link
                  href="/signup"
                  className="text-sm text-foreground/80 hover:text-primary"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-foreground/80 hover:text-primary"
                >
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
            <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
              <p>© 2026 Monolith. Built with Next.js, Supabase, and OpenAI.</p>
              <div className="flex items-center gap-5">
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-foreground">
                  Terms
                </Link>
                <p className="eyebrow">Idea → plan → board → progress</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
