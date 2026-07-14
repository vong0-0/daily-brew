"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { formatNumber, formatUSD } from "@/lib/utils/currency";
import { formatDateTimeUTC7 } from "@/lib/utils/date";
import { StockMovementTypeBadge } from "@/components/shared/stock-movement-type-badge";
import type { Product } from "@/types/product";
import { StockMovementRecord } from "@/types/stock-movement";

export const getStockMovementTableColumns = (
  isAdmin: boolean,
): ColumnDef<StockMovementRecord>[] => {
  const columns: ColumnDef<StockMovementRecord>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as any;
        return <StockMovementTypeBadge type={type} />;
      },
    },
    {
      accessorKey: "productNameSnapshot",
      header: "Product Name",
    },
    {
      accessorKey: "categoryNameSnapshot",
      header: "Category Name",
    },
    {
      accessorKey: "unitSnapshot",
      header: "Unit",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const qty = row.getValue("quantity");
        return <span>{formatNumber(parseFloat(qty as string))}</span>;
      },
    },
    {
      accessorKey: "costSnapshot",
      header: "Cost",
      cell: ({ row }) => {
        const cost = row.getValue("costSnapshot");
        return isAdmin ? (
          <span>{formatUSD(parseFloat(cost as string))}</span>
        ) : (
          <span>-</span>
        );
      },
    },
    {
      accessorKey: "reasonNameSnapshot",
      header: "Reason",
    },
    {
      accessorKey: "userNameSnapshot",
      header: "Action By",
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => {
        const note = row.getValue<string | null>("note");
        return <span>{note ?? "-"}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const updateAt = row.getValue("createdAt");
        return (
          <span className="text-text-secondary">
            {formatDateTimeUTC7(updateAt as Date)}
          </span>
        );
      },
    },
  ];

  return columns;
};
