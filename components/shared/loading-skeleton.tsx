import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-surface-elevated/50",
        className
      )}
    />
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative">
          <div className="flex items-center gap-5 mb-6">
            <Skeleton className="w-[46px] h-[46px] rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="ml-[62px] space-y-4">
            {[1, 2].map((j) => (
              <div
                key={j}
                className="border border-border-subtle rounded-xl bg-surface/50 p-5 space-y-3"
              >
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-4 pt-3 border-t border-border-subtle">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-12 w-40 rounded-xl" />
        <Skeleton className="h-12 w-40 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-border-subtle rounded-xl bg-surface/50 p-6 space-y-3"
          >
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-border-subtle rounded-xl bg-surface/50 p-5 space-y-3"
          >
            <div className="flex justify-between">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemoryDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="border border-border-subtle rounded-xl bg-surface/50 p-8 space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-5/6" />
      </div>
      <div className="border border-accent/10 rounded-xl bg-surface/60 p-8 space-y-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  );
}

export function RememberSkeleton() {
  return (
    <div className="max-w-2xl mx-auto text-center py-24 space-y-8">
      <Skeleton className="w-20 h-20 rounded-full mx-auto" />
      <div className="space-y-3">
        <Skeleton className="h-7 w-48 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      <Skeleton className="h-12 w-48 mx-auto rounded-xl" />
    </div>
  );
}
