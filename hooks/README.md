# Hooks

Custom React hooks for logic shared across multiple components.

## `useProducts`

Fetches the list of active products from `/api/products_get`. Used in the customer order flow to display available service options.

Returns: `{ products, loading, error }`

---

Additional hooks are planned here as part of ongoing refactoring (e.g. `useNotifications`, `useOrderStatus`).
