# Admin console

Every page under `app/admin/` is behind two checks: `proxy.ts` requires a session cookie for
`/admin/:path*`, and `app/admin/layout.tsx` refuses to render for an account that is not an active
administrator.

| Page      | Paths                                                | Page component    | Data source                              |
| --------- | ---------------------------------------------------- | ----------------- | ---------------------------------------- |
| Dashboard | `/admin/dashboard`                                   | client            | `GET /api/admin/dashboard`               |
| Orders    | `/admin/orders`, `/admin/orders/[id]`                | server + client   | `lib/orderService.ts`                    |
| Services  | `/admin/service`, `/admin/service/new`, `/admin/service/[id]/edit` | client / server | `/api/admin/service` endpoints |
| Customers | `/admin/customers`, `/admin/customers/[phone]`       | server            | `lib/customerService.ts`                 |

The dashboard page is a **client component**: it fetches its KPIs and its period filter from the API.
Aggregation itself happens server-side in the route handler, so the browser only renders what it
receives — the earlier claim that the page was fully server-rendered was wrong and is not repeated here.

Dashboard components (`app/admin/dashboard/components/`): `StatsCard`, `RevenueChart`,
`OrderStatusChart`, `TopProductsTable`, `Categorybreakdown`, `Revenuebreakdown`, `Customerstats`,
`SectionHeader`.

Shared vocabulary:

- Order statuses, their labels, colours and allowed transitions live in `lib/constants.ts`.
- Currency (`formatCurrency`) and date (`formatDate`, `formatDateTime`) formatting live in `lib/utils.ts`.
- Service duration is stored and displayed in days, bounded by `SERVICE_DURATION_MIN_DAYS` and
  `SERVICE_DURATION_MAX_DAYS` in `lib/constants.ts`.
