"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { conceptMeta } from "@/components/concepts/demo";
import { cn } from "@/lib/utils";

const concepts = Object.values(conceptMeta);

export function ConceptFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-[#0b0b0d] text-[#f4f2ec]">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0d]/90 backdrop-blur">
        <div className="mx-auto flex h-12 w-full max-w-[1500px] items-center gap-3 px-3 sm:px-5">
          <Link
            href="/concepts"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Concepts
          </Link>
          <span className="hidden h-4 w-px bg-white/15 sm:block" />
          <nav aria-label="Concept previews" className="flex items-center gap-1">
            {concepts.map((concept) => {
              const active = pathname === concept.route;
              return (
                <Link
                  key={concept.route}
                  href={concept.route}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
                    active
                      ? "bg-white text-black"
                      : "text-white/50 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span className="sm:hidden">{concept.letter}</span>
                  <span className="hidden sm:inline">
                    {concept.letter} · {concept.name}
                  </span>
                </Link>
              );
            })}
          </nav>
          <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 md:inline">
            Preview · illustrative data only
          </span>
          <Link
            href="/"
            className="rounded-sm border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white hover:text-white"
          >
            Production
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
