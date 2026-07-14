import { getStockMovementsByProductId } from "@/lib/data/stock-movement";
import { StockMovementTable } from "../stock-movement/stock-movement-table/data-table";

export async function ProductStockMovementList({
  productId,
}: {
  productId: string;
}) {
  const productStockMovementList =
    await getStockMovementsByProductId(productId);

  return (
    <StockMovementTable
      stockMovementList={productStockMovementList}
      isAdmin={false}
    />
  );
}
