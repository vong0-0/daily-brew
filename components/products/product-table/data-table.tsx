import { getProducts } from "@/lib/data/product"
import { TableData } from "@/components/shared/table-data"
import { productTableColumns } from "./columns"
import type { ProductStockStatus } from "@/types/product"

type ProductTableProp = {
  page?: number
  search?: string
  categoryId?: string
  stockStatus?: ProductStockStatus
}

export async function ProductTable({
  page = 1,
  search,
  categoryId,
  stockStatus = "all",
}: ProductTableProp) {
  const productList = await getProducts({
    page,
    search,
    categoryId,
    stockStatus,
  })

  return (
    <TableData
      columns={productTableColumns}
      data={productList.items}
      pagination={productList.pagination}
      rowLinkPrefix="/products"
    />
  )
}
