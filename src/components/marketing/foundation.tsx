// Structural primitives adapted from Launch UI (MIT License).
// Copyright (c) 2024 Mikolaj Dobrucki. See docs/design-sources.md for the notice.
import * as React from "react";

import { cn } from "@/lib/utils";

function Section({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="section"
      className={cn("px-4 py-16 sm:px-6 sm:py-24 md:py-28", className)}
      {...props}
    />
  );
}

function LayoutLines({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 top-0 -z-10 hidden lg:block",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex h-full w-full max-w-container flex-col border-x border-dashed border-border/60" />
    </section>
  );
}

function Navbar({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="navbar"
      className={cn("flex items-center justify-between py-4", className)}
      {...props}
    />
  );
}

function NavbarLeft({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-left"
      className={cn("flex items-center justify-start gap-6", className)}
      {...props}
    />
  );
}

function NavbarRight({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-right"
      className={cn("flex items-center justify-end gap-3", className)}
      {...props}
    />
  );
}

function Footer({ className, ...props }: React.ComponentProps<"footer">) {
  return <footer className={cn("px-4 pb-6 sm:px-6", className)} {...props} />;
}

function FooterContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="footer-content"
      className={cn("grid grid-cols-2 gap-8 sm:grid-cols-3", className)}
      {...props}
    />
  );
}

function FooterColumn({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="footer-column"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

function FooterBottom({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="footer-bottom"
      className={cn(
        "mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center",
        className,
      )}
      {...props}
    />
  );
}

export {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
  LayoutLines,
  Navbar,
  NavbarLeft,
  NavbarRight,
  Section,
};
