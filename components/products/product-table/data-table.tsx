"use client"

import { TableData } from "@/components/shared/table-data"
import { getProductTableColumns } from "./columns"
import type { ProductList } from "@/types/product"
import type { CategoryOption, UnitOption } from "../product-form"

export function ProductTable({ productList, isAdmin, categories, units }: { productList: ProductList, isAdmin: boolean, categories: CategoryOption[], units: UnitOption[] }) {
  const productTableColumns = getProductTableColumns(isAdmin, categories, units)

  return (
    <TableData
      columns={productTableColumns}
      data={productList.items}
      pagination={productList.pagination}
      rowLinkPrefix="/products"
    />
  )
}
