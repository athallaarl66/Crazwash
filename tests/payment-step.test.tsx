// tests/payment-step.test.tsx
//
// Renders the checkout payment step server-side so the configured destinations
// (and the absence of placeholder accounts) are asserted from real markup.
import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Step4Payment } from "../app/(public)/order/components/steps/Step4Payment";
import type { PaymentDestination } from "../lib/business-config";

const CONFIGURED: PaymentDestination[] = [
  {
    method: "TRANSFER",
    name: "Transfer Bank",
    description: "Bank transfer",
    badge: "Populer",
    accounts: [{ label: "BCA", value: "8800123456", holder: "Crazwash" }],
    qrImageUrl: null,
    note: null,
  },
  {
    method: "COD",
    name: "Bayar di Tempat",
    description: "Cash saat pengambilan",
    badge: null,
    accounts: [],
    qrImageUrl: null,
    note: "Bayar langsung saat sepatu diambil.",
  },
];

const noop = () => {};

function render(
  destinations: PaymentDestination[],
  paymentMethod = "",
): string {
  return renderToStaticMarkup(
    <Step4Payment
      paymentDestinations={destinations}
      paymentMethod={paymentMethod}
      onPaymentMethodChange={noop}
      onBack={noop}
      onSubmit={noop}
      loading={false}
      error=""
      canSubmit={false}
    />,
  );
}

test("renders only the configured destinations", () => {
  const markup = render(CONFIGURED);

  assert.match(markup, /Transfer Bank/);
  assert.match(markup, /Bayar di Tempat/);
  assert.doesNotMatch(markup, /QRIS/);
  assert.doesNotMatch(markup, /E-Wallet/);
});

test("shows the configured account details for the selected method", () => {
  const markup = render(CONFIGURED, "TRANSFER");

  assert.match(markup, /8800123456/);
  assert.match(markup, /Crazwash/);
  assert.match(markup, /Detail Pembayaran/);
});

test("never renders placeholder account data", () => {
  const markup = render(CONFIGURED, "TRANSFER");
  const placeholders = [
    "123456789012",
    "098765432109",
    "112233445566",
    "556677889900",
    "812-3456-7890",
    "Crazwash Indonesia",
    "QRIS Placeholder",
  ];

  for (const placeholder of placeholders) {
    assert.ok(
      !markup.includes(placeholder),
      `placeholder value leaked into the payment step: ${placeholder}`,
    );
  }
});

test("shows an operational error instead of a method list when nothing is configured", () => {
  const markup = render([]);

  assert.match(markup, /Pembayaran Belum Dikonfigurasi/);
  assert.doesNotMatch(markup, /Buat Pesanan/);
  assert.doesNotMatch(markup, /Detail Pembayaran/);
});
