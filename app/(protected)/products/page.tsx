import { PageHeading } from "@/components/shared/page-heading";
import { ProductTableFilterBar } from "@/components/products/product-table/product-table-filter";
import { CreateProductDialog } from "@/components/products/create-product-dialog";
import { getCategories } from "@/lib/data/category";
import { getUnits } from "@/lib/data/unit";
import { isAdmin as checkIsAdmin } from "@/lib/auth";
import { Suspense } from "react";
import { FilterBarSkeleton } from "@/components/shared/skeletons/filter-bar-skeleton";
import { DataTableSkeleton } from "@/components/shared/skeletons/data-table-skeleton";
import type { ProductStockStatus } from "@/types/product";
import ProductList from "@/components/products/product-list";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

function parseStockStatus(value?: string): ProductStockStatus {
  if (value === "normal" || value === "low") {
    return value;
  }

  return "all";
}

function parseIsActive(value?: string): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

export default async function ProductListPage({ searchParams }: Props) {
  const [resolvedSearchParams, categories, units, isUserAdmin] =
    await Promise.all([
      searchParams,
      getCategories(),
      getUnits(),
      checkIsAdmin(),
    ]);
  const page =
    Number.parseInt(getSearchParam(resolvedSearchParams, "page") ?? "1", 10) ||
    1;
  const search = getSearchParam(resolvedSearchParams, "search");
  const categoryId = getSearchParam(resolvedSearchParams, "category");
  const stockStatus = parseStockStatus(
    getSearchParam(resolvedSearchParams, "stockStatus"),
  );
  const isActive = parseIsActive(
    getSearchParam(resolvedSearchParams, "isActive"),
  );

  return (
    <div className="flex flex-col gap-4">
      <PageHeading title="Product list" />

      <div className="content-shell">
        <div className="flex items-center justify-between">
          {/* Filter bar */}
          <Suspense fallback={<FilterBarSkeleton showAction={false} />}>
            <ProductTableFilterBar />
          </Suspense>

          {isUserAdmin && (
            <CreateProductDialog categories={categories} units={units} />
          )}
        </div>

        {/* Product table */}
        <Suspense fallback={<DataTableSkeleton />}>
          <ProductList
            page={page}
            search={search}
            categoryId={categoryId}
            stockStatus={stockStatus}
            isActive={isActive}
          />
        </Suspense>
      </div>
    </div>
  );
}
