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
    <div className="flex min-h-96 flex-col items-center justify-center rounded-lg border border-border/60 bg-card/20 px-6 py-14 text-center">
      <AlertTriangle className="size-6 text-amber-400" aria-hidden="true" />
      <h1 className="mt-4 text-lg font-medium">This view could not load</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        The workspace hit an unexpected error. Try again, or return to the
        Command Center.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-5 flex gap-2">
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
