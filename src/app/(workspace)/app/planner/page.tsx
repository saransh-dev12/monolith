import Link from "next/link";
import { Plus } from "lucide-react";

import { PlannerWorkspace } from "@/components/planner/planner-workspace";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { isPlannerConfigured } from "@/lib/ai/planner";
import { requireUser } from "@/lib/auth/session";
import { getPlannerUsage } from "@/lib/data/planner";

export const metadata = {
  title: "Planner · Monolith",
};

export default async function PlannerPage() {
  await requireUser();
  const quota = await getPlannerUsage();
  const configured = isPlannerConfigured();

  return (
    <>
      <PageHeader
        title="Planner"
        description="Start with an idea. Review the draft, edit it, and confirm only when the plan is worth keeping."
        actions={
          <Button asChild variant="outline">
            <Link href="/app/projects">
              <Plus className="size-4" aria-hidden="true" />
              New project manually
            </Link>
          </Button>
        }
      />
      <PlannerWorkspace configured={configured} initialQuota={quota} />
    </>
  );
}
