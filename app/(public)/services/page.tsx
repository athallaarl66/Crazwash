// app/(public)/services/page.tsx
import { prisma } from "@/lib/prisma";
import ServicesView from "./ServicesView";

async function getActiveProducts() {
  const products = await prisma.product.findMany({
    where: {
      deletedAt: null,
      isActive: true,
    },
    orderBy: { category: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      category: true,
      duration: true,
    },
  });

  // Serialize Decimal to string
  return products.map((p) => ({
    ...p,
    price: p.price.toString(),
  }));
}

export default async function ServicesPage() {
  const products = await getActiveProducts();

  return <ServicesView products={products} />;
}
