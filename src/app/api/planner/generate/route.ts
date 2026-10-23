import { NextResponse, type NextRequest } from "next/server";

import {
  generateModelPlan,
  isPlannerConfigured,
  PlannerConfigError,
  PlannerOutputError,
  PlannerProviderError,
} from "@/lib/ai/planner";
import {
  hasValidOrigin,
  jsonError,
  readJson,
  validationError,
} from "@/lib/api/http";
import { requireApiUser } from "@/lib/auth/session";
import {
  releasePlannerGeneration,
  reservePlannerGeneration,
} from "@/lib/data/planner";
import { todayIsoDate } from "@/lib/format";
import { buildPlannerPreview } from "@/lib/planner/transform";
import { plannerInputSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) {
    return jsonError(403, "This request came from an unexpected origin.");
  }

  const user = await requireApiUser();
  if (!user) {
    return jsonError(401, "Sign in to generate a plan.");
  }

  const body = await readJson(request);
  if (body === undefined) {
    return jsonError(400, "Send a valid JSON body.");
  }

  const parsed = plannerInputSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  if (!isPlannerConfigured()) {
    return NextResponse.json(
      {
        error:
          "AI planning is not configured on this deployment. Add OPENAI_API_KEY and OPENAI_MODEL on the server.",
        code: "not_configured",
      },
      { status: 503 },
    );
  }

  let reservation;

  try {
    reservation = await reservePlannerGeneration();
  } catch {
    return jsonError(500, "Could not check the planning quota. Try again.");
  }

  const quota = {
    used: reservation.used,
    limit: reservation.limit,
    remaining: reservation.remaining,
  };

  if (!reservation.allowed) {
    return NextResponse.json(
      {
        error: `You have used today's ${reservation.limit} plan generations. Try again tomorrow.`,
        code: "quota_exceeded",
        quota,
      },
      { status: 429 },
    );
  }

  try {
    const modelPlan = await generateModelPlan(parsed.data);
    const plan = buildPlannerPreview(modelPlan, todayIsoDate());

    return NextResponse.json({ plan, quota });
  } catch (error) {
    await releasePlannerGeneration();

    if (error instanceof PlannerConfigError) {
      return NextResponse.json(
        {
          error:
            "AI planning is not configured on this deployment. Add OPENAI_API_KEY and OPENAI_MODEL on the server.",
          code: "not_configured",
        },
        { status: 503 },
      );
    }

    if (error instanceof PlannerOutputError) {
      return jsonError(
        502,
        "The model returned a plan that could not be read. Try again.",
      );
    }

    if (error instanceof PlannerProviderError) {
      return jsonError(
        502,
        "The planning model did not respond. Try again in a moment.",
      );
    }

    console.error("Unexpected planner failure", {
      name: error instanceof Error ? error.name : "unknown",
    });

    return jsonError(500, "The plan could not be generated. Try again.");
  }
}
