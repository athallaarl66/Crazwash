# Issue 01 - Customer-facing placeholders: fake payment data, forgeable confirmation, drifting prices

The public checkout shipped developer placeholder data (a WhatsApp number, fabricated bank
accounts and e-wallets), built its success state from URL parameters, and showed a price list
kept separate from the database catalogue.

Change: `openspec/changes/fix-customer-facing-placeholders` (schema `spec-driven`, language `en`).
Implemented in commit `e7d4ff5`, merged in `84cd51f`. "Before" line references below are taken
from the commit that preceded the fix, `e7d4ff5~1`.

## Status

Implemented, verification partially pending.

Ticked: 8 of 14 tasks in `openspec/changes/fix-customer-facing-placeholders/tasks.md`
(1.1-1.3, 2.1-2.3, 3.3, 3.4) - every task whose stated verification is an offline check
(unit test, type check, build gate).

Pending part: tasks **3.1, 3.2, 4.1, 4.2, 5.1, 5.2**. Their code is present in the tree; their
stated verification is a live request against a database-backed application, which this checkout
cannot provide (no `.env`, only `.env.example`). See "Pending verification".

## Scope

Covered:

- The contact destination customers send payment proof to (`payment-instructions`,
  `business-contact`).
- The payment destinations shown in the checkout payment step.
- The order success view and the checkout redirect that feeds it (`order-success-confirmation`).
- The public landing price list (`public-pricing`).
- The new configuration keys, their documentation, and a build-time gate against missing values.

Deliberately left out (recorded in `proposal.md` and `design.md`, both under
`openspec/changes/fix-customer-facing-placeholders/`):

- Payment gateway integration (Midtrans/Xendit/QRIS API). Customers still pay manually.
- Uploading payment proof in the app; the manual WhatsApp handoff stays.
- An admin UI for editing payment destinations. Configuration stays an environment change.
- Persisting which destination was shown to a customer (no schema change).
- Redesign of the checkout steps or of the landing page's visual language.

## Symptoms

Cluster 1 - dummy business data reaching customers.

- `app/(public)/order/components/steps/Step4Payment.tsx:57` declared `PAYMENT_DETAILS` with
  invented accounts and holders: BCA `123456789012`, Mandiri `098765432109`, BNI `112233445566`,
  BRI `556677889900`, and GoPay/OVO/Dana wallet entries, all under a "PLACEHOLDER RANDOM - GANTI
  DENGAN DATA REAL ANDA!" comment. It was read at line 104 and rendered in the step.
  Command: `git show e7d4ff5~1:'app/(public)/order/components/steps/Step4Payment.tsx' | grep -n 'PAYMENT_DETAILS\|bank:\|provider:'`
- `app/(public)/order/success/SuccessClient.tsx:13` held `const ADMIN_PHONE = "6281234567890";`
  labelled "GANTI NOMOR WA ADMIN LU!", used at line 73 to build the `https://wa.me/...` link.
  Every customer's payment proof was addressed to that number.
  Command: `git show e7d4ff5~1:'app/(public)/order/success/SuccessClient.tsx' | grep -n 'ADMIN_PHONE\|wa.me'`

Cluster 2 - the confirmation view was client-authoritative.

- `app/(public)/order/success/SuccessClient.tsx:17-20` read `orderNumber`, `customerName`,
  `totalPrice` and `paymentMethod` from `useSearchParams()`, and rendered them as the order.
- `app/(public)/order/components/OrderForm.tsx:103` was what put them there:
  `router.push(\`/order/success?${params.toString()}\`)`.
- Consequence: any hand-edited URL produced a "payment received"-style success state for an
  order that does not exist.

Cluster 3 - the public price list was a second copy of the catalogue.

- `app/page.tsx:24-47` declared a hardcoded `services` map of three marketing groups (`shoes`,
  `bags`, `special`) with string prices (`"50K"`, `"70K"`, ...), separate from the `Product`
  table used by `/services` and `/order`. An admin price change never reached the landing page.
  Command: `git show e7d4ff5~1:app/page.tsx | grep -n 'const services'`

Cluster 4 - the payment illustration and the absent configuration surface.

- `app/(public)/order/components/steps/Step4Payment.tsx:256` used a raw `<img>` for the QRIS
  illustration instead of the project's image component.
- `.env.example` declared only `DATABASE_URL`, `NEXTAUTH_URL` and `NEXTAUTH_SECRET`, so there was
  no key an operator could set to replace the placeholders.

Note: `proposal.md` cites `Step4Payment.tsx:56` for the placeholder block. In the tree the
`PAYMENT_DETAILS` declaration is at line 57; line 56 is the comment above it. The code is the
authority here.

## Root cause

- No single owner for "what the business publishes". Payment destinations and the contact number
  lived only in component code, so there was no value an operator could change and nothing failed
  when development placeholders shipped.
- The success view treated the URL as the source of truth. The server never re-read the stored
  order, and the redirect in `OrderForm` supplied display values the page then trusted.
