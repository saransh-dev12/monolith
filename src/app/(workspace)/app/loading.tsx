import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceLoading() {
  return (
    <div className="space-y-8" aria-label="Loading workspace" aria-busy="true">
      <div className="space-y-3 border-b border-border/60 pb-6">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 border-y border-border/60 py-5 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-12" />
        ))}
      </div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <Skeleton className="h-56" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
