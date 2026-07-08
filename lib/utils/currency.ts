/**
 * Shared number/currency formatting utilities.
 * Always reuse these instead of creating new Intl instances per-component.
 */

/** Formats a number as USD currency, e.g. 1234.5 → "$1,234.50" */
export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

/** Formats a plain number with thousands separators, e.g. 1234 → "1,234" */
export const numberFormatter = new Intl.NumberFormat("en-US");

/** Convenience wrapper — formats a value as USD string */
export function formatUSD(value: number): string {
  return usdFormatter.format(value);
}

/** Convenience wrapper — formats a plain number string */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}
