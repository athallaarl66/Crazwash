# Tasks

## 1. De-slop Customer Ordering Flow (`/order`)

- [x] 1.1 Replace emoji characters (`🧼`, `✨`, `💧`, `⚡`, `📦`) in `CategoryTabs.tsx` with segmented text tabs showing label and item count chip; verify component renders cleanly without emoji glyphs
- [x] 1.2 Remove floating initial badges (`(B)`, `(P)`, `(D)`, `(T)`) and overlapping checkmarks from `ProductCard.tsx`; replace 44px bouncy buttons with 32px compact steppers and verify no scale bounce on quantity changes
- [x] 1.3 Fix mobile layout in `ProgressSteps.tsx` so connector lines do not render as misaligned horizontal bars inside vertical layouts
- [x] 1.4 Remove decorative `<Sparkles />` icons and excessive gradient styling from `CartSummary.tsx` and consolidate duplicate checkout buttons

## 2. Order Lifecycle & History Tracking

- [x] 2.1 Update `lib/orderService.ts:updateOrderStatus` to safely append to `statusHistory` and set `completedDate` upon transition to `COMPLETED`; verify status history array grows on status change
- [x] 2.2 Unify order status mutations across `app/admin/orders/action.ts` and `actions/orderActions.ts` to use `lib/orderService.ts:updateOrderStatus`
- [x] 2.3 Add interactive status transition controls, payment actions, and a back link to `/admin/orders` on `app/admin/orders/[id]/OrderDetailView.tsx`

## 3. Customer Metrics & Analytics Logic

- [x] 3.1 Refactor `lib/customerService.ts` customer summary query to aggregate all non-cancelled orders for active order counts and last order timestamps
- [x] 3.2 Eliminate `new Date()` fallback when a customer has no orders, ensuring `DORMANT` status does not display a misleading current-day last order date

## 4. Branding, Location, and Input Sanitization

- [x] 4.1 Implement phone input sanitization in `Step2CustomerInfo.tsx` and `createOrderAction` to strip leading zeroes when `+62` prefix is present
- [x] 4.2 Update placeholder addresses in `Step3PickupInfo.tsx` and keywords in `app/(public)/order/page.tsx` from Jakarta to Bandung Arcamanik
- [x] 4.3 Update card title in `app/auth/login/LoginView.tsx` from "Cuci Sepatu" to "Crazwash Admin"

## 5. Verification & Quality Gates

- [x] 5.1 Run test suite with `npm test` and verify all tests pass
- [x] 5.2 Run TypeScript verification with `npx tsc --noEmit` and confirm 0 errors

## 6. Follow-up pass on the reported defect (added after review)

- [x] 6.1 Fix the invisible active tab label: `darkMode` was left at Tailwind's default `media` strategy while `globals.css` defines no `.dark` values, so on a dark-mode browser every `dark:` utility in the UI primitives fired and painted navy-on-navy; set `darkMode: "class"` in `tailwind.config.ts` and verify the active tab renders white-on-navy
- [x] 6.2 Remove the remaining decorative gradients from the order flow (`Step1ServiceSelection`, `Step2CustomerInfo`, `Step3PickupInfo`, `Step4Payment`, `ProgressSteps`, `MobileCartSheet`) and verify a DOM scan finds zero gradient backgrounds on `/order`
- [x] 6.3 Remove the raw emoji from the order flow (`ℹ️`, `⏰`, `🎉`, `📱`, `💡`), drop the `whileHover`/`whileTap` scale and the confetti effect on the success view, and replace the hardcoded `green-*`/`blue-*` failure-view colours with theme tokens
