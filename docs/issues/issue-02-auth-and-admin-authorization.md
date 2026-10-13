# Issue 02 - Auth and admin authorization: every session was an administrator

The session role was hardcoded, several administrative surfaces had no authorization at all,
credential sign-in ignored removed accounts and had no lockout, checkout provisioning shared one
credential across customers and rewrote roles, the path guard used a convention Next 16 does not
execute, and the rate limiter was an unused in-memory map.

Change: `openspec/changes/harden-auth-and-admin-guards` (schema `spec-driven`, language `en`).
Present in the working tree, not committed. "Before" line references below are from `HEAD`
(commit `84cd51f`), which is also the diff base of `git diff`.

## Status

Implemented, verification partially pending.

Ticked: 4 of 21 tasks in `openspec/changes/harden-auth-and-admin-guards/tasks.md`
(1.1, 1.2, 6.3, 7.2) - the ones whose stated verification is an offline check or a code listing.

Pending part: tasks **2.1-2.4, 3.1-3.4, 4.1-4.4, 5.1, 5.2, 6.1, 6.2, 7.1**. Their code is present
in the working tree; their stated verification requires a database-backed run with a real
administrator session, a real non-administrator account, and the migrations applied. This checkout
has no `.env` (only `.env.example`), so the app cannot be started. See "Pending verification".

## Scope

Covered:

- Authorization decisions derived from the stored account record (`admin-authorization`).
- Credential sign-in against active, non-removed accounts, with lockout (`credential-login`).
- Checkout customer creation/linking without privilege escalation or shared credentials
  (`customer-provisioning`).
- Path-level protection on the convention the installed Next.js actually executes
  (`route-protection`).
- Rate limiting and lockout storage that survives multiple instances (`login-protection`).

Deliberately left out (`proposal.md`, `design.md`):

- Roles beyond `ADMIN`/`CUSTOMER`, and any user-management UI.
- Multi-factor authentication (a previous migration `20260203041612_remove_mfa` removed it
  deliberately).
- Row-level security / authorization in the data layer; application-level guards are the boundary.
- Rewriting the admin console's behaviour or presentation.

## Symptoms

Cluster 1 - every session carried administrator authority.

- `lib/auth.ts:35` returned `role: "ADMIN"` from `authorize()`; `lib/auth.ts:45` wrote
  `token.role = "ADMIN"` in the `jwt` callback; `lib/auth.ts:52` wrote
  `session.user.role = "ADMIN"` in the `session` callback.
  Command: `git show HEAD:lib/auth.ts | grep -n 'role'`
lanju- `types/next-auth.d.ts` typed `User.role`, `Session.user.role` and `JWT.role` as the literal
  `"ADMIN"`, so a role other than `"ADMIN"` was not representable and the compiler could not flag
  the always-false comparisons.
- Consequence: the inline checks such as `session.user.role !== "ADMIN"` used across the admin
  routes could never reject anyone; `app/api/admin/notifications/route.ts` was one of them.

Cluster 2 - administrative surfaces with no authorization.

- `app/api/admin/dashboard/route.ts:7` - the `GET` handler performed zero authorization and
  returned revenue and order data. The file was 467 lines with no session call:
  `git show HEAD:app/api/admin/dashboard/route.ts | wc -l` -> `467`;
  `git show HEAD:app/api/admin/dashboard/route.ts | grep -c getServerSession` -> `0`.
- `app/api/orders/[id]/route.ts:6` - the `PATCH` handler had no session check at all, so an
  anonymous caller could set an order to paid, confirmed or cancelled:
  `git show HEAD:app/api/orders/[id]/route.ts | grep -c 'getServerSession\|requireAuth'` -> `0`.
- `app/admin/orders/action.ts:9` and `:24` (`updateOrderStatusAction`,
  `updatePaymentStatusAction`) and `actions/orderActions.ts:267` (`updateOrderStatus`) mutated
  orders with no session check. Because they are exported from `"use server"` modules, anyone able
  to reach the endpoint could invoke them.

Cluster 3 - sign-in ignored account lifecycle and had no lockout.

