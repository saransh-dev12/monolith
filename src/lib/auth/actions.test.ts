import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  redirect: vi.fn((path: string) => { throw new Error(`redirect:${path}`); }),
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("@/lib/supabase/admin-server", () => ({ createAdminClient: vi.fn() }));
vi.mock("@/lib/env", () => ({ getSiteUrl: () => "https://monolith.example" }));

import { signInAction, signUpAction } from "./actions";

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("authentication actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createClient.mockResolvedValue({ auth: { signInWithPassword: mocks.signIn, signUp: mocks.signUp } });
  });

  it("signs in and only redirects to a safe local destination", async () => {
    mocks.signIn.mockResolvedValue({ error: null });
    await expect(signInAction({}, form({ email: "user@example.com", password: "password", next: "//attacker.example" }))).rejects.toThrow("redirect:/app");
    expect(mocks.signIn).toHaveBeenCalledWith({ email: "user@example.com", password: "password" });
  });

  it("returns an actionable error without exposing service details", async () => {
    mocks.signIn.mockResolvedValue({ error: { message: "Invalid login credentials" } });
    await expect(signInAction({}, form({ email: "user@example.com", password: "wrong" }))).resolves.toEqual({ error: "Email or password is incorrect." });
    mocks.createClient.mockRejectedValue(new Error("secret service detail"));
    await expect(signInAction({}, form({ email: "user@example.com", password: "wrong" }))).resolves.toEqual({ error: "Sign in is temporarily unavailable. Please try again later." });
  });

  it("requires email confirmation when sign-up has no session", async () => {
    mocks.signUp.mockResolvedValue({ data: { session: null }, error: null });
    const result = await signUpAction({}, form({ displayName: "Ada", email: "ada@example.com", password: "password" }));
    expect(result.message).toMatch(/confirm your email/i);
    expect(mocks.signUp).toHaveBeenCalledWith(expect.objectContaining({ options: expect.objectContaining({ emailRedirectTo: "https://monolith.example/auth/callback?next=/app" }) }));
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("redirects immediately when sign-up creates a session", async () => {
    mocks.signUp.mockResolvedValue({ data: { session: {} }, error: null });
    await expect(signUpAction({}, form({ displayName: "Ada", email: "ada@example.com", password: "password" }))).rejects.toThrow("redirect:/app");
  });
});
