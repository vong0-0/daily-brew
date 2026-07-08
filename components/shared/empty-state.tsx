import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  /** Icon to display — any ReactNode, typically a Lucide icon */
  icon?: ReactNode;
  /** Primary message, e.g. "No results found" */
  title?: string;
  /** Secondary helper text */
  description?: string;
  /** Optional action button / link */
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title = "No results found",
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 px-4 text-center",
        className
      )}
    >
      {icon && (
        <span className="flex items-center justify-center rounded-sm border border-border bg-bg-surface p-3 text-text-secondary">
          {icon}
        </span>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {description && (
          <p className="text-xs text-text-secondary">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
