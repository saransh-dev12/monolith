import "server-only";

import { jsonError } from "@/lib/api/http";

type ErrorLike = {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
};

export function databaseError(error: ErrorLike | null, fallback: string) {
  if (!error) {
    return jsonError(404, "That record was not found.");
  }

  if (error.code === "date_order") {
    return jsonError(400, error.message);
  }

  if (error.code === "23514" || error.code === "23502") {
    return jsonError(400, "Some values are not allowed. Check the form and try again.");
  }

  if (error.code === "23503") {
    return jsonError(400, "That related record no longer exists.");
  }

  if (error.code === "42501") {
    return jsonError(404, "That record was not found or is not yours.");
  }

  if (error.code === "22P02") {
    return jsonError(400, "That identifier is not valid.");
  }

  if (error.code === "PGRST116") {
    return jsonError(404, "That record was not found.");
  }

  console.error(fallback, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });

  return jsonError(500, fallback);
}
