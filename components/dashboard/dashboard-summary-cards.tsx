import { AlertTriangle, Boxes, DollarSign, Layers3 } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatNumber, formatUSD } from "@/lib/utils/currency";
import { getLowStockProductCount, getStockSummary } from "@/lib/data/product";

type SummaryCard = {
  label: string;
  value: string;
  description: string;
  icon: typeof Boxes;
  accentClassName: string;
};


export async function DashboardSummaryCards() {
  const [stockSummary, lowStockProductCount] = await Promise.all([
    getStockSummary(),
    getLowStockProductCount(),
  ]);

  const cards: SummaryCard[] = [
    {
      label: "Active Products",
      value: formatNumber(stockSummary.totalProductCount),
      description: "Products currently active in the catalog",
      icon: Boxes,
      accentClassName: "border-l-status-ok",
    },
    {
      label: "Stock Value",
      value: formatUSD(stockSummary.totalStockValue),
      description: "Estimated value of active stock on hand",
      icon: DollarSign,
      accentClassName: "border-l-accent",
    },
    {
      label: "Low Stock Items",
      value: formatNumber(lowStockProductCount),
      description: "Products below their reorder point",
      icon: AlertTriangle,
      accentClassName: "border-l-status-warning",
    },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className={cn(
              "flex min-h-28 flex-col gap-3 border border-border bg-bg-surface px-4 py-4 shadow-sm",
              card.accentClassName
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">
                  {card.label}
                </p>
                <h2 className="text-2xl font-semibold text-text-primary tabular-nums">
                  {card.value}
                </h2>
              </div>
              <div className="flex size-10 items-center justify-center rounded-sm border border-border bg-bg-base text-text-secondary">
                <Icon className="size-4" />
              </div>
            </div>

            <div className="mt-auto flex items-center gap-2 text-sm text-text-secondary">
              <Layers3 className="size-4 shrink-0" />
              <span>{card.description}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
