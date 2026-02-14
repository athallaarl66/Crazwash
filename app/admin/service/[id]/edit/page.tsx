// app/admin/service/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // ← TAMBAH INI
import EditForm from "../EditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    notFound();
  }

  // Fetch langsung dari database (lebih cepat & reliable)
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
      deletedAt: null,
    },
  });

  if (!product) {
    notFound();
  }

  // Format data untuk EditForm
  const productData = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    duration: product.duration,
    isActive: product.isActive,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <a href="/admin" className="hover:text-gray-700">
            Admin
          </a>
          <span>/</span>
          <a href="/admin/service" className="hover:text-gray-700">
            Layanan
          </a>
          <span>/</span>
          <a
            href={`/admin/service/${product.id}`}
            className="hover:text-gray-700"
          >
            {product.name}
          </a>
          <span>/</span>
          <span className="font-medium text-gray-900">Edit</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Layanan:{" "}
              <span className="text-blue-600">{product.name}</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Perbarui informasi layanan cuci sepatu
            </p>
          </div>
          <div className="flex gap-3">
            <a href={`/admin/service/${product.id}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* EDIT FORM */}
      <div className="max-w-4xl mx-auto">
        <EditForm productId={id} initialData={productData} />
      </div>
    </div>
  );
}
