import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type BarChartSkeletonProps = {
  className?: string
  bars?: number
  series?: number
  showLegend?: boolean
}

const defaultBarHeights = [84, 58, 92, 44, 76, 64, 88, 52]

export function BarChartSkeleton({
  className,
  bars = 6,
  series = 2,
  showLegend = true,
}: BarChartSkeletonProps) {
  return (
    <div
      className={cn(
        "flex aspect-video w-full flex-col gap-4 rounded-sm max-h-[400px] border border-border bg-bg-surface p-4",
        className
      )}
    >
      <div className="flex flex-1 items-end gap-3">
        {Array.from({ length: bars }).map((_, barIndex) => (
          <div key={barIndex} className="flex flex-1 items-end gap-1.5">
            {Array.from({ length: series }).map((_, seriesIndex) => {
              const height =
                defaultBarHeights[(barIndex + seriesIndex) % defaultBarHeights.length]

              return (
                <Skeleton
                  key={seriesIndex}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${height}%`,
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center justify-between gap-2">
          {Array.from({ length: bars }).map((_, index) => (
            <Skeleton key={index} className="h-3 flex-1" />
          ))}
        </div>
      </div>

      {showLegend ? (
        <div className="flex items-center gap-4">
          {Array.from({ length: series }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="size-2.5 rounded-sm" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
