import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";

type FieldError = {
  path: string;
  message: string;
};

export function jsonError(
  status: number,
  message: string,
  fields?: FieldError[],
) {
  return NextResponse.json(
    { error: message, ...(fields ? { fields } : {}) },
    { status },
  );
}

export function validationError(error: ZodError) {
  return jsonError(
    422,
    "Some fields need attention.",
    error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  );
}

export async function readJson(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

export function hasValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  return origin === new URL(request.url).origin;
}
