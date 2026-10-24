"use client";

import Link from "next/link";
import { useActionState } from "react";
import { motion } from "motion/react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthState } from "@/lib/auth/state";

type AuthAction = (
  state: AuthState,
  formData: FormData,
) => Promise<AuthState>;

type AuthFormProps = {
  mode: "login" | "signup";
  action: AuthAction;
  next?: string;
  showDemoHint?: boolean;
  notice?: string;
};

const initialState: AuthState = {};

export function AuthForm({
  mode,
  action,
  next,
  showDemoHint = false,
  notice,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isSignup = mode === "signup";

  return (
    <motion.div
      data-motion-reveal
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
    <Card className="w-full gap-5 rounded-2xl border-border/70 bg-card/90 shadow-[0_32px_80px_-48px_rgba(0,0,0,0.9)] backdrop-blur">
      <CardHeader>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          {isSignup ? "New workspace" : "Workspace access"}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-none tracking-[-0.01em]">
          {isSignup ? "Create your workspace" : "Welcome back"}
        </h1>
        <CardDescription>
          {isSignup
            ? "Start turning loose ideas into milestones and tasks."
            : "Sign in to pick up where you left off."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {next ? <input type="hidden" name="next" value={next} /> : null}

          {notice ? (
            <p
              role="status"
              className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
            >
              {notice}
            </p>
          ) : null}

          {isSignup ? (
            <div className="space-y-2">
              <Label htmlFor="displayName">Name</Label>
              <Input
                id="displayName"
                name="displayName"
                autoComplete="name"
                placeholder="Ada Lovelace"
                maxLength={80}
                required
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              maxLength={254}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={isSignup ? 8 : undefined}
              maxLength={72}
              required
            />
            {isSignup ? (
              <p className="text-xs text-muted-foreground">
                At least 8 characters.
              </p>
            ) : null}
          </div>

          {state.error ? (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state.error}
            </p>
          ) : null}

          {state.message ? (
            <p
              role="status"
              className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
            >
              {state.message}
            </p>
          ) : null}

          <Button type="submit" className="w-full rounded-full" disabled={pending}>
            {pending ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {isSignup ? "Create account" : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3 text-sm text-muted-foreground">
        <p>
          {isSignup ? "Already have an account?" : "New to Monolith?"}{" "}
          <Link
            className="font-medium text-foreground underline-offset-4 hover:underline"
            href={isSignup ? "/login" : "/signup"}
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
        {showDemoHint ? (
          <p className="w-full rounded-md border border-border/70 bg-muted/30 px-3 py-2 text-xs">
            Local demo: demo@monolith.local / monolith-demo
          </p>
        ) : null}
      </CardFooter>
    </Card>
    </motion.div>
  );
}
