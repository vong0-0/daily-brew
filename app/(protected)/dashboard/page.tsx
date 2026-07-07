import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PageHeading } from "@/components/shared/page-heading";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeading title="Dashboard" />


      <div className="content-shell">
        <PageBreadcrumb items={[{ label: "Dashboard" }]} />
      </div>
    </div>
  );
}
