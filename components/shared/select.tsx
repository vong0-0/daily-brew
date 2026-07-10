"use client"

import { useCallback, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"

type SharedSelectProps = {
  className?: string
  paramKey: string
  options: SharedSelectOption[]
  showAllOption?: boolean
  allLabel?: string
  ariaLabel?: string
  placeholder?: string
  disabled?: boolean
}

export type SharedSelectOption = {
  label: string
  value: string
  disabled?: boolean
}

const ALL_VALUE = "__all__"

export function SharedSelect({
  className,
  paramKey,
  options,
  showAllOption = true,
  allLabel = "All",
  ariaLabel,
  placeholder,
  disabled = false,
}: SharedSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const currentValue = searchParams.get(paramKey) ?? ""
  const defaultValue = currentValue || (showAllOption ? ALL_VALUE : "")
  const [value, setValue] = useState(defaultValue)
  const [prevCurrentValue, setPrevCurrentValue] = useState(currentValue)

  if (currentValue !== prevCurrentValue) {
    setPrevCurrentValue(currentValue)
    setValue(defaultValue)
  }

  const updateSearchParam = useCallback(
    (nextValue: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (nextValue === ALL_VALUE) {
        params.delete(paramKey)
      } else {
        params.set(paramKey, nextValue)
      }

      params.delete("page")

      const queryString = params.toString()
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname

      startTransition(() => {
        router.replace(nextUrl, { scroll: false })
      })
    },
    [paramKey, pathname, router, searchParams, startTransition]
  )

  const handleChange = (nextValue: string) => {
    setValue(nextValue)
    updateSearchParam(nextValue)
  }

  return (
    <div className={cn("w-full sm:max-w-xs", className)}>
      <Select
        value={value}
        onValueChange={handleChange}
        disabled={disabled || isPending}
      >
        <SelectTrigger
          className="w-full"
          aria-label={ariaLabel ?? placeholder ?? paramKey}
        >
          <SelectValue placeholder={placeholder ?? allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {showAllOption ? (
              <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>
            ) : null}
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
