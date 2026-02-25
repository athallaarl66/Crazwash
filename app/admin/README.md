# Admin Dashboard

Overview page for Crazwash's business performance. All data is fetched server-side from `/api/admin/dashboard`.

## Components

- **StatsCard** — compact KPI card (total orders, revenue, new customers, etc.)
- **RevenueChart** — daily/weekly/monthly revenue chart (Recharts)
- **OrderStatusChart** — pie/bar chart showing order status distribution
- **TopProductsTable** — best-selling services ranked by quantity and revenue
- **CategoryBreakdown** — revenue breakdown by service category
- **CustomerStats** — new vs. returning customer statistics
- **RevenueBreakdown** — revenue comparison across periods
- **SectionHeader** — reusable section header component

## Data Source

All data comes from a single endpoint: `GET /api/admin/dashboard`

Aggregation happens on the server, not the client — keeps the browser light and the page SSR-friendly.

## Notes

This page is fully server-rendered. If you want to add period filtering (e.g. pick a specific month), you'll need to convert it to a client component and re-fetch with query params.
s
