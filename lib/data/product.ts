import {
  type LowStockProductList,
  type StockSummary,
} from "@/types/product";
import { GLOBAL_DEFAULT_PAGINATION_LIMIT } from "@/lib/constants/pagination";
import prisma from "../prisma";
import { Prisma } from "@/prisma/generated/prisma/client";

type LowStockProductRow = {
  id: string;
  name: string;
  sku: string | null;
  currentStock: string;
  reorderPoint: string;
  categoryName: string;
  unitName: string;
};

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

export async function getLowStockProductCount(): Promise<number> {
  const [result] = await prisma.$queryRaw<{ totalCount: number }[]>`
    SELECT COUNT(*)::int AS "totalCount"
    FROM "products" AS p
    WHERE p."isActive" = TRUE
      AND p."currentStock" < p."reorderPoint"
  `;

  return result?.totalCount ?? 0;
}

type GetLowStockProductsParams = {
  page?: number;
  limit?: number;
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
): Promise<LowStockProductList> {
  const { page, limit } = normalizePagination(params);
  const totalCount = await getLowStockProductCount();
  const totalPages = Math.ceil(totalCount / limit);
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const skip = (safePage - 1) * limit;

  const items = await prisma.$queryRaw<LowStockProductRow[]>`
    SELECT
      p."id",
      p."name",
      p."sku",
      p."currentStock"::text AS "currentStock",
      p."reorderPoint"::text AS "reorderPoint",
      c."name" AS "categoryName",
      u."name" AS "unitName"
    FROM "products" AS p
    INNER JOIN "categories" AS c ON c."id" = p."categoryId"
    INNER JOIN "units" AS u ON u."id" = p."unitId"
    WHERE p."isActive" = TRUE
      AND p."currentStock" < p."reorderPoint"
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
