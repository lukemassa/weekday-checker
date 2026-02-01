const dateRegexFactory = () =>
  /(mon|monday|tue|tues|tuesday|wed|wednesday|thu|thurs|thursday|fri|friday|sat|saturday|sun|sunday),?\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+([1-9][0-9]?)/gi;
const year = 2026; // TODO: figure this out dynamically

export function findProblemDates(text: string): Date | null {
  let dateRegex = dateRegexFactory();
  let match: RegExpExecArray | null;
  while ((match = dateRegex.exec(text)) !== null) {
    const month = match[2].slice(0, 3);
    const day = match[3];

    const matchEndsAtEndOfInput = match.index + match[0].length === text.length;
    // If the number is 1 and 2, and we're at the end of the string, it's possible the user will type more so leave it.
    // If they started to type a 3, or they've already typed 11, then we don't need to skip, we have the full date
    if (parseInt(day) < 3 && matchEndsAtEndOfInput) {
      continue;
    }
    const date = new Date(`${month} ${day}, ${year}`);
    if (isNaN(date.getTime())) {
      continue;
    }

    const actualWeekday = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toLowerCase();

    const foundWeekday = match[1].slice(0, 3).toLowerCase();

    if (foundWeekday === actualWeekday) {
      continue;
    }
    return date;
  }
  return null;
}
