"use client";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { type MovementChartPoint } from "@/lib/data/stock-movement";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartConfig = {
  in: {
    label: "Stock in",
    color: "#2563eb",
  },
  out: {
    label: "Stock out",
    color: "var(--destructive)",
  },
} satisfies ChartConfig

type Props = {
  stockMovementData: MovementChartPoint[];
}

export function LastStockMovementBarChart({ stockMovementData }: Props) {
  return (

    <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[400px] w-full">
      <BarChart accessibilityLayer data={stockMovementData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="displayDate"
          tickLine={true}
          tickMargin={10}
          axisLine={false}
          minTickGap={32}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="in" fill={"var(--color-in)"} radius={4} />
        <Bar dataKey="out" fill={"var(--color-out)"} radius={4} />
      </BarChart>
    </ChartContainer>

  )
}
