# Tasks

## 1. Baseline

- [x] 1.1 Install dependencies and record the baseline: `npm install` then `npx tsc --noEmit` and `npm run lint`; store the resulting output so later regressions are distinguishable from pre-existing errors
- [x] 1.2 Verify the path-guard file convention for the installed Next.js version by reading its own docs under `node_modules/next/dist/docs/`, and write the finding (file name, export name, expected build output) into the change conversation before renaming anything

## 2. Session and authorization from stored state

- [ ] 2.1 Remove the hardcoded role from `lib/auth.ts` sign-in and session callbacks and populate the session from the stored account role; verify with a test that a customer-role account produces a session whose role is not administrator
- [ ] 2.2 Extend `lib/api-error-handler.ts` with a single administrative guard that loads role, enabled state, and removed state from storage per request; verify with a test that a role changed in storage after sign-in is reflected on the next guard evaluation
- [ ] 2.3 Apply the guard to every administrative API route, including the dashboard route that currently has none; verify by calling each route with an unauthenticated client and a non-administrator session and asserting an authorization error with no data returned
- [ ] 2.4 Apply the guard to every administrative server action (`app/admin/orders/action.ts`, `actions/orderActions.ts`) so no mutation occurs without an administrator session; verify with a test that a non-administrator invocation leaves the order record unchanged

## 3. Credential sign-in hardening

- [ ] 3.1 Reject removed and disabled accounts in the credentials provider; verify with tests for both cases asserting no session is issued
- [ ] 3.2 Enforce failed-attempt counting and the lockout window using the existing account columns, clearing them and writing the last successful sign-in time on success; verify with a test that the threshold refuses the correct credential inside the window and accepts it after the window expires
- [ ] 3.3 Remove the sign-in side effects from customer provisioning (no last-login write, no role write); verify by placing an order and asserting the linked account's role and last-sign-in fields are unchanged
- [ ] 3.4 Document the lockout thresholds, windows, and how an operator clears a locked account in `README.md`; verify the documented procedure against the running code path

## 4. Customer provisioning

- [ ] 4.1 Make `User.email` nullable with a dedicated migration and confirm sign-in, order creation, and the admin customer page still work afterwards; verify the migration applies cleanly to a database containing existing rows
- [ ] 4.2 Stop generating substitute email addresses and stop writing `role` on existing records; verify by placing an order without an email and asserting the stored record has no email value and no role change
- [ ] 4.3 Give checkout-created customer records a per-record undisclosed credential and confirm such a record cannot sign in; verify with a test that two records created in the same run cannot authenticate with a credential derived from the other
- [ ] 4.4 Link rather than rewrite on match: verify that an administrator account which places an order keeps its stored role, name, and address

## 5. Path-level protection

- [ ] 5.1 Migrate the path guard to the convention verified in 1.2 and make the matcher cover exactly the paths the guard branches on, removing the unreachable branch; verify the guard is active by observing the redirect on a protected path and by confirming the build output lists the guard as active
- [ ] 5.2 Add a regression test or documented manual check that an unauthenticated request to an administrative path redirects to sign-in; record the observed status code and redirect target

## 6. Abuse limits for public order creation

- [ ] 6.1 Add the rate-limit storage with a migration (unique key per client and route, window start, counter) and an atomic increment; verify with a test that concurrent increments on the same key produce the expected total
- [ ] 6.2 Apply the limit to the public order-creation path with a defined refusal response; verify with a test that requests beyond the threshold are refused and create no order
- [x] 6.3 Document the configured thresholds and windows in `README.md` and confirm the documented values match the code

## 7. Integration verification

- [ ] 7.1 End-to-end negative check with an account that genuinely lacks administrator privileges (do not revoke an existing administrator's role to create the test case): confirm the dashboard API, the order mutation endpoint, and each administrative action all refuse that session while an administrator session succeeds
- [x] 7.2 Verify no administrative surface remains unguarded: list every administrative route handler and server action and confirm each one calls the guard, recording the list in the change conversation

## Workflow follow-up

- Rotate the signing secret when deploying so existing sessions carrying the hardcoded role are invalidated.
- Validate the change with `openspec validate harden-auth-and-admin-guards` before applying it.
- Archive the change once the negative checks in group 7 have been run against a deployed environment.
