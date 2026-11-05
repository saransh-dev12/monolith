import * as React from "react"
import { cn } from "cn"

/**
 * Ember Obsidian v2 surface primitive. Solid tonal panel with a hairline
 * border and a 1px top-edge highlight for depth. No glass, no gradients.
 * Tones: `default` card, `raised` popover-level, `sunken` background-level.
 */
function Panel({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"div"> & {
  tone?: "default" | "raised" | "sunken"
}) {
  return (
    <div
      data-slot="panel"
      data-tone={tone}
      className={cn(
        "relative rounded-2xl border border-border/70 bg-card shadow-[inset_0_1px_0_0_rgb(255_255_255/4%)]",
        tone === "raised" && "bg-popover",
        tone === "sunken" && "border-border/50 bg-background/40",
        className
      )}
      {...props}
    />
  )
}

export { Panel }
