# Design

## Context

See `proposal.md` - Why. Facts that shape the approach:

- The repository currently has no `node_modules`, so no typecheck, lint, or build baseline exists. Any deletion is unverifiable until dependencies are installed.
- The build script (`package.json:8`) runs `prisma generate && prisma migrate deploy && prisma db seed && next build`, which needs a reachable database; verification during this change should use `npx next build` after generating the client, not the full script.
- `types/product.ts` and `types/orderTypes.ts` are imported by nothing and are already stale: `types/product.ts` declares a `stock` field that does not exist in the Prisma schema and repeats category labels that already live in `lib/constants.ts`.
- `app/api/orders/route.ts` and `app/api/orders/[id]/route.ts` have no callers in the application (the only reference to `/api/orders` is inside the unused `lib/rate-limit.ts` config map), so the order-mutation endpoint is dead but still reachable in production.
- Node 26 and npm 11 are installed; `tsx` is already a devDependency, so Node's built-in test runner can execute TypeScript tests without adding a test framework.

## Goals / Non-Goals

**Goals:**

- A repository where every file is reachable, every configuration key is consumed, and every in-repo document describes the code as it is.
- One definition per concept (product shape, currency formatting, order number, order creation).
- A gate that fails when the above stops being true.

**Non-Goals:**

- Rewriting git history to reclaim the ~31 MB of committed photographs; existing clones would break. The change stops future weight, it does not purge the past.
- Chasing upstream shadcn `dark:` utility classes. The dead part is this project's own dark palette and the `darkMode` setting; third-party component sources are left to future upstream updates.
- Component or end-to-end test coverage. This change establishes a runnable minimal gate for pure logic; broader coverage is its own change.
- Behaviour changes. If removing something would change behaviour, it does not belong in this change (the customer-facing and authorization changes are separate).

## Decisions

**1. Establish the baseline before deleting anything.**
Install dependencies, capture `tsc --noEmit` and lint output, and treat new errors as the only signal. Without this the deletions are guesswork.

**2. Delete dead routes before dead helpers.**
`app/api/orders/route.ts`, `app/api/orders/[id]/route.ts`, and `app/api/service_get/route.ts` go first, because they are the only code paths that legitimately consume the duplicate order-creation logic and the product serializers. Note for coordination: `PATCH /api/orders/[id]` is undocumented and reachable; at the commit this change is based on (`b67d026`) it is already guarded by `adminGuardResponse()`, so deleting it removes a dead path rather than closing an exposure.

**3. Prefer Prisma's generated types over hand-written interfaces.**
Local `Product` declarations (seven of them today) are replaced by the generated model types, narrowed with `Pick`/`Omit` for serialized shapes. Hand-copied shapes are what let `stock` survive in `types/product.ts` after the schema dropped it.

**4. One utility per job.**
One `formatCurrency` in `lib/utils.ts`; one order-number generator; one create-order path (the server action calling the order service). The three current variants of each disagree subtly (price as string vs number, random suffix format), which is exactly the drift the tests should pin down.

**5. Consolidate documentation, do not redistribute it.**
The five in-repo READMEs move to the root README (setup) and a `docs/` directory (API reference, data model notes). Rationale: documentation living inside code directories is only re-read by people already editing that directory, so it rots unnoticed - the current files carry at least one false claim each. Archived copies in git remain available.

**6. Remove this project's dark-mode configuration, leave third-party class strings alone.**
`darkMode: "class"` in the Tailwind config and the `.dark` palette in `globals.css` are unreachable without a theme provider or toggle. Removing them removes a claim the app does not honour; touching `dark:` utilities inside `components/ui/*` would fight upstream shadcn updates for no user-visible gain.

**7. Fix the hydration mismatches instead of suppressing them.**
The ten `suppressHydrationWarning` attributes hide real server/client rendering differences (typically locale- or time-dependent formatting). The work is to make that formatting deterministic or server-rendered, then remove the attributes, verified by a browser console free of hydration errors.

**8. Re-encode images once; do not rewrite history.**
Six photographs of roughly 5 MB each are re-encoded to a modern format at display dimensions with a one-off script, and rendered through the project's image component with explicit dimensions. Git history keeps the old blobs; that is accepted and documented rather than rewritten.

**9. Minimal gate with the tooling already installed.**
CI runs install, typecheck, lint, and the test command; tests use Node's built-in test runner through the existing `tsx` dependency, so no test framework is added. A new dependency is justified only if the built-in runner cannot execute the chosen tests, and that would be recorded in the change conversation rather than assumed.

## Risks / Trade-offs

- [Deleting something that is still referenced at runtime, not by static imports] → Grep for string references (routes, action names) in addition to import checks, and run a build plus a manual pass over the public order flow and each admin page before archiving.
- [A clean baseline is impossible if dependencies fail to install or the database is unreachable] → The gate tasks use `npx next build` with a generated client and do not require a live database; if installation fails, stop and report rather than deleting blind.
- [Removing `suppressHydrationWarning` surfaces mismatches that need real fixes] → Sequence: remove one attribute at a time with a browser console check, fix the underlying formatting, and keep any attribute that cannot be fixed without a behaviour change - documented rather than silently restored.
- [Image re-encoding alters perceived quality on the before/after gallery] → Re-encode at ~1600 px on the long edge, compare before/after visually, and keep the smaller size only when the difference is not visible.
- [Documentation consolidation loses detail present in the old files] → Read each of the five files before deleting; anything still true goes into the root README or `docs/`, anything false is dropped.
