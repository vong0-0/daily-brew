import prisma from "@/lib/prisma";
import {
  getLocalStartOfDayInUTC,
  toLocalDateKey,
  formatShortDate,
} from "../utils/date";
import { normalizeSearch, normalizePagination } from "../utils/normalize";
import { Prisma } from "@/prisma/generated/prisma/client";
import { GLOBAL_DEFAULT_PAGINATION_LIMIT } from "@/lib/constants/pagination";
import type {
  MovementChartPoint,
  StockMovementRecord,
  StockMovementFilters,
  StockMovementList,
} from "@/types/stock-movement";
import type { PaginationMeta } from "@/types/pagination";

function buildStockMovementConditions(
  productId: string,
  filters: Omit<StockMovementFilters, "page" | "limit"> = {},
) {
  const conditions: Prisma.Sql[] = [Prisma.sql`sm."productId" = ${productId}`];

  const search = normalizeSearch(filters.search);
  if (search) {
    conditions.push(
      Prisma.sql`(
        sm."productNameSnapshot" ILIKE ${search}
        OR sm."categoryNameSnapshot" ILIKE ${search}
        OR sm."userNameSnapshot" ILIKE ${search}
        OR sm."reasonNameSnapshot" ILIKE ${search}
      )`,
    );
  }

  if (filters.type) {
    conditions.push(Prisma.sql`sm."type" = ${filters.type}`);
  }

  if (filters.dateFrom) {
    conditions.push(Prisma.sql`sm."createdAt" >= ${filters.dateFrom}`);
  }

  if (filters.dateTo) {
    conditions.push(Prisma.sql`sm."createdAt" <= ${filters.dateTo}`);
  }

  if (conditions.length === 0) {
    return Prisma.empty;
  }

  return Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`;
}

export async function getMovementChartData(
  periodDays: 7 | 30,
): Promise<MovementChartPoint[]> {
  const startDate = getLocalStartOfDayInUTC(periodDays - 1);

  const buckets = new Map<string, MovementChartPoint>();

  for (let i = 0; i < periodDays; i++) {
    const dayStart = getLocalStartOfDayInUTC(periodDays - 1 - i);
    const key = toLocalDateKey(dayStart);
    buckets.set(key, {
      date: key,
      displayDate: formatShortDate(key),
      in: 0,
      out: 0,
    });
  }

  const movements = await prisma.stockMovement.findMany({
    where: { createdAt: { gte: startDate } },
    select: { type: true, quantity: true, createdAt: true },
  });

  for (const movement of movements) {
    const key = toLocalDateKey(movement.createdAt);
    const bucket = buckets.get(key);
    if (!bucket) continue;

    const qty = movement.quantity.toNumber();
    if (movement.type === "IN") bucket.in += qty;
    else bucket.out += qty;
  }

  return Array.from(buckets.values());
}

export async function getStockMovementsByProductId(
  productId: string,
  filters: StockMovementFilters = {},
): Promise<StockMovementList> {
  const { page, limit } = normalizePagination(
    filters,
    GLOBAL_DEFAULT_PAGINATION_LIMIT,
  );
  const whereClause = buildStockMovementConditions(productId, filters);

  // Get total count
  const countResult = await prisma.$queryRaw<
    Array<{ count: bigint }>
  >`SELECT COUNT(*) as count FROM "stock_movements" sm ${whereClause}`;

  const total = Number(countResult[0]?.count ?? 0);
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  // Get paginated results
  const data = await prisma.$queryRaw<StockMovementRecord[]>`
    SELECT
      sm."id",
      sm."type",
      sm."quantity"::text AS "quantity",
      sm."productId",
      sm."productNameSnapshot",
      sm."categoryNameSnapshot",
      sm."unitSnapshot",
      sm."costSnapshot"::text AS "costSnapshot",
      sm."reasonTypeId",
      sm."reasonNameSnapshot",
      sm."userId",
      sm."userNameSnapshot",
      sm."note",
      sm."createdAt"
    FROM "stock_movements" sm
    ${whereClause}
    ORDER BY sm."createdAt" DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const pagination: PaginationMeta = {
    page,
    limit,
    totalCount: total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return {
    items: data,
    pagination,
  };
}
