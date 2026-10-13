# Design

## Context

See `proposal.md` - Why. Three constraints shape the approach:

- `app/(public)/order/page.tsx` is already a server component that reads the catalogue with Prisma, so the public order flow can receive operator-configured values as props without adding a client-side API.
- `app/(public)/order/success/SuccessClient.tsx` is a client component that currently reads everything from `searchParams`; the checkout redirect at `app/(public)/order/components/OrderForm.tsx:97-103` is what puts those values in the URL today.
- The deployed environment (Vercel) is serverless with no persistent process, so any validation of operator configuration must happen per request or at build time.

## Goals / Non-Goals

**Goals:**

- One place in the codebase that answers "what payment destinations and what contact number does the business publish", validated once and reused by every customer-facing surface.
- Confirmation views that cannot be forged by editing a URL.
- One price source for the public site.

**Non-Goals:**

- Payment gateway integration, proof-of-payment upload, or persisting which destination was shown to a customer.
- An admin UI for editing payment destinations (see Decisions: configuration source).
- Redesign of the four checkout steps or of the landing page's visual language.

## Decisions

**1. Configuration module over database table for payment destinations and business contact.**
`lib/business-config.ts` reads environment variables, parses them once at module load into typed structures, and throws a descriptive error when a required value is missing in production. Alternatives considered: (a) a `PaymentDestination` table with a migration - rejected for now because it drags in an admin CRUD screen to be useful at all, and operators currently edit nothing else in the app; (b) `NEXT_PUBLIC_*` variables read directly in client components - rejected because it scatters parsing and lets an undefined value render as empty text instead of failing loudly. Trade-off accepted: changing a value is an environment change plus a redeploy of the host's environment settings, not a live edit. Upgrade path: when operators need self-service editing, move the same typed shape behind a table plus an admin screen and keep `lib/business-config.ts` as the read API.

**2. Payment step receives destinations as props from the server component.**
`app/(public)/order/page.tsx` passes the serialized configuration into `OrderForm`, which forwards it to `Step4Payment`. Alternatives considered: fetching from a public API route on mount - rejected as an extra round trip and a new public endpoint for static data. The payment step must also stop rendering its placeholder `PAYMENT_DETAILS` block; a method with no configured destination is not selectable.

**3. The success view becomes a server component that resolves the order, with a thin client component for the interactive parts.**
`app/(public)/order/success/page.tsx` reads the order number from the URL, loads the order server-side through the existing order service, and passes a serialized order plus the contact destination to the client part. The checkout redirect therefore only needs to carry the order number, not customer name, total, or payment method: those are read from the database. When no order matches, the page renders a not-found state, not a success state.

**4. Landing price list is rendered from the catalogue, grouped by the product category enum.**
`app/page.tsx` currently hardcodes three marketing groups (`shoes`, `bags`, `special`) with string prices. The catalogue's `ProductCategory` enum only has `BASIC`, `PREMIUM`, `DEEP`, `TREATMENT`, so the landing groups become those four categories using the existing labels in `lib/constants.ts`. Consequence to accept explicitly: the current marketing grouping (shoes vs bags vs special treatments) is not representable in the data model, so the landing page loses that grouping until a category field is extended. Emoji headings and the hardcoded slogan are dropped along with the hardcoded data. Alternative considered: keeping the marketing grouping with a hardcoded mapping from product name to group - rejected because it recreates the drift this change exists to remove.

**5. Build-time configuration check.**
A small check invoked by the build script fails the build when required configuration is absent in production, so a deployment cannot ship with missing payment destinations and only discover it when a customer reaches the payment step.

## Risks / Trade-offs

- [Order data becomes readable by anyone who can guess an order number] → The success view only exposes what the customer already saw, the order number keeps a random suffix, and exposure is not increased relative to the current URL-parameter behaviour. A follow-up change should add a second factor (phone suffix or a signed link). Deliberately not solved here because it changes spec behaviour and needs its own requirement.
- [Landing page loses the shoes/bags/special grouping] → Accepted, documented in Decisions; a category extension is its own change.
- [Configuration typo produces a runtime error instead of the previous silent placeholder] → Intended: the failure is loud at build/request time instead of silent at the customer's screen. The error message must name the missing variable.
- [Order numbers are generated with a 3-digit random suffix (`lib/utils.ts:generateOrderNumber`), so the success view is weakly protected] → Accept as above; the alternative (exposing nothing) would require customer accounts, which do not exist in this flow.
- [Existing deployments hold no configuration for the new keys] → Migration plan below; the change is not deployable without setting the environment values.

## Migration Plan

1. Add the new keys to `.env.example` and to the host's environment settings before deploying code that reads them.
2. Deploy; the build-time check fails fast if a key is missing.
3. Rollback: revert the deployment. No data migration is involved, so no data rollback is required.
