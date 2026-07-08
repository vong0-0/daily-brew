"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import type { ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/shared/empty-state"
import { TablePagination } from "@/components/shared/table-pagination"
import { DatabaseX } from "lucide-react"
import type { PaginationMeta } from "@/types/pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Custom empty state rendered when the table has no rows. Defaults to a generic EmptyState. */
  emptyState?: ReactNode
  /** Optional pagination metadata. If provided, renders the TablePagination component below the table. */
  pagination?: PaginationMeta
}

const defaultEmptyState = (
  <EmptyState
    icon={<DatabaseX />}
    title="No data"
    description="No data found. Please check back later"
  />
)

export function TableData<TData, TValue>({
  columns,
  data,
  emptyState = defaultEmptyState,
  pagination,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="w-full overflow-x-auto border">
      <Table>
        <TableHeader className="bg-bg-surface hover:bg-bg-surface-hover">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="py-2 px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-0">
                {emptyState}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && <TablePagination pagination={pagination} />}
    </div>
  )
}