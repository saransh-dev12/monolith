type ApiFieldError = { path: string; message: string };

type ApiEnvelope = {
  error?: string;
  fields?: ApiFieldError[];
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; fields?: ApiFieldError[] };

export async function apiRequest<T>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<ApiResult<T>> {
  let response: Response;

  try {
    response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    return { ok: false, message: "The network request failed. Try again." };
  }

  let payload: (ApiEnvelope & T) | null = null;

  try {
    payload = (await response.json()) as (ApiEnvelope & T) | null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    return {
      ok: false,
      message: payload?.error ?? "The request could not be completed.",
      fields: payload?.fields,
    };
  }

  return { ok: true, data: payload as T };
}
