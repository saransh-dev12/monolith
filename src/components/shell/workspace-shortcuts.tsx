"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SHORTCUTS: Record<string, string> = {
  "1": "/app",
  "2": "/app/projects",
  "3": "/app/board",
  "4": "/app/planner",
};

/**
 * Workspace navigation shortcuts: ⌘1–⌘4 (Ctrl on Windows/Linux).
 * Command palette (⌘K) is handled separately.
 */
export function WorkspaceShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) {
        return;
      }
      const target = SHORTCUTS[event.key];
      if (target && !event.defaultPrevented) {
        const active = document.activeElement;
        const typing =
          active instanceof HTMLElement &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.isContentEditable);
        if (typing) return;
        event.preventDefault();
        router.push(target);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
