// app/(public)/order/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import OrderForm from "./components/OrderForm";
import { Package, Loader2 } from "lucide-react";

// ==================== METADATA ====================
export const metadata: Metadata = {
  title: "Pesan Layanan Cuci Sepatu | Crazwash",
  description:
    "Pesan layanan cuci sepatu profesional dari Crazwash. Pilih jenis treatment, isi data diri, dan dapatkan sepatu bersih seperti baru.",
  keywords: [
    "pesan cuci sepatu",
    "order cuci sepatu",
    "booking cuci sepatu",
    "layanan cuci sepatu Jakarta",
    "deep clean sepatu",
  ],
  openGraph: {
    title: "Pesan Layanan Cuci Sepatu | Crazwash",
    description: "Pesan layanan cuci sepatu profesional dengan mudah dan cepat",
    type: "website",
  },
};

// ==================== DATA FETCHING ====================
async function getActiveProducts() {
  try {
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
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

// ==================== LOADING COMPONENT ====================
function OrderFormSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3 text-center">
        <div className="h-10 bg-muted rounded-lg w-64 mx-auto" />
        <div className="h-5 bg-muted rounded w-96 mx-auto" />
      </div>

      {/* Progress Steps Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-2xl mx-auto gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted" />
              <div className="h-4 w-16 bg-muted rounded mt-2" />
            </div>
            {i < 4 && <div className="flex-1 h-1 mx-2 md:mx-4 bg-muted" />}
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-custom p-6 space-y-3">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="card-custom p-6 space-y-4">
            <div className="h-6 bg-muted rounded w-32" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== ERROR STATE ====================
function OrderErrorState() {
  return (
    <div className="container-custom py-8 md:py-12">
      <div className="max-w-md mx-auto text-center card-custom p-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <Package className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-h4 mb-2">Gagal Memuat Produk</h2>
        <p className="text-body text-muted-foreground mb-4">
          Terjadi kesalahan saat memuat daftar layanan. Silakan refresh halaman
          atau hubungi admin.
        </p>
        <a
          href="/order"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold
                   hover:opacity-90 transition-opacity"
        >
          Muat Ulang
        </a>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default async function OrderPage() {
  const products = await getActiveProducts();

  // Handle error state
  if (!products || products.length === 0) {
    return <OrderErrorState />;
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header dengan design tokens */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-h2 mb-3">Buat Pesanan</h1>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Pilih layanan yang Anda butuhkan, isi data diri, dan kami akan
            proses pesanan Anda dengan cepat dan profesional.
          </p>
        </div>

        {/* Order Form dengan Suspense */}
        <Suspense fallback={<OrderFormSkeleton />}>
          <OrderForm products={products} />
        </Suspense>
      </div>
    </div>
  );
}
