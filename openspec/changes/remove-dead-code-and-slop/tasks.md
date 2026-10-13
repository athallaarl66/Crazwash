# Tasks

## 1. Baseline

- [ ] 1.1 Install dependencies and capture the baseline typecheck and lint output; verify the captured output is stored in the change conversation so later differences are attributable
- [ ] 1.2 Verify a build works before changes: run the Prisma client generation followed by `npx next build`, and record whether it needs a reachable database

## 2. Dead routes and modules

- [ ] 2.1 Confirm no caller exists for `app/api/orders/route.ts`, `app/api/orders/[id]/route.ts`, and `app/api/service_get/route.ts` (grep for the route strings as well as imports), then delete them; verify typecheck and build still pass
- [ ] 2.2 Delete `app/(public)/landingpage.tsx` (a file that imports itself and is not a route) and `hooks/useProducts.ts` (no importer, and it targets a route that does not exist); verify no import path breaks after removal
- [ ] 2.3 Delete `components/ui/dialog.tsx`, `components/ui/Modal.tsx`, and `components/ui/radio-group.tsx` after confirming zero importers; verify lint and build pass and that no page loses a control in the browser

## 3. Types and utilities consolidation

- [ ] 3.1 Delete `types/product.ts` and `types/orderTypes.ts` (unused, and `types/product.ts` declares a `stock` field absent from the schema) and replace the seven local `Product` declarations with one generated-type-based export; verify typecheck passes with no new errors
- [ ] 3.2 Keep one `formatCurrency` in `lib/utils.ts` and delete the copies in the dashboard page, the customer detail page, and the inline conversions; verify every affected surface still renders the same formatted value
- [ ] 3.3 Keep one order-number generator and delete the two redundant implementations, adding duplicate-safe creation behaviour; verify with a test that two creations in the same millisecond still produce two stored orders
- [ ] 3.4 Reduce order creation to a single path (server action calling the order service) and verify the public order flow still creates an order with the same stored fields as before

## 4. Dependencies

- [ ] 4.1 Remove `swiper`, `otplib`, `qrcode`, `resend`, and `@types/qrcode` from `package.json` and the lockfile; verify installation succeeds and the build passes
- [ ] 4.2 Verify no removed package is imported anywhere in the surviving tree, and record the check in the change conversation

## 5. Documentation

- [ ] 5.1 Read `app/api/README.md`, `app/admin/README.md`, `app/admin/dashboard/README.md`, `prisma/README.md`, and `hooks/README.md`; move every still-true statement into the root README or `docs/`, drop the false ones (the API README's blanket ADMIN claim, its `PUT`/`PATCH` mismatch, and the admin README's server-rendering claim are known false), then delete the files
- [ ] 5.2 Correct the root README setup section so every documented command exists in `package.json` and the documented migration command matches the one the build uses; verify each documented command runs as written

## 6. Configuration and styling

- [ ] 6.1 Remove `darkMode: "class"` from the Tailwind config, the unreachable `pages/` content glob, and the accordion keyframes for a package that is not installed; verify the build passes and no class silently changes appearance in the browser
- [ ] 6.2 Remove the dead `.dark` palette from `globals.css` (leave third-party `dark:` utilities untouched) and remove the never-imported `tw-animate-css` dependency; verify build and lint pass

## 7. Assets

- [ ] 7.1 Re-encode the six committed photographs once at display dimensions in a modern format, replace the references, and render them through the image component with explicit dimensions; verify each gallery pair still displays and the page weight drops substantially while the visible difference is negligible
- [ ] 7.2 Record in the change conversation that git history still contains the original blobs and that history rewriting was deliberately not performed

## 8. Noise and hydration

- [ ] 8.1 Remove the development and generation marker comments and the `console.log` calls introduced by earlier passes, keeping error logging; verify lint passes with no unused-symbol errors
- [ ] 8.2 Remove the `suppressHydrationWarning` attributes one surface at a time, fixing the underlying server/client formatting difference where it exists; verify the browser console reports no hydration error on the landing page, the order flow, and each admin page, and document any attribute that had to stay together with the reason

## 9. Quality gate

- [ ] 9.1 Add a test setup using the already-installed TypeScript runner with the runtime's built-in test runner, covering at least currency formatting and order-number generation; verify the test command runs and fails when an assertion is deliberately broken
- [ ] 9.2 Add a CI workflow running install, typecheck, lint, and the test command; verify the workflow passes on the branch that introduces it, and record the observed result

## 10. Final verification

- [ ] 10.1 Walk the public order flow and every admin page against the cleaned tree and confirm no feature is missing; record the walkthrough result in the change conversation
- [ ] 10.2 Re-run the typecheck, lint, test, and build commands and confirm all four pass with no new errors relative to the baseline captured in 1.1

## Workflow follow-up

- Validate the change with `openspec validate remove-dead-code-and-slop` before applying it.
- Archive the change after the walkthrough in group 10 passes.
