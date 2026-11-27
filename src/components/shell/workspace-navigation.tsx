"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  Archive,
  Columns3,
  FolderKanban,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

const links = [
  { href: "/app", label: "Command Center", icon: LayoutDashboard, exact: true },
  {
    href: "/app/projects",
    label: "Projects",
    icon: FolderKanban,
    exact: false,
  },
  { href: "/app/board", label: "Board", icon: Columns3, exact: false },
  { href: "/app/planner", label: "Planner", icon: Sparkles, exact: false },
  {
    href: "/app/projects?archived=1",
    label: "Archived",
    icon: Archive,
    exact: false,
  },
] as const;

export function WorkspaceNavigation() {
  const pathname = usePathname();
  const params = useSearchParams();
  const reduced = useReducedMotion();
  return (
    <nav
      aria-label="Workspace"
      data-overflow-clip
      className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max items-center gap-1 p-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const archived =
            pathname === "/app/projects" && params.get("archived") === "1";
          const active = href.includes("?")
            ? archived
            : !(href === "/app/projects" && archived) &&
              (exact ? pathname === href : pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`group relative flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "text-foreground" : "text-muted-foreground"}`}
            >
              {active && (
                <motion.span
                  layoutId="top-nav-active"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 480, damping: 38 }
                  }
                  className="absolute inset-0 rounded-xl border border-primary/20 bg-primary/15"
                  aria-hidden="true"
                />
              )}
              <Icon className="relative size-4" aria-hidden="true" />
              <span className="relative whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
