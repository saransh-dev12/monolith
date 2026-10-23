import { NextResponse, type NextRequest } from "next/server";

import { databaseError } from "@/lib/api/db";
import {
  hasValidOrigin,
  jsonError,
  readJson,
  validationError,
} from "@/lib/api/http";
import { requireApiUser } from "@/lib/auth/session";
import { createMilestone } from "@/lib/data/milestones";
import { milestoneCreateSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) {
    return jsonError(403, "This request came from an unexpected origin.");
  }

  const user = await requireApiUser();
  if (!user) {
    return jsonError(401, "Sign in to create a milestone.");
  }

  const body = await readJson(request);
  if (body === undefined) {
    return jsonError(400, "Send a valid JSON body.");
  }

  const parsed = milestoneCreateSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { data, error } = await createMilestone(parsed.data);

  if (error) {
    return databaseError(error, "Could not create the milestone.");
  }

  return NextResponse.json({ milestone: data }, { status: 201 });
}
