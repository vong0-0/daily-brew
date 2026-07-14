import { MovementType } from "@/prisma/generated/prisma/enums";

interface StockMovementTypeBadgeProps {
  type: MovementType;
  variant?: "solid" | "outline";
}

export function StockMovementTypeBadge({
  type,
  variant = "solid",
}: StockMovementTypeBadgeProps) {
  const isIn = type === "IN";
  const baseClass =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold";

  if (variant === "solid") {
    return (
      <span
        className={`${baseClass} ${
          isIn ? "bg-status-ok text-bg-base" : "bg-status-warning text-bg-base"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isIn ? "bg-bg-base/40" : "bg-bg-base/40"
          }`}
        />
        {type}
      </span>
    );
  }

  return (
    <span
      className={`${baseClass} border ${
        isIn
          ? "border-status-ok text-status-ok bg-status-ok/5"
          : "border-status-warning text-status-warning bg-status-warning/5"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isIn ? "bg-status-ok" : "bg-status-warning"
        }`}
      />
      {type}
    </span>
  );
}
