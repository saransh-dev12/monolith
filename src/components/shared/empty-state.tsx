import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/80 bg-card/20 px-6 py-14 text-center">
      <Image
        src="/assets/3dicons/folder-color.png"
        alt=""
        width={400}
        height={400}
        sizes="80px"
        loading="lazy"
        className="relative size-20 drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)]"
        aria-hidden="true"
      />
      <h2 className="relative mt-4 font-brand text-xl font-semibold leading-none tracking-[-0.02em]">{title}</h2>
      <p className="relative mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {onAction ? <div className="mt-5">{onAction}</div> : null}
      {!onAction && actionLabel && actionHref ? (
        <Button asChild className="relative mt-5 rounded-full" variant="outline">
          <Link href={actionHref}>
            {actionLabel}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
