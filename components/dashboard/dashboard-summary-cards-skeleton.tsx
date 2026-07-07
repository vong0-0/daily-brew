import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSummaryCardsSkeleton() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="flex min-h-28 flex-col gap-3 border border-border bg-bg-surface px-4 py-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="size-10 rounded-sm" />
          </div>

          <div className="mt-auto">
            <Skeleton className="h-4 w-48" />
          </div>
        </article>
      ))}
    </section>
  );
}
