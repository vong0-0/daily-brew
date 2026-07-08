import prisma from "@/lib/prisma";
import { getLocalStartOfDayInUTC, toLocalDateKey, formatShortDate } from "../utils/date";

export type MovementChartPoint = {
  date: string;
  displayDate: string;
  in: number;
  out: number;
}

export async function getMovementChartData(periodDays: 7 | 30): Promise<MovementChartPoint[]> {
  const startDate = getLocalStartOfDayInUTC(periodDays - 1);

  const buckets = new Map<string, MovementChartPoint>();

  for (let i = 0; i < periodDays; i++) {
    const dayStart = getLocalStartOfDayInUTC(periodDays - 1 - i);
    const key = toLocalDateKey(dayStart);
    buckets.set(key, { date: key, displayDate: formatShortDate(key), in: 0, out: 0 });
  }

  const movements = await prisma.stockMovement.findMany({
    where: { createdAt: { gte: startDate } },
    select: { type: true, quantity: true, createdAt: true }
  })

  for (const movement of movements) {
    const key = toLocalDateKey(movement.createdAt);
    const bucket = buckets.get(key);
    if (!bucket) continue;

    const qty = movement.quantity.toNumber();
    if (movement.type === "IN") bucket.in += qty;
    else bucket.out += qty
  }

  return Array.from(buckets.values())
}
