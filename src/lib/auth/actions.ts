"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { safeNextPath } from "@/lib/auth/safe-next-path";
import { getSiteUrl } from "@/lib/env";
import type { AuthState } from "@/lib/auth/state";
import { createClient } from "@/lib/supabase/server";

const emailSchema = z.email("Enter a valid email address.").trim().max(254);
const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Use 72 characters or fewer.");

function authErrorMessage(message: string): string {
  if (/invalid login credentials/i.test(message)) {
    return "Email or password is incorrect.";
  }

  if (/email not confirmed/i.test(message)) {
    return "Confirm your email address before signing in.";
  }

  if (/already registered|already exists/i.test(message)) {
    return "An account with that email already exists.";
  }

  if (/rate limit|too many/i.test(message)) {
    return "Too many attempts. Wait a moment and try again.";
  }

  return "We could not complete that request. Try again.";
}

export async function signInAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = emailSchema.safeParse(formData.get("email"));
  const password = z
    .string()
    .min(1, "Enter your password.")
    .safeParse(formData.get("password"));

  if (!email.success) {
    return { error: email.error.issues[0]?.message };
  }

  if (!password.success) {
    return { error: password.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.data,
    password: password.data,
  });

  if (error) {
    return { error: authErrorMessage(error.message) };
  }

  const destination = safeNextPath(formData.get("next"));

  redirect(destination);
}

export async function signUpAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const displayName = z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(80, "Use 80 characters or fewer.")
    .safeParse(formData.get("displayName"));
  const email = emailSchema.safeParse(formData.get("email"));
  const password = passwordSchema.safeParse(formData.get("password"));

  if (!displayName.success) {
    return { error: displayName.error.issues[0]?.message };
  }

  if (!email.success) {
    return { error: email.error.issues[0]?.message };
  }

  if (!password.success) {
    return { error: password.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.data,
    password: password.data,
    options: {
      data: { display_name: displayName.data },
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/app`,
    },
  });

  if (error) {
    return { error: authErrorMessage(error.message) };
  }

  if (!data.session) {
    return {
      message:
        "Check your inbox to confirm your email, then sign in to open the workspace.",
    };
  }

  redirect("/app");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
