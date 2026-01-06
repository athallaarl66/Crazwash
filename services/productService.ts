// src/services/productService.ts
import { prisma } from "@/lib/prisma";

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: number) {
  try {
    return await prisma.product.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  category: "BASIC" | "PREMIUM" | "DEEP" | "TREATMENT";
  duration: number;
}) {
  try {
    return await prisma.product.create({
      data,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}
