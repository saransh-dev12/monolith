"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Columns3,
  FolderKanban,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/app", label: "Command Center", icon: LayoutDashboard, exact: true },
  { href: "/app/projects", label: "Projects", icon: FolderKanban, exact: false },
  { href: "/app/board", label: "Board", icon: Columns3, exact: false },
  { href: "/app/planner", label: "Planner", icon: Sparkles, exact: false },
] as const;

export function WorkspaceNav({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Workspace"
      className={cn(
        variant === "desktop"
          ? "flex flex-col gap-1"
          : "flex items-center gap-0.5 overflow-x-auto px-2 pb-2",
      )}
    >
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              variant === "desktop"
                ? "gap-2.5 px-3 py-2 text-sm"
                : "gap-1.5 px-2.5 py-1.5 text-xs",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              variant === "mobile" && "shrink-0",
            )}
          >
            <item.icon
              className={variant === "desktop" ? "size-4" : "size-3.5"}
              aria-hidden="true"
            />
            {variant === "mobile" && item.label === "Command Center"
              ? "Home"
              : item.label}
          </Link>
        );
      })}
    </nav>
  );
}
