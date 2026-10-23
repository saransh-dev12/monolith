import { NextResponse, type NextRequest } from "next/server";

import { databaseError } from "@/lib/api/db";
import {
  hasValidOrigin,
  jsonError,
  readJson,
  validationError,
} from "@/lib/api/http";
import { requireApiUser } from "@/lib/auth/session";
import { createTask } from "@/lib/data/tasks";
import { taskCreateSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) {
    return jsonError(403, "This request came from an unexpected origin.");
  }

  const user = await requireApiUser();
  if (!user) {
    return jsonError(401, "Sign in to create a task.");
  }

  const body = await readJson(request);
  if (body === undefined) {
    return jsonError(400, "Send a valid JSON body.");
  }

  const parsed = taskCreateSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { data, error } = await createTask(parsed.data);

  if (error) {
    return databaseError(error, "Could not create the task.");
  }

  return NextResponse.json({ task: data }, { status: 201 });
}
