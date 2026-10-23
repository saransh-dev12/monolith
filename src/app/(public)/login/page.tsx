import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import { signInAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "Sign in · Monolith",
};

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const nextParam = searchParams.next;
  const next = typeof nextParam === "string" ? nextParam : undefined;
  const errorParam = searchParams.error;

  return (
    <AuthForm
      mode="login"
      action={signInAction}
      next={next}
      showDemoHint={process.env.NODE_ENV !== "production"}
      notice={
        errorParam === "callback"
          ? "That sign-in link could not be verified. Try signing in again."
          : undefined
      }
    />
  );
}
