"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";

import { MonolithMark } from "@/components/brand/monolith-mark";
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
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
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
  embedded?: boolean;
  onSwitchMode?: () => void;
};

const initialState: AuthState = {};

export function AuthForm({
  mode,
  action,
  next,
  showDemoHint = false,
  notice,
  embedded = false,
  onSwitchMode,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === "signup";

  return (
    <motion.div
      data-motion-reveal
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
    <Card className={embedded ? "w-full gap-0 rounded-none border-0 bg-card py-0 shadow-none ring-0 [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]" : "w-full gap-5 rounded-2xl border-border/70 bg-card shadow-[0_32px_80px_-48px_rgba(0,0,0,0.9)]"}>
      {embedded ? (
        <div className="flex items-center gap-3 px-6 pb-6 pt-6 sm:px-8 sm:pt-8">
          <span className="grid size-9 place-items-center bg-primary text-primary-foreground" aria-hidden="true">
            <MonolithMark className="size-4" />
          </span>
          <span className="font-brand text-lg font-semibold tracking-[-0.02em]">Monolith</span>
        </div>
      ) : null}
      <CardHeader className={embedded ? "gap-0" : undefined}>
        {embedded ? (
          <>
            <DialogTitle className="pr-8 font-display text-[2rem] leading-[1.1] tracking-[-0.02em] sm:text-4xl">
              {isSignup ? "Create your workspace" : "Welcome back"}
            </DialogTitle>
            <DialogDescription className="mt-3 text-[15px] leading-6">
              {isSignup ? "Turn your next idea into work that moves." : "Sign in to continue your work."}
            </DialogDescription>
          </>
        ) : (
          <>
            <h1 className="font-brand text-3xl font-semibold leading-tight tracking-[-0.02em]">
              {isSignup ? "Create your workspace" : "Welcome back"}
            </h1>
            <CardDescription>
              {isSignup ? "Turn your next idea into work that moves." : "Sign in to pick up where you left off."}
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className={embedded ? "mt-6" : undefined}>
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
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                autoFocus={embedded}
                className="h-12 px-3 text-base md:text-base"
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              autoFocus={embedded && !isSignup}
              className="h-12 px-3 text-base md:text-base"
              placeholder="you@example.com"
              maxLength={254}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={isSignup ? 8 : undefined}
                maxLength={72}
                className="h-12 px-3 pr-12 text-base md:text-base"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              </button>
            </div>
            {isSignup ? (
              <p className="text-sm leading-5 text-muted-foreground">
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

          <Button type="submit" className="h-12 w-full rounded-lg text-[15px] font-medium" disabled={pending}>
            {pending ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {isSignup ? "Create account" : "Sign in"}
            {!pending ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
          </Button>
        </form>
      </CardContent>
      <CardFooter className={embedded ? "flex-col items-start gap-3 border-0 bg-transparent pb-6 pt-5 text-[15px] leading-6 text-muted-foreground sm:pb-8" : "flex-col gap-3 text-sm text-muted-foreground"}>
        <p>
          {isSignup ? "Already have an account?" : "New to Monolith?"}{" "}
          {onSwitchMode ? <button type="button" onClick={onSwitchMode} className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            {isSignup ? "Sign in" : "Create an account"}
          </button> : <Link
            className="font-medium text-foreground underline-offset-4 hover:underline"
            href={isSignup ? "/login" : "/signup"}
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>}
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
