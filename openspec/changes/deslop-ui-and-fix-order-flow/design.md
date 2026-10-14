# Design

## Context

See `proposal.md` for motivation. The application is a Next.js App Router project using Prisma with PostgreSQL.
Currently, administrative order mutations are split between `app/admin/orders/action.ts` (which calls `lib/orderService.ts`) and `actions/orderActions.ts`. `lib/orderService.ts:updateOrderStatus` performs a bare Prisma update that ignores `statusHistory` and `completedDate`.
In the frontend, customer checkout components (`CategoryTabs.tsx`, `ProductCard.tsx`, `ProgressSteps.tsx`, `CartSummary.tsx`) carry AI template artifacts: emoji headers, bouncing scale animations on steppers, oversized pill buttons, and broken mobile connectors.

## Goals / Non-Goals

**Goals:**
- Eliminate AI template slop from `/order` without altering the data payload submitted to `createOrderAction`.
- Unify `updateOrderStatus` logic in `lib/orderService.ts` so all callers record status history and completion dates.
- Enable interactive status controls and back navigation on `/admin/orders/[id]`.
- Provide accurate customer summary statistics in `lib/customerService.ts` without contradictory date fallbacks.
- Ensure all business copy, metadata, and input sanitization accurately reflect Bandung Arcamanik.

**Non-Goals:**
- No database schema migrations: utilize existing JSON and DateTime columns.
- No rewrite of the checkout state machine or payment destinations configuration.
- No public tracking portal in this change (stays scoped to fixing existing order flows and de-slopping UI).

## Decisions

### 1. Unify Order State Mutations in `lib/orderService.ts`
- **Decision**: Update `lib/orderService.ts:updateOrderStatus` to accept optional `adminNotes`, append to `statusHistory` (preserving prior history), and set `completedDate = new Date()` when transition is `COMPLETED`. Deprecate redundant logic in `actions/orderActions.ts`.
- **Alternative considered**: Keep the logic in `actions/orderActions.ts` and change imports in `app/admin/orders/action.ts`. Rejected because `lib/` is the single source of truth for database operations across the app.

### 2. Segmented Text Controls for Categories
- **Decision**: Replace `CATEGORY_DISPLAY_CONFIG` emoji properties with clean text labels and count chips.
- **Alternative considered**: Lucide SVG icons per category. Rejected because category names (`Cleaning`, `Deep Clean`, `Special Treatment`) are self-explanatory and text badges are cleaner and less prone to icon ambiguity.

### 3. Compact Native Stepper in Product Cards
- **Decision**: Render standard 32px (`w-8 h-8`) rounded buttons with `lucide-react` Minus/Plus and a static tabular-nums quantity display. Remove `initial={{ scale: 1.3 }}` bounce animation.
- **Alternative considered**: Input number box. Rejected because stepper buttons are faster and prevent invalid text input on mobile touchscreens.

### 4. Normalize Phone Numbers at Boundary
- **Decision**: In `Step2CustomerInfo.tsx` and `createOrderAction`, strip any leading "0" or country code prefix before storing the local subscriber number (storing normalized "8xxxxxxxxx").
- **Alternative considered**: Third-party phone parsing library like `libphonenumber-js`. Rejected to avoid unnecessary dependencies (YAGNI / native-first).

### 5. Multi-Status Customer Order Aggregation
- **Decision**: In `lib/customerService.ts`, aggregate customer stats from all non-cancelled orders (`status != 'CANCELLED'`). For customers with 0 orders, leave `lastOrderDate` as empty/null instead of injecting `new Date()`.
- **Alternative considered**: Keep only `COMPLETED` orders for spending, but all orders for order count. Adopted: total spending sums paid orders, while total orders and last order date track all confirmed customer orders.

## Risks / Trade-offs

- [Risk] Legacy orders in DB have null or malformed `statusHistory` array.
  → Mitigation: In `updateOrderStatus`, safely parse `order.statusHistory` with an array fallback before appending.
- [Risk] Phone number normalization could mutate already-stored numbers.
  → Mitigation: Apply normalization on input and checkout creation; existing database records are untouched.
