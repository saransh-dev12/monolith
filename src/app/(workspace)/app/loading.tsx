import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceLoading() {
  return (
    <div role="status" aria-label="Loading workspace" aria-busy="true" className="space-y-5">
      <span className="sr-only">Loading workspace</span>
      <div className="command-glass rounded-2xl p-5 sm:p-6" aria-hidden="true">
        <Skeleton className="h-7 w-56 max-w-full motion-reduce:animate-none" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full motion-reduce:animate-none" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]" aria-hidden="true">
        <div className="command-glass min-h-80 rounded-2xl p-5 sm:p-6">
          <Skeleton className="h-4 w-32 motion-reduce:animate-none" />
          <Skeleton className="mt-6 h-10 w-64 max-w-full motion-reduce:animate-none" />
          <Skeleton className="mt-4 h-4 w-80 max-w-full motion-reduce:animate-none" />
          <Skeleton className="mt-12 h-1 w-full motion-reduce:animate-none" />
        </div>
        <div className="command-glass min-h-52 rounded-2xl p-5 sm:p-6">
          <Skeleton className="h-5 w-32 motion-reduce:animate-none" />
          <Skeleton className="mt-6 h-20 w-full motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}