- `lib/auth.ts:25` tested only `!user || !user.isActive`; a soft-deleted account (`deletedAt`) could
  still sign in.
- `loginAttempts`, `lockedUntil` and `passwordChangedAt` (declared in `prisma/schema.prisma`) were
  never read or written:
  `git grep -n 'loginAttempts\|lockedUntil\|passwordChangedAt' HEAD -- app lib actions components`
  -> no match. The only use of the security columns was `lastLogin`, written by checkout
  (`actions/orderActions.ts:144`), not by sign-in.

Cluster 4 - checkout provisioning escalated privilege and shared a credential.

- `actions/orderActions.ts:125` invented a substitute address
  (`customer-${Date.now()}@temp.com`) to satisfy the non-nullable unique `email`.
- `actions/orderActions.ts:127` assigned one literal bcrypt hash to every created customer, so all
  checkout-created accounts shared the same credential. (The hash string itself is a credential;
  it is not reproduced here. It was at that line before the change.)
- `actions/orderActions.ts:131` forced `role: "CUSTOMER"` on create and `:143` forced it on update;
  `:144` wrote `lastLogin: new Date()` on order creation. An administrator who ordered as a
  customer would have their stored role rewritten.

Cluster 5 - the path guard used a convention the framework does not execute, with a dead branch.

- `middleware.ts:29` declared `matcher: ["/admin/:path*"]`, while the guard branched on
  `/auth/login` at `:19-23`. The matcher excluded that path, so the signed-in-user redirect was
  dead code.
  Command: `git show HEAD:middleware.ts | grep -n 'matcher\|startsWith'`
- Next 16 executes `proxy.ts` exporting `proxy`,
  not `middleware.ts`: `node_modules/next/dist/build/templates/middleware.js:60-61`
  (`const isProxy = page === '/proxy' || page === '/src/proxy'; const handlerUserland =
  (isProxy ? mod.proxy : mod.middleware) || mod.default;`) and `:72`, the export-name error.
  Shipping both files is a hard build error:
  `node_modules/next/dist/build/index.js:605` throws
  "Both middleware file ... and proxy file ... are detected. Please use ./proxy only."

Note: `proposal.md` cites `middleware.ts:31` for the matcher; in the file it is at line 29. The
code is the authority here. The `/auth/login` branch line range `19-23` matches.

Cluster 6 - the rate limiter was inert.

