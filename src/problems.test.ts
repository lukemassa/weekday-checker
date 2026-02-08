import { test } from "node:test";
import * as assert from "node:assert/strict";
import {
  ProblemFinder,
  formatDateMessage,
  getClosestDate,
  getDate,
} from "./problems";

const anchorDate = new Date(2026, 0, 1);

// Helper for the common case of just testing strings
function findProblemDates(text: string): Date | null {
  let p = new ProblemFinder(anchorDate);
  // findProblemText is a private function, but important and worth testing
  let res = (p as any).findProblemText(text);
  if (res === null) {
    return null;
  }
  return res.date;
}

test.test("format result for Jan 31 on the day", () => {
  const res = formatDateMessage(new Date(2026, 0, 31), new Date(2026, 0, 31));
  assert.equal(res, "January 31 is a Saturday in 2026");
});

test.test(
  "format result for Jan 31 from the perspective of the previous Dec",
  () => {
    const res = formatDateMessage(
      new Date(2026, 0, 31),
      new Date(2025, 11, 31),
    );
    assert.equal(res, "January 31 will be a Saturday in 2026");
  },
);

test.test(
  "format result for Jan 31 from the perspective of later that year",
  () => {
    const res = formatDateMessage(
      new Date(2026, 0, 31),
      new Date(2026, 11, 31),
    );
    assert.equal(res, "January 31 is a Saturday in 2026");
  },
);

test.test(
  "format result for Dec 31 from the perspective of early next year",
  () => {
    const res = formatDateMessage(
      new Date(2025, 11, 31),
      new Date(2026, 0, 31),
    );
    assert.equal(res, "December 31 was a Wednesday in 2025");
  },
);

test.test("detects tuesday Jan 31", () => {
  const res = findProblemDates("Meet me Tuesday Jan 31");
  assert.ok(res);
  assert.equal(res.getTime(), new Date(2026, 0, 31).getTime());
});

test.test("allow for numbers after Tuesday Jan 1", () => {
  const res = findProblemDates("Meet me Tuesday Jan 1");
  assert.equal(res, null);
});

test.test("allow for numbers after Tuesday Jan 3", () => {
  const res = findProblemDates("Meet me Tuesday Jan 3");
  assert.equal(res, null);
});

test.test("do not allow for numbers after Tuesday Jan 11", () => {
  const res = findProblemDates("Meet me Tuesday Jan 11");
  assert.ok(res);
  assert.equal(res.getTime(), new Date(2026, 0, 11).getTime());
});

test.test("after a comma know the date is over", () => {
  const res = findProblemDates("Meet me Tuesday Jan 1, if you can");
  assert.ok(res);
  assert.equal(res.getTime(), new Date(2026, 0, 1).getTime());
});

test.test("detects saturday Jan 31", () => {
  const res = findProblemDates("Meet me Saturday Jan 31.");
  assert.equal(res, null);
});

test.test("detects problem after valid date", () => {
  const res = findProblemDates(
    "Meet me Saturday Jan 31. Then we can discuss this on Monday, Feb 1.",
  );
  assert.ok(res);
  assert.equal(res.getTime(), new Date(2026, 1, 1).getTime());
});

test.test("handles 0 date", () => {
  const res = findProblemDates("Meet me Saturday Jan 0.");
  assert.equal(res, null);
});

test.test("handles 99 date", () => {
  const res = findProblemDates("Meet me Saturday Jan 99.");
  assert.equal(res, null);
});

test.test("ignores unrelated text", () => {
  const res = findProblemDates("See you next week");
  assert.equal(res, null);
});

test.test("detects lowercase and punctuation", () => {
  const res = findProblemDates("meet me tues, jan 31.");
  assert.equal(res?.getTime(), new Date(2026, 0, 31).getTime());
});

test.test("Update errors as you go", () => {
  let p = new ProblemFinder(anchorDate);
  const res1 = p.analyzeText("meet me tues, jan 31.");
  assert.equal(res1.found, true);
  // Don't show the error
  const res2 = p.analyzeText("meet me tues, jan 31. Something else");
  assert.equal(res2.found, false);

  // After a reset, the error should not show up again
  const res3 = p.analyzeText("meet me");
  assert.equal(res3.found, false);

  const res4 = p.analyzeText("meet me tues, jan 31.");
  assert.equal(res4.found, false);

  // However there should be other errors.
  const res5 = p.analyzeText("meet me tues, jan 31. Or wed, jan 31");
  assert.equal(res5.found, true);
});

// Tests for getClosestDate

test.test("pick nearest date in Jan a few days ahead", () => {
  const res = getClosestDate("jan", 8, new Date(2026, 0, 5));
  assert.ok(res);
  assert.equal(res?.getTime(), new Date(2026, 0, 8).getTime());
});

