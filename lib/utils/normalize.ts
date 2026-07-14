/**
 * Shared utility functions for data fetching
 */

export function normalizeSearch(search?: string): string | undefined {
  const trimmed = search?.trim();
  return trimmed ? `%${trimmed}%` : undefined;
}

export function normalizePagination(
  params?: { page?: number; limit?: number },
  defaultLimit?: number,
) {
  const limit = Math.max(1, Math.floor(params?.limit ?? defaultLimit ?? 10));
  const page = Math.max(1, Math.floor(params?.page ?? 1));

  return { page, limit };
}
