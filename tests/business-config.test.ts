// tests/business-config.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";

import { parseBusinessConfig } from "../lib/business-config";

const VALID_DESTINATIONS = JSON.stringify([
  {
    method: "TRANSFER",
    name: "Transfer Bank",
    description: "BCA",
    accounts: [{ label: "BCA", value: "1234567890", holder: "Crazwash" }],
  },
  {
    method: "COD",
    name: "Bayar di Tempat",
    description: "Cash saat pengambilan",
    note: "Bayar langsung saat sepatu diambil.",
  },
  {
    method: "QRIS",
    name: "QRIS",
    description: "Scan QR",
  },
]);

const whatsapp = "628123456789";

test("parses valid configuration", () => {
  const config = parseBusinessConfig({
    PAYMENT_DESTINATIONS: VALID_DESTINATIONS,
    BUSINESS_WHATSAPP_NUMBER: whatsapp,
  });

  assert.equal(config.whatsappNumber, whatsapp);
  assert.equal(config.paymentDestinations.length, 2);
  assert.deepEqual(
    config.paymentDestinations.map((d) => d.method),
    ["TRANSFER", "COD"],
  );
  assert.equal(config.paymentDestinations[0].accounts[0].value, "1234567890");
});

test("drops destinations that cannot tell the customer where to pay", () => {
  const config = parseBusinessConfig({
    PAYMENT_DESTINATIONS: VALID_DESTINATIONS,
    BUSINESS_WHATSAPP_NUMBER: whatsapp,
  });

  assert.ok(!config.paymentDestinations.some((d) => d.method === "QRIS"));
});

test("throws in required mode naming every missing variable", () => {
  assert.throws(
    () => parseBusinessConfig({}, { requireAll: true }),
    (error: Error) => {
      assert.match(error.message, /PAYMENT_DESTINATIONS/);
      assert.match(error.message, /BUSINESS_WHATSAPP_NUMBER/);
      return true;
    },
  );
});

test("keeps running without required values when not required", () => {
  const config = parseBusinessConfig({}, { requireAll: false });

  assert.equal(config.whatsappNumber, "");
  assert.deepEqual(config.paymentDestinations, []);
});

test("throws when destinations are not valid JSON", () => {
  assert.throws(
    () =>
      parseBusinessConfig(
        { PAYMENT_DESTINATIONS: "{not json", BUSINESS_WHATSAPP_NUMBER: whatsapp },
        { requireAll: true },
      ),
    /PAYMENT_DESTINATIONS is not valid JSON/,
  );
});

test("throws on an unknown payment method", () => {
  assert.throws(
    () =>
      parseBusinessConfig(
        {
          PAYMENT_DESTINATIONS: JSON.stringify([{ method: "CRYPTO" }]),
          BUSINESS_WHATSAPP_NUMBER: whatsapp,
        },
        { requireAll: true },
      ),
    /unknown method: CRYPTO/,
  );
});

test("ignores account entries without a label or value", () => {
  const config = parseBusinessConfig({
    PAYMENT_DESTINATIONS: JSON.stringify([
      {
        method: "TRANSFER",
        accounts: [{ label: "BCA", value: "  " }, { label: "", value: "123" }, { label: "BNI", value: "999" }],
      },
    ]),
    BUSINESS_WHATSAPP_NUMBER: whatsapp,
  });

  assert.equal(config.paymentDestinations.length, 1);
  assert.deepEqual(config.paymentDestinations[0].accounts, [
    { label: "BNI", value: "999" },
  ]);
});
