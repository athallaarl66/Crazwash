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
- Payment proof upload
- Order success page with summary

**Admin panel:**

- Dashboard with KPIs: revenue, order count, status breakdown
- Order management (update status, add notes, filter/search)
- Service/product management (CRUD + soft delete)
- Customer list with order history per customer
- Real-time notifications for incoming orders
- Data export

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
DATABASE_URL=       # PostgreSQL connection string (from Neon dashboard)
NEXTAUTH_SECRET=    # Random secret — generate with: openssl rand -base64 32
NEXTAUTH_URL=       # http://localhost:3000 for local dev
```

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
- `statusHistory` on `Order` is stored as a `Json[]` array for lightweight audit trail without an extra table
- Some hooks and components are intentionally left as stubs, planned for future refactoring
