"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { signInAction, signUpAction } from "@/lib/auth/actions";

type Mode = "login" | "signup";

export function AuthDialog({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest("a[href]");
    if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute("download")) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.search || url.hash) return;
    if (url.pathname !== "/login" && url.pathname !== "/signup") return;
    event.preventDefault();
    opener.current = link;
    setMode(url.pathname === "/login" ? "login" : "signup");
  }

  return (
    <>
      <div onClickCapture={handleClick}>{children}</div>
      <Dialog open={mode !== null} onOpenChange={(open) => { if (!open) setMode(null); }}>
        <DialogContent
          className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border border-border bg-card p-0 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:max-w-md"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
        >
          {mode ? (
            <AuthForm
              key={mode}
              embedded
              mode={mode}
              action={mode === "login" ? signInAction : signUpAction}
              onSwitchMode={() => setMode(mode === "login" ? "signup" : "login")}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
