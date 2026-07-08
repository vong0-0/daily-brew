import { cn } from "@/lib/utils"

type ActiveStatusBadgeProps = {
  isActive: boolean
  className?: string
}

export function ActiveStatusBadge({ isActive, className }: ActiveStatusBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border border-border bg-bg-surface px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isActive ? "bg-status-ok" : "bg-text-secondary"
        )}
      />
      <span className={cn(isActive ? "text-text-primary" : "text-text-secondary")}>
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  )
}
