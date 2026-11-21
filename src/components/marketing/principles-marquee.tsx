const principles = [
  "Capture the idea",
  "Review the plan",
  "Set milestones",
  "Move work forward",
  "See real progress",
  "Finish what matters",
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
      data-principles-marquee
    >
      <div className="flex w-full">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className={copy === 0
              ? "flex w-max min-w-full shrink-0 animate-marquee items-center justify-around group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center"
              : "flex w-max min-w-full shrink-0 animate-marquee items-center justify-around group-hover:[animation-play-state:paused] motion-reduce:hidden"}
          >
            {principles.map((item) => (
              <li
                key={item}
                className="flex items-center gap-6 whitespace-nowrap px-6 py-3.5 motion-reduce:gap-3 motion-reduce:px-3 motion-reduce:py-2"
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
