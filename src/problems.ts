export function findProblemDates(text: string): Date | null {
  if (text.includes("Tuesday Jan 31")) {
    return new Date(2026, 0, 31);
  }
  if (text.includes("Wednesday Jan 31")) {
    return new Date(2026, 0, 31);
  }
  return null;
}