- The landing page kept a second, hand-maintained copy of the catalogue in page code, which
  drifted from the `Product` table by construction.
- The raw `<img>` predated use of the project's image component in that step.

## Fix

Grouped by area. All paths are relative to the repository root.

### A. One configuration source

New `lib/business-config.ts`:

- `parseBusinessConfig(raw, { requireAll })` parses `BUSINESS_WHATSAPP_NUMBER` and
  `PAYMENT_DESTINATIONS` into typed `BusinessConfig`. There is no fallback account: a destination
  survives only if `isConfigured()` finds a non-empty `accounts` array, a `qrImageUrl`, or a
  `note`. An unknown `method` throws an error naming the allowed values
  (`TRANSFER | EWALLET | QRIS | COD`); malformed JSON throws naming the variable.
- `getBusinessConfig()` parses once per process and passes `requireAll` when
  `NODE_ENV === "production"`, so a missing required value fails the request instead of rendering
  invented details. Development stays usable so the UI can show its "not configured" state.

Design decisions recorded in `design.md`:

- A configuration module was chosen over a `PaymentDestination` table. The table alternative was
  rejected because it is useless without an admin CRUD screen; reading `NEXT_PUBLIC_*` directly in
  client components was rejected because it scatters parsing and turns an unset value into empty
  text instead of a loud failure. Accepted trade-off: changing a value means an environment change
  plus redeploy, not a live edit. Recorded upgrade path: move the same typed shape behind a table
  and keep this module as the read API.

### B. Build-time gate

- New `scripts/check-business-config.ts` calls `parseBusinessConfig(process.env, { requireAll: true })`
  and exits 1 naming the missing variables. `ALLOW_MISSING_BUSINESS_CONFIG=1` skips the gate for
  local experiments.
- `package.json` `build` script runs it first:
  `node --import tsx scripts/check-business-config.ts && prisma generate && ... && next build`,
  so a deployment cannot ship with missing destinations.
- `.env.example` now documents both keys, the JSON shape, and the method list.

### C. Checkout payment step

- `app/(public)/order/page.tsx` (lines ~168-200) reads `getBusinessConfig().paymentDestinations`
  and passes them into `OrderForm`.
- `app/(public)/order/components/OrderForm.tsx:28` accepts `paymentDestinations` and forwards them
  to `Step4Payment` (line 176-178).
- `app/(public)/order/components/steps/Step4Payment.tsx` is now prop-driven: `paymentDestinations`
  (line 19) replaces the `PAYMENT_DETAILS` constant, only configured destinations are rendered
  (line 94), and when none is configured the step renders an operational error
  ("Pembayaran Belum Dikonfigurasi") instead of a method list or any fallback account.
- The raw `<img>` is replaced by `next/image` (`import Image from "next/image"`, used for
  `selected.qrImageUrl`).
- Decision: destinations are passed as props from the server component; fetching them from a new
  public API on mount was rejected as an extra round trip and a new public endpoint for static data.

### D. Server-side order confirmation

- `app/(public)/order/success/page.tsx` is now a server component with
  `export const dynamic = "force-dynamic"`. It accepts only `orderNumber` from `searchParams`,
  resolves the order through `getOrderByNumber()` (`lib/orderService.ts:162`), and renders a
  `OrderNotFound` state when nothing matches. It also resolves the configured contact destination
  and the payment method label, and passes a serialized order to the client view.
- `app/(public)/order/success/SuccessClient.tsx` is presentation only: props are
  `{ order, whatsappNumber }`; the `useSearchParams()` reads and `ADMIN_PHONE` are gone.
- `app/(public)/order/components/OrderForm.tsx:100-104` now redirects with the order number alone
  and documents the URL contract in the file header:
  `/order/success?orderNumber=<orderNumber>`.

### E. Landing price list from the catalogue

- `app/page.tsx` renders `getActiveProducts()` (`lib/productService.ts:50`, `isActive: true,
  deletedAt: null`) grouped by `ProductCategory` in the order `BASIC, PREMIUM, DEEP, TREATMENT`,
  using `CATEGORY_LABELS` and `CATEGORY_DESCRIPTIONS` from `lib/constants.ts`. The hardcoded
  `services` map, the emoji headings and the hardcoded slogan are removed.
- Decision recorded in `design.md`: group by the `ProductCategory` enum. Keeping the current
  marketing grouping (`shoes` / `bags` / `special`) through a hardcoded name-to-group map was
  rejected because it recreates the drift this change exists to remove. Accepted consequence: the
  landing page loses the shoes/bags/special grouping until the category model is extended.

### F. Documentation

- `README.md` lists the new keys under Environment Variables and notes that monetary values,
  soft delete and the optional email behave as described there.

## Evidence

Commands run against this checkout, with observed results:

