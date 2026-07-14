import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PageHeading } from "@/components/shared/page-heading";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/data/category";
import { getUnits } from "@/lib/data/unit";
import { isAdmin as checkIsAdmin } from "@/lib/auth";
import { EditProductDialog } from "@/components/products/edit-product-dialog";
import { getProduct } from "@/lib/data/product";
import { type ProductDetail } from "@/types/product";
import { ProductInforSection } from "@/components/product-detail/product-info-section";
import NotFound from "@/app/not-found";
import { QuickActionButtons } from "@/components/product-detail/quick-action-buttons";
import { ProductStockMovementList } from "@/components/product-detail/product-stock-movement-list";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [productDetail, categories, units, isUserAdmin] = await Promise.all([
    getProduct(id),
    getCategories(),
    getUnits(),
    checkIsAdmin(),
  ]);

  if (!productDetail) {
    return NotFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeading title="Product Detail" />

      <div className="content-shell gap-3">
        <div className="flex justify-between gap-4 flex-wrap">
          {/* Breadcrumb */}
          <PageBreadcrumb
            items={[
              { label: "products", href: "/products" },
              { label: "detail" },
            ]}
          />
          {/* Edit Product Button */}
          <EditProductDialog
            product={productDetail}
            categories={categories}
            units={units}
            trigger={
              <Button className="w-full sm:w-auto bg-primary px-2 py-1 text-primary-foreground hover:bg-primary/90">
                Edit Product
              </Button>
            }
          />
        </div>

        <div className="w-full flex flex-col gap-2 mx-auto">
          {/* Product information */}
          <div className="min-w-0 block space-y-2 md:flex md:items-start md:gap-2 md:flex-row">
            <div className="flex-1 relative md:sticky md:top-[1%]">
              <ProductInforSection productDetail={productDetail} />
            </div>
            <div className="min-w-0 flex-3">
              <ProductStockMovementList productId={productDetail.id} />
            </div>
          </div>

          {/* Quick Action Buttons */}
          {/* <QuickActionButtons productId={productDetail.id} /> */}
        </div>
      </div>
    </div>
  );
}
