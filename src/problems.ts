const dateRegexFactory = () =>
  /(mon|monday|tue|tues|tuesday|wed|wednesday|thu|thurs|thursday|fri|friday|sat|saturday|sun|sunday),?\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+([1-9][0-9]?)/gi;

export type Analysis = { found: false } | { found: true; message: string };

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

export class ProblemFinder {
  // properties
  alreadySeen: Set<string>;
  currentDate: Date;

  // constructor to initialize properties
  constructor(currentDate: Date) {
    this.alreadySeen = new Set<string>();
    this.currentDate = currentDate;
  }

  analyzeText(text: string): Analysis {
    const res = this.findProblemText(text);
    if (res === null) {
      return { found: false };
    }
    this.alreadySeen.add(res.rawString);
    return {
      found: true,
      message: formatDateMessage(res.date, this.currentDate),
    };
  }

  private findProblemText(text: string): {
    date: Date;
    rawString: string;
  } | null {
    let dateRegex = dateRegexFactory();
    let match: RegExpExecArray | null;
    while ((match = dateRegex.exec(text)) !== null) {
      const month = match[2].slice(0, 3).toLowerCase();
      const day = parseInt(match[3]); // regex has already validated this as number, so will not get NaN

      // We've already seen this one!
      if (this.alreadySeen.has(match[0])) {
        continue;
      }

      const matchEndsAtEndOfInput =
        match.index + match[0].length === text.length;
      // If the number is 1, 2 or 3, and we're at the end of the string, it's possible the user will type more so leave it.
      // If they started to type a 4, or they've already typed 11, then we don't need to skip, we have the full date
      if (day < 4 && matchEndsAtEndOfInput) {
        continue;
      }
      const date = getClosestDate(month, day, this.currentDate);
      if (date === null) {
        continue;
      }

      const actualWeekday = date
        .toLocaleDateString("en-US", { weekday: "short" })
        .toLowerCase();

      const foundWeekday = match[1].slice(0, 3).toLowerCase();

      if (foundWeekday === actualWeekday) {
        continue;
      }
      return { date, rawString: match[0] };
    }
    return null;
  }
}

export function formatDateMessage(date: Date, anchorDate: Date): string {
  const dateString = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const dateYear = date.getFullYear();
  const anchorYear = anchorDate.getFullYear();

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  if (dateYear > anchorYear) {
    return `${dateString} will be a ${weekday} in ${dateYear}`;
  }
  if (dateYear < anchorYear) {
    return `${dateString} was a ${weekday} in ${dateYear}`;
  }

  return `${dateString} is a ${weekday} in ${dateYear}`;
}

// Gets the closest date to the anchor for the given month and day, not more than a year away.
// It expects month to be three letter low case abbreviation (jan, feb)
// If the day/month combo is invalid (jan 50), it returns null.
// The reason to have the requirement of not more than a year away is leap years
// If you ask for Feb 29 and the current date is Feb 28, 2002 there is no reasoanble date you could be referring to
export function getClosestDate(
  month: string,
  day: number,
  anchor: Date,
): Date | null {
  const anchorYear = anchor.getFullYear();

  if (month === "feb" && day === 29) {
    return getClosestLeapDay(anchor);
  }
  const dateInAnchorYear = getDate(month, day, anchorYear);
  if (dateInAnchorYear === null) {
    return null;
  }
  const diffFromAnchorYear = anchor.getTime() - dateInAnchorYear.getTime();
  if (diffFromAnchorYear > 0) {
    // The proposed date happened *earlier* in the year.
    // Maybe next year would be better?
    const dateInNextYear = getDate(month, day, anchorYear + 1);
    if (dateInNextYear === null) {
      return null;
    }
    const diffFromNextYear = anchor.getTime() - dateInNextYear.getTime();
    if (Math.abs(diffFromNextYear) < Math.abs(diffFromAnchorYear)) {
      return dateInNextYear;
    }
    return dateInAnchorYear;
  }
  // The proposed date happened *later* in the year.
  // Maybe last year would be better?
  const dateInLastYear = getDate(month, day, anchorYear - 1);
  if (dateInLastYear === null) {
    return null;
  }
  const diffFromLastYear = anchor.getTime() - dateInLastYear.getTime();
  if (Math.abs(diffFromLastYear) < Math.abs(diffFromAnchorYear)) {
    return dateInLastYear;
  }
  return dateInAnchorYear;
}

export function getDate(month: string, day: number, year: number): Date | null {
  if (day <= 0) {
    return null;
  }
  const date = new Date(`${month} ${day}, ${year}`);
  // Firstly, if it fails to parse, obviously invalid
  if (isNaN(date.getTime())) {
    return null;
  }
  // Next, because javascript is ridiculous, it allows you to put the 30th day of Feb and turns it into march
  const calculatedMonth = date
    .toLocaleDateString("en-US", {
      month: "short",
    })
    .toLowerCase();
  if (calculatedMonth !== month) {
    return null;
  }
  return date;
}

// Special case for finding closest leap day
function getClosestLeapDay(anchor: Date): Date | null {
  const anchorYear = anchor.getFullYear();

  var candidate: Date | null = null;
  // At most one of the three years, (last, this, next) will have a valid leap day
  for (let i = -1; i <= 1; i++) {
    candidate = getDate("feb", 29, anchorYear + i);
    if (candidate !== null) {
      break;
    }
  }

  // For example we were in 2002, so before and after, no leap years
  if (candidate === null) {
    return null;
  }
  const diffFromCandidate = anchor.getTime() - candidate.getTime();
  // This might get confusing if we are in a non-leap year, and next year is, but it's Feb 28 today
  // Let's just err on the side of, we can't find date, that's pretty ridiculous
  if (Math.abs(diffFromCandidate) > ONE_YEAR_MS) {
    return null;
  }
  return candidate;
}