- `lib/rate-limit.ts` at `HEAD` stored counters in a module-level `new Map()` (comment: "In-memory
  store (untuk produksi pakai Redis)"), which cannot hold a count across serverless instances, and
  it had no importers: `git grep -n 'rate-limit' HEAD -- app lib actions components` matched only
  its own first line (prose in `app/api/README.md` aside).

## Root cause

- Authorization: authority was a constant written into the token and session at sign-in instead of
  a value read from the `User` record, and the type declaration froze the role to the literal
  `"ADMIN"`, so the guards that did exist could not fail closed.
- Coverage: there was no single authorization entry point. `lib/api-error-handler.ts` already
  exposed `requireAuth()`/`requireRole()` but nothing in the app called them, so coverage depended
  on each handler remembering, and the dashboard route and the server actions never did.
- Provisioning: a non-nullable unique `email` plus "create a user without a real password" were
  solved with a fabricated address and one shared hash, and the same code path then rewrote
  `role` on records it did not own.
- Path guard: it was written against the pre-16 middleware convention, and its matcher was
  narrower than the branches in its own body.
- Rate limiting: the implementation was never wired to a call site and its storage was unsuitable
  for the deployed (serverless) environment.

## Fix

Grouped by area. All paths relative to the repository root.

### A. Authorization from stored state

`lib/api-error-handler.ts`:

- New `requireAdmin()`: reads the session's user id, then loads `role`, `isActive` and `deletedAt`
  from `prisma.user` on every call. It throws 401 when the account is missing, inactive or
  removed, and 403 when the stored role is not `ADMIN`; otherwise it returns `{ session, user }`.
- New `adminGuardResponse()`: route-handler adapter, returns a `NextResponse` on refusal or `null`
  when the request may proceed.
- New `adminGuardResult()`: server-action adapter, returns `{ success: false, error }` on refusal
  or `null` when the action may proceed, so a rejected action reports failure to its caller instead
  of throwing into the framework's error path.
- `requireAuth()`/`requireRole()` refactored onto a shared `httpError(message, status)` helper.
- Decision (`design.md` 1 and 2): guards decide from the database rather than from the role cached
  in the token. Caching was rejected because a demotion would stay effective until the session
  expired, and that cached literal was the escalation cause. Accepted cost: one indexed lookup per
  administrative request. A middleware-only strategy was rejected because a path guard cannot
  distinguish roles and does not cover server actions.

### B. Guard applied to every administrative surface

- `app/api/admin/dashboard/route.ts` - `adminGuardResponse()` at the top of `GET`.
- `app/api/admin/notifications/route.ts` - `GET` and `POST` now call `requireAdmin()` and use the
  returned `user.id`, replacing the old `getServerSession` plus `role !== "ADMIN"` checks; errors
  go through `handleAPIError`.
- `app/api/admin/service/route.ts` (`GET`, `POST`),
  `app/api/admin/service/[id]/route.ts` (`GET`, `PATCH`, `DELETE`),
  `app/api/admin/service/bulk-delete/route.ts` (`DELETE`) - all use `adminGuardResponse()`.
- `app/api/orders/[id]/route.ts` - `PATCH` uses `adminGuardResponse()`.
- `app/admin/orders/action.ts` (`updateOrderStatusAction`, `updatePaymentStatusAction`) and
  `actions/orderActions.ts` (`updateOrderStatus`) - `adminGuardResult()` before any mutation.
- `app/admin/layout.tsx` is now a server component with `export const dynamic = "force-dynamic"`
  that calls `requireAdmin()` and `redirect("/auth/login")` on failure. It was added because
  `proxy.ts` answers only "is there a session at all" and cannot distinguish roles, so a
  customer-role session would otherwise reach administrative pages.

### C. Credential sign-in hardening

`lib/auth.ts`:

- Exported `LOGIN_MAX_ATTEMPTS = 5` and `LOGIN_LOCK_WINDOW_MS = 15 * 60 * 1000`; `README.md` and
  `tests/security-policy.test.ts` assert both against the documentation.
- `authorize()` now rejects a removed account (`user.deletedAt`) in addition to a missing or
  inactive one, with the same result as a wrong credential, so the response does not reveal whether
  the account exists.
- Refuses sign-in while `lockedUntil` is in the future, even with the correct password.
- On a wrong password: increments `loginAttempts`, and sets `lockedUntil` to now plus the window
  at the threshold. A lock that has already expired resets the count instead of continuing it.
- On success: clears `loginAttempts` and `lockedUntil` and writes `lastLogin`.
- Returns `role: user.role`; the `jwt` and `session` callbacks now carry `user.role` / `token.role`
  instead of the literal.

`types/next-auth.d.ts` - `role` is typed as the Prisma `Role`, and `email` as `string | null`, so
the literal can no longer be asserted by the type system.

### D. Checkout customer provisioning

`actions/orderActions.ts`:

- Matches on phone first (`deletedAt: null`), then on lowercased email when one was given.
- On match: links the order and writes nothing to the record - not `role`, not `name`, not
  `address`, not `lastLogin`. An administrator who orders as a customer keeps their stored role.
- On no match: creates a record with `email` set to the lowercased address or `null` when the
  customer gave none (no substitute address), and with a password that is a bcrypt hash of
  `randomBytes(32).toString("hex")` - a per-record secret that is never disclosed, so the record
  satisfies the schema but cannot sign in until an administrator sets a credential. No `role` is
  written; the schema default `CUSTOMER` (`prisma/schema.prisma:18`) applies.
- Decision (`design.md` 5): link when possible, create when necessary, never rewrite privilege.

### E. Schema and migrations

- `prisma/schema.prisma` - `User.email` becomes `String? @unique`; new
  `RateLimit { key String @id, windowStart DateTime, count Int @default(0), updatedAt DateTime @updatedAt }`.
- `prisma/migrations/20261013134707_user_email_nullable/migration.sql` -
  `ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;` (additive; the unique constraint stays).
- `prisma/migrations/20261013134800_add_rate_limit/migration.sql` - creates the `RateLimit` table.
- `lib/audit.ts` - three call sites now pass `user.email ?? ""`, because `AuditLog.userEmail` is a
  required column while a checkout-created account may have no email. These were the three type
  errors the nullable column introduced.
- Decision (`design.md` 6): keep `passwordChangedAt`, `loginAttempts`, `lockedUntil` and
  `lastLogin`. They are used by this change; dropping them would add a migration and destroy
  history for no behavioural gain.

### F. Path guard

- New `proxy.ts`: `export async function proxy(req)`, redirecting an unauthenticated request under
  `/admin` to `/auth/login`, and a signed-in request under `/auth/login` to `/admin/dashboard`;
  `export const config = { matcher: ["/admin/:path*", "/auth/login"] }` covers exactly the two
  paths the guard branches on.
- `middleware.ts` deleted.
- The convention was verified against the installed package rather than assumed:
  `node_modules/next/dist/build/templates/middleware.js:60-61` requires `proxy.ts` exporting
  `proxy`, and `node_modules/next/dist/build/index.js:605` errors on shipping both files.

### G. Rate limiting and abuse limits

- `lib/rate-limit.ts` rewritten: `ORDER_RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 }`;
  `clientIdentifier()` takes the first entry of `x-forwarded-for`; `rateLimit(key, limit, windowMs)`
  performs one atomic `INSERT ... ON CONFLICT ("key") DO UPDATE` with a `CASE` that resets the
  window when it has elapsed, `RETURNING "count", "windowStart"`, and reports
  `{ success, limit, remaining, resetInSeconds }`.
- `actions/orderActions.ts` applies it to public order creation before anything is written; a
  refusal returns `{ success: false, error: "Terlalu banyak pesanan dari perangkat ini. ..." }`
  and creates no order.
- Account lockout (area C) uses the existing `User` columns.
- Decision (`design.md` 4): the database table was chosen over the in-memory map (which cannot work
  across instances) and over a managed Redis or edge KV store (a new dependency and service to
  operate for one small application). Accepted cost: one write per limited request.

### H. Documentation

- `README.md` Security section: how `requireAdmin()` and `app/admin/layout.tsx` protect
  administrative surfaces, the `proxy.ts` convention and matcher, the manual path-guard check
  (expected `307 -> http://localhost:3000/auth/login`) and the administrative API check (expected
  `401` with a JSON error), the lockout table (5 attempts / 15 minutes) with the SQL to clear a
  locked account, the order-creation limit (5 per client per hour) with the SQL to reset a counter,
  and the behaviour of checkout-created accounts.
- `README.md` Notes also states that sessions issued before the role change carry a hardcoded role
  and that `NEXTAUTH_SECRET` must be rotated when deploying.

## Evidence

Commands run against this working tree, with observed results:

```
$ npx tsc --noEmit
(no output, exit code 0)

$ npm run lint
D:\tal\Crazwash\lib\productService.ts
  133:21  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
D:\tal\Crazwash\scripts\generate-admin.js
  2:16  error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
X 78 problems (57 errors, 21 warnings)

$ npm test
tests 20 | pass 20 | fail 0
  tests/security-policy.test.ts   5 pass
  tests/business-config.test.ts   7 pass
  tests/payment-step.test.tsx     4 pass
  tests/success-view.test.tsx     4 pass

$ git status --short
 M README.md
 M actions/orderActions.ts
 M app/admin/layout.tsx
 M app/admin/orders/action.ts
 M app/api/admin/dashboard/route.ts
 M app/api/admin/notifications/route.ts
 M app/api/admin/service/[id]/route.ts
 M app/api/admin/service/bulk-delete/route.ts
 M app/api/admin/service/route.ts
 M app/api/orders/[id]/route.ts
 M lib/api-error-handler.ts
 M lib/audit.ts
 M lib/auth.ts
 M lib/rate-limit.ts
 D middleware.ts
 M openspec/changes/harden-auth-and-admin-guards/tasks.md
 M prisma/schema.prisma
 M types/next-auth.d.ts
?? prisma/migrations/20261013134707_user_email_nullable/
?? prisma/migrations/20261013134800_add_rate_limit/
?? proxy.ts
?? tests/security-policy.test.ts
```

The lint result is identical to the pre-change baseline recorded under task 1.1 (57 errors,
21 warnings), so the change introduced no new lint finding.

`tests/security-policy.test.ts` asserts, offline: the documented lockout values
(`LOGIN_MAX_ATTEMPTS = 5`, `LOGIN_LOCK_WINDOW_MS = 15 * 60 * 1000`) and order limit
(`{ limit: 5, windowMs: 60 * 60 * 1000 }`) match the code and `README.md`; `proxy.ts` exists while
`middleware.ts` does not, exports `proxy`, and its matcher lists both `/admin/:path*` and
`/auth/login`; every `route.ts` under `app/api/admin` calls `adminGuardResponse()` or
`requireAdmin()`; and both administrative server-action files call `adminGuardResult()`.

Framework-convention evidence, read from the installed package:

```
$ sed -n '60,72p' node_modules/next/dist/build/templates/middleware.js
const isProxy = page === '/proxy' || page === '/src/proxy';
const handlerUserland = (isProxy ? mod.proxy : mod.middleware) || mod.default;
...
throw new ProxyMissingExportError(`The ${isProxy ? 'Proxy' : 'Middleware'} file "${page}" must export a function named \`${isProxy ? 'proxy' : 'middleware'}\` or a default function.`);

