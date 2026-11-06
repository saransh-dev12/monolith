import Link from "next/link";

import { Wordmark } from "@/components/brand/monolith-mark";

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ember-field min-h-dvh">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-[720px] px-6 py-12 sm:py-16">
        <Link href="/" aria-label="Monolith home" className="inline-flex">
          <Wordmark />
        </Link>
        <p className="eyebrow mt-10 text-primary">Legal</p>
        <h1 className="mt-3 display-lg">{title}</h1>
        <p className="mt-2 num text-[11px] text-muted-foreground">
          Last updated {updated}
        </p>
        <div className="mt-10 space-y-8 text-sm leading-6 text-foreground/85 [&_h2]:font-display [&_h2]:text-xl [&_h2]:leading-tight [&_h2]:text-foreground [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-foreground">
          {children}
        </div>
        <div className="mt-14 flex items-center justify-between border-t border-border/70 pt-6 text-xs text-muted-foreground">
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
          <Link href="/" className="hover:text-foreground">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
