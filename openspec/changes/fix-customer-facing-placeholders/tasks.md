# Tasks

## 1. Configuration source

- [x] 1.1 Add `lib/business-config.ts` exposing typed payment destinations and the business contact number, read from environment variables, with a descriptive error naming the missing variable when a required value is absent in production; verify by running a unit test that asserts the parse result for a valid value and the thrown error for a missing one
- [x] 1.2 Add the new keys to `.env.example` with sample non-placeholder formatting guidance, and document them in `README.md` under Environment Variables; verify `README.md` lists exactly the keys present in `.env.example`
- [x] 1.3 Add the build-time configuration check to the project's build script; verify `npm run build` fails with the named variable when the key is unset and passes when it is set

## 2. Payment destinations at checkout

- [x] 2.1 Pass the configured payment destinations from `app/(public)/order/page.tsx` into `OrderForm` and `Step4Payment`, replacing the placeholder `PAYMENT_DETAILS` constant; verify no dummy account number, wallet number, or invented holder name remains in the component
- [x] 2.2 Render only methods that have at least one configured destination, and prevent selecting a method with none; verify in the browser that a method removed from the configuration is no longer selectable and that the step shows an operational error when all destinations are missing
- [x] 2.3 Replace the raw `<img>` payment illustration in `Step4Payment` with the project's image component and record the verification step: the checkout page renders with no console warning about unoptimized images

## 3. Server-side order confirmation

- [ ] 3.1 Convert `app/(public)/order/success/page.tsx` into a server component that resolves the order by order number through the order service and passes a serialized order plus the contact destination to the client view; verify with a rendered request that the page shows the stored order number, stored total, and stored payment method
- [ ] 3.2 Render a not-found state when the order number does not resolve; verify that requesting the success route with a nonexistent or malformed order number never displays the success heading
- [x] 3.3 Reduce the checkout redirect in `OrderForm` to the order number only and confirm the success view still shows name, total, and payment method after a hard refresh; document the URL contract in the component's header comment
- [x] 3.4 Point the send-payment-proof link at the configured contact destination and verify the generated link contains that value rather than an example number

## 4. Public price list

- [ ] 4.1 Render the landing price list from active, non-deleted products grouped by product category, reusing the existing labels in `lib/constants.ts`, and remove the hardcoded `services` map, emoji headings, and hardcoded slogan; verify the landing page shows the same names and prices as the services page for the same catalogue
- [ ] 4.2 Verify the drift is gone end to end: change a price in the admin console, reload the landing page, and confirm the new price appears without a code change

## 5. Verification and documentation

- [ ] 5.1 Add an integration check covering the full public path (catalogue → order creation → success view) and verify it passes in CI-free local runs, or record explicitly that automated coverage is deferred and describe the manual verification performed
- [ ] 5.2 Walk the deployed preview: complete one order, confirm payment instructions are the configured ones, confirm payment proof reaches the configured contact, and record the result in the change conversation

## Workflow follow-up

- Validate the change with `openspec validate fix-customer-facing-placeholders` before applying it.
- Archive the change after the order path has been exercised once against the configured environment.
