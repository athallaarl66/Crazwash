# Design

## Context

See `proposal.md` - Why. Facts that shape the approach:

- Authorization currently happens in three different ways: `getServerSession` calls scattered through admin API routes, no check at all in the dashboard route and in the order-mutating server actions, and a role literal written into `lib/auth.ts` at sign-in time.
- `lib/api-error-handler.ts` already exposes `requireAuth()` and `requireRole()`, and already maps thrown errors with a `status` property into JSON responses. Nothing in the app calls them.
- `User` already carries `isActive`, `deletedAt`, `loginAttempts`, `lockedUntil`, `lastLogin`, and `passwordChangedAt`; only `isActive` is read anywhere.
- `User.email` is currently non-nullable and unique, which is why provisioning fabricates addresses like `customer-${Date.now()}@temp.com`.
- `middleware.ts` is deprecated on the installed Next.js version (16.x); `node_modules` is not installed in the current checkout, so the rename must be verified against the version's docs before it is applied.

## Goals / Non-Goals

**Goals:**

- One authorization path used by every administrative surface, with the decision taken from stored account state.
- Checkout that records customers without creating shared credentials or rewriting accounts it does not own.
- Abuse limits that work on a serverless host without adding a new managed service.

**Non-Goals:**

- Roles beyond the existing administrator/customer distinction, and any user-management UI.
- Multi-factor authentication (deliberately removed earlier).
- Moving authorization into the data layer (row-level security). Application-level guards are the boundary here.
- Rewriting the admin console's behaviour or presentation.

## Decisions

**1. Guards decide from the database, the token only identifies the account.**
`requireAdmin()` reads the session's user identifier and loads `role`, `isActive`, and `deletedAt` from storage before allowing the request. Alternative considered: trusting `token.role` cached at sign-in - rejected because it makes a demotion ineffective until the session expires, and because that cached literal is the root cause of the current escalation. Trade-off: one extra indexed lookup per administrative request, acceptable at this traffic level.

**2. One guard helper reused by routes and server actions.**
The existing `lib/api-error-handler.ts` helpers become the single entry point. Route handlers let the thrown, status-carrying error be converted to JSON by the existing handler. Server actions call the same helper and convert the failure into their own result shape, so the client can surface it, instead of throwing into the framework's opaque error path. Alternative considered: a Next.js middleware-only strategy - rejected, because path-level checks cannot distinguish roles and do not cover server actions.

**3. Path-level guard stays coarse and moves to the convention the installed version executes.**
Path protection answers only "is there a session at all" and redirects otherwise; role decisions stay in (1). The guard file is migrated to the convention of the installed framework version, verified against that version's own docs, and proven by observing a redirect. The `matcher` is narrowed or widened so that every branch in the guard is reachable; the current sign-in redirect branch is dead because the matcher excludes it, so either the matcher covers it or the branch goes.

**4. Rate limiting and lockout use existing storage, not a new service.**
Account lockout uses the columns that already exist: failed attempts increment `loginAttempts`, an account past the threshold gets `lockedUntil`, and a successful sign-in clears both and writes `lastLogin`. Per-client limiting for public order creation uses a small table with a unique key (client identifier plus route) holding a window start and a counter, updated with an atomic upsert. Alternatives considered: an in-memory map (the current unused implementation, which cannot work across instances) and a managed Redis or edge KV (a new dependency and service to operate for one small business app). Trade-off accepted: a write per limited request against the database; the window is generous enough that normal traffic rarely reaches it.

**5. Customer provisioning links when it can, creates when it must, and never rewrites privilege.**
Match on phone first, then on email. On match: link the order only, change nothing on the record. On no match: create a customer record whose credential is a bcrypt hash of a random per-record secret that is never disclosed, so the record satisfies the schema but cannot be signed in to until the business sets a credential. `role` is never written on an existing record and synthetic email addresses are never generated, which requires making `User.email` nullable. `lastLogin` is written by sign-in, not by order creation.

**6. Keep the unused security columns.**
`passwordChangedAt` and the lockout columns become used by this change; no column is dropped. Dropping them would add a migration and destroy history for no behavioural gain.

## Risks / Trade-offs

- [Demoting an administrator still leaves their existing session valid until the next request] → Accepted; guard (1) re-reads storage per request, so the next request already fails.
- [Extra database lookup on every admin request and a write on limited public requests] → Accepted at this scale; both use indexed/unique keys. If it becomes hot, cache the role lookup with a short TTL.
- [Account lockout can be abused to lock a legitimate administrator out] → Use a short window, count per account and client, and keep the lockout state visible in the audit trail so an operator can clear it deliberately.
- [Making `email` nullable touches the NextAuth adapter and the admin customer list] → Mitigate by doing the migration first, then verifying sign-in, order creation, and the customer page in the same task group; keep the uniqueness constraint on email so lookups stay deterministic.
- [Renaming the guard file to the new convention silently disables path protection if done wrong] → Verify the convention against the installed version's docs in `node_modules/next/dist/docs/` before renaming, and prove the guard is active by observing the redirect after the change.
- [Every pre-existing session JWT carries the hardcoded role] → Rotate the signing secret as part of deployment, invalidating existing sessions, and state that in the change's deployment notes.

## Migration Plan

1. Install dependencies and establish a working baseline (no `node_modules` exists in the current checkout).
2. Apply the schema change for nullable `email` with a dedicated migration; verify existing rows are unaffected.
3. Create the rate-limit table with a migration.
4. Deploy with the signing secret rotated so no session carries the old hardcoded role.
5. Rollback: redeploy the previous build; both migrations are additive and nullable, so no data rollback is required.

## Open Questions

None that affect the specs or the task breakdown. The choice of lockout thresholds and rate-limit windows is an operational value, not a design decision, and can be tuned without changing behaviour described by the specs.
