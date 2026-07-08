"use client"

import { useCallback, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type LastStockMovementPeriodToggleProps = {
  periodDays: 7 | 30
}

export function LastStockMovementPeriodToggle({
  periodDays,
}: LastStockMovementPeriodToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updatePeriodDays = useCallback(
    (nextValue: string) => {
      const params = new URLSearchParams(searchParams)
      params.set("periodDays", nextValue)
      params.delete("page")

      const queryString = params.toString()
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname

      startTransition(() => {
        router.replace(nextUrl, { scroll: false })
      })
    },
    [pathname, router, searchParams, startTransition]
  )

  return (
    <ToggleGroup
      type="single"
      value={periodDays.toString()}
      onValueChange={updatePeriodDays}
      className="border **:data-[slot=toggle-group-item]:rounded-none **:data-[slot=toggle-group-item]:border-r **:data-[slot=toggle-group-item]:last:border-r-0 gap-0"
      disabled={isPending}
    >
      <ToggleGroupItem value="7">Last 7 days</ToggleGroupItem>
      <ToggleGroupItem value="30">Last 30 days</ToggleGroupItem>
    </ToggleGroup>
  )
}
