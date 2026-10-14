// tests/admin-console-ux.test.tsx
//
// Offline checks for the admin-console change. The checkout has no .env, so nothing
// here needs a database or a running app: the order-status model is asserted against
// the canonical constants, the two console views that can be rendered are rendered
// from real fixtures, and the remaining claims are read off the source that implements
// them (the console-side checks an operator would otherwise do by hand).
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import type { OrderStatus } from "@prisma/client";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { OrderWithServices } from "@/lib/orderService";

// lib/prisma.ts hands DATABASE_URL to the client constructor, which rejects an
// undefined url. No query is issued by these tests.
process.env.DATABASE_URL ??= "postgresql://u:p@localhost:5432/test";

const root = process.cwd();
const read = (...parts: string[]) =>
  readFileSync(path.join(root, ...parts), "utf8");
const flat = (text: string) => text.replace(/\s+/g, " ");

const CONSOLE_FILES = [
  "app/admin/orders/components/OrderStatusBadge.tsx",
  "app/admin/orders/components/PaymentStatusBadge.tsx",
  "app/admin/orders/components/OrderFilters.tsx",
  "app/admin/orders/components/OrdersTable.tsx",
  "app/admin/orders/components/OrdersClient.tsx",
  "app/admin/orders/page.tsx",
  "app/admin/orders/[id]/OrderDetailView.tsx",
  "app/admin/customers/components/OrderHistoryTable.tsx",
  "app/admin/service/page.tsx",
  "app/admin/service/ProductsTable.tsx",
  "app/admin/service/new/page.tsx",
  "app/admin/service/[id]/EditForm.tsx",
  "app/admin/service/[id]/page.tsx",
  "components/layout/AdminHeader.tsx",
  "components/layout/AdminSidebar.tsx",
];

/* ------------------------------------------------------------------ 1. status model */

test("every stored order status has a label, a colour and a reachable transition", async () => {
  const { OrderStatus } = await import("@prisma/client");
  const constants = await import("@/lib/constants");
  const statuses = Object.values(OrderStatus);

  assert.equal(statuses.length, 7, "the data model defines seven order statuses");

  for (const status of statuses) {
    assert.ok(
      constants.ORDER_STATUS_LABELS[status]?.trim(),
      `${status} has no label`,
    );
    assert.ok(
      constants.ORDER_STATUS_COLORS[status]?.trim(),
      `${status} has no colour`,
    );

    const transitions = constants.ORDER_STATUS_TRANSITIONS[status];
    assert.ok(
      Array.isArray(transitions) && transitions.length > 0,
      `${status} has no reachable transition`,
    );

    for (const next of transitions) {
      assert.ok(
        statuses.includes(next),
        `${status} transitions to ${next}, which is not a stored status`,
      );
      assert.notEqual(next, status, `${status} transitions to itself`);
    }
  }
});

test("every stored status is selectable from the console", async () => {
  const { OrderStatus } = await import("@prisma/client");
  const { ORDER_STATUS_TRANSITIONS } = await import("@/lib/constants");
  const statuses = Object.values(OrderStatus);

  // The selector offers the stored status plus everything reachable from it, so the
  // union over all statuses is the set an operator can ever select.
  const selectable = new Set<string>();

  for (const status of statuses) {
    selectable.add(status);
    for (const next of ORDER_STATUS_TRANSITIONS[status]) selectable.add(next);
  }

  for (const status of statuses) {
    assert.ok(selectable.has(status), `${status} cannot be selected anywhere`);
  }
});

