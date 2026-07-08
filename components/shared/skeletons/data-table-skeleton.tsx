import { Skeleton } from "@/components/ui/skeleton"

type DataTableSkeletonProps = {
  columns?: number
  rows?: number
  showPagination?: boolean
}

export function DataTableSkeleton({
  columns = 6,
  rows = 6,
  showPagination = true,
}: DataTableSkeletonProps) {
  return (
    <div className="w-full overflow-x-auto border">
      <div className="flex items-center gap-4 border-b border-border bg-bg-surface px-4 py-2">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>

      <div className="flex flex-col">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b border-border last:border-b-0">
            <div className="flex items-center gap-4 px-4 py-2">
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <Skeleton
                  key={columnIndex}
                  className="h-4 flex-1"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showPagination ? (
        <div className="flex items-center justify-between border-t border-border bg-bg-surface px-4 py-2">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-16 rounded-md" />
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
        </div>
      ) : null}
    </div>
  )
}
