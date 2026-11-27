"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="command-glass flex min-h-80 flex-col items-start justify-center rounded-2xl px-6 py-12 sm:px-10">
      <AlertTriangle className="size-5 text-primary" aria-hidden="true" />
      <h1 className="mt-5 font-brand text-2xl font-semibold">This view could not load</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        The workspace hit an unexpected error. Try again, or return to the
        Command Center.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/app">Command Center</Link>
        </Button>
      </div>
    </div>
  );
}
