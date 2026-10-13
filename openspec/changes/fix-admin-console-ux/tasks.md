# Tasks

## 1. One status model

- [x] 1.1 Add the canonical status metadata and transition graph to `lib/constants.ts`, covering all seven stored statuses, and delete the divergent definitions in `OrderStatusBadge.tsx`, `OrderFilters.tsx`, and `OrderHistoryTable.tsx`; verify with a unit test that every status has a label, a colour, and at least one reachable transition
- [x] 1.2 Remove the status normalisation that rewrites processing and picked-up values; verify in the console that an order stored in a processing status displays that status rather than "ready" — verified offline by rendering the badge with a stored `IN_PROGRESS` and with a stored `PICKED_UP` value: each shows its own label and never the `READY` label (tests/admin-console-ux.test.tsx)
- [ ] 1.3 Render the status selector from the graph and confirm every status is selectable from the console; verify by moving one test order through each status in sequence and checking the stored value after each change — deferred: the selector is rendered from the graph and the graph is asserted to reach all seven statuses offline, but moving a real order through each status needs a database and an admin session

## 2. Order detail completeness

- [x] 2.1 Extend the order detail view with pickup address, pickup date, customer phone, payment method, customer notes, internal notes, payment-proof reference, and status history; verify each field is visible on a test order that has values for all of them — verified offline by rendering the view with a fixture carrying all eight values (tests/admin-console-ux.test.tsx)
- [x] 2.2 Add a test order fixture covering an order with no internal notes and no payment proof and confirm those sections degrade without showing empty labels or errors — verified offline: the sparse fixture renders the replacement statements and no empty label

## 3. Change feedback

- [ ] 3.1 Make status and payment changes surface their result using the toast component already mounted in the admin layout, and refresh the view after a successful change; verify a successful change shows a confirmation and an induced failure shows a failure message while the displayed status stays correct — deferred: the action result is read and reported on both paths and a success refreshes the view (asserted offline), but inducing a failure needs a live server action
- [ ] 3.2 Replace the browser confirmation for destructive transitions with the project's dialog component and verify the cancel transition still cannot be applied without confirmation — deferred: the dialog gates the transition and no browser `confirm` remains (asserted offline); the interaction itself needs a browser
- [ ] 3.3 Check the response of the bulk delete operation and report failures instead of refreshing as if the operation succeeded; verify by inducing a failure and confirming the operator sees it — deferred: the response check, the failure toast and the early return before the refresh are asserted offline; inducing a failure needs a live endpoint

## 4. Summary figures

- [ ] 4.1 Return counts by payment state and the summed paid total for the active filter from the order service, and render them in place of the per-page figures; verify the figures are identical on page one and page two with the same filter — deferred: the service returns the aggregate from the same filter as the paginated query and the page renders it (asserted offline); comparing page one and page two needs a database
- [ ] 4.2 Verify figures follow filters: apply a payment-state filter and a status filter and confirm both the totals and the row count agree with the database — deferred: needs a database
- [ ] 4.3 Verify the empty-filter case shows zero rather than a derived value, and adjust the summary labels so each states the population it covers — deferred: the labels now state the population ("sesuai filter") and no figure is derived from the page (asserted offline); the empty-filter run needs a database

## 5. Notifications

- [ ] 5.1 Write a notification for each active administrator when an order is created, inside the order service, without failing the order if the write fails; verify by placing an order and observing an unread notification for an administrator account — deferred: the writer is implemented in the order service and called from the order-creation action (asserted offline); observing a row needs a database
- [ ] 5.2 Refresh the notification list while the console is open and on window focus, and persist read state; verify an incoming order updates the indicator without a manual reload and that read state survives a reload — deferred: the header polls every 15s and on window focus and read state is stored on the row (asserted offline); the live indicator needs a running app
- [x] 5.3 Verify the notification write cannot be triggered by an unauthenticated caller and cannot be induced to grow without bound; document the retention decision in `README.md` — verified offline: no caller-facing endpoint inserts a notification, both endpoints call the administrative guard, the read path is capped at 50, the writer only runs as a side effect of order creation, and `README.md` documents the retention decision and the cleanup statement

