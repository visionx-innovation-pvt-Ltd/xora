import test from "node:test";
import assert from "node:assert/strict";
import { assertMinorAmount, calculateOrderTotal, formatMinorAmount } from "../src/money.js";
test("minor amounts must be safe non-negative integers", () => {
  assert.equal(assertMinorAmount(2500), 2500);
  assert.throws(() => assertMinorAmount(-1), TypeError);
  assert.throws(() => assertMinorAmount(1.25), TypeError);
  assert.throws(() => assertMinorAmount(Number.MAX_SAFE_INTEGER + 1), TypeError);
});
test("order totals use trusted integer prices and bounded quantities", () => {
  assert.equal(calculateOrderTotal([{priceMinor:1000,quantity:2},{priceMinor:550,quantity:3}]), 3650);
  assert.throws(() => calculateOrderTotal([]), TypeError);
  assert.throws(() => calculateOrderTotal([{priceMinor:100,quantity:21}]), TypeError);
});
test("minor amount formatting uses selected currency", () => {
  assert.match(formatMinorAmount(1250,"SAR"), /12[.]50/);
});
