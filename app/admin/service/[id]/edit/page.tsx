// app/admin/service/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link"; // Tambah import Link
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

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
      deletedAt: null,
    },
  });

  if (!product) {
    notFound();
  }

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
    <div className="min-h-screen bg-background p-4 md:p-6">
      {" "}
      {/* Pakai bg-background */}
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-body-sm text-muted-foreground mb-4">
          {" "}
          {/* Pakai text-body-sm, text-muted-foreground */}
          <Link href="/admin" className="hover:text-foreground">
            Admin
          </Link>
          <span>/</span>
          <Link href="/admin/service" className="hover:text-foreground">
            Layanan
          </Link>
          <span>/</span>
          <Link
            href={`/admin/service/${product.id}`}
            className="hover:text-foreground"
          >
            {product.name}
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">Edit</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-h2 text-primary">
              {" "}
              {/* Pakai text-h2, text-primary */}
              Edit Layanan: <span className="text-primary">{product.name}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Perbarui informasi layanan cuci sepatu
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/admin/service/${product.id}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
            </Link>
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
