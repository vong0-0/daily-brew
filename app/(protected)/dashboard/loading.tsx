import { DashboardSummaryCardsSkeleton } from "@/components/dashboard/dashboard-summary-cards-skeleton";
import { PageHeading } from "@/components/shared/page-heading";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeading title="Dashboard" />

      <div className="content-shell">
        <DashboardSummaryCardsSkeleton />
      </div>
    </div>
  );
}
