"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import type { PaginationMeta } from "@/types/pagination"

type TablePaginationProps = {
  pagination: PaginationMeta
}

export function TablePagination({ pagination }: TablePaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // If there are no items or only 1 page, we might still want to show the count, 
  // but let's keep the layout stable.
  return (
    <div className="flex items-center justify-between border-t border-border bg-bg-surface px-4 py-2">
      <div className="text-xs text-text-secondary">
        Page <span className="font-medium text-text-primary">{pagination.page}</span> of{" "}
        <span className="font-medium text-text-primary">{pagination.totalPages || 1}</span>
        {" "}· {pagination.totalCount} items
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!pagination.hasPreviousPage}
          onClick={() => router.push(createPageURL(pagination.page - 1))}
          className="h-7 text-xs"
        >
          <ChevronLeft className="size-3.5" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Prev</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!pagination.hasNextPage}
          onClick={() => router.push(createPageURL(pagination.page + 1))}
          className="h-7 text-xs"
        >
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
