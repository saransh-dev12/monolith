const principles = [
  "Owner-scoped rows",
  "Atomic plan saves",
  "No fabricated analytics",
  "Progress from records",
  "RLS on every row",
  "Review before save",
];

/**
 * Slow, seamless principles strip. Pure CSS animation, pauses on hover,
 * frozen entirely under prefers-reduced-motion via globals.css.
 */
export function PrinciplesMarquee() {
  return (
    <div
      className="group overflow-hidden border-y border-border/70 bg-card/40"
      data-overflow-clip
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex shrink-0 items-center"
          >
            {principles.map((item) => (
              <li
                key={item}
                className="flex items-center gap-6 whitespace-nowrap px-6 py-3.5"
              >
                <span className="size-1 rotate-45 bg-primary/70" aria-hidden="true" />
                <span className="eyebrow text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
