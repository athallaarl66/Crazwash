# Proposal

## Why

The Crazwash web application exhibits significant AI template fatigue and visual slop across the customer ordering flow (raw emoji tabs, floating single-letter badges, jittery bouncing steppers, broken mobile progress lines, and decorative pulsing blur-blobs). Furthermore, critical order lifecycle and reporting flows have operational bugs: administrative status updates bypass status history and completion timestamp recording, customer lifetime metrics report 0 orders and dormant status for active customers with in-progress orders, and phone input lacks leading-zero sanitization with location metadata drifting away from the actual business location in Bandung.

## What Changes

- **De-slop Public Ordering Flow (`/order`)**:
  - Replace raw emoji tabs (`🧼`, `✨`, `💧`, `⚡`, `📦`) with clean, responsive segmented category filters showing label and item count.
  - Remove floating single-letter badges (`(B)`, `(P)`, `(D)`, `(T)`) and overlapping checkmarks from service cards in favor of subtle border highlights.
  - Replace oversized 44px bouncy stepper buttons with compact, predictable stepper controls without scale bounce animations.
  - Fix broken progress connector lines on mobile viewports in `ProgressSteps`.
  - Remove decorative blur-3xl animated pulse blobs and redundant checkout buttons.
- **Fix Order Status Lifecycle & History**:
  - Unify `updateOrderStatusAction` to append to `statusHistory` and set `completedDate` upon transition to `COMPLETED`, matching the read path in order detail view.
  - Add interactive status transitions and back navigation to the admin order detail page (`/admin/orders/[id]`).
- **Fix Customer Analytics & Metric Contradictions**:
  - Revise customer summary aggregation to evaluate all non-cancelled orders rather than exclusively completed paid orders, preventing active customers from showing 0 orders and dormant status.
  - Eliminate the contradictory fallback that stamps today's timestamp as the last order date while marking the customer dormant.
- **Branding & Location Consistency**:
  - Sanitize phone input to automatically strip leading zeroes when prefixed with `+62`.
  - Correct location copy and metadata from Jakarta placeholders to Bandung Arcamanik.
  - Update admin sign-in title from generic "Cuci Sepatu" to "Crazwash Admin".

## Capabilities

### New Capabilities

- `order-checkout`: Customer service selection, compact quantity controls, input sanitization, and clean category navigation without AI template slop.
- `order-management`: Administrative order state transitions with persistent status history tracking and completion timestamps.
- `customer-metrics`: Multi-status customer order aggregation and coherent activity status calculation.

### Modified Capabilities

None. (Durable specs under `openspec/specs/` are currently uninitialized).

## Impact

- **Customer UI**: `app/(public)/order/`, `components/shared/`, `components/steps/`, `components/cart/`.
- **Admin UI & Actions**: `app/admin/orders/`, `app/admin/orders/[id]/`, `app/admin/customers/`, `actions/orderActions.ts`.
- **Business Logic Services**: `lib/orderService.ts`, `lib/customerService.ts`.
- **Database**: No schema migration required; leverages existing `statusHistory`, `completedDate`, and relations.
- **Dependencies**: No new external packages required.
