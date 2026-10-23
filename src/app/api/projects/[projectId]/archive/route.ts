import { NextResponse, type NextRequest } from "next/server";

import { databaseError } from "@/lib/api/db";
import {
  hasValidOrigin,
  jsonError,
  readJson,
  validationError,
} from "@/lib/api/http";
import { requireApiUser } from "@/lib/auth/session";
import { setProjectArchived } from "@/lib/data/projects";
import { projectArchiveSchema } from "@/lib/validation/schemas";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/projects/[projectId]/archive">,
) {
  if (!hasValidOrigin(request)) {
    return jsonError(403, "This request came from an unexpected origin.");
  }

  const user = await requireApiUser();
  if (!user) {
    return jsonError(401, "Sign in to archive a project.");
  }

  const { projectId } = await context.params;
  const body = await readJson(request);
  if (body === undefined) {
    return jsonError(400, "Send a valid JSON body.");
  }

  const parsed = projectArchiveSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { data, error } = await setProjectArchived(projectId, parsed.data.archived);

  if (error) {
    return databaseError(error, "Could not archive the project.");
  }

  if (!data) {
    return jsonError(404, "That project was not found.");
  }

  return NextResponse.json({ project: data });
}
