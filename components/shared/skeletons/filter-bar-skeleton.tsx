import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type FilterBarSkeletonProps = {
  className?: string
  showSearch?: boolean
  selectorCount?: number
  showAction?: boolean
}

export function FilterBarSkeleton({
  className,
  showSearch = true,
  selectorCount = 2,
  showAction = true,
}: FilterBarSkeletonProps) {
  return (
    <div
      className={cn(
        "flex w-full bg-transparent max-w-[700px] flex-col gap-3 lg:flex-row lg:items-center",
        className
      )}
    >
      {showSearch ? <Skeleton className="h-9 w-full sm:max-w-sm" /> : null}

      {Array.from({ length: selectorCount }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-9 w-full sm:max-w-xs"
        />
      ))}

      {showAction ? (
        <Skeleton className="h-9 w-full sm:w-36 lg:ml-auto" />
      ) : null}
    </div>
  )
}
