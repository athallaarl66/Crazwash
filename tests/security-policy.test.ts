// tests/security-policy.test.ts
//
// Offline checks for the hardening change: the security values written in README.md
// must match the code, the path guard must use the convention the installed Next.js
// executes, and every administrative surface must call the shared guard.
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (...parts: string[]) =>
  readFileSync(path.join(root, ...parts), "utf8");
const flat = (text: string) => text.replace(/\s+/g, " ");

function routeFiles(dir: string): string[] {
  const found: string[] = [];

  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);

    if (statSync(full).isDirectory()) {
      found.push(...routeFiles(full));
    } else if (entry === "route.ts") {
      found.push(path.relative(root, full).replace(/\\/g, "/"));
    }
  }

  return found;
}

test("documented lockout values match the sign-in code", () => {
  const auth = read("lib", "auth.ts");
  const readme = flat(read("README.md"));

  assert.match(auth, /LOGIN_MAX_ATTEMPTS = 5;/);
  assert.match(auth, /LOGIN_LOCK_WINDOW_MS = 15 \* 60 \* 1000;/);
  assert.match(readme, /5 \(`LOGIN_MAX_ATTEMPTS`\)/);
  assert.match(readme, /15 minutes \(`LOGIN_LOCK_WINDOW_MS`\)/);
});

test("documented order limit matches the rate limit code", () => {
  const rateLimit = read("lib", "rate-limit.ts");
  const readme = flat(read("README.md"));

  assert.match(
    rateLimit,
    /ORDER_RATE_LIMIT = \{ limit: 5, windowMs: 60 \* 60 \* 1000 \}/,
  );
  assert.match(readme, /5 order submissions per client within 1 hour/);
  assert.match(readme, /`RateLimit` table/);
});

test("path guard uses the convention the installed Next.js executes", () => {
  assert.ok(existsSync(path.join(root, "proxy.ts")), "proxy.ts is missing");
  assert.ok(
    !existsSync(path.join(root, "middleware.ts")),
    "middleware.ts is deprecated on Next 16 and must not exist next to proxy.ts",
  );

  const proxy = read("proxy.ts");

  assert.match(proxy, /export async function proxy\(/);
  assert.match(proxy, /matcher: \["\/admin\/:path\*", "\/auth\/login"\]/);
  // Both branches must be reachable, so both paths are in the matcher above.
  assert.match(proxy, /pathname\.startsWith\("\/admin"\)/);
  assert.match(proxy, /pathname\.startsWith\("\/auth\/login"\)/);
});

test("every administrative API route calls the shared guard", () => {
  const adminRoutes = routeFiles(path.join(root, "app", "api", "admin"));
  assert.ok(adminRoutes.length > 0, "no administrative route found");

  for (const file of adminRoutes) {
    assert.match(
      read(file),
      /adminGuardResponse\(|requireAdmin\(/,
      `${file} does not call the administrative guard`,
    );
  }
});

test("administrative server actions call the shared guard", () => {
  for (const file of ["app/admin/orders/action.ts", "actions/orderActions.ts"]) {
    assert.match(
      read(file),
      /adminGuardResult\(/,
      `${file} does not call the administrative guard`,
    );
  }
});
