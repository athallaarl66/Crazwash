# Proposal

## Why

The admin console shows operators a partial and in places wrong picture of their own business, so it cannot be trusted for daily work. Two of the seven order statuses cannot be seen or selected, the order detail page omits the pickup address, pickup date, phone number, payment method and notes needed to actually fulfil an order, the summary cards on the orders page count only the ten rows currently displayed while sitting next to a true total, the notification bell can never light up because nothing writes a notification row, the header search control navigates to a route that does not exist, and an expired session redirects to an API endpoint instead of the sign-in page.

## What Changes

- Make every order status the data model defines usable in the console: `OrderStatus` has seven values, the admin console currently exposes five and silently rewrites two of them (`app/admin/orders/components/OrderStatusBadge.tsx:17-33` normalises `PICKED_UP` and `IN_PROGRESS` to `READY` for both display and selection, and `STATUS_FLOW` at `:45-53` never routes through them).
- Make the order detail page show what fulfilment needs: pickup address, pickup date, customer phone, payment method, customer notes, internal notes, payment-proof reference, and the recorded status history. Today `app/admin/orders/[id]/OrderDetailView.tsx` (88 lines) renders only order number, statuses, customer name/email, service lines, and the total.
- Report the outcome of status and payment changes. The badges fire server actions and discard the returned result (`OrderStatusBadge.tsx:83-85`, `PaymentStatusBadge.tsx:41-44`), so a failed change looks like a completed one; `Toaster` is already mounted in `app/admin/layout.tsx:15` and unused for this.
- Correct the orders page summary so the figures describe the whole filtered result set rather than the current page (`app/admin/orders/page.tsx:52-62` derives "Lunas", "Belum Bayar" and "Revenue" from `result.data`, the current page's rows).
- Give the notification feature a writer and a refresh path, or remove it. `Notification` has no writer anywhere in the repository, so the bell is permanently empty while `README.md` advertises real-time notifications for incoming orders; the header also fetches once on mount with no refresh.
- Fix navigation that leads nowhere: the header search pushes to `/admin/search` (no such route, `AdminHeader.tsx:62`) and the service list redirects an expired session to `/api/auth/login` (`app/admin/service/page.tsx:40`), an API endpoint.
- Make the duration unit of a service unambiguous: the same field is labelled days in the admin form (`service/new/page.tsx:290`), described as hours in the edit form hint (`EditForm.tsx:316`), shown as hours on the service detail page (`service/[id]/page.tsx:172`), and as days in the service table (`ProductsTable.tsx:209`).
- Replace operator-facing `alert()` calls and unchecked bulk operations with feedback consistent with the rest of the console, including a checked response for bulk delete (`ProductsTable.tsx:105-110` ignores the response and refreshes as if it succeeded).

## Capabilities

### New Capabilities

- `admin-order-management`: operators can see and set every order status the data model defines, view the fulfilment fields of an order, and observe the outcome of a status or payment change.
- `admin-order-statistics`: summary figures shown alongside an order list describe the whole filtered result set.
- `admin-notifications`: notifications for the events the console advertises are created, and are surfaced to operators without a full page reload - or the feature is removed from the console and the documentation.
- `admin-navigation`: every console navigation control leads to a destination that exists, and an expired session returns the operator to sign-in with operator-visible feedback on failures.
- `admin-service-catalogue`: a service's duration is stored and presented with one unambiguous unit, and operator input is validated against it.

### Modified Capabilities

- None. The project has no existing specs (`openspec list --specs` returns an empty inventory).

## Impact

- `app/admin/orders/components/OrderStatusBadge.tsx`, `PaymentStatusBadge.tsx`, `OrdersTable.tsx`, `OrderFilters.tsx` — status model and change feedback.
- `app/admin/orders/[id]/OrderDetailView.tsx`, `app/admin/orders/page.tsx` — detail completeness and correct summaries.
- `app/admin/orders/action.ts`, `actions/orderActions.ts` — result reporting (their authorization is covered by `harden-auth-and-admin-guards`).
- `components/layout/AdminHeader.tsx`, `app/admin/service/page.tsx` — navigation and expired-session handling; a new search destination or removal of the control.
- Notification writer path (order creation) and `app/api/admin/notifications/route.ts` — creation and refresh.
- `app/admin/service/new/page.tsx`, `app/admin/service/[id]/EditForm.tsx`, `app/admin/service/[id]/page.tsx`, `app/admin/service/ProductsTable.tsx`, `lib/productService.ts` — duration semantics and validation.
- `app/admin/customers/**` — pagination moved out of scope (see below) but affected by summary-figure accuracy if reused.

## Out of Scope

- Authorization of the console and its endpoints (`harden-auth-and-admin-guards`).
- Removing dead code, dependencies and stale documentation (`remove-dead-code-and-slop`).
- Customer-facing placeholder content (`fix-customer-facing-placeholders`).
- Customer list pagination, export formats, and any new administrative feature such as user management or an audit-log viewer. The customer list currently loads every customer with every order and filters client-side; that scaling problem is real but is not this change.
