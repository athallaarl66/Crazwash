# API reference

Every endpoint is a Next.js App Router `route.ts` handler. This document replaces the
directory-level READMEs the repository used to carry (`app/api/README.md`,
`app/admin/README.md`, `app/admin/dashboard/README.md`, `prisma/README.md`,
`hooks/README.md`); the data model and the end-to-end flows are described in
[`docs/projects/crazwash-technical-documentation.md`](projects/crazwash-technical-documentation.md).

## Authentication

- `GET`, `POST /api/auth/[...nextauth]` — the NextAuth handler; configuration lives in `lib/auth.ts`.
- Administrative handlers load the stored account on every request through
  `lib/api-error-handler.ts`: `adminGuardResponse()` in the dashboard and service handlers,
  `requireAdmin()` in the notification handler, `adminGuardResult()` in server actions. The role,
  enabled state and removal state therefore come from the database, not from the token.
- The session-cookie check for `/admin/*` lives in `proxy.ts`.

## Administrative endpoints

| Endpoint                         | Methods                | Guard                  |
| -------------------------------- | ---------------------- | ---------------------- |
| `/api/admin/dashboard`           | `GET`                  | `adminGuardResponse()` |
| `/api/admin/notifications`       | `GET`, `POST`          | `requireAdmin()`       |
| `/api/admin/service`             | `GET`, `POST`          | `adminGuardResponse()` |
| `/api/admin/service/[id]`        | `GET`, `PATCH`, `DELETE` | `adminGuardResponse()` |
| `/api/admin/service/bulk-delete` | `DELETE`               | `adminGuardResponse()` |

- `GET /api/admin/dashboard` — aggregated KPIs for the console dashboard; accepts a `range` query
  parameter.
- `GET /api/admin/notifications` — the newest 50 notifications for the signed-in administrator.
- `POST /api/admin/notifications` — marks one notification read
  (`{ "action": "markAsRead", "notificationId": … }`) or all of them (`{ "action": "markAllAsRead" }`).
  No endpoint inserts a notification; the only writer is order creation, in `lib/orderService.ts`.
- `/api/admin/service`, `/api/admin/service/[id]`, `/api/admin/service/bulk-delete` — service
  management. `DELETE` is a soft delete: `deletedAt` is set and `isActive` becomes `false`.

There is no public product endpoint. The customer-facing pages read the catalogue through
`lib/productService.ts` and the order form submits the server action
`createOrderAction(formData)` in `actions/orderActions.ts`, which writes through
`createOrder()` in `lib/orderService.ts`. The unused `/api/orders`, `/api/orders/[id]` and
`/api/service_get` handlers were removed by the `remove-dead-code-and-slop` change.

## Errors

Failures return `{ "error": string }` with a status code. `handleAPIError()` in
`lib/api-error-handler.ts` builds the envelope; a refused guard answers `401`.

## Rate limiting

`lib/rate-limit.ts` stores counters in the `RateLimit` table so the limit holds across instances.
Public order creation is capped at 5 submissions per client per hour (`ORDER_RATE_LIMIT`); a refusal
returns `success: false` and creates no order.
