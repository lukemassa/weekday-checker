import { test } from "node:test";
import * as assert from "node:assert/strict";
import { findProblemDates } from "./problems";

test.test("detects tuesday Jan 31", () => {
  const res = findProblemDates("Meet me Tuesday Jan 31");
  assert.ok(res);
  assert.equal(res.getTime(), new Date(2026, 0, 31).getTime());
});

test.test("ignores unrelated text", () => {
  const res = findProblemDates("See you next week");
  assert.equal(res, null);
});