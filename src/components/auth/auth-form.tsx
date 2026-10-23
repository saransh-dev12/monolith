"use client";

import Link from "next/link";
import { useActionState } from "react";
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
    <Card className="w-full max-w-md border-border/70 bg-card/70 shadow-2xl shadow-black/20 backdrop-blur">
      <CardHeader>
        <h1 className="font-heading text-3xl leading-tight tracking-[-0.01em]">
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

          <Button type="submit" className="w-full" disabled={pending}>
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
  );
}
