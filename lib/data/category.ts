import prisma from "@/lib/prisma"

export type CategoryOption = {
  id: string
  name: string
  isActive: boolean
}

export type CategoryStatusFilter = "active" | "inactive" | "all"

type GetCategoriesParams = {
  status?: CategoryStatusFilter
}

export async function getCategories(
  params: GetCategoriesParams = {}
): Promise<CategoryOption[]> {
  const status = params.status ?? "active"

  return prisma.category.findMany({
    where:
      status === "all"
        ? undefined
        : {
            isActive: status === "active",
          },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  })
}
