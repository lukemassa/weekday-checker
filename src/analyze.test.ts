import { test } from "node:test";
import * as assert from "node:assert/strict";
import { formatDateMessage } from "./analyze";

test.test("detects tuesday Jan 31", () => {
  const res = formatDateMessage(new Date(2026, 0, 31));
  assert.equal(res, "January 31, 2026 is a Saturday");
});