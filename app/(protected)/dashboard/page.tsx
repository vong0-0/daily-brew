import { LastStockMovementSection } from "@/components/dashboard/last-stock-movement-chart/last-stock-movement-section";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { DashboardSummaryCardsSkeleton } from "@/components/dashboard/dashboard-summary-cards-skeleton";
import { LowStackProductTableSection } from "@/components/dashboard/low-stack-product-table/LowStackProductTableSection";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PageHeading } from "@/components/shared/page-heading";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/shared/skeletons/data-table-skeleton";
import { BarChartSkeleton } from "@/components/shared/skeletons/bar-chart-skeleton";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DashboardPage(props: Props) {
  const searchParams = await props.searchParams;
  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const periodDays = searchParams.periodDays === "7" ? 7 : 30;

  return (
    <div className="flex flex-col gap-4">
      <PageHeading title="Dashboard" />

      <div className="content-shell">
        <PageBreadcrumb items={[{ label: "Dashboard" }]} />
        <Suspense fallback={<DashboardSummaryCardsSkeleton />}>
          <DashboardSummaryCards />
        </Suspense>

        <Suspense fallback={<BarChartSkeleton />}>
          <LastStockMovementSection periodDays={periodDays} />
        </Suspense>
        <Suspense fallback={<DataTableSkeleton />}>
          <LowStackProductTableSection page={page} search={search} />
        </Suspense>
      </div>
    </div>
  );
}
