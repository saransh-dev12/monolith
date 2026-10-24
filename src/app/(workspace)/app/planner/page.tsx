import { PlannerWorkspace } from "@/components/planner/planner-workspace";
import { PageHeader } from "@/components/shell/page-header";
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
      />
      <PlannerWorkspace configured={configured} initialQuota={quota} />
    </>
  );
}
