// app/(public)/order/page.tsx
import { prisma } from "@/lib/prisma";
import OrderForm from "./components/OrderForm"; // ← Default import (no curly braces)

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
    },
  });

  return products.map((p) => ({
    ...p,
    price: parseFloat(p.price.toString()),
  }));
}

export default async function OrderPage() {
  const products = await getActiveProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Buat Pesanan</h1>
          <p className="text-gray-600">
            Isi formulir di bawah untuk memesan layanan cuci sepatu
          </p>
        </div>

        <OrderForm products={products} />
      </div>
    </div>
  );
}
