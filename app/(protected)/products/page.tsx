import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PageHeading } from "@/components/shared/page-heading";
import { ProductTable } from "@/components/products/product-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductTableFilterBar } from "@/components/products/product-table/product-table-filter";
import { Suspense } from "react";
import { FilterBarSkeleton } from "@/components/shared/skeletons/filter-bar-skeleton";
import { DataTableSkeleton } from "@/components/shared/skeletons/data-table-skeleton";
import type { ProductStockStatus } from "@/types/product";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key]
  return typeof value === "string" ? value : undefined
}

function parseStockStatus(value?: string): ProductStockStatus {
  if (value === "normal" || value === "low") {
    return value
  }

  return "all"
}

export default async function ProductListPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams
  const page = Number.parseInt(getSearchParam(resolvedSearchParams, "page") ?? "1", 10) || 1
  const search = getSearchParam(resolvedSearchParams, "search")
  const categoryId = getSearchParam(resolvedSearchParams, "category")
  const stockStatus = parseStockStatus(getSearchParam(resolvedSearchParams, "stockStatus"))

  return (
    <div className="flex flex-col gap-4">
      <PageHeading title="Product list">
        <PageBreadcrumb items={[{ label: "products" }]} />
      </PageHeading>

      <div className="content-shell">
        <div className="flex items-center justify-between">
          {/* Filter bar */}
          <Suspense fallback={<FilterBarSkeleton showAction={false} />}>
            <ProductTableFilterBar />
          </Suspense>

          <Button className="py-1 bg-sky-800 text-white hover:bg-sky-700">
            <Plus />
            Add product
          </Button>
        </div>

        {/* Product table */}
        <Suspense fallback={<DataTableSkeleton />}>
          <ProductTable
            page={page}
            search={search}
            categoryId={categoryId}
            stockStatus={stockStatus}
          />
        </Suspense>

      </div>
    </div>
  )
}
