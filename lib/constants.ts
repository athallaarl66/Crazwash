// src/lib/constants.ts

import {
  ProductCategory,
  OrderStatus,
  PaymentStatus,
  Role,
} from "@prisma/client";

// Re-export Prisma enums
export { ProductCategory, OrderStatus, PaymentStatus, Role };

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.UNPAID]: "Belum Dibayar",
  [PaymentStatus.PAID]: "Lunas",
  [PaymentStatus.REFUNDED]: "Dikembalikan",
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.UNPAID]: "bg-red-100 text-red-800 border-red-200",
  [PaymentStatus.PAID]: "bg-green-100 text-green-800 border-green-200",
  [PaymentStatus.REFUNDED]: "bg-gray-100 text-gray-800 border-gray-200",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Menunggu",
  [OrderStatus.CONFIRMED]: "Dikonfirmasi",
  [OrderStatus.PICKED_UP]: "Sudah Diambil",
  [OrderStatus.IN_PROGRESS]: "Sedang Dikerjakan",
  [OrderStatus.READY]: "Siap Diambil",
  [OrderStatus.COMPLETED]: "Selesai",
  [OrderStatus.CANCELLED]: "Dibatalkan",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-800",
  [OrderStatus.PICKED_UP]: "bg-purple-100 text-purple-800",
  [OrderStatus.IN_PROGRESS]: "bg-orange-100 text-orange-800",
  [OrderStatus.READY]: "bg-green-100 text-green-800",
  [OrderStatus.COMPLETED]: "bg-gray-100 text-gray-800",
  [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.BASIC]: "Basic Wash",
  [ProductCategory.PREMIUM]: "Premium Clean",
  [ProductCategory.DEEP]: "Deep Cleaning",
  [ProductCategory.TREATMENT]: "Treatment Khusus",
};

export const CATEGORY_DESCRIPTIONS: Record<ProductCategory, string> = {
  [ProductCategory.BASIC]: "Cuci standar untuk sepatu harian",
  [ProductCategory.PREMIUM]: "Cuci mendalam dengan poles",
  [ProductCategory.DEEP]: "Deep cleaning untuk sepatu kotor berat",
  [ProductCategory.TREATMENT]: "Treatment khusus (suede, leather, canvas)",
};

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: "Admin",
  [Role.CUSTOMER]: "Customer",
};

// Helper arrays for dropdowns
export const CATEGORY_OPTIONS = Object.values(ProductCategory).map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
  description: CATEGORY_DESCRIPTIONS[value],
}));

export const ORDER_STATUS_OPTIONS = Object.values(OrderStatus).map((value) => ({
  value,
  label: ORDER_STATUS_LABELS[value],
}));

export const PAYMENT_STATUS_OPTIONS = Object.values(PaymentStatus).map(
  (value) => ({
    value,
    label: PAYMENT_STATUS_LABELS[value],
  }),
);
