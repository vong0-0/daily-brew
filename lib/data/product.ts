import {
  type ProductList,
  type StockSummary,
  type Product
} from "@/types/product";
import { GLOBAL_DEFAULT_PAGINATION_LIMIT } from "@/lib/constants/pagination";
import prisma from "../prisma";
import { Prisma } from "@/prisma/generated/prisma/client";
import { isAdmin } from "@/lib/auth";

export async function getStockSummary(): Promise<StockSummary> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    select: {
      currentStock: true,
      cost: true,
    },
  });

  const totalStockValue = products.reduce((sum, product) => {
    const lineValue = product.currentStock.mul(product.cost);
    return sum.add(lineValue);
  }, new Prisma.Decimal(0));

  return {
    totalStockValue: totalStockValue.toNumber(),
    totalProductCount: products.length,
  };
}

export async function getLowStockProductCount(search?: string): Promise<number> {
  const searchCondition = search
    ? Prisma.sql`AND (p."name" ILIKE ${`%${search}%`} OR p."sku" ILIKE ${`%${search}%`})`
    : Prisma.empty;

  const [result] = await prisma.$queryRaw<{ totalCount: number }[]>`
    SELECT COUNT(*)::int AS "totalCount"
    FROM "products" AS p
    WHERE p."isActive" = TRUE
      AND p."currentStock" < p."reorderPoint"
      ${searchCondition}
  `;

  return result?.totalCount ?? 0;
}

type GetLowStockProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

function normalizePagination(params?: GetLowStockProductsParams) {
  const page = Math.max(1, Math.floor(params?.page ?? 1));
  const limit = Math.max(
    1,
    Math.floor(params?.limit ?? GLOBAL_DEFAULT_PAGINATION_LIMIT)
  );

  return { page, limit };
}

export async function getLowStockProducts(
  params?: GetLowStockProductsParams
): Promise<ProductList> {
  const isUserAdmin = await isAdmin();
  const { page, limit } = normalizePagination(params);
  const search = params?.search;
  const totalCount = await getLowStockProductCount(search);
  const totalPages = Math.ceil(totalCount / limit);
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const skip = (safePage - 1) * limit;

  const items = await prisma.$queryRaw<Product[]>`
    SELECT
      p."id",
      p."name",
      p."sku",
      ${isUserAdmin ? Prisma.sql`p."cost"::text` : Prisma.sql`'-'`} AS "cost",
      p."currentStock"::text AS "currentStock",
      p."reorderPoint"::text AS "reorderPoint",
      c."name" AS "categoryName",
      u."name" AS "unitName",
      p."isActive" AS "isActive",
      p."updatedAt" AS "updateAt"
    FROM "products" AS p
    INNER JOIN "categories" AS c ON c."id" = p."categoryId"
    INNER JOIN "units" AS u ON u."id" = p."unitId"
    WHERE p."isActive" = TRUE
      AND p."currentStock" < p."reorderPoint"
      ${
        search
          ? Prisma.sql`AND (p."name" ILIKE ${`%${search}%`} OR p."sku" ILIKE ${`%${search}%`})`
          : Prisma.empty
      }
    ORDER BY p."currentStock" ASC, p."name" ASC
    LIMIT ${limit}
    OFFSET ${skip}
  `;

  return {
    items,
    pagination: {
      page: safePage,
      limit,
      totalCount,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  };
}
