// tests/success-view.test.tsx
//
// The success view must show the stored order, not values handed in by the URL,
// and must never render a success state for an order it cannot resolve.
import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import SuccessClient from "../app/(public)/order/success/SuccessClient";

// The server component pulls in the Prisma client at import time, which refuses to
// construct without a datasource URL. No query is issued by the cases below.
process.env.DATABASE_URL ??= "postgresql://user:password@localhost:5432/crazwash";

const ORDER = {
  orderNumber: "ORD-20261013-421",
  customerName: "Budi Santoso",
  totalPrice: 150000,
  paymentMethodLabel: "Transfer Bank",
};

test("renders the stored order values", () => {
  const markup = renderToStaticMarkup(
    <SuccessClient order={ORDER} whatsappNumber="628111222333" />,
  );

  assert.match(markup, /ORD-20261013-421/);
  assert.match(markup, /Budi Santoso/);
  assert.match(markup, /150\.000/);
  assert.match(markup, /Transfer Bank/);
});

test("links the configured contact destination", () => {
  const markup = renderToStaticMarkup(
    <SuccessClient order={ORDER} whatsappNumber="628111222333" />,
  );

  assert.match(markup, /https:\/\/wa\.me\/628111222333/);
  assert.doesNotMatch(markup, /6281234567890/);
});

test("shows an operational error instead of a link when no contact is configured", () => {
  const markup = renderToStaticMarkup(
    <SuccessClient order={ORDER} whatsappNumber="" />,
  );

  assert.match(markup, /Kontak Admin Belum Dikonfigurasi/);
  assert.doesNotMatch(markup, /wa\.me/);
});

test("does not render a success state without an order number", async () => {
  const { default: SuccessPage } = await import(
    "../app/(public)/order/success/page"
  );

  const element = await SuccessPage({
    searchParams: Promise.resolve({}),
  });
  const markup = renderToStaticMarkup(element);

  assert.match(markup, /Pesanan Tidak Ditemukan/);
  assert.doesNotMatch(markup, /Pesanan Berhasil Dibuat/);
});
