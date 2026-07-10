import { SearchInput } from "@/components/shared/search-input";
import { SharedSelect } from "@/components/shared/select";
import { getCategories } from "@/lib/data/category";

const StockStatusFilterOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Normal",
    value: "normal",
  },
  {
    label: "Low stock",
    value: "low",
  },
]

export async function ProductTableFilterBar() {
  const categories = await getCategories({ status: "active" })
  return (
    <div className="flex max-w-[700px] items-center gap-2">
      <SearchInput className="flex-2" />
      <SharedSelect
        className="flex-1"
        paramKey="category"
        options={categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        allLabel={"All categories"}
        ariaLabel={"Filter by category"}
        placeholder={"Select category"}
      />
      <SharedSelect
        className="flex-1"
        paramKey="stockStatus"
        options={StockStatusFilterOptions}
        placeholder="Filter stock status"
      />
    </div>
  )
}