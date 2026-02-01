import { test } from "node:test";
import * as assert from "node:assert/strict";
import { findDateProblems } from "./analyze";

test.test("detects tuesday Jan 31", () => {
  const res = findDateProblems("Meet me Tuesday Jan 31");
  assert.ok(res);
  assert.equal(res.problemString, "Tuesday Jan 31");
  assert.equal(res.actualDay, "Saturday");
});

test.test("ignores unrelated text", () => {
  const res = findDateProblems("See you next week");
  assert.equal(res, null);
});