test.test("pick nearest date in Jan a few days behind", () => {
  const res = getClosestDate("jan", 1, new Date(2026, 0, 5));
  assert.ok(res);
  assert.equal(res?.getTime(), new Date(2026, 0, 1).getTime());
});

test.test("pick nearest date in Aug a few days ahead", () => {
  const res = getClosestDate("aug", 8, new Date(2026, 7, 5));
  assert.ok(res);
  assert.equal(res?.getTime(), new Date(2026, 7, 8).getTime());
});

test.test("pick nearest date in Aug a few days behind", () => {
  const res = getClosestDate("aug", 1, new Date(2026, 7, 5));
  assert.ok(res);
  assert.equal(res?.getTime(), new Date(2026, 7, 1).getTime());
});

test.test("pick nearest date in Dec a few days ahead", () => {
  const res = getClosestDate("dec", 8, new Date(2026, 11, 5));
  assert.ok(res);
  assert.equal(res?.getTime(), new Date(2026, 11, 8).getTime());
});

test.test("pick nearest date in Dec a few days behind", () => {
  const res = getClosestDate("dec", 1, new Date(2026, 11, 5));
  assert.ok(res);
  assert.equal(res?.getTime(), new Date(2026, 11, 1).getTime());
});

test.test("pick nearest date in Dec that's in Jan", () => {
  const res = getClosestDate("jan", 5, new Date(2026, 11, 5));
  assert.ok(res);
  assert.equal(res?.getTime(), new Date(2027, 0, 5).getTime());
});

test.test("pick nearest date in Jan that's in Dec", () => {
  const res = getClosestDate("dec", 5, new Date(2027, 0, 7));
  assert.ok(res);
  assert.equal(res?.getTime(), new Date(2026, 11, 5).getTime());
});

test.test("return null if we get invalid date", () => {
  const res = getClosestDate("dec", 50, new Date(2027, 0, 7));
  assert.equal(res, null);
});

test("ties prefer anchor year", () => {
  const res = getClosestDate("jul", 2, new Date(2026, 6, 2));
  assert.equal(res?.getTime(), new Date(2026, 6, 2).getTime());
});

// test date helper

test("Jan 1, 2000 is valid date", () => {
  const res = getDate("jan", 1, 2000);
  assert.equal(res?.getTime(), new Date(2000, 0, 1).getTime());
});

test("Jan -1, 2000 is an invalid date", () => {
  const res = getDate("jan", -1, 2000);
  assert.equal(res, null);
});

test("Jan 0, 2000 is an invalid date", () => {
  const res = getDate("jan", 0, 2000);
  assert.equal(res, null);
});

test("Jan 35, 2000 is an invalid date", () => {
  const res = getDate("jan", 35, 2000);
  assert.equal(res, null);
});

test("Feb 29, 2000 is an valid date", () => {
  const res = getDate("feb", 29, 2000);
  assert.equal(res?.getTime(), new Date(2000, 1, 29).getTime());
});

test("Feb 30, 2000 is not a valid date", () => {
  const res = getDate("feb", 30, 2000);
  assert.equal(res, null);
});

test("Feb 29, 2001 is not a valid date", () => {
  const res = getDate("feb", 29, 2001);
  assert.equal(res, null);
});

test("Feb 29, 1900 is not a valid date", () => {
  const res = getDate("feb", 29, 1900);
  assert.equal(res, null);
});

// Leap day

test.test("pick nearest leap day in a leap year", () => {
  const res = getClosestDate("feb", 29, new Date(2000, 1, 5));
  assert.ok(res);
  assert.equal(res?.getTime(), new Date(2000, 1, 29).getTime());
});

test.test(
  "pick nearest leap day if next year is a leap year and it's Dec",
  () => {
    const res = getClosestDate("feb", 29, new Date(1999, 12, 5));
    assert.ok(res);
    assert.equal(res?.getTime(), new Date(2000, 1, 29).getTime());
  },
);

test.test(
  "do not pick nearest leap day if next year is a leap year and it's Jan",
  () => {
    const res = getClosestDate("feb", 29, new Date(1999, 0, 5));
    assert.equal(res, null);
  },
);

test.test(
  "pick nearest leap day if last year is a leap year and it's Jan",
  () => {
    const res = getClosestDate("feb", 29, new Date(2001, 0, 5));
    assert.ok(res);
    assert.equal(res?.getTime(), new Date(2000, 1, 29).getTime());
  },
);

test.test(
  "do not pick nearest leap day if last year is a leap year but it's March",
  () => {
    const res = getClosestDate("feb", 29, new Date(2001, 2, 5));
    assert.equal(res, null);
  },
);
