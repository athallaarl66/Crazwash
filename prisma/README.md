# Prisma Schema

Database schema for Shoe Cleaning Service App.

## Main Models

- User → admin & customer
- Product → services offered
- Order → customer orders
- OrderItem → order details

## Notes

- PostgreSQL (Neon)
- Decimal used for all monetary fields
- Enums are intentionally fixed to reduce migrations

## Prisma Seed

Seed utama:
npm run prisma:seed
→ prisma/seed-data.ts
→ admin + customer + product + order

Seed admin saja:
npm run prisma:seed-admin
→ prisma/seed-admin.ts

Reset database:
npm run prisma:reset
⚠️ hapus semua data
