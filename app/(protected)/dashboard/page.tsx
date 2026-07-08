import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { DashboardSummaryCardsSkeleton } from "@/components/dashboard/dashboard-summary-cards-skeleton";
import { LowStackProductTable } from "@/components/dashboard/low-stack-product-table/table-data";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PageHeading } from "@/components/shared/page-heading";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;

  return (
    <div className="flex flex-col gap-4">
      <PageHeading title="Dashboard">
        <PageBreadcrumb items={[{ label: "Dashboard" }]} />
      </PageHeading>

      <div className="content-shell">
        <Suspense fallback={<DashboardSummaryCardsSkeleton />}>
          <DashboardSummaryCards />
        </Suspense>
        <LowStackProductTable page={page} search={search} />
      </div>
    </div>
  );
}
