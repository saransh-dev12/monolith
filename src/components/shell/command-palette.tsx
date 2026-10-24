"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Columns3,
  FolderKanban,
  LayoutDashboard,
  Search,
  Sparkles,
} from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const destinations = [
  { href: "/app", label: "Command Center", icon: LayoutDashboard },
  { href: "/app/projects", label: "Projects", icon: FolderKanban },
  { href: "/app/board", label: "Board", icon: Columns3 },
  { href: "/app/planner", label: "Planner", icon: Sparkles },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center gap-2 rounded-md border border-border/80 bg-background px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open command menu"
      >
        <Search className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Jump to</span>
        <kbd className="ml-1 hidden rounded border border-border/80 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Monolith command menu"
        description="Jump to a workspace area"
      >
        <Command>
          <CommandInput placeholder="Jump to a page..." />
          <CommandList>
            <CommandEmpty>No destination found.</CommandEmpty>
            <CommandGroup heading="Workspace">
              {destinations.map((destination) => (
                <CommandItem
                  key={destination.href}
                  value={destination.label}
                  onSelect={() => go(destination.href)}
                >
                  <destination.icon className="size-4" aria-hidden="true" />
                  {destination.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Library">
              <CommandItem
                value="Archived projects"
                onSelect={() => go("/app/projects?archived=1")}
              >
                <FolderKanban className="size-4" aria-hidden="true" />
                Archived projects
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
