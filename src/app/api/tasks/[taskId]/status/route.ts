import { NextResponse, type NextRequest } from "next/server";

import { databaseError } from "@/lib/api/db";
import {
  hasValidOrigin,
  jsonError,
  readJson,
  validationError,
} from "@/lib/api/http";
import { requireApiUser } from "@/lib/auth/session";
import { updateTaskStatus } from "@/lib/data/tasks";
import { taskStatusUpdateSchema } from "@/lib/validation/schemas";

export async function PATCH(
  request: NextRequest,
  context: RouteContext<"/api/tasks/[taskId]/status">,
) {
  if (!hasValidOrigin(request)) {
    return jsonError(403, "This request came from an unexpected origin.");
  }

  const user = await requireApiUser();
  if (!user) {
    return jsonError(401, "Sign in to move a task.");
  }

  const { taskId } = await context.params;
  const body = await readJson(request);
  if (body === undefined) {
    return jsonError(400, "Send a valid JSON body.");
  }

  const parsed = taskStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { data, error } = await updateTaskStatus(taskId, parsed.data);

  if (error) {
    return databaseError(error, "Could not move the task.");
  }

  if (!data) {
    return jsonError(404, "That task was not found.");
  }

  return NextResponse.json({ task: data });
}
