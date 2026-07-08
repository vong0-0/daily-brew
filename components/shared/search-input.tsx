"use client"

import { Search, X } from "lucide-react"
import { useCallback, useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "use-debounce"

import { GLOBAL_DEFAULT_DEBOUNCE_DELAY_MS } from "@/lib/constants/debounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SearchInputProps = {
  className?: string
  placeholder?: string
  paramKey?: string
  showButton?: boolean
}

export function SearchInput({
  className,
  placeholder = "Search...",
  paramKey = "search",
  showButton = false,
}: SearchInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const currentValue = searchParams.get(paramKey) ?? ""
  const [value, setValue] = useState(currentValue)
  const [debouncedValue] = useDebounce(
    value,
    GLOBAL_DEFAULT_DEBOUNCE_DELAY_MS
  )

  const updateSearchParam = useCallback((nextValue: string) => {
    const params = new URLSearchParams(searchParams)

    if (nextValue.trim()) {
      params.set(paramKey, nextValue.trim())
    } else {
      params.delete(paramKey)
    }

    params.delete("page")

    const queryString = params.toString()
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname

    startTransition(() => {
      router.replace(nextUrl, { scroll: false })
    })
  }, [paramKey, pathname, router, searchParams, startTransition])

  const clearSearch = () => {
    setValue("")
    updateSearchParam("")
  }

  const applySearch = () => {
    updateSearchParam(value)
  }

  useEffect(() => {
    if (debouncedValue === currentValue) {
      return
    }

    updateSearchParam(debouncedValue)
  }, [currentValue, debouncedValue, updateSearchParam])

  return (
    <div className={cn("flex w-full items-center gap-2 sm:max-w-sm", className)}>
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-text-secondary" />
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="pl-7 pr-8"
          aria-label={placeholder}
          disabled={isPending}
        />
        {value ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-1 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-label="Clear search"
            disabled={isPending}
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
      {showButton ? (
        <Button type="button" size="sm" variant="outline" onClick={applySearch} disabled={isPending}>
          Search
        </Button>
      ) : null}
    </div>
  )
}
