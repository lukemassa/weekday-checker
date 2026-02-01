import { test } from "node:test";
import * as assert from "node:assert/strict";
import { findProblemDates } from "./problems";

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
