const dateRegex =
  /(mon|monday|tue|tues|tuesday|wed|wednesday|thu|thurs|thursday|fri|friday|sat|saturday|sun|sunday),?\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+([1-9][0-9]?)(?:[^\d])/i;
const year = 2026; // TODO: figure this out dynamically

export function findProblemDates(text: string): Date | null {
  const match = dateRegex.exec(text);
  if (match === null) {
    return null;
  }
  const month = match[2].slice(0, 3);
  const day = match[3];

  const date = new Date(`${month} ${day}, ${year}`);

  const actualWeekday = date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();

  const foundWeekday = match[1].slice(0, 3).toLowerCase();

  if (foundWeekday === actualWeekday) {
    return null;
  }
  return date;
}
