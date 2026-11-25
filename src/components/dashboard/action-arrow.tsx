import { ChevronRight } from "lucide-react";

// Adapted from Skiper UI's Skiper99 ArrowIcon; see third-party attributions.
export function ActionArrow() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-grid size-5 place-items-center overflow-hidden"
    >
      <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
      <span className="absolute right-2 h-px w-3 origin-right scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none" />
    </span>
  );
}
