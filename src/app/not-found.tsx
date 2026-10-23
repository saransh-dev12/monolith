import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        That page does not exist
      </h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Check the address, or head back to the workspace.
      </p>
      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link href="/app">Open workspace</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
