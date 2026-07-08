"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatNumber, formatUSD } from "@/lib/utils/currency"
import { formatDateTimeUTC7 } from "@/lib/utils/date"
import { ActiveStatusBadge } from "@/components/shared/active-status-badge"
import type { Product } from "@/types/product"

export const lowStockColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => {
      const costRaw = row.getValue("cost") as string
      if (costRaw === "-") return "-"
      const cost = parseFloat(costRaw)
      return formatUSD(cost)
    },
  },
  {
    accessorKey: "categoryName",
    header: "Category Name",
  },
  {
    accessorKey: "unitName",
    header: "Unit Name",
  },
  {
    accessorKey: "currentStock",
    header: "Current Stock",
    cell: ({ row }) => formatNumber(parseFloat(row.getValue("currentStock"))),
  },
  {
    accessorKey: "reorderPoint",
    header: "Reorder Point",
    cell: ({ row }) => formatNumber(parseFloat(row.getValue("reorderPoint"))),
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "updateAt",
    header: "Updated At",
    cell: ({ row }) => {
      const updateAt = row.getValue("updateAt")
      return <span className="text-text-secondary">{formatDateTimeUTC7(updateAt as Date)}</span>
    }
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return <ActiveStatusBadge isActive={isActive} />
    },
  },
]
