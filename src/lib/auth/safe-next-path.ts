const INTERNAL_ORIGIN = "https://monolith.invalid";

/** Accept only local paths, including after URL normalization. */
export function safeNextPath(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    /[\\\u0000-\u001f\u007f]|%(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i.test(value)
  ) {
    return "/app";
  }

  try {
    const url = new URL(value, INTERNAL_ORIGIN);
    if (url.origin !== INTERNAL_ORIGIN || url.pathname.startsWith("//")) return "/app";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/app";
  }
}
