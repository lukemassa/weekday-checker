import { test } from "node:test";
import * as assert from "node:assert/strict";
import { ProblemFinder, formatDateMessage } from "./problems";

// Helper for the common case of just testing strings
function findProblemDates(text: string): Date | null {
  let p = new ProblemFinder();
  // findProblemText is a private function, but important and worth testing
  let res = (p as any).findProblemText(text);
  if (res === null) {
    return null;
  }
  return res.date;
}

test.test("format result for Jan 31", () => {
  const res = formatDateMessage(new Date(2026, 0, 31));
  assert.equal(res, "January 31, 2026 is a Saturday");
});

test.test("detects tuesday Jan 31", () => {
  const res = findProblemDates("Meet me Tuesday Jan 31");
  assert.ok(res);
  assert.equal(res.getTime(), new Date(2026, 0, 31).getTime());
});

test.test("allow for numbers after Tuesday Jan 1", () => {
  const res = findProblemDates("Meet me Tuesday Jan 1");
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
  let p = new ProblemFinder();
  const res1 = p.analyzeText("meet me tues, jan 31.");
  assert.equal(res1.found, true);
  // Don't show the error
  const res2 = p.analyzeText("meet me tues, jan 31. Something else");
  assert.equal(res2.found, false);

  // After a reset, the error should show up again
  const res3 = p.analyzeText("meet me");
  assert.equal(res3.found, false);

  const res4 = p.analyzeText("meet me tues, jan 31.");
  assert.equal(res4.found, true);
});
