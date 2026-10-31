import { afterEach, describe, expect, it, vi } from "vitest";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/lib/supabase/quota-server", () => ({
  createQuotaClient: () => ({ rpc }),
}));

import { releasePlannerGeneration, reservePlannerGeneration } from "./planner";

afterEach(() => {
  vi.unstubAllEnvs();
  rpc.mockReset();
});

describe("server planner quota", () => {
  it("reserves quota for the supplied verified user and server limit", async () => {
    vi.stubEnv("PLANNER_DAILY_LIMIT", "3");
    rpc.mockResolvedValue({ data: [{ allowed: true, used: 1, quota: 3, remaining: 2 }], error: null });
    await expect(reservePlannerGeneration("verified-user")).resolves.toEqual({
      allowed: true, used: 1, limit: 3, remaining: 2,
    });
    expect(rpc).toHaveBeenCalledWith("consume_planner_generation", {
      p_user_id: "verified-user", p_limit: 3,
    });
  });

  it("releases the reservation for the same user", async () => {
    rpc.mockResolvedValue({ error: null });
    await releasePlannerGeneration("verified-user");
    expect(rpc).toHaveBeenCalledWith("release_planner_generation", { p_user_id: "verified-user" });
  });
});
