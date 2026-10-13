# Design

## Context

See `proposal.md` - Why. Facts that shape the approach:

- Five independent definitions of order-status presentation and transitions exist: `lib/constants.ts` (labels and colours for all seven), `OrderStatusBadge.tsx` (five allowed statuses, its own labels/colours, a transition graph, and a normalisation function), `OrderFilters.tsx` (five filter options), `OrderHistoryTable.tsx` (a third colour map), and `admin/orders/action.ts` (unchecked status writes).
- `app/admin/orders/page.tsx` is a server component that already receives `result.total` and `result.totalPages` from `getAllOrders`, so the correct aggregates can be produced in the same query layer that paginates.
- Server actions in `app/admin/orders/action.ts` already return a result object; the badges simply ignore it. `Toaster` is mounted in the admin layout. `AlertDialog` is already used for destructive confirmation in `ProductsTable.tsx`.
- Nothing writes `Notification` rows. Order creation happens through the order server action (after `remove-dead-code-and-slop` removes the unused API route).
- The service detail page (`service/[id]/page.tsx:34`) reads Prisma directly while the rest of the catalogue goes through `lib/productService.ts`; the duration value is displayed as days in the table, hours on the detail page, labelled days in the create form, and hinted as hours in the edit form.
- Authorization of these actions is handled by `harden-auth-and-admin-guards`; this change must not duplicate that work, and its action changes must not conflict with the guard added there.

## Goals / Non-Goals

**Goals:**

- One authoritative definition of order-status metadata and transitions, used by the badge, the filters, the history table, and the mutation path.
- An order detail view an operator can work from, and figures that describe the business rather than the current page.
- Console controls whose destination and failure modes are honest.

**Non-Goals:**

- Customer list pagination, export format changes, new administrative features (user management, audit-log viewer), and any redesign of the console's visual language.
- Automated end-to-end coverage of the console; verification here is a documented manual pass plus unit tests for the transition graph and the aggregate query.
- Changing how much data a page loads (the customer list's full scan remains out of scope as stated in the proposal).

## Decisions

**1. Status metadata and transitions live in one module.**
`lib/constants.ts` gains the canonical transition graph and the badge/filters/history consume it; the four divergent definitions are deleted. Alternative considered: keeping presentation local to each component - rejected, because that is precisely what produced four disagreeing truths about a two-value enum.

**2. The transition graph is data, not branches.**
Declared as a mapping from each status to the statuses reachable from it, covering all seven values, and rendered by the selector. The proposed graph follows the order's lifecycle: pending to confirmed; confirmed to picked-up or cancelled; picked-up to in-progress; in-progress to ready; ready to completed; completed and cancelled reopenable to the previous working state. Rationale for making it data: the business can tune the flow without touching component logic, and the tests pin the graph rather than the UI. If the business does not actually track a picked-up stage, removing that node is a one-line change to the graph and its tests rather than a UI rewrite.

**3. Aggregates are computed where pagination is computed.**
`getAllOrders` (or a sibling function in the same service) returns, for the same filter, the counts by payment state and the summed paid total, in one additional grouped query. Alternative considered: fetching all matching orders and aggregating in the page - rejected, it defeats pagination. The page stops deriving figures from `result.data`.

**4. Change feedback uses the components already in the project.**
Badges and table actions use the mounted toast component for the result, `AlertDialog` for destructive transitions (cancel, refund), and trigger a refresh after a successful change so the displayed state matches storage. Alternative considered: local state updates - rejected, because the server action already revalidates the affected paths. The actions keep returning their result object; the checks added in `harden-auth-and-admin-guards` run first.

**5. Notifications are implemented, not removed.**
Order creation writes one notification per active administrator account, and the header refreshes the list on a short interval and when the window regains focus. Alternatives considered: server-sent events or websockets (an extra always-open connection, badly suited to a serverless host, and unnecessary for a single-operator console) and removing the feature (permitted by the spec, but the business does want to learn about incoming orders). Consequence accepted: the indicator is eventually consistent within the polling interval, not instant.

**6. Header search points at the implemented search.**
The console's order list already implements a text search with a `search` query parameter, so the header control navigates there. Alternative considered: building `/admin/search` across customers and orders - rejected as new scope for a control that has never worked. If a cross-entity search is wanted later it gets its own change.

**7. Duration is days.**
The declared unit is days for every surface, validated as a bounded positive integer, with the customer-facing estimate phrased in working days (the marketing copy already says "1-3 hari kerja"). Alternatives considered: hours (the current hint, but the table and forms already say days, and the business quotes days) and storing a unit per service (more schema and UI for a business that has never quoted hours). Consequence to handle explicitly: stored values were entered under ambiguous labels; the seed data (1-7) is consistent with days, and the catalogue must be reviewed once after the change, which is a task rather than an assumption.

**8. Service detail reads through the service layer.**
`service/[id]/page.tsx` switches to `lib/productService.ts` so the same serialization and duration handling applies everywhere.

## Risks / Trade-offs

- [Changing which statuses are selectable changes operator workflow] → The graph covers every status so nothing is unreachable, and the destructive transitions keep their confirmation via `AlertDialog`.
- [Notification rows accumulate and are written on a public code path] → Keep the write inside the order service, one row per active administrator, with the existing read path capped and an explicit cleanup task; a failed notification write must not fail the order.
- [Polling adds periodic requests from every open console] → The console has one operator; the interval is short but bounded, and the endpoint is already capped at the newest 50 rows.
- [Reinterpreting existing duration values as days could mis-state a service that was entered as hours] → Verify the catalogue against the business's real turnaround times once after the change; the task records the values found.
- [Aggregating in the query layer adds a grouped query per list request] → The group-by runs on the same filtered set with existing indexes on status and payment fields; if it becomes hot, the summary can move to a cached aggregate.
- [Conflict with other changes touching the same files] → `harden-auth-and-admin-guards` touches the order actions and `remove-dead-code-and-slop` touches components and constants; apply this change after the authorization change so guards are in place, and re-run the typecheck after each merge.

## Migration Plan

1. Land after `harden-auth-and-admin-guards` so action guards exist.
2. The transition graph and duration unit are code-level changes with no schema migration.
3. If persisted notification rows are wanted for existing orders, that is a deliberate backfill decision, not part of this change; existing orders stay un-notified.
4. Rollback: revert the deployment; no data migration is involved.
