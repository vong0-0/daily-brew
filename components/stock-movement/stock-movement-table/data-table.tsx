"use client";

import { TableData } from "@/components/shared/table-data";
import { getStockMovementTableColumns } from "./columns";
import { StockMovementList } from "@/types/stock-movement";

export function StockMovementTable({
  stockMovementList,
  isAdmin,
}: {
  stockMovementList: StockMovementList;
  isAdmin: boolean;
}) {
  const stockMovementTableColumns = getStockMovementTableColumns(isAdmin);

  return (
    <TableData
      columns={stockMovementTableColumns}
      data={stockMovementList.items}
      pagination={stockMovementList.pagination}
    />
  );
}
