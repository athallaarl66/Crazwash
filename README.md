# Crazwash — Shoe Cleaning Service Web App

A web app for Crazwash, a shoe cleaning small business based in Bandung, Indonesia. Built to help and support manual order flows (WhatsApp/phone) with a structured system that can be monitored directly from an admin dashboard.

## Tech Stack

| Layer     | Tools                                          |
| --------- | ---------------------------------------------- |
| Framework | Next.js 15 App Router + TypeScript (strict)    |
| Database  | PostgreSQL via Neon (free tier) + Prisma 5 ORM |
| Auth      | NextAuth v4 (Credentials provider)             |
| UI        | Tailwind CSS + shadcn/ui                       |
| Deploy    | Vercel                                         |

## Features

**Customer-facing:**

- 4-step order flow: pick a service → fill in details → schedule pickup → confirm payment
- Order success page with summary
- Payment instructions come from configuration (bank transfer, e-wallet, QRIS, cash on delivery)

**Admin panel:**

- Dashboard with KPIs: revenue, order count, status breakdown
- Order management (update status, add notes, filter/search)
- Service/product management (CRUD + soft delete)
- Customer list with order history per customer
- Data export (CSV/JSON from the customer list)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# Push schema to database
npx prisma db push

# Seed initial data (admin account + products + sample orders)
npm run prisma:seed

# Start dev server
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Environment Variables

```env
DATABASE_URL=                 # PostgreSQL connection string (from Neon dashboard)
NEXTAUTH_SECRET=              # Random secret — generate with: openssl rand -base64 32
NEXTAUTH_URL=                 # http://localhost:3000 for local dev
BUSINESS_WHATSAPP_NUMBER=     # WhatsApp number that receives payment proof (digits, country code)
PAYMENT_DESTINATIONS=         # JSON array of the payment destinations shown at checkout
```

`BUSINESS_WHATSAPP_NUMBER` and `PAYMENT_DESTINATIONS` feed every customer-facing
payment surface. The app has no fallback accounts, and the build refuses to run
while they are empty (set `ALLOW_MISSING_BUSINESS_CONFIG=1` to skip that check
locally). See `.env.example` for the JSON shape and the allowed methods.

## Security

### Administrative surfaces

Role checks read the stored account role on every request: `requireAdmin()` in
`lib/api-error-handler.ts` loads role, enabled state and removal state from the
database, so demoting an account takes effect on its next request instead of at
token expiry. Every administrative API route calls it, administrative server
actions return a failure instead of mutating, and `app/admin/layout.tsx` sends
non-administrators to sign-in before any administrative page renders.

Path-level protection lives in `proxy.ts` (the convention Next 16 executes; the
deprecated `middleware.ts` is not present). It only checks that a session exists,
and its matcher covers `/admin/:path*` and `/auth/login` — the two paths the guard
branches on.

Manual check of the path guard (no session): expected `307 -> http://localhost:3000/auth/login`

```bash
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' http://localhost:3000/admin/dashboard
```

Manual check of an administrative API route (no session): expected `401` with a JSON
error and no business data

```bash
curl -s -i http://localhost:3000/api/admin/dashboard | head -1
```

### Sign-in lockout

Implemented in `lib/auth.ts`:

| Value                             | Setting                    |
| --------------------------------- | -------------------------- |
| Failed attempts before lockout    | 5 (`LOGIN_MAX_ATTEMPTS`)   |
| Lockout window                    | 15 minutes (`LOGIN_LOCK_WINDOW_MS`) |

Failed attempts increment `loginAttempts`; reaching the threshold sets `lockedUntil`
to now plus the window. While locked, sign-in is refused even with the correct
credential. A successful sign-in clears both columns and writes `lastLogin`, and a
lock that has expired no longer counts — the next attempt starts a fresh window.

Clearing a locked account on purpose (Prisma Studio or SQL):

```sql
UPDATE "User" SET "loginAttempts" = 0, "lockedUntil" = NULL WHERE "email" = '<account email>';
```

### Order creation limit

Implemented in `lib/rate-limit.ts` (`ORDER_RATE_LIMIT`): 5 order submissions per
client within 1 hour. Each attempt is one atomic upsert into the `RateLimit` table,
so the count holds across deployed instances; a refusal returns `success: false`
with a message and creates no order. Counters are keyed per client address and can be
reset with:

```sql
DELETE FROM "RateLimit" WHERE "key" = 'orders:<client address>';
```

### Customer accounts created by checkout

A checkout that finds no matching customer creates a record whose password is a hash
of a random secret that is never disclosed, so that record cannot sign in until an
administrator sets a credential for it. Matching is by phone first, then by email,
and an existing record is only linked — its role, name and address are never
rewritten. Checkout never invents a substitute email address, so `User.email` is
optional.

### Operator notifications

Creating an order writes one unread notification per active administrator, inside the
order service (`notifyAdminsOfNewOrder` in `lib/orderService.ts`); the write is
swallowed on failure, so an unwritable notification never fails the order. A
notification row can only appear as that side effect: the notification endpoints
(`/api/admin/notifications`) require an administrator session and only read rows or
mark them read — nothing caller-facing inserts a notification. The console header
refreshes the list every 15 seconds and whenever the window regains focus
(`NOTIFICATION_POLL_MS` in `components/layout/AdminHeader.tsx`), and read state is
stored on the row, so it survives a reload.

Retention: the read path returns the newest 50 notifications per administrator
(`take: 50`) and rows otherwise live until they are cleared — there is no automatic
pruning, so the table grows with order volume (bounded in practice by the order rate
limit above, which caps how often an order can be created). Trim old rows with:

```sql
DELETE FROM "Notification" WHERE "createdAt" < now() - interval '90 days';
```

## Documentation

Resolved issues are written up under `docs/issues/` — one document per issue, with the symptoms, the
root cause, the evidence that was actually observed and the checks still outstanding. Start at
[`docs/issues/README.md`](docs/issues/README.md).

## Project Structure

```
app/
├── (public)/           # Customer-facing pages (landing, order flow, services)
├── admin/              # Admin panel (auth-protected)
├── api/                # API route handlers
│   ├── admin/          # Admin-only endpoints
│   ├── auth/           # NextAuth handler
│   └── orders/         # Order endpoints
lib/
├── auth.ts             # NextAuth configuration
├── prisma.ts           # Prisma client singleton
├── orderService.ts     # Order business logic
└── productService.ts   # Product business logic
prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Seed script
```

## Scripts

```bash
npm run dev               # Start development server
npm run build             # Build for production
npm run prisma:seed       # Seed all data
npm run prisma:seed-admin # Seed admin account only
npm run prisma:reset      # ⚠️ Reset DB and re-seed (deletes all data)
npx prisma studio         # Open Prisma GUI
```

## Notes

- All monetary values use Prisma `Decimal` type to avoid floating point issues
- Soft delete is used for `User` and `Product` (via `deletedAt` field)
- A service's `duration` is stored and displayed in days (1-30) on every console surface: the admin create
  and edit forms, the service table and the service detail page
- `statusHistory` on `Order` is stored as a `Json[]` array for lightweight audit trail without an extra table
- `User.email` is optional: checkout-created accounts have no email until one is set
- Sessions issued before the role change carry a hardcoded role — rotate `NEXTAUTH_SECRET` when deploying so they are invalidated
- Some hooks and components are intentionally left as stubs, planned for future refactoring
