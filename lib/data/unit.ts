import prisma from "@/lib/prisma"

export type UnitOption = {
  id: string
  name: string
  symbol: string | null
  isActive: boolean
}

export async function getUnits({ activeOnly = true }: { activeOnly?: boolean } = {}): Promise<UnitOption[]> {
  return prisma.unit.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    select: {
      id: true,
      name: true,
      symbol: true,
      isActive: true,
    },
    orderBy: { name: "asc" },
  })
}