## 6. Navigation and session handling

- [x] 6.1 Point the header search at the implemented order search, or remove the control; verify the submitted search produces a result page and that no console control targets a missing route — verified offline: the header submits to the order list's `search` parameter, the order page reads it, and every navigation target in the console resolves to an existing page (tests/admin-console-ux.test.tsx)
- [ ] 6.2 Send an operator with a missing or expired session to the sign-in page instead of an API endpoint, on every console page that fetches data client-side; verify by clearing the session and loading the page — deferred: every console fetch handles 401 by going to `/auth/login` and no console file targets `/api/auth/login` (asserted offline); the live check needs a running app
- [x] 6.3 Mark the active navigation item for nested console routes; verify the correct item is highlighted on a detail page as well as a list page — verified offline by unit-testing the matcher for a list path, a detail path and a non-matching prefix path

## 7. Service duration

- [ ] 7.1 Declare days as the unit everywhere a duration is entered or displayed (admin form, edit form, service table, service detail, customer-facing catalogue) and remove the hour-based labels and hints; verify the same value renders identically on all five surfaces — partly done, needs a decision: the unit, the range and the formatter are declared once and the hour-based hint and detail label are gone, but the customer-facing catalogue renders no duration at all today (its `products` prop is unused), so the fifth surface cannot show the same value without adding a duration display to the public catalogue. Four of the five surfaces are verified offline; ask before adding the public display.
- [x] 7.2 Validate duration as a bounded positive integer with the accepted range stated in the error message; verify an out-of-range value and a missing value are both rejected with a message naming the field — verified offline by unit-testing the validator: 0, 31, 2.5, -1 and "abc" are refused, and a missing value is refused, each with a message naming `Durasi` and the accepted range
- [ ] 7.3 Route the service detail page through the product service instead of reading the database directly, and verify its rendered values match the service table — deferred: the page now reads through `getProductById` (asserted offline); comparing rendered values against the service table needs a database
- [ ] 7.4 Review the catalogue with the business once and correct any service whose stored duration was entered as hours; record the reviewed values in the change conversation — deferred: needs the user and the business; this cannot be done from the repository

## 8. Verification

- [ ] 8.1 Walk the console end to end on a test order (list, filter, summary, detail, each status change, notification arrival, expired session) and record the walkthrough result in the change conversation — deferred: needs a running app with a session and a database
- [ ] 8.2 Confirm no console control leads to a missing route and no console figure disagrees with the database, then re-run typecheck, lint, and the tests added by this change — partly done: the route scan, `npx tsc --noEmit` (0 errors), the lint baseline (57 errors / 21 warnings, unchanged) and the 17 tests added by this change all pass offline; the "figure disagrees with the database" clause needs a database

## Workflow follow-up

- Apply after `harden-auth-and-admin-guards` so the action guards are already in place. (The authorization change is merged on this branch; its tasks.md is still unticked.)
- Validate the change with `openspec validate fix-admin-console-ux` before applying it.
- Archive the change after the walkthrough in group 8 passes.

## Deferred to a live pass (needs `.env`, a database and an admin session)

The checkout has no `.env` (only `.env.example`), so no page can boot and no query can run here.
Everything above is implemented, and every clause that can be checked without a database was checked;
these remain: 1.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 5.1, 5.2, 6.2, 7.3, 7.4, 8.1, 8.2 (database/session
clauses) and the five-surface clause of 7.1 (decision needed).

Offline gates as evidence: `npx tsc --noEmit` → 0 errors; `npm run lint` → 57 errors / 21 warnings
(identical to the recorded baseline); `npm test` → 37/37 pass, 17 of them added by this change.
