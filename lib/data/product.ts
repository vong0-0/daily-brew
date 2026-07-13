import { Prisma } from "@/prisma/generated/prisma/client";

import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { GLOBAL_DEFAULT_PAGINATION_LIMIT } from "@/lib/constants/pagination";
import type {
  ProductDetail,
  ProductFilters,
  ProductList,
  StockSummary,
  Product,
} from "@/types/product";

function normalizePagination(params?: Pick<ProductFilters, "page" | "limit">) {
  const page = Math.max(1, Math.floor(params?.page ?? 1));
  const limit = Math.max(
    1,
    Math.floor(params?.limit ?? GLOBAL_DEFAULT_PAGINATION_LIMIT),
  );

  return { page, limit };
}

function normalizeSearch(search?: string) {
  const trimmed = search?.trim();
  return trimmed ? `%${trimmed}%` : undefined;
}

function buildProductConditions(
  params: Omit<ProductFilters, "page" | "limit"> = {},
) {
  const conditions: Prisma.Sql[] = [];

  const search = normalizeSearch(params.search);
  if (search) {
    conditions.push(
      Prisma.sql`(p."name" ILIKE ${search} OR p."sku" ILIKE ${search})`,
    );
  }

  if (params.categoryId) {
    conditions.push(Prisma.sql`p."categoryId" = ${params.categoryId}`);
  }

  if (params.isActive !== undefined) {
    conditions.push(Prisma.sql`p."isActive" = ${params.isActive}`);
  }

  if (params.stockStatus === "low") {
    conditions.push(Prisma.sql`p."currentStock" < p."reorderPoint"`);
  }

  if (params.stockStatus === "normal") {
    conditions.push(Prisma.sql`p."currentStock" >= p."reorderPoint"`);
  }

  if (conditions.length === 0) {
    return Prisma.empty;
  }

  console.log(conditions);

  return Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`;
}

async function getProductCount(
  params?: Omit<ProductFilters, "page" | "limit">,
): Promise<number> {
  const whereClause = buildProductConditions(params);

  const [result] = await prisma.$queryRaw<{ totalCount: number }[]>`
    SELECT COUNT(*)::int AS "totalCount"
    FROM "products" AS p
    ${whereClause}
  `;

  return result?.totalCount ?? 0;
}

async function getProductRows(params?: ProductFilters) {
  const isUserAdmin = await isAdmin();
  const { page, limit } = normalizePagination(params);
  const whereClause = buildProductConditions(params);
  const totalCount = await getProductCount(params);
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
      p."createdAt" AS "createAt",
      p."updatedAt" AS "updateAt"
    FROM "products" AS p
    INNER JOIN "categories" AS c ON c."id" = p."categoryId"
    INNER JOIN "units" AS u ON u."id" = p."unitId"
    ${whereClause}
    ORDER BY p."name" ASC
    LIMIT ${limit}
    OFFSET ${skip}
  `;

  return {
    items: items,
    pagination: {
      page: safePage,
      limit,
      totalCount,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  } satisfies ProductList;
}

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

export async function getProducts(
  params?: ProductFilters,
): Promise<ProductList> {
  return getProductRows(params);
}

export async function getProduct(id: string): Promise<ProductDetail | null> {
  const isUserAdmin = await isAdmin();

  const [product] = await prisma.$queryRaw<ProductDetail[]>`
    SELECT
      p."id",
      p."name",
      p."sku",
      p."categoryId",
      c."name" AS "categoryName",
      p."unitId",
      u."name" AS "unitName",
      ${isUserAdmin ? Prisma.sql`p."cost"::text` : Prisma.sql`'-'`} AS "cost",
      p."currentStock"::text AS "currentStock",
      p."reorderPoint"::text AS "reorderPoint",
      p."isActive" AS "isActive",
      p."createdAt" AS "createdAt",
      p."updatedAt" AS "updatedAt"
    FROM "products" AS p
    INNER JOIN "categories" AS c ON c."id" = p."categoryId"
    INNER JOIN "units" AS u ON u."id" = p."unitId"
    WHERE p."id" = ${id}
    LIMIT 1
  `;

  return product ? product : null;
}

export async function getLowStockProductCount(
  search?: string,
): Promise<number> {
  return getProductCount({
    search,
    stockStatus: "low",
  });
}

export async function getLowStockProducts(
  params?: Omit<ProductFilters, "categoryId" | "stockStatus">,
): Promise<ProductList> {
  return getProductRows({
    page: params?.page,
    limit: params?.limit,
    search: params?.search,
    stockStatus: "low",
  });
}
