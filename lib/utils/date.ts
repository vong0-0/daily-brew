/**
 * Shared date formatting utilities.
 */

import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { subDays, startOfDay } from "date-fns";

const TIME_ZONE = "Asia/Bangkok"; // UTC+7, same as Laos, no daylight saving

/** Formats a Date object to a string in UTC+7 (Asia/Bangkok) */
export function formatDateTimeUTC7(date: Date | string | number): string {
  if (!date) return "-";
  return formatInTimeZone(new Date(date), TIME_ZONE, "MMM d, yyyy HH:mm");
}

/**
 * Converts a UTC Date into a local date key (YYYY-MM-DD) based on the shop's timezone.
 * Used as the grouping key when bucketing daily data.
 */
export function toLocalDateKey(utcDate: Date): string {
  return formatInTimeZone(utcDate, TIME_ZONE, "yyyy-MM-dd");
}

/**
 * Gets the start of day (00:00 local time) for N days ago, converted back to UTC
 * for use in DB queries (WHERE createdAt >= ...).
 */
export function getLocalStartOfDayInUTC(daysAgo: number): Date {
  const nowInBangkok = formatInTimeZone(new Date(), TIME_ZONE, "yyyy-MM-dd'T'00:00:00");
  const todayStartLocal = startOfDay(new Date(nowInBangkok));
  const targetDayLocal = subDays(todayStartLocal, daysAgo);

  return fromZonedTime(targetDayLocal, TIME_ZONE);
}

/** Formats a date key as DD/MM for chart axis labels, e.g. "27/07" */
export function formatShortDate(dateKey: string): string {
  const utcDate = fromZonedTime(`${dateKey}T00:00:00`, TIME_ZONE);
  return formatInTimeZone(utcDate, TIME_ZONE, "dd/MM");
}