```
$ npx tsc --noEmit
(no output, exit code 0)

$ npm test
tests 20 | pass 20 | fail 0
  tests/business-config.test.ts   7 pass
  tests/payment-step.test.tsx     4 pass
  tests/success-view.test.tsx     4 pass
  tests/security-policy.test.ts   5 pass   (added by issue 02)

$ env -u BUSINESS_WHATSAPP_NUMBER -u PAYMENT_DESTINATIONS npx tsx scripts/check-business-config.ts
[business-config] Missing required business configuration: BUSINESS_WHATSAPP_NUMBER, PAYMENT_DESTINATIONS
[business-config] Set the missing variables (see .env.example) or set ALLOW_MISSING_BUSINESS_CONFIG=1 to skip this check.
exit code 1
```

The 15 tests attributable to this change (7 + 4 + 4) cover: configuration parsing and the missing
value error, the payment step rendering only configured destinations plus its operational error
state, and the success view rendering stored values / refusing to render a success state without an
order.

Files touched by the change (from `git show e7d4ff5 --stat`): `lib/business-config.ts`,
`scripts/check-business-config.ts`, `tests/business-config.test.ts`, `tests/payment-step.test.tsx`,
`tests/success-view.test.tsx`, `app/(public)/order/page.tsx`,
`app/(public)/order/components/OrderForm.tsx`,
`app/(public)/order/components/steps/Step4Payment.tsx`,
`app/(public)/order/success/page.tsx`, `app/(public)/order/success/SuccessClient.tsx`,
`app/page.tsx`, `.env.example`, `README.md`, `package.json`.

Verified absences in the current tree:

```
$ grep -rn "6281234567890\|PAYMENT_DETAILS\|temp\.com" app lib actions components scripts
(no match)
```

## How to verify

Offline, no database needed:

1. `npx tsc --noEmit` - expect no output and exit code 0.
2. `node --import tsx --test tests/business-config.test.ts tests/payment-step.test.tsx tests/success-view.test.tsx`
   - expect `pass 15`, `fail 0`.
3. `env -u BUSINESS_WHATSAPP_NUMBER -u PAYMENT_DESTINATIONS npx tsx scripts/check-business-config.ts`
   - expect exit code 1 and a line naming `BUSINESS_WHATSAPP_NUMBER, PAYMENT_DESTINATIONS`.
4. `ALLOW_MISSING_BUSINESS_CONFIG=1 npx tsx scripts/check-business-config.ts`
   - expect exit code 0 with `[business-config] No payment destination is configured; ...`.
5. `BUSINESS_WHATSAPP_NUMBER=628123456789 PAYMENT_DESTINATIONS='[{"method":"COD","name":"Bayar di Tempat","note":"Bayar saat sepatu diambil."}]' npx tsx scripts/check-business-config.ts`
   - expect exit code 0 and `[business-config] 1 payment destination(s), contact 628123456789`.
6. `npm run build` with the keys unset - expect the build to fail in the first step with the
   missing variable names; with the keys set, expect it to continue into `next build`.

With a running application (see "Pending verification" for what is not covered): copy
`.env.example` to `.env`, fill both keys, `npm run dev`, then open `/`, `/order`, and
`/order/success?orderNumber=<a stored order number>` and confirm the landing prices equal the
catalogue, the payment step shows only configured destinations, and the success view shows the
stored values after a hard refresh.

## Pending verification

Tasks 3.1, 3.2, 4.1, 4.2, 5.1, 5.2. All six need a running, database-backed application; this
checkout has no `.env` (only `.env.example`), so no request can be served and no order can be
resolved. None of the following was run:

- 3.1 / 3.2 - rendered request to the success route showing the stored order number, total and
  payment method, and a not-found state that never displays the success heading for an unknown or
  malformed order number. To close: set `DATABASE_URL` plus the business keys, run the app, place
  one order, then request `/order/success` with the real number, a nonexistent number, and a
  malformed number.
- 4.1 - landing page showing the same names and prices as the services page for the same
  catalogue. To close: with a seeded database, compare `/` and `/services` for the same products.
- 4.2 - the end-to-end drift check: change a price in the admin console, reload `/`, confirm the
  new price appears with no code change. To close: needs an administrator session and a writable
  database.
- 5.1 - an integration check over catalogue to order creation to success view. Not added; the
  change records automated coverage as deferred pending a database-backed test environment.
- 5.2 - walking the deployed preview: one full order, confirming the payment instructions are the
  configured ones and that payment proof reaches the configured contact. To close: a deployment
  with the real values set.

## Follow-ups / out of scope

- Order-number exposure: the success view is readable by anyone who can guess an order number,
  and `lib/utils.ts:45` generates only a 3-digit random suffix. Recorded in `design.md` as an
  accepted risk; the follow-up is a second factor (phone suffix or a signed link) in its own change.
- Landing page category model: the shoes/bags/special marketing grouping needs a category
  extension before it can be restored from catalogue data.
- Online payment gateway and in-app proof upload remain out of scope (see `proposal.md`).
- An admin UI for payment destinations is the recorded upgrade path of the configuration module.
- Run `openspec validate fix-customer-facing-placeholders` and archive the change once the order
  path has been exercised once against a configured environment (tasks 5.1/5.2).
