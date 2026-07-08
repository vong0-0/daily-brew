import { getLowStockProducts } from "@/lib/data/product"

import { SearchInput } from "@/components/shared/search-input"
import { TableData } from "../../shared/table-data"
import { lowStockColumns } from "./columns"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type LowStackProductTableProps = {
  page?: number
  search?: string
}

export async function LowStackProductTableSection({ page = 1, search }: LowStackProductTableProps) {
  const productList = await getLowStockProducts({ page, limit: 1, search })
  const products = productList.items

  return (
    <Card className="pb-0">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-1.5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Low Stock Products</CardTitle>
            <CardDescription>
              These products have low stock and need to be reordered.
            </CardDescription>
          </div>
          <SearchInput placeholder="Search low stock products..." />
        </div>
      </CardHeader>
      <TableData columns={lowStockColumns} data={products} pagination={productList.pagination} />
    </Card>
  )
}
