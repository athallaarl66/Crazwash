# Proposal

## Why

The repository carries a large amount of code, documentation and configuration that nothing uses, that no longer matches the implementation, or that only exists because earlier generation passes left it behind. That dead weight actively misleads: two in-repo READMEs describe an API surface and a rendering model the code does not implement, an unused hook points at a route that does not exist, and a self-importing page file looks like a working route. There is no typecheck, lint or test gate in CI to catch any of it, so the drift compounds with every change.

## What Changes

- Remove unused runtime dependencies: `swiper`, `otplib`, `qrcode`, `resend`, `@types/qrcode` (zero imports; `otplib`/`qrcode` are leftovers from the removed MFA feature).
- Remove unused UI components: `components/ui/dialog.tsx`, `components/ui/Modal.tsx`, `components/ui/radio-group.tsx`.
- Remove dead exports and dead modules: `productService.toggleProductStatus`, `productService.getProductStats`, `customerService.deleteCustomer`, `utils.formatDateTime`, `hooks/useProducts.ts` (zero importers, and it calls the non-existent `/api/admin/products`), and the self-importing `app/(public)/landingpage.tsx`.
- Consolidate duplicated code: local `Product` type declarations (7 copies), `formatCurrency` (4 variants incl. `formatRupiah`), `generateOrderNumber` (3 variants), and the three order-creation paths.
- Correct or remove the in-repo documentation that contradicts the code: `app/api/README.md` (claims every `/api/admin/*` route is ADMIN-guarded, and documents `PUT` where the route implements `PATCH`), `app/admin/README.md` (claims fully server-rendered while the page is a client component; stray trailing character), `hooks/README.md` (documents a hook that fetches a non-existent route), plus `prisma/README.md` and `app/admin/dashboard/README.md`.
- End the dead dark-mode configuration: `globals.css:64-105` defines a full `.dark` palette and `tailwind.config.ts:4` enables `darkMode: "class"`, but no theme provider or toggle exists.
- Reduce repository weight: six `public/images/HCL_*.jpg` photographs totalling ~31 MB are committed to git (each 4.9-5.6 MB) and served unoptimized.
- Clean configuration and leftovers: `tailwind.config.ts:6` references a `pages/` directory that does not exist, and defines accordion keyframes for a Radix package that is not installed; `tw-animate-css` is a dependency that is never imported.
- Remove generation/development marker comments and noise: 35 marker comments (`// ← BENARIN PATH …`, `// ✅ FIX …`, `// 🔥 CRITICAL …`), 10 `GANTI`/`PLACEHOLDER`/`Temporary` markers, 19 `console.log` calls, and 10 `suppressHydrationWarning` attributes that hide hydration mismatches instead of fixing them.
- Add the missing quality gate: a CI workflow running typecheck and lint, and a minimal test setup so regressions are catchable (the repository currently has no `tests/` directory, no test script, and no `.github`). Setup commands in `README.md` must match reality (documented `npm run prisma:seed-admin` does not exist; documented `prisma db push` differs from the `migrate deploy` used by the build script).

## Capabilities

### New Capabilities

- None. This change removes unused code, dead configuration and inaccurate documentation without altering system behaviour. Per the spec-driven workflow it opts out of spec deltas by setting `skip_specs: true` in `.openspec.yaml`; no requirement is invented to satisfy validation.

### Modified Capabilities

- None. The project has no existing specs (`openspec list --specs` returns an empty inventory), and no spec-level behaviour changes here.

## Impact

- `package.json` / `package-lock.json` — dependency removal.
- `components/ui/`, `hooks/`, `lib/productService.ts`, `lib/customerService.ts`, `lib/utils.ts`, `app/(public)/landingpage.tsx` — deletions and consolidation.
- `app/**/README.md`, `hooks/README.md`, `prisma/README.md`, root `README.md` — documentation corrected or relocated.
- `app/globals.css`, `tailwind.config.ts` — dead tokens and config removed.
- `public/images/` and git history weight — image optimisation and repository size.
- New `.github/workflows/` and test tooling — new files, no runtime behaviour change.
- Risk: deleting `hooks/useProducts.ts` and the unused UI components must be confirmed by a clean typecheck/lint run; the repository currently has no `node_modules`, so the first task must install dependencies and establish that baseline before deletions are applied.

## Out of Scope

- The admin console behaviour items (order status transitions, order detail completeness, per-page statistics, notifications) — separate change.
- Authentication and authorization hardening — separate change.
- Customer-facing placeholder content (WhatsApp destination, payment accounts, success-page data source) — separate change.
