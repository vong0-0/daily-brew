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

export type ProductDetail = {
  id: string,
  name: string,
  sku: string | null,
  categoryId: string,
  categoryName: string,
  unitId: string,
  unitName: string,
  cost: string,
  currentStock: string,
  reorderPoint: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date,
}

export type ProductList = {
  items: Product[],
  pagination: PaginationMeta,
}

export type ProductStockStatus = "all" | "normal" | "low"

export type ProductFilters = {
  page?: number,
  limit?: number,
  search?: string,
  categoryId?: string,
  stockStatus?: ProductStockStatus,
}
