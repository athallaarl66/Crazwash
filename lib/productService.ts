// lib/productService.ts
import { prisma } from "./prisma";
import { Product } from "@prisma/client";

export type SerializedProduct = Omit<Product, "price"> & {
  price: number;
};

export async function getAllProducts(): Promise<SerializedProduct[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));
}

export async function getProductById(
  id: number
): Promise<SerializedProduct | null> {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
  };
}
