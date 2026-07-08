import { getMovementChartData } from "@/lib/data/stock-movement";
import { LastStockMovementBarChart } from "./last-stock-movement-chart";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LastStockMovementPeriodToggle } from "./last-stock-movement-period-toggle";


export async function LastStockMovementSection({ periodDays }: { periodDays: 7 | 30 }) {
  const lastStockMovement = await getMovementChartData(periodDays ?? 7)
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1.5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Last Stock Movement</CardTitle>
            <CardDescription>Last {periodDays} days of stock movement</CardDescription>
          </div>
          <LastStockMovementPeriodToggle periodDays={periodDays} />
        </div>
      </CardHeader>
      <LastStockMovementBarChart stockMovementData={lastStockMovement} />
    </Card>
  )
}
