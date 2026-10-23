import { NextResponse, type NextRequest } from "next/server";

import { databaseError } from "@/lib/api/db";
import {
  hasValidOrigin,
  jsonError,
  readJson,
  validationError,
} from "@/lib/api/http";
import { requireApiUser } from "@/lib/auth/session";
import { deleteMilestone, updateMilestone } from "@/lib/data/milestones";
import { milestoneUpdateSchema } from "@/lib/validation/schemas";

export async function PATCH(
  request: NextRequest,
  context: RouteContext<"/api/milestones/[milestoneId]">,
) {
  if (!hasValidOrigin(request)) {
    return jsonError(403, "This request came from an unexpected origin.");
  }

  const user = await requireApiUser();
  if (!user) {
    return jsonError(401, "Sign in to update a milestone.");
  }

  const { milestoneId } = await context.params;
  const body = await readJson(request);
  if (body === undefined) {
    return jsonError(400, "Send a valid JSON body.");
  }

  const parsed = milestoneUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  if (Object.keys(parsed.data).length === 0) {
    return jsonError(422, "Provide at least one field to update.");
  }

  const { data, error } = await updateMilestone(milestoneId, parsed.data);

  if (error) {
    return databaseError(error, "Could not update the milestone.");
  }

  if (!data) {
    return jsonError(404, "That milestone was not found.");
  }

  return NextResponse.json({ milestone: data });
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext<"/api/milestones/[milestoneId]">,
) {
  if (!hasValidOrigin(request)) {
    return jsonError(403, "This request came from an unexpected origin.");
  }

  const user = await requireApiUser();
  if (!user) {
    return jsonError(401, "Sign in to delete a milestone.");
  }

  const { milestoneId } = await context.params;
  const { data, error } = await deleteMilestone(milestoneId);

  if (error) {
    return databaseError(error, "Could not delete the milestone.");
  }

  if (!data || data.length === 0) {
    return jsonError(404, "That milestone was not found.");
  }

  return NextResponse.json({ deleted: true });
}
