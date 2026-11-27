import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  getSupabaseConfig: () => ({ url: "https://supabase.example", publishableKey: "public-test-key" }),
}));

import { GET } from "./route";

afterEach(() => vi.unstubAllGlobals());

describe("health endpoint", () => {
  it("reports auth reachability without claiming database verification", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ name: "auth" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: "ok", auth: "reachable", database: "unverified", service: "auth" });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe("https://supabase.example/auth/v1/health");
  });

  it.each(["response", "network"])("reports degraded auth on %s failure without asserting database status", async (failure) => {
    vi.stubGlobal("fetch", failure === "response" ? vi.fn().mockResolvedValue(new Response(null, { status: 503 })) : vi.fn().mockRejectedValue(new Error("network")));
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ status: "degraded", auth: "unreachable", database: "unverified" });
  });
});