test("the console keeps one definition of status presentation", () => {
  const singleSource = ["app/admin/orders/components/OrderStatusBadge.tsx"];

  for (const file of singleSource) {
    assert.match(read(file), /from "@\/lib\/constants"/);
  }

  // The divergent copies: a local transition graph, a normalisation function, a
  // second colour map, and a filter list that named five of seven statuses.
  const forbidden: Array<[string, RegExp]> = [
    ["app/admin/orders/components/OrderStatusBadge.tsx", /STATUS_FLOW/],
    ["app/admin/orders/components/OrderStatusBadge.tsx", /normalizeStatus/],
    ["app/admin/orders/components/OrderStatusBadge.tsx", /const STATUS_LABEL/],
    ["app/admin/orders/components/OrderStatusBadge.tsx", /ADMIN_STATUSES/],
    ["app/admin/customers/components/OrderHistoryTable.tsx", /orderStatusColor/],
    ["app/admin/customers/components/OrderHistoryTable.tsx", /translateOrderStatus/],
    ["app/admin/orders/components/OrderFilters.tsx", /label: "Semua Status"[\s\S]*label: "Menunggu"/],
  ];

  for (const [file, pattern] of forbidden) {
    assert.doesNotMatch(read(file), pattern, `${file} still defines its own status model`);
  }

  const filters = read("app/admin/orders/components/OrderFilters.tsx");
  assert.match(filters, /\.\.\.ORDER_STATUS_OPTIONS/, "the status filter uses the canonical options");
  assert.match(filters, /\.\.\.PAYMENT_STATUS_OPTIONS/, "the payment filter uses the canonical options");
});

/* ------------------------------------------------- 2. detail and change feedback */

test("an order stored in a processing status is displayed as that status", async () => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const React = (await import("react")).default;
  // Client components call useRouter(), which needs the App Router context.
  const { AppRouterContext } = await import(
    "next/dist/shared/lib/app-router-context.shared-runtime"
  );
  const { default: OrderStatusBadge } = await import(
    "@/app/admin/orders/components/OrderStatusBadge"
  );
  const { ORDER_STATUS_LABELS } = await import("@/lib/constants");

  const router = {
    push: () => {},
    replace: () => {},
    refresh: () => {},
    back: () => {},
    forward: () => {},
    prefetch: () => {},
  } as unknown as AppRouterInstance;

  function render(status: OrderStatus) {
    return renderToStaticMarkup(
      React.createElement(
        AppRouterContext.Provider,
        { value: router },
        React.createElement(OrderStatusBadge, { orderId: 1, status }),
      ),
    );
  }

  // PICKED_UP and IN_PROGRESS used to be rewritten to READY, hiding two statuses.
  const inProgress = render("IN_PROGRESS");
  assert.ok(inProgress.includes(ORDER_STATUS_LABELS.IN_PROGRESS));
  assert.ok(!inProgress.includes(ORDER_STATUS_LABELS.READY));

  const pickedUp = render("PICKED_UP");
  assert.ok(pickedUp.includes(ORDER_STATUS_LABELS.PICKED_UP));
  assert.ok(!pickedUp.includes(ORDER_STATUS_LABELS.READY));
});

test("order detail shows the fulfilment fields and degrades without notes or proof", async () => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const React = (await import("react")).default;
  const { default: OrderDetailView } = await import(
    "@/app/admin/orders/[id]/OrderDetailView"
  );

  const complete = {
    id: 7,
    orderNumber: "ORD-20261013-001",
    customerName: "Budi Santoso",
    customerPhone: "081234567890",
    customerEmail: "budi@example.com",
    customer: null,
    address: "Jl. Merdeka 1",
    city: "Bandung",
    pickupDate: new Date("2026-10-20T00:00:00.000Z"),
    notes: "Jangan pakai pemutih",
    adminNotes: "Sole menguning, pakai treatment khusus",
    paymentProof: "https://example.com/bukti-transfer.jpg",
    paymentMethod: "TRANSFER",
    paymentStatus: "PAID",
    status: "IN_PROGRESS",
    totalPrice: 75000,
    createdAt: new Date("2026-10-13T01:00:00.000Z"),
    completedDate: null,
    services: [],
    statusHistory: [
      {
        status: "PENDING",
        timestamp: "2026-10-13T01:00:00.000Z",
        note: "Pesanan dibuat",
      },
      {
        status: "IN_PROGRESS",
        timestamp: "2026-10-14T02:00:00.000Z",
        note: "Mulai dikerjakan",
      },
    ],
  } as unknown as OrderWithServices;

  const filled = renderToStaticMarkup(
    React.createElement(OrderDetailView, { order: complete }),
  );

  for (const expected of [
    "Jl. Merdeka 1",
    "Bandung",
    "081234567890",
    "TRANSFER",
    "Jangan pakai pemutih",
    "Sole menguning, pakai treatment khusus",
    "https://example.com/bukti-transfer.jpg",
    "Mulai dikerjakan",
    "13 Oktober 2026",
    "20 Oktober 2026",
  ]) {
    assert.ok(filled.includes(expected), `detail view is missing ${expected}`);
  }

  // The fixture with no internal notes and no payment proof: the sections degrade to a
  // statement instead of empty labels or an error.
  const sparse = {
    ...complete,
    notes: null,
    adminNotes: null,
    paymentProof: null,
    paymentMethod: null,
    pickupDate: null,
    services: [],
    statusHistory: [],
  } as unknown as OrderWithServices;

  const degraded = renderToStaticMarkup(
    React.createElement(OrderDetailView, { order: sparse }),
  );

  assert.ok(!degraded.includes("Catatan Internal"));
  assert.ok(!degraded.includes("Catatan Pelanggan"));
  assert.ok(degraded.includes("Tidak ada catatan pelanggan"));
  assert.ok(degraded.includes("Belum dijadwalkan"));
  assert.ok(degraded.includes("Belum diunggah"));
  assert.ok(degraded.includes("Belum ada riwayat status"));
});

