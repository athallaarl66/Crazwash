# Proposal

## Why

The public checkout funnel cannot complete: after placing an order the customer is sent to a placeholder WhatsApp number and shown placeholder bank/e-wallet accounts, so payment proof can never reach the business. The success page also builds its content entirely from client-supplied URL parameters, so it will happily display a fabricated "order successful" state. Customers therefore see prices, payment destinations and confirmations that do not correspond to reality.

## What Changes

- Replace the hardcoded placeholder WhatsApp destination (`app/(public)/order/success/SuccessClient.tsx:13`, `ADMIN_PHONE = "6281234567890"`, commented "GANTI NOMOR WA ADMIN LU!") with a single configured business contact value. Customer-facing flows must fail visibly (not silently) when that value is unset in production.
- Replace the placeholder payment destinations (`app/(public)/order/components/steps/Step4Payment.tsx:56`, `PAYMENT_DETAILS` with fake BCA/Mandiri/BNI/BRI/GoPay/OVO/Dana numbers) with a single configurable source of payment instructions.
- Make the post-checkout success page authoritative on the server: resolve the order by its order number server-side and render that order's stored data. Client query parameters stop being the source of truth, and an unknown/foreign order number must not produce a success state.
- Make the public landing price list derive from the same product records used by `/services` and `/order`. Remove the hardcoded `services` map in `app/page.tsx:24-47` (string prices such as `"50K"`), which currently drifts from the `Product` table and is not updated when an admin edits prices.
- Document the new configuration keys in `.env.example` (which currently declares only `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`).

## Capabilities

### New Capabilities

- `payment-instructions`: the payment destinations shown to customers (bank accounts, e-wallets, other methods) come from one configurable source; no placeholder account data can reach the customer UI.
- `business-contact`: the contact destination (WhatsApp number) used by customer-facing flows comes from one configured source.
- `order-success-confirmation`: the order success view reflects server-side order state for the given order number instead of client-supplied URL data.
- `public-pricing`: prices displayed on the public landing page derive from the product catalogue, the same data used by the services and order pages.

### Modified Capabilities

- None. The project has no existing specs (`openspec list --specs` returns an empty inventory), so every capability above is introduced by this change.

## Impact

- `app/(public)/order/success/SuccessClient.tsx` — success view data source and WhatsApp link.
- `app/(public)/order/components/steps/Step4Payment.tsx` — payment destinations; placeholder QR/transfer block (`:56` onward, incl. raw `<img>` at `:256`).
- `app/page.tsx` — landing price list data source.
- `app/(public)/order/success/page.tsx` — becomes a server component that resolves the order.
- New configuration module or extension of `lib/constants.ts`; `.env.example`; `README.md` setup section.
- No database migration expected: `Order.paymentMethod` and `Order.orderNumber` already exist. Payment destinations are not persisted on the order, so no schema change is required unless admin-editable payment instructions are chosen.

## Out of Scope

- Online payment gateway integration (Midtrans/Xendit/QRIS API). Customers still pay manually and send proof.
- Uploading payment proof inside the app; the current manual WhatsApp handoff stays until a later change.
- Redesign of the checkout steps.
