import { getProducts } from "@/lib/data/product"
import { ProductStockStatus } from "@/types/product"
import { ProductTable } from "./product-table/data-table"
import { getCategories } from "@/lib/data/category"
import { getUnits } from "@/lib/data/unit"
import { isAdmin as checkIsAdmin } from "@/lib/auth"

export default async function ProductList({
  page = 1,
  search,
  categoryId,
  stockStatus = "all",
  isActive,
}: {
  page?: number
  search?: string
  categoryId?: string
  stockStatus?: ProductStockStatus
  isActive?: boolean,
}) {

  const [productList, categories, units, isAdmin] = await Promise.all([
    getProducts({
      page,
      search,
      categoryId,
      stockStatus,
      isActive,
    }),
    getCategories(),
    getUnits(),
    checkIsAdmin()
  ])
  return (
    <ProductTable productList={productList} isAdmin={isAdmin} categories={categories} units={units} />
  )
}