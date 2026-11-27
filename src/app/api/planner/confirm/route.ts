import { NextResponse, type NextRequest } from "next/server";

import {
  hasValidOrigin,
  jsonError,
  readJson,
  validationError,
} from "@/lib/api/http";
import { requireApiUser } from "@/lib/auth/session";
import { saveReviewedPlan } from "@/lib/data/planner";
import { plannerConfirmationSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) {
    return jsonError(403, "This request came from an unexpected origin.");
  }

  const user = await requireApiUser();
  if (!user) {
    return jsonError(401, "Sign in to save a plan.");
  }

  const body = await readJson(request);
  if (body === undefined) {
    return jsonError(400, "Send a valid JSON body.");
  }

  const parsed = plannerConfirmationSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { data, error } = await saveReviewedPlan(
    parsed.data,
    parsed.data.confirmationId,
  );

  if (error) {
    if (error.code === "P0003") {
      return jsonError(
        409,
        "This confirmation was already used for a different plan.",
      );
    }
    if (error.code === "P0002") {
      return jsonError(
        410,
        "The project created by this confirmation was deleted.",
      );
    }
    if (
      error.code === "P0001" ||
      error.code === "22023" ||
      error.code === "23514" ||
      error.code === "23502"
    ) {
      return jsonError(
        400,
        "The plan could not be saved. Check the titles, dates, and item counts.",
      );
    }

    if (error.code === "42501") {
      return jsonError(401, "Your session is not allowed to save this plan.");
    }

    console.error("Could not persist a reviewed plan", {
      code: error.code,
      message: error.message,
    });

    return jsonError(500, "The plan could not be saved. Try again.");
  }

  if (!data) {
    return jsonError(500, "The plan was saved without a project id.");
  }

  return NextResponse.json({ projectId: data }, { status: 201 });
}
