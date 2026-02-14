// types/product.ts

// Database Product type (from Prisma)
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string; // Serialized from Decimal
  category: "BASIC" | "PREMIUM" | "DEEP" | "TREATMENT";
  stock: number;
  duration: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Public-facing Product (for customers)
export interface PublicProduct {
  id: number;
  name: string;
  description: string | null;
  price: string; // Serialized from Decimal
  category: "BASIC" | "PREMIUM" | "DEEP" | "TREATMENT";
  duration: number;
}

// Product for order form (with numeric price)
export interface OrderProduct {
  id: number;
  name: string;
  description: string | null;
  price: number; // Converted to number for calculations
  category: string;
}

// Category display names
export const CATEGORY_LABELS: Record<string, string> = {
  BASIC: "Basic Wash",
  PREMIUM: "Premium Clean",
  DEEP: "Deep Cleaning",
  TREATMENT: "Treatment Khusus",
};

// Category colors for badges
export const CATEGORY_COLORS: Record<string, string> = {
  BASIC: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  PREMIUM: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  DEEP: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  TREATMENT: "bg-green-100 text-green-800 hover:bg-green-100",
};

// Helper to convert string price to number
export function parsePrice(price: string): number {
  return parseFloat(price);
}

// Helper to format price for display
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `Rp ${numPrice.toLocaleString("id-ID")}`;
}
