import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-lg border border-border/60 bg-card/20 px-6 py-14 text-center">
      <h1 className="text-lg font-medium">Project not found</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        It may have been deleted, archived under another view, or it belongs to a
        different account. Monolith never reveals another user&apos;s rows.
      </p>
      <Button asChild className="mt-5" variant="outline">
        <Link href="/app/projects">Back to projects</Link>
      </Button>
    </div>
  );
}
