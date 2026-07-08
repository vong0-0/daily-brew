import type { PaginationMeta } from "./pagination"

export type StockSummary = {
  totalStockValue: number,
  totalProductCount: number
}
export type Product = {
  id: string,
  name: string,
  sku: string | null,
  cost: string,
  currentStock: string,
  reorderPoint: string,
  categoryName: string,
  unitName: string,
  isActive: boolean,
  createAt: Date,
  updateAt: Date,
}

export type ProductList = {
  items: Product[],
  pagination: PaginationMeta,
}
