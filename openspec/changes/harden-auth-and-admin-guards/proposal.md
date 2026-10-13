# Proposal

## Why

Every authenticated session is treated as an administrator: the session role is hardcoded to `"ADMIN"` regardless of the stored role, so the `session.user.role !== "ADMIN"` checks found across admin routes never reject anyone. On top of that, several admin-only entry points have no session check at all (the dashboard API and every order-mutating server action), and customer provisioning writes a shared literal password hash and forces `role: "CUSTOMER"` on update. The combined effect is that anyone who can obtain a session — including a customer created by the public order flow, whose password hash is identical for every customer — can read revenue data and mutate orders.

## What Changes

- Stop hardcoding the role. `lib/auth.ts:35`, `:45`, `:52` must carry the role stored on the `User` record, and `authorize()` (`:18-37`) must reject soft-deleted accounts (`deletedAt` is currently ignored) while only returning active users.
- Require an ADMIN session on every admin surface:
  - `GET /api/admin/dashboard` (`app/api/admin/dashboard/route.ts:7`, 467 lines) currently performs zero authorization.
  - `PATCH /api/orders/[id]` (`app/api/orders/[id]/route.ts:6`) lets an anonymous caller set `PAID`/`CONFIRMED` or `CANCELLED` for any order id.
  - Server actions in `app/admin/orders/action.ts:9`, `:24` and `actions/orderActions.ts:267` have no session check.
- Fix customer provisioning in `actions/orderActions.ts` (`:120-148`): no shared literal bcrypt hash (`:127`), no forcing of `role` on an existing user, no synthetic `customer-${Date.now()}@temp.com` addresses, no `lastLogin` write on order creation.
- Make the admin path guard effective on the installed Next.js version: `middleware.ts` is deprecated in favour of `proxy.ts` on Next 16, and its matcher (`middleware.ts:31`, `["/admin/:path*"]`) excludes the `/auth/login` redirect branch at `:19-23`, which is dead code.
- Apply rate limiting to the public order-creation path and credential sign-in. `lib/rate-limit.ts` is currently never imported and uses an in-memory `Map`, which does not work across serverless instances, so the storage strategy is a design decision for this change.
- Decide and enforce the lifecycle of the unused account-security columns (`loginAttempts`, `lockedUntil`, `lastLogin`, `passwordChangedAt`): enforce them or drop them.

## Capabilities

### New Capabilities

- `admin-authorization`: admin-only resources (pages, API routes, server actions) require an authenticated session whose persisted role is ADMIN; authorization is derived from stored user data, never from a constant.
- `credential-login`: the credentials provider authenticates only active, non-deleted users and derives the session role from the database record.
- `customer-provisioning`: creating or linking a customer during checkout never escalates privileges, never overwrites an existing account's role, and never stores credentials the business cannot rotate per-user.
- `route-protection`: path-level protection for the admin area is implemented with the mechanism the installed Next.js version actually executes.
- `login-protection`: repeated failed sign-ins and public order creation are rate limited with storage that works in the deployed environment.

### Modified Capabilities

- None. The project has no existing specs (`openspec list --specs` returns an empty inventory).

## Impact

- `lib/auth.ts` — session/JWT callbacks, `authorize()`.
- `app/api/admin/dashboard/route.ts`, `app/api/orders/[id]/route.ts`, `app/api/admin/notifications/route.ts`, `app/api/admin/service/**` — consistent ADMIN enforcement.
- `app/admin/orders/action.ts`, `actions/orderActions.ts` — session checks before mutation.
- `middleware.ts` → `proxy.ts` (verify against `node_modules/next/dist/docs/` before renaming; `node_modules` is not installed in the current checkout).
- `lib/rate-limit.ts` — real implementation and call sites.
- `prisma/schema.prisma` — only if unused security columns are dropped; otherwise no migration.
- Behaviour change for existing deployments: sessions/tokens issued before this change carry the hardcoded role and should be treated as invalidated.

## Out of Scope

- Adding roles beyond the existing `ADMIN`/`CUSTOMER` enum, or building a user-management UI.
- Multi-factor authentication (a previous migration `20260203041612_remove_mfa` removed it deliberately).
- Rewriting the admin console UX (status transitions, order detail completeness, per-page statistics).
