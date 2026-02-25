# API Routes

All endpoints use Next.js App Router (`route.ts` files). Auth is checked via `getServerSession` from NextAuth.

## Admin Endpoints

All `/api/admin/*` routes require a session with `role === "ADMIN"`.

### `GET /api/admin/dashboard`

Aggregated data for the dashboard page: total revenue, order counts, status breakdown, top products, and revenue trends by day/week/month.

### `GET /api/admin/notifications`

Fetch notifications for the currently logged-in admin. Returns the 50 most recent.

### `POST /api/admin/notifications`

Update notification read status.

```json
// Mark a single notification as read
{ "action": "markAsRead", "notificationId": "clxxx..." }

// Mark all notifications as read
{ "action": "markAllAsRead" }
```

### `GET | PUT | DELETE /api/admin/service/[id]`

Read, update, or soft-delete a single product/service.

### `POST /api/admin/service`

Create a new service/product.

### `DELETE /api/admin/service/bulk-delete`

Soft-delete multiple products at once.

## Order Endpoints

### `GET | PATCH /api/orders/[id]`

Get order details or update an order. PATCH is used by the admin to update status, add notes, confirm payment, etc.

## Product Endpoints

### `GET /api/products/[id]`

Get details for a single product. Public — no auth required.

### `GET /api/products_get`

Get all active products. Used by the customer-facing order flow.

## Auth

### `/api/auth/[...nextauth]`

Standard NextAuth handler. Configuration lives in `lib/auth.ts`.

## Notes

- Rate limiting is handled in `lib/rate-limit.ts` and applied to sensitive endpoints
- Error handling helpers are in `lib/api-error-handler.ts`
- All error responses follow the format `{ error: string }`
