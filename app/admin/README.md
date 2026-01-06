# Admin Module

Admin panel for managing operations and monitoring business performance.

## Routes

- /admin/dashboard → Business overview
- /admin/orders → Order management
- /admin/inventory → Product & stock management
- /admin/customers → Customer data

## Access Control

- Protected by NextAuth
- Only admin role allowed

## Notes

- Dashboard page is kept thin
- Most business logic lives in API routes
