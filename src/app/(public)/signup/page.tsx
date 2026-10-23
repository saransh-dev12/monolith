import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import { signUpAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "Create an account · Monolith",
};

export default function SignupPage() {
  return <AuthForm mode="signup" action={signUpAction} />;
}
