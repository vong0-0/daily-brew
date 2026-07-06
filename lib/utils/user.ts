/**
 * Generates avatar fallback text from a user's first and last name.
 * Returns the first character of each name, uppercased.
 * e.g. "John Doe" → "JD"
 */
export function getAvatarFallback(firstName: string, lastName: string): string {
  const first = firstName.trim()[0] ?? "";
  const last = lastName.trim()[0] ?? "";
  return (first + last).toUpperCase();
}
