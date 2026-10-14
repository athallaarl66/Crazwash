import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency to IDR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format date to Indonesian format
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// Generate order number: ORD-20250104-3f9a1c07. The suffix uses the platform random
// source rather than Math.random(), and the unique index on `orderNumber` stays the
// arbiter: `createOrder` retries when the index reports a collision.
export function generateOrderNumber(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const suffix = globalThis.crypto
    .getRandomValues(new Uint32Array(1))[0]
    .toString(16)
    .padStart(8, "0");

  return `ORD-${date}-${suffix}`;
}

// Truncate text with ellipsis
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// A console navigation item stays active on its own nested routes, so a detail page
// (/admin/orders/12) highlights the same item as its list page (/admin/orders).
export function isActiveNavItem(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Checkout shows a fixed +62 prefix, so only the local part is stored. A pasted
// number that already carries the country code or a leading zero is normalised
// instead of being kept as typed, which would store "+620812...".
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  return digits.replace(/^62/, "").replace(/^0+/, "");
}