$ grep -n "Both " node_modules/next/dist/build/index.js | head -1
605:  throw Object.defineProperty(new Error(`Both ${MIDDLEWARE_FILENAME} file ... and ${PROXY_FILENAME} file ... are detected. Please use "./proxy" only. ...`), ...
```

Pre-change absences, from `HEAD`:

```
$ git show HEAD:app/api/admin/dashboard/route.ts | wc -l                      -> 467
$ git show HEAD:app/api/admin/dashboard/route.ts | grep -c getServerSession   -> 0
$ git show HEAD:app/api/orders/[id]/route.ts | grep -c 'getServerSession\|requireAuth' -> 0
$ git show HEAD:lib/auth.ts | grep -n role                                    -> 35 role: "ADMIN" / 45 token.role = "ADMIN" / 52 session.user.role = "ADMIN"
$ git show HEAD:middleware.ts | grep -n 'matcher\|startsWith'                 -> 29 matcher: ["/admin/:path*"] (branch at 19, 21)
$ git grep -n 'loginAttempts\|lockedUntil\|passwordChangedAt' HEAD -- app lib actions components -> no match
$ git grep -n 'rate-limit' HEAD -- app lib actions components                 -> lib/rate-limit.ts:1 only
```

## How to verify

Offline, no database needed:

1. `npx tsc --noEmit` - expect no output, exit code 0.
2. `node --import tsx --test tests/security-policy.test.ts` - expect `pass 5`, `fail 0`.
3. `npm test` - expect `pass 20`, `fail 0`.
4. `test -f proxy.ts && test ! -f middleware.ts && echo ok` - expect `ok`.
5. `npm run lint` - expect `57 errors, 21 warnings`, matching the recorded baseline.

Requiring a database and a running app (documented in `README.md` under Security). Create the
database, `npm run prisma:reset`, copy `.env.example` to `.env` and fill `DATABASE_URL`,
`NEXTAUTH_URL`, `NEXTAUTH_SECRET` and the business keys, then:

6. `npm run dev`, then
   `curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' http://localhost:3000/admin/dashboard`
   - expect `307 -> http://localhost:3000/auth/login`.
7. `curl -s -i http://localhost:3000/api/admin/dashboard | head -1` - expect `401` with a JSON
   error body and no business data.
8. `curl -s -i -X PATCH http://localhost:3000/api/orders/1 -d '{"action":"mark_paid"}'` without a
   session - expect an authorization error and an unchanged order.
9. Sign in as a genuine non-administrator account (create one; do not demote an existing
   administrator) and repeat 7 and 8 - expect `403` and no mutation; sign in as an administrator -
   expect the data.
10. Lockout: submit a wrong password 5 times for one account - expect `loginAttempts` to reach 5 and
    `lockedUntil` to be set; a 6th attempt with the *correct* password must still fail;
    `UPDATE "User" SET "loginAttempts" = 0, "lockedUntil" = NULL WHERE "email" = '<account email>';`
    clears it.
11. Order limit: submit 6 orders from one client within the hour - expect the 6th to return
    `success: false` with the Indonesian refusal message and to create no order; the `RateLimit`
    row for `orders:<client address>` shows the count.
12. Provisioning: place an order with an administrator's phone number - expect their stored `role`,
    `name` and `address` to be unchanged; place one with a new customer and no email - expect the
    created record to have `email` NULL and to fail credential sign-in.

## Pending verification

Tasks 2.1-2.4, 3.1-3.4, 4.1-4.4, 5.1, 5.2, 6.1, 6.2, 7.1. None of the following was run:

- 2.1-2.4 - a customer-role account producing a non-administrator session; a role changed in
  storage after sign-in reflected on the next guard evaluation; unauthenticated and
  non-administrator calls to each administrative route returning an authorization error with no
  data; a non-administrator server-action invocation leaving the order unchanged. Needs a running
  app with two real accounts.
- 3.1-3.2 - sign-in refused for a removed account and for a disabled account, and the lockout
  threshold refusing the correct credential inside the window and accepting it after it expires.
  Needs a database with a writable `User` row.
- 3.3 - placing an order and asserting the linked account's `role` and `lastLogin` are unchanged.
  Needs a database.
- 3.4 - the documented lockout procedure verified against the running code path (documented in
  `README.md`, exercised only offline here by the matching test).
- 4.1 - the `user_email_nullable` migration applied cleanly to a database containing existing rows,
  then sign-in, order creation and the admin customer page still working.
- 4.2-4.4 - an order placed without an email storing no email and no role change; two records
  created in the same run unable to authenticate with a credential derived from the other; an
  administrator account placing an order keeping its stored role, name and address.
- 5.1 - the guard observed active by the redirect on a protected path and by the build output
  listing the guard. The file convention is verified from the installed package, but no redirect
  has been observed on a running server.
- 5.2 - the `curl` check in `README.md` with an observed status code and redirect target.
- 6.1-6.2 - concurrent increments on the same key producing the expected total, and requests beyond
  the threshold being refused without creating an order.
- 7.1 - the end-to-end negative check with an account that genuinely lacks administrator privileges.

To close any of them: a `.env` with a live database, the two migrations applied
(`npx prisma migrate deploy`), and a running application. No `.env` exists in this checkout, so
none could be run here.

## Follow-ups / out of scope

- Rotate `NEXTAUTH_SECRET` when deploying, so sessions carrying the old hardcoded role are
  invalidated (stated in `README.md` Notes and in the change's migration plan).
- Validate with `openspec validate harden-auth-and-admin-guards` and archive the change once the
  group 7 negative checks have run against a deployed environment.
- No roles beyond `ADMIN`/`CUSTOMER`, no user-management UI, and no multi-factor authentication
  (out of scope in `proposal.md`; MFA was removed deliberately earlier).
- The `RateLimit` window is a single decision point; if the lockout or order limit needs tuning,
  the values are `LOGIN_MAX_ATTEMPTS` / `LOGIN_LOCK_WINDOW_MS` in `lib/auth.ts` and
  `ORDER_RATE_LIMIT` in `lib/rate-limit.ts`, both asserted against `README.md` by
  `tests/security-policy.test.ts`, so a change requires updating all three.
