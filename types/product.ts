export type StockSummary = {
  totalStockValue: number,
  totalProductCount: number
}

export type PaginationMeta = {
  page: number,
  limit: number,
  totalCount: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
}

export type LowStockProduct = {
  id: string,
  name: string,
  sku: string | null,
  currentStock: string,
  reorderPoint: string,
  categoryName: string,
  unitName: string,
}

export type LowStockProductList = {
  items: LowStockProduct[],
  pagination: PaginationMeta,
}
