const dateRegexFactory = () =>
  /(mon|monday|tue|tues|tuesday|wed|wednesday|thu|thurs|thursday|fri|friday|sat|saturday|sun|sunday),?\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+([1-9][0-9]?)/gi;
const year = 2026; // TODO: figure this out dynamically

export type Analysis = { found: false } | { found: true; message: string };

export class ProblemFinder {
  // properties
  alreadySeen: Set<string>;

  // constructor to initialize properties
  constructor() {
    this.alreadySeen = new Set<string>();
  }

  analyzeText(text: string): Analysis {
    // If the text *no longer* contains the bad string, "forget it", so we can error on it later
    for (const rawString of Array.from(this.alreadySeen)) {
      if (!text.includes(rawString)) {
        this.alreadySeen.delete(rawString);
      }
    }
    const res = this.findProblemText(text);
    if (res === null) {
      return { found: false };
    }
    this.alreadySeen.add(res.rawString);
    return {
      found: true,
      message: formatDateMessage(res.date),
    };
  }

  private findProblemText(text: string): {
    date: Date;
    rawString: string;
  } | null {
    let dateRegex = dateRegexFactory();
    let match: RegExpExecArray | null;
    while ((match = dateRegex.exec(text)) !== null) {
      const month = match[2].slice(0, 3);
      const day = match[3];

      const matchEndsAtEndOfInput =
        match.index + match[0].length === text.length;
      // If the number is 1, 2 or 3, and we're at the end of the string, it's possible the user will type more so leave it.
      // If they started to type a 4, or they've already typed 11, then we don't need to skip, we have the full date
      if (parseInt(day) < 4 && matchEndsAtEndOfInput) {
        continue;
      }
      const date = new Date(`${month} ${day}, ${year}`);
      if (isNaN(date.getTime())) {
        continue;
      }
      // We've already seen this one!
      if (this.alreadySeen.has(match[0])) {
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

export function formatDateMessage(date: Date): string {
  const dateString = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return `${dateString} is a ${weekday}`;
}
