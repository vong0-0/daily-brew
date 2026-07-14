import prisma from "@/lib/prisma";
import { Unit } from "@/prisma/generated/prisma/browser";

export type UnitOption = {
  id: string;
  name: string;
  symbol: string | null;
  isActive: boolean;
};

export async function getUnits({
  activeOnly = true,
}: { activeOnly?: boolean } = {}): Promise<UnitOption[]> {
  return prisma.unit.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    select: {
      id: true,
      name: true,
      symbol: true,
      isActive: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getUnit(id: string): Promise<Unit | null> {
  if (!id) {
    return null;
  }
  const unit = await prisma.unit.findUnique({
    where: { id },
  });

  if (!unit) {
    return null;
  }

  return unit;
}
