import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { DashboardSummaryCardsSkeleton } from "@/components/dashboard/dashboard-summary-cards-skeleton";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PageHeading } from "@/components/shared/page-heading";
import {
  getLowStockProductCount,
  getStockSummary,
} from "@/lib/data/product";
import { Suspense } from "react";

export default async function DashboardPage() {
  const [stockSummary, lowStockProductCount] = await Promise.all([
    getStockSummary(),
    getLowStockProductCount(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeading title="Dashboard">
        <PageBreadcrumb items={[{ label: "Dashboard" }]} />
      </PageHeading>

      <div className="content-shell">
        <Suspense fallback={<DashboardSummaryCardsSkeleton />}>
          <DashboardSummaryCards />
        </Suspense>
      </div>
    </div>
  );
}
