import { getLowStockProducts } from "@/lib/data/product"

import { TableData } from "../../shared/table-data"
import { lowStockColumns } from "./columns"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type LowStackProductTableProps = {
  page?: number
  search?: string
}

export async function LowStackProductTable({ page = 1, search }: LowStackProductTableProps) {
  const productList = await getLowStockProducts({ page, limit: 1, search })
  const products = productList.items

  return (
    <Card className="pb-0">
      <CardHeader>
        <CardTitle>Low Stock Products</CardTitle>
        <CardDescription>
          These products have low stock and need to be reordered.
        </CardDescription>
      </CardHeader>
      <TableData columns={lowStockColumns} data={products} pagination={productList.pagination} />
    </Card>
  )
}