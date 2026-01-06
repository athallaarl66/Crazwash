# Admin Dashboard

Dashboard for monitoring key business metrics.

## Data Source

- GET /api/admin/dashboard

## Components

- StatsCard → KPI summary
- RevenueChart → Revenue trends
- OrderStatusChart → Order status distribution
- TopProducts → Best performing services
- AlertsPanel → Operational alerts

## Design Principles

- Page = orchestration only
- UI split into small reusable components
- Heavy computation handled by API
