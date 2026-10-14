// tests/lib-utils.test.ts
import assert from "node:assert/strict";
import test from "node:test";

import { formatCurrency, generateOrderNumber } from "../lib/utils";

/* -------------------------------------------------- currency formatting */

test("formatCurrency matches every collapsed variant, value for value", () => {
  // The four local copies this file replaced, kept verbatim as the reference the
  // shared helper has to reproduce.
  const legacyInline = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  const legacyRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  for (const amount of [0, 25000, 50000, 85000, 1234567, 100000000, 42501]) {
    assert.equal(
      formatCurrency(amount),
      legacyInline.format(amount),
      `the shared helper disagrees with the inline variant at ${amount}`,
    );
    assert.equal(
      formatCurrency(amount),
      legacyRupiah.format(amount),
      `the shared helper disagrees with the customer-detail variant at ${amount}`,
    );
  }

  assert.match(formatCurrency(50000), /^Rp\s50\.000$/u);
  assert.match(
    formatCurrency(1234567),
    /^Rp\s1\.234\.567$/u,
    "thousands are not grouped the Indonesian way",
  );
});

/* --------------------------------------------------- order numbers */

test("generateOrderNumber does not repeat within one millisecond", () => {
  const numbers: string[] = [];
  const started = Date.now();

  // One tight loop: several thousand numbers from the same millisecond.
  for (let index = 0; index < 1000; index += 1) {
    numbers.push(generateOrderNumber());
  }

  assert.equal(
    new Set(numbers).size,
    numbers.length,
    "two numbers generated in the same millisecond were identical",
  );
  assert.ok(
    Date.now() - started < 1000,
    "the loop did not stay inside one millisecond",
  );

  for (const number of numbers) {
    assert.match(
      number,
      /^ORD-\d{8}-[0-9a-f]{8}$/,
      `unexpected order number shape: ${number}`,
    );
  }

  const today = new Date();
  const prefix = `ORD-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(
    today.getDate(),
  ).padStart(2, "0")}-`;
  assert.ok(
    numbers.every((number) => number.startsWith(prefix)),
    "the date part is not the current day",
  );
});