test("status and payment changes report their result and refresh the view", () => {
  for (const file of [
    "app/admin/orders/components/OrderStatusBadge.tsx",
    "app/admin/orders/components/PaymentStatusBadge.tsx",
  ]) {
    const source = read(file);

    // The returned result of the server action is read, reported through the mounted
    // toast component, and a success refreshes the view.
    assert.match(source, /await update(Order|Payment)StatusAction\(/, `${file} discards the action result`);
    assert.match(source, /result\?\.success/, `${file} does not read success`);
    assert.match(source, /toast\.success/, `${file} reports no confirmation`);
    assert.match(source, /toast\.error/, `${file} reports no failure`);
    assert.match(source, /router\.refresh\(\)/, `${file} does not refresh after a change`);
  }
});

test("destructive transitions use the console dialog, not the browser prompt", () => {
  for (const file of [
    "app/admin/orders/components/OrderStatusBadge.tsx",
    "app/admin/orders/components/PaymentStatusBadge.tsx",
    "app/admin/service/ProductsTable.tsx",
  ]) {
    const source = read(file);

    assert.doesNotMatch(source, /\bconfirm\(/, `${file} still calls the browser confirm`);
    assert.doesNotMatch(source, /\balert\(/, `${file} still calls the browser alert`);
    assert.match(source, /ConfirmDialog|AlertDialog/, `${file} has no confirmation dialog`);
  }

  const orderBadge = read("app/admin/orders/components/OrderStatusBadge.tsx");
  assert.match(orderBadge, /ORDER_STATUS_DESTRUCTIVE/, "cancelling is gated");
  assert.match(orderBadge, /open=\{pendingChange !== null\}/, "the dialog gates the transition");

  const paymentBadge = read("app/admin/orders/components/PaymentStatusBadge.tsx");
  assert.match(paymentBadge, /PAYMENT_DESTRUCTIVE/);
});

test("bulk delete reports a failed response instead of refreshing as if it worked", () => {
  const source = read("app/admin/service/ProductsTable.tsx");
  const bulk = source.slice(source.indexOf("const handleBulkDelete"));

  assert.match(bulk, /const res = await fetch\("\/api\/admin\/service\/bulk-delete"/);
  assert.match(bulk, /if \(!res\.ok \|\| !result\?\.success\)/, "the response decides the outcome");
  assert.match(bulk, /toast\.error\(/, "a failure is reported to the operator");

  // The success path is the only one that refreshes and clears the selection.
  const failureCheck = bulk.indexOf("if (!res.ok");
  const failureReturn = bulk.indexOf("return;", failureCheck);
  const successRefresh = bulk.indexOf("onRefresh?.()", failureCheck);
  assert.ok(failureCheck > -1, "no response check found");
  assert.ok(
    failureReturn > -1 && failureReturn < successRefresh,
    "a failure must not refresh as if it succeeded",
  );
});

/* ------------------------------------------------------------ 3. summary figures */

test("summary figures are computed over the filtered result set", () => {
  const service = read("lib", "orderService.ts");
  const ordersQuery = service.slice(service.indexOf("export async function getAllOrders"));

  assert.match(ordersQuery, /prisma\.order\.groupBy\(/, "no grouped query for the counts");
  assert.match(ordersQuery, /by: \["paymentStatus"\]/);
  assert.match(ordersQuery, /prisma\.order\.aggregate\(/, "no aggregate for the paid total");
  assert.match(ordersQuery, /_sum: \{ totalPrice: true \}/);
  assert.match(ordersQuery, /summary: \{/, "the page has no summary to render");

  const page = read("app/admin/orders/page.tsx");
  assert.match(page, /result\.summary/, "the page does not read the service summary");
  assert.doesNotMatch(page, /result\.data\.filter\(/, "the page derives figures from the current page");
  assert.match(page, /sesuai filter/, "the summary labels do not state the population they cover");
  assert.match(page, /formatCurrency\(paidRevenue\)/, "the paid total is not rendered");
});

/* ------------------------------------------------------------- 4. notifications */

test("order creation writes one notification per active administrator", () => {
  const service = read("lib", "orderService.ts");

  assert.match(service, /export async function notifyAdminsOfNewOrder/);
  assert.match(service, /role: "ADMIN", isActive: true, deletedAt: null/);
  assert.match(service, /prisma\.notification\.createMany\(/, "one row per administrator, not one per order");
  // The write must not fail the order that produced it.
  assert.match(service, /catch \(error\) \{\s*console\.error\("Failed to write order notifications:/);

  const creation = read("actions", "orderActions.ts");
  assert.match(
    creation,
    /await createOrder\(\{/,
    "the checkout action does not use the single creation path",
  );
  // The notification is written inside the order service, so every caller of the
  // creation path notifies.
  assert.match(
    service,
    /export async function createOrder\([\s\S]*await notifyAdminsOfNewOrder\(\{/,
    "the order-creation path never notifies",
  );
});

test("no caller-facing endpoint can create a notification and the read path is capped", () => {
  const route = read("app", "api", "admin", "notifications", "route.ts");

  assert.match(route, /requireAdmin\(\)/, "the notification endpoints are not guarded");
  assert.doesNotMatch(route, /notification\.create(?!Many)/, "the endpoint inserts notifications");
  assert.doesNotMatch(route, /notification\.createMany/, "the endpoint inserts notifications");
  assert.match(route, /take: 50/, "the read path is not capped");

  const header = read("components", "layout", "AdminHeader.tsx");
  assert.match(header, /setInterval\(fetchNotifications, NOTIFICATION_POLL_MS\)/, "no refresh while open");
  assert.match(header, /window\.addEventListener\("focus", onFocus\)/, "no refresh on window focus");

  const readme = flat(read("README.md"));
  assert.match(readme, /Retention: the read path returns the newest 50 notifications/);
  assert.match(readme, /NOTIFICATION_POLL_MS/);
});

/* -------------------------------------------------- 5. navigation and sessions */

function routeExists(prefix: string): boolean {
  const dir = path.join(root, "app", ...prefix.split("/").filter(Boolean));
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
  if (existsSync(path.join(dir, "page.tsx"))) return true;
  // A push into a nested dynamic route (/admin/orders/12) resolves to app/admin/orders/[id].
  return readdirSync(dir).some(
    (entry) =>
      entry.startsWith("[") && existsSync(path.join(dir, entry, "page.tsx")),
  );
}

test("no console control targets a route the application does not implement", () => {
  const pushes: Array<{ file: string; target: string }> = [];

  for (const file of CONSOLE_FILES) {
    const source = read(file);
    for (const match of source.matchAll(/router\.(?:push|replace)\(([^)]*)\)/g)) {
      const literal = match[1];
      const extracted = literal.match(/["'`](\/[^"'`]*)["'`]/);

      if (!extracted) continue;

      // Keep the static prefix: `/admin/orders/${order.id}` cannot be empty.
      const prefix = extracted[1].split("${")[0].split("?")[0];
      pushes.push({ file, target: prefix });
    }
  }

  assert.ok(pushes.length > 0, "no console navigation found");

  for (const { file, target } of pushes) {
    assert.notEqual(target, "/", `${file} pushes to the site root`);
    assert.ok(
      routeExists(target),
      `${file} navigates to ${target}, which has no page`,
    );
  }
});

test("the header search reaches the implemented order search", () => {
  const header = read("components", "layout", "AdminHeader.tsx");

  assert.doesNotMatch(header, /\/admin\/search/, "the header still targets the missing search route");
  assert.match(header, /router\.push\(`\/admin\/orders\?search=\$\{encodeURIComponent/);
  assert.match(read("app", "admin", "orders", "page.tsx"), /params\.search/, "the order list ignores the search parameter");
});

test("an expired session sends the operator to sign-in, never to an API endpoint", () => {
  assert.ok(existsSync(path.join(root, "app", "auth", "login", "page.tsx")));

  const consoleFetchers = [
    "app/admin/service/page.tsx",
    "app/admin/service/new/page.tsx",
    "app/admin/service/[id]/EditForm.tsx",
    "components/layout/AdminHeader.tsx",
  ];

  for (const file of consoleFetchers) {
    const source = read(file);

    assert.doesNotMatch(source, /\/api\/auth\/login/, `${file} redirects to an API endpoint`);
    assert.match(source, /"\/auth\/login"/, `${file} does not offer the sign-in destination`);
  }

  // An API-backed console page tells the operator why instead of showing an error code.
  assert.match(read("app/admin/service/page.tsx"), /Session expired\./);
});

test("the active navigation item covers nested console routes", async () => {
  const { isActiveNavItem } = await import("@/lib/utils");

  assert.equal(isActiveNavItem("/admin/orders", "/admin/orders"), true);
  assert.equal(isActiveNavItem("/admin/orders/12", "/admin/orders"), true);
  assert.equal(isActiveNavItem("/admin/orders/12/edit", "/admin/orders"), true);
  assert.equal(isActiveNavItem("/admin/customers", "/admin/orders"), false);
  assert.equal(isActiveNavItem("/admin/orders-archive", "/admin/orders"), false);

  assert.match(read("components/layout/AdminSidebar.tsx"), /isActiveNavItem\(pathname, item\.href\)/);
});

/* -------------------------------------------------------------- 6. duration unit */

test("a service duration is declared in days on every console surface", async () => {
  const constants = await import("@/lib/constants");

  assert.equal(constants.SERVICE_DURATION_UNIT, "hari");
  assert.equal(constants.formatDuration(3), "3 hari");

  const surfaces = [
    "app/admin/service/new/page.tsx",
    "app/admin/service/[id]/EditForm.tsx",
    "app/admin/service/[id]/page.tsx",
    "app/admin/service/ProductsTable.tsx",
  ];

  for (const file of surfaces) {
    const source = read(file);

    assert.match(source, /SERVICE_DURATION_UNIT|formatDuration/, `${file} declares its own unit`);
    // No hour-based duration label or hint survives.
    assert.doesNotMatch(source, /dalam jam|\(1-168\)|\} jam/, `${file} still speaks of hours`);
  }

  const editForm = read("app/admin/service/[id]/EditForm.tsx");
  assert.match(editForm, /SERVICE_DURATION_RANGE_LABEL/);

  const detail = read("app/admin/service/[id]/page.tsx");
  assert.match(detail, /formatDuration\(product\.duration\)/);
  assert.match(detail, /getProductById\(/, "the detail page does not use the product service");
  assert.doesNotMatch(detail, /prisma\.product\.findUnique/, "the detail page reads the database directly");
});

test("duration input is rejected outside its unit's range, naming the field", async () => {
  const { parseDurationDays } = await import("@/lib/productService");
  const { SERVICE_DURATION_MAX_DAYS, SERVICE_DURATION_RANGE_LABEL } =
    await import("@/lib/constants");

  assert.equal(parseDurationDays(1), 1);
  assert.equal(parseDurationDays("7"), 7);
  assert.equal(parseDurationDays(SERVICE_DURATION_MAX_DAYS), 30);

  for (const invalid of [0, 31, 2.5, -1, "abc"]) {
    assert.throws(
      () => parseDurationDays(invalid),
      (error: Error) => {
        assert.match(error.message, /Durasi/, `${invalid} is rejected without naming the field`);
        assert.ok(
          error.message.includes(SERVICE_DURATION_RANGE_LABEL),
          `${invalid} is rejected without stating the accepted range`,
        );
        return true;
      },
    );
  }

  for (const missing of [undefined, null, ""]) {
    assert.throws(
      () => parseDurationDays(missing),
      (error: Error) => {
        assert.match(error.message, /Durasi wajib diisi/);
        assert.ok(error.message.includes(SERVICE_DURATION_RANGE_LABEL));
        return true;
      },
    );
  }
});
