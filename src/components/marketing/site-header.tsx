"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { Wordmark } from "@/components/brand/monolith-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sections = [
  { href: "#story", label: "Workflow" },
  { href: "#product", label: "Workspace" },
  { href: "#start", label: "Start" },
];

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/95"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="Monolith home" className="shrink-0">
          <Wordmark />
        </Link>

        <nav
          aria-label="Product sections"
          className="hidden items-center gap-5 text-[13px] text-muted-foreground lg:flex"
        >
          {sections.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="transition-colors hover:text-foreground"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {signedIn ? (
            <Button asChild className="h-9 rounded-full px-4">
              <Link href="/app">
                Open workspace
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="h-9 rounded-full px-3 text-[13px]"
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="h-9 rounded-full px-4 text-[13px]">
                <Link href="/signup">
                  <span className="hidden sm:inline">Start a project</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-primary via-primary to-chart-4"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}
