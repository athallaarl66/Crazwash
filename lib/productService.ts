// lib/productService.ts
import { prisma } from "./prisma";
import { Product, ProductCategory } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// ============================================
// TYPES
// ============================================

export interface ProductInput {
  name: string;
  description?: string | null;
  price: number | string | Decimal;
  category: ProductCategory;
  duration: number;
  isActive?: boolean;
}

export interface UpdateProductInput extends Partial<ProductInput> {
  id: number;
}

export type SerializedProduct = Omit<Product, "price"> & {
  price: string; // Decimal to string for JSON
};

// ============================================
// PUBLIC FUNCTIONS (for customers)
// ============================================

export async function getActiveProducts(): Promise<SerializedProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
    orderBy: { name: "asc" },
  });

  return products.map(serializeProduct);
}

export async function getProductById(
  id: number,
): Promise<SerializedProduct | null> {
  const product = await prisma.product.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });

  return product ? serializeProduct(product) : null;
}

// ============================================
// ADMIN FUNCTIONS (for admin panel)
// ============================================

export async function getAllProducts(): Promise<SerializedProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map(serializeProduct);
}

export async function createProduct(
  data: ProductInput,
): Promise<SerializedProduct> {
  // Validate required fields
  if (!data.name || !data.price || !data.category || !data.duration) {
    throw new Error(
      "Harap isi semua field yang wajib: nama, harga, kategori, durasi",
    );
  }

  // Validate category
  if (!Object.values(ProductCategory).includes(data.category)) {
    throw new Error(
      `Kategori tidak valid. Pilih: ${Object.values(ProductCategory).join(", ")}`,
    );
  }

  const product = await prisma.product.create({
    data: {
      name: data.name.trim(),
      slug: generateSlug(data.name), // ← TAMBAH INI
      description: data.description?.trim() || null,
      price: new Decimal(data.price),
      category: data.category,
      duration: Number(data.duration),
      isActive: data.isActive ?? true,
    },
  });

  return serializeProduct(product);
}

export async function updateProduct(
  data: UpdateProductInput,
): Promise<SerializedProduct> {
  const existing = await prisma.product.findFirst({
    where: { id: data.id, deletedAt: null },
  });

  if (!existing) {
    throw new Error("Product not found");
  }

  const updateData: any = {};

  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.description !== undefined)
    updateData.description = data.description?.trim() || null;
  if (data.price !== undefined) updateData.price = new Decimal(data.price);
  if (data.category !== undefined) updateData.category = data.category;
  if (data.duration !== undefined) updateData.duration = Number(data.duration);
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const product = await prisma.product.update({
    where: { id: data.id },
    data: updateData,
  });

  return serializeProduct(product);
}

export async function softDeleteProduct(id: number): Promise<void> {
  const existing = await prisma.product.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new Error("Product not found");
  }

  await prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });
}

export async function toggleProductStatus(
  id: number,
): Promise<SerializedProduct> {
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  });

  return serializeProduct(updated);
}

// ============================================
// UTILITIES
// ============================================

function serializeProduct(product: Product): SerializedProduct {
  return {
    ...product,
    price: product.price.toString(),
  };
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

// Statistics
export async function getProductStats() {
  const [total, active, inactive] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null, isActive: true } }),
    prisma.product.count({ where: { deletedAt: null, isActive: false } }),
  ]);

  return { total, active, inactive };
}
