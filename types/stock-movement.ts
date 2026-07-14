import type { MovementType } from "@/prisma/generated/prisma/client";
import type { PaginationMeta } from "./pagination";

export type MovementChartPoint = {
  date: string;
  displayDate: string;
  in: number;
  out: number;
};

export type StockMovementRecord = {
  id: string;
  type: MovementType;
  quantity: string;
  productId: string;
  productNameSnapshot: string;
  categoryNameSnapshot: string;
  unitSnapshot: string;
  costSnapshot: string;
  reasonTypeId: string;
  reasonNameSnapshot: string;
  userId: string;
  userNameSnapshot: string;
  note: string | null;
  createdAt: Date;
};

export type StockMovementFilters = {
  search?: string;
  type?: MovementType;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
};

export type StockMovementList = {
  items: StockMovementRecord[];
  pagination: PaginationMeta;
};
