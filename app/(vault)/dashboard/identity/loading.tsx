import { Skeleton } from "@/components/shared/loading-skeleton";

export default function IdentityLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="border border-border-subtle rounded-xl bg-surface/50 p-16 flex flex-col items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-12 w-48 rounded-xl" />
      </div>
    </div>
  );
}
