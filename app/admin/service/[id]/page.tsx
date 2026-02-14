// app/admin/service/[id]/page.tsx - REDESIGNED VERSION
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  Package,
  Clock,
  Tag,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* HEADER WITH BREADCRUMB */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/admin" className="hover:text-gray-700">
            Admin
          </Link>
          <span>/</span>
          <Link href="/admin/service" className="hover:text-gray-700">
            Layanan
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-900">{product.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-1">
              ID: #{product.id} • Detail layanan lengkap
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/service">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
            </Link>
            <Link href={`/admin/service/${product.id}/edit`}>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4" />
                Edit Layanan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - PRODUCT DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          {/* PRODUCT INFORMATION CARD */}
          <Card className="border shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-4 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Package className="h-6 w-6 text-blue-600" />
                Informasi Layanan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NAME & CATEGORY */}
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Nama Layanan
                    </label>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {product.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Kategori
                    </label>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className="px-4 py-2 text-base border-blue-200 bg-blue-50 text-blue-700"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        {CATEGORY_LABELS[product.category]}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* PRICE & DURATION */}
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Harga
                    </label>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatCurrency(Number(product.price))}
                      </span>
                      <span className="text-gray-500">/ sepatu</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Durasi Pengerjaan
                    </label>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {product.duration} jam
                        </p>
                        <p className="text-sm text-gray-500">Estimasi waktu</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* DESCRIPTION */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                  Deskripsi Layanan
                </label>
                <div className="bg-gray-50 rounded-xl p-6 border">
                  {product.description ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {product.description}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-400 font-medium">
                        Belum ada deskripsi
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Tambahkan deskripsi untuk layanan ini
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* METADATA CARD */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="flex items-center gap-2 mt-2">
                    {product.isActive ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-green-700">
                          Aktif
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="font-semibold text-red-700">
                          Nonaktif
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {product.isActive
                      ? "Ditampilkan ke pelanggan"
                      : "Tidak ditampilkan"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500">Dibuat</p>
                  <p className="font-semibold text-gray-900 mt-2">
                    {new Date(product.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(product.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500">
                    Terakhir Update
                  </p>
                  <p className="font-semibold text-gray-900 mt-2">
                    {new Date(product.updatedAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(product.updatedAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - ACTIONS & STATS */}
        <div className="space-y-6">
          {/* QUICK ACTIONS CARD */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href={`/admin/service/${product.id}/edit`}
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                >
                  <Edit className="h-4 w-4" />
                  <div className="text-left">
                    <p className="font-medium">Edit Layanan</p>
                    <p className="text-xs text-gray-500">
                      Ubah informasi layanan
                    </p>
                  </div>
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Package className="h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Duplikat Layanan</p>
                  <p className="text-xs text-gray-500">Buat versi baru</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Nonaktifkan</p>
                  <p className="text-xs text-gray-500">
                    Sembunyikan dari pelanggan
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* STATUS OVERVIEW CARD */}
          <Card
            className={`border ${product.isActive ? "border-green-200" : "border-gray-200"} shadow-sm`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${product.isActive ? "bg-green-100" : "bg-gray-100"}`}
                >
                  {product.isActive ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {product.isActive ? "Layanan Aktif" : "Layanan Nonaktif"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {product.isActive
                      ? "Layanan ini sedang ditampilkan dan dapat dipesan oleh pelanggan."
                      : "Layanan ini disembunyikan dan tidak dapat dipesan oleh pelanggan."}
                  </p>
                  <div className="mt-3">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "PUBLIK" : "PRIVATE"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PRODUCT ID CARD */}
          <Card className="border shadow-sm bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  ID Layanan
                </p>
                <div className="mt-3">
                  <div className="inline-block bg-gray-900 text-white px-4 py-3 rounded-lg">
                    <code className="text-xl font-mono font-bold">
                      #{product.id}
                    </code>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Gunakan ID ini untuk referensi internal
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
