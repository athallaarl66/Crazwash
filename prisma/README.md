# Prisma — Database Schema

PostgreSQL via Neon, managed with Prisma 5.

## Models

### User

Admins and customers share one table, differentiated by the `role` field (ADMIN / CUSTOMER). Includes login attempt tracking, account locking, and soft delete.

### Product

The cleaning services offered by Crazwash. Has a category (BASIC, PREMIUM, DEEP, TREATMENT), price stored as `Decimal`, and supports multiple images via the `ProductImage` relation. Soft delete via `deletedAt`.

### Order + OrderService

`Order` stores customer info (supports guests without an account), status, and payment details. `OrderService` is the join table between `Order` and `Product` — it stores the qty and unit price at the time of the transaction, not the current price. This is intentional to preserve accurate order history.

### Notification

Notifications for the admin. Created automatically when a new order comes in or a payment is confirmed.

### AuditLog

Records important actions: logins, order status changes, product CRUD, etc. Useful for debugging and security auditing.

## Enums

- `Role`: ADMIN, CUSTOMER
- `OrderStatus`: PENDING → CONFIRMED → PICKED_UP → IN_PROGRESS → READY → COMPLETED / CANCELLED
- `PaymentStatus`: UNPAID, PAID, REFUNDED
- `ProductCategory`: BASIC, PREMIUM, DEEP, TREATMENT

Enums are kept fixed intentionally to reduce migrations. Adding a new category requires a schema change and migration.

## Scripts

```bash
# Seed everything (admin + products + sample orders)
npm run prisma:seed

# Seed admin account only
npm run prisma:seed-admin

# ⚠️ Reset database — deletes all data, then re-seeds
npm run prisma:reset

# Sync schema without a migration file (dev only)
npx prisma db push

# Open Prisma Studio (GUI for browsing/editing data)
npx prisma studio

# Regenerate Prisma client after schema changes
npx prisma generate
```

## Notes

- All price fields use `Decimal @db.Decimal(10, 2)` — do not change to `Float`
- `statusHistory` on `Order` is a `Json[]` that stores status change history without needing a separate table
- Migration files are in `migrations/` — do not edit them manually
  ss
