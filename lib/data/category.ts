import prisma from "@/lib/prisma";
import { Category } from "@/types/category";

export type CategoryOption = {
  id: string;
  name: string;
  isActive: boolean;
};

export type CategoryStatusFilter = "active" | "inactive" | "all";

type GetCategoriesParams = {
  status?: CategoryStatusFilter;
};

export async function getCategories(
  params: GetCategoriesParams = {},
): Promise<CategoryOption[]> {
  const status = params.status ?? "active";

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
  });
}

export async function getCategory(id: string): Promise<Category | null> {
  if (!id) {
    return null;
  }

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return null;
  }

  return category;
}
