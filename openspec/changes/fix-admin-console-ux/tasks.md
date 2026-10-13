# Tasks

## 1. One status model

- [ ] 1.1 Add the canonical status metadata and transition graph to `lib/constants.ts`, covering all seven stored statuses, and delete the divergent definitions in `OrderStatusBadge.tsx`, `OrderFilters.tsx`, and `OrderHistoryTable.tsx`; verify with a unit test that every status has a label, a colour, and at least one reachable transition
- [ ] 1.2 Remove the status normalisation that rewrites processing and picked-up values; verify in the console that an order stored in a processing status displays that status rather than "ready"
- [ ] 1.3 Render the status selector from the graph and confirm every status is selectable from the console; verify by moving one test order through each status in sequence and checking the stored value after each change

## 2. Order detail completeness

- [ ] 2.1 Extend the order detail view with pickup address, pickup date, customer phone, payment method, customer notes, internal notes, payment-proof reference, and status history; verify each field is visible on a test order that has values for all of them
- [ ] 2.2 Add a test order fixture covering an order with no internal notes and no payment proof and confirm those sections degrade without showing empty labels or errors

## 3. Change feedback

- [ ] 3.1 Make status and payment changes surface their result using the toast component already mounted in the admin layout, and refresh the view after a successful change; verify a successful change shows a confirmation and an induced failure shows a failure message while the displayed status stays correct
- [ ] 3.2 Replace the browser confirmation for destructive transitions with the project's dialog component and verify the cancel transition still cannot be applied without confirmation
- [ ] 3.3 Check the response of the bulk delete operation and report failures instead of refreshing as if the operation succeeded; verify by inducing a failure and confirming the operator sees it

## 4. Summary figures

- [ ] 4.1 Return counts by payment state and the summed paid total for the active filter from the order service, and render them in place of the per-page figures; verify the figures are identical on page one and page two with the same filter
- [ ] 4.2 Verify figures follow filters: apply a payment-state filter and a status filter and confirm both the totals and the row count agree with the database
- [ ] 4.3 Verify the empty-filter case shows zero rather than a derived value, and adjust the summary labels so each states the population it covers

## 5. Notifications

- [ ] 5.1 Write a notification for each active administrator when an order is created, inside the order service, without failing the order if the write fails; verify by placing an order and observing an unread notification for an administrator account
- [ ] 5.2 Refresh the notification list while the console is open and on window focus, and persist read state; verify an incoming order updates the indicator without a manual reload and that read state survives a reload
- [ ] 5.3 Verify the notification write cannot be triggered by an unauthenticated caller and cannot be induced to grow without bound; document the retention decision in `README.md`

## 6. Navigation and session handling

- [ ] 6.1 Point the header search at the implemented order search, or remove the control; verify the submitted search produces a result page and that no console control targets a missing route
- [ ] 6.2 Send an operator with a missing or expired session to the sign-in page instead of an API endpoint, on every console page that fetches data client-side; verify by clearing the session and loading the page
- [ ] 6.3 Mark the active navigation item for nested console routes; verify the correct item is highlighted on a detail page as well as a list page

## 7. Service duration

- [ ] 7.1 Declare days as the unit everywhere a duration is entered or displayed (admin form, edit form, service table, service detail, customer-facing catalogue) and remove the hour-based labels and hints; verify the same value renders identically on all five surfaces
- [ ] 7.2 Validate duration as a bounded positive integer with the accepted range stated in the error message; verify an out-of-range value and a missing value are both rejected with a message naming the field
- [ ] 7.3 Route the service detail page through the product service instead of reading the database directly, and verify its rendered values match the service table
- [ ] 7.4 Review the catalogue with the business once and correct any service whose stored duration was entered as hours; record the reviewed values in the change conversation

## 8. Verification

- [ ] 8.1 Walk the console end to end on a test order (list, filter, summary, detail, each status change, notification arrival, expired session) and record the walkthrough result in the change conversation
- [ ] 8.2 Confirm no console control leads to a missing route and no console figure disagrees with the database, then re-run typecheck, lint, and the tests added by this change

## Workflow follow-up

- Apply after `harden-auth-and-admin-guards` so the action guards are already in place.
- Validate the change with `openspec validate fix-admin-console-ux` before applying it.
- Archive the change after the walkthrough in group 8 passes.
