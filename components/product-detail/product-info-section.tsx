import {
  CardHeader,
  Card,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { isAdmin as checkIsAdmin } from "@/lib/auth";
import { formatNumber, formatUSD } from "@/lib/utils/currency";
import { ProductDetail } from "@/types/product";
import type { ReactNode } from "react";
import { ActiveStatusBadge } from "../shared/active-status-badge";
import { formatDateTimeUTC7 } from "@/lib/utils/date";

function ProductInfoRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 flex-row ${
        !isLast ? "border-b border-border pb-2" : ""
      }`}
    >
      <span className="text-zinc-400">{label}</span>
      <div className="font-bold">{value ?? "-"}</div>
    </div>
  );
}

export async function ProductInforSection({
  productDetail,
}: {
  productDetail: ProductDetail;
}) {
  const isAdmin = await checkIsAdmin();
  return (
    <Card className="w-full max-w-[900px] mx-auto">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ProductInfoRow label="Product ID:" value={productDetail.id} />
        <ProductInfoRow label="Product Name:" value={productDetail.name} />
        <ProductInfoRow label="SKU:" value={productDetail.sku} />
        <ProductInfoRow label="Category:" value={productDetail?.categoryName} />
        <ProductInfoRow label="Unit:" value={productDetail?.unitName} />
        <ProductInfoRow
          label="Cost:"
          value={isAdmin ? formatUSD(parseFloat(productDetail.cost)) : "-"}
        />
        <ProductInfoRow
          label="Current Stock:"
          value={
            isAdmin
              ? formatNumber(parseFloat(productDetail.currentStock || "0"))
              : "-"
          }
        />
        <ProductInfoRow
          label="Reorder Point:"
          value={
            isAdmin
              ? formatNumber(parseFloat(productDetail.reorderPoint || "0"))
              : "-"
          }
        />
        <ProductInfoRow
          label="Active Status:"
          value={
            isAdmin ? (
              <ActiveStatusBadge isActive={productDetail.isActive} />
            ) : (
              "-"
            )
          }
        />
        <ProductInfoRow
          label="Created At:"
          value={
            productDetail?.createdAt
              ? formatDateTimeUTC7(productDetail.createdAt)
              : "-"
          }
        />
        <ProductInfoRow
          label="Updated At:"
          value={
            productDetail?.updatedAt
              ? formatDateTimeUTC7(productDetail.updatedAt)
              : "-"
          }
          isLast={true}
        />
      </CardContent>
    </Card>
  );
}
