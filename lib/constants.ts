// src/lib/constants.ts

// Order Status
export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PICKED_UP: "PICKED_UP",
  IN_PROGRESS: "IN_PROGRESS",
  READY: "READY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const ORDER_STATUS_LABELS = {
  PENDING: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  PICKED_UP: "Sudah Diambil",
  IN_PROGRESS: "Sedang Dikerjakan",
  READY: "Siap Diambil",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const ORDER_STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PICKED_UP: "bg-purple-100 text-purple-800",
  IN_PROGRESS: "bg-orange-100 text-orange-800",
  READY: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

// Payment Status
export const PAYMENT_STATUS = {
  UNPAID: "UNPAID",
  PAID: "PAID",
  REFUNDED: "REFUNDED",
} as const;

export const PAYMENT_STATUS_LABELS = {
  UNPAID: "Belum Dibayar",
  PAID: "Sudah Dibayar",
  REFUNDED: "Dikembalikan",
};

// Product Categories
export const CATEGORIES = {
  BASIC: "BASIC",
  PREMIUM: "PREMIUM",
  DEEP: "DEEP",
  TREATMENT: "TREATMENT",
} as const;

export const CATEGORY_LABELS = {
  BASIC: "Basic Wash",
  PREMIUM: "Premium Clean",
  DEEP: "Deep Cleaning",
  TREATMENT: "Treatment Khusus",
};

export const CATEGORY_DESCRIPTIONS = {
  BASIC: "Cuci standar untuk sepatu harian",
  PREMIUM: "Cuci mendalam dengan poles",
  DEEP: "Deep cleaning untuk sepatu kotor berat",
  TREATMENT: "Treatment khusus (suede, leather, canvas)",
};

// User Roles
export const USER_ROLES = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
} as const;
