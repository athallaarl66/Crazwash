// app/admin/service/[id]/page.tsx
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
    <div className="min-h-screen bg-background p-4 md:p-6">
      {" "}
      {/* Pakai bg-background */}
      {/* HEADER WITH BREADCRUMB */}
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
          <span className="font-medium text-foreground">{product.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-h2 text-primary">{product.name}</h1>{" "}
            {/* Pakai text-h2, text-primary */}
            <p className="text-muted-foreground mt-1">
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
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                {" "}
                {/* Pakai bg-primary */}
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
          <Card className="card-custom">
            {" "}
            {/* Pakai card-custom */}
            <CardHeader className="bg-muted pb-4 border-b border-border">
              {" "}
              {/* Pakai bg-muted, border-border */}
              <CardTitle className="flex items-center gap-3 text-h4">
                {" "}
                {/* Pakai text-h4 */}
                <Package className="h-6 w-6 text-primary" />
                Informasi Layanan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NAME & CATEGORY */}
                <div className="space-y-6">
                  <div>
                    <label className="text-caption font-semibold text-muted-foreground uppercase tracking-wide">
                      {" "}
                      {/* Pakai text-caption, text-muted-foreground */}
                      Nama Layanan
                    </label>
                    <p className="text-h5 text-foreground mt-1">
                      {" "}
                      {/* Pakai text-h5, text-foreground */}
                      {product.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-caption font-semibold text-muted-foreground uppercase tracking-wide">
                      Kategori
                    </label>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className="px-4 py-2 text-body border-border bg-muted text-foreground" // Pakai text-body, border-border, bg-muted, text-foreground
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
                    <label className="text-caption font-semibold text-muted-foreground uppercase tracking-wide">
                      Harga
                    </label>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">
                        {" "}
                        {/* Mobile-first: text-2xl sm:text-3xl */}
                        {formatCurrency(Number(product.price))}
                      </span>
                      <span className="text-muted-foreground">/ sepatu</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-caption font-semibold text-muted-foreground uppercase tracking-wide">
                      Durasi Pengerjaan
                    </label>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        {" "}
                        {/* Pakai bg-muted */}
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-foreground">
                          {" "}
                          {/* Mobile-first */}
                          {product.duration} jam
                        </p>
                        <p className="text-body-sm text-muted-foreground">
                          Estimasi waktu
                        </p>{" "}
                        {/* Pakai text-body-sm */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* DESCRIPTION */}
              <div>
                <label className="text-caption font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
                  Deskripsi Layanan
                </label>
                <div className="bg-muted rounded-xl p-6 border border-border">
                  {" "}
                  {/* Pakai bg-muted, border-border */}
                  {product.description ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-body text-foreground leading-relaxed whitespace-pre-line">
                        {" "}
                        {/* Pakai text-body, text-foreground */}
                        {product.description}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        {" "}
                        {/* Pakai bg-muted */}
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">
                        Belum ada deskripsi
                      </p>
                      <p className="text-body-sm text-muted-foreground mt-1">
                        {" "}
                        {/* Pakai text-body-sm */}
                        Tambahkan deskripsi untuk layanan ini
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* METADATA CARD */}
          <Card className="card-custom">
            <CardHeader className="pb-3">
              <CardTitle className="text-h5 flex items-center gap-2">
                {" "}
                {/* Pakai text-h5 */}
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  {" "}
                  {/* Pakai bg-muted */}
                  <p className="text-body-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {product.isActive ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="font-semibold text-success">
                          Aktif
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-destructive" />
                        <span className="font-semibold text-destructive">
                          Nonaktif
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-caption text-muted-foreground mt-1">
                    {" "}
                    {/* Pakai text-caption */}
                    {product.isActive
                      ? "Ditampilkan ke pelanggan"
                      : "Tidak ditampilkan"}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <p className="text-body-sm font-medium text-muted-foreground">
                    Dibuat
                  </p>
                  <p className="font-semibold text-foreground mt-2">
                    {new Date(product.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-caption text-muted-foreground mt-1">
                    {new Date(product.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <p className="text-body-sm font-medium text-muted-foreground">
                    Terakhir Update
                  </p>
                  <p className="font-semibold text-foreground mt-2">
                    {new Date(product.updatedAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-caption text-muted-foreground mt-1">
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
          <Card className="card-custom">
            <CardHeader>
              <CardTitle className="text-h5">Aksi Cepat</CardTitle>
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
                    <p className="text-caption text-muted-foreground">
                      {" "}
                      {/* Pakai text-caption */}
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
                  <p className="text-caption text-muted-foreground">
                    Buat versi baru
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:bg-destructive/10" // Pakai text-destructive
              >
                <XCircle className="h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Nonaktifkan</p>
                  <p className="text-caption text-muted-foreground">
                    Sembunyikan dari pelanggan
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* STATUS OVERVIEW CARD */}
          <Card
            className={`card-custom ${product.isActive ? "border-success/20" : "border-muted"}`} // Pakai border-success/20, border-muted
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${product.isActive ? "bg-success/10" : "bg-muted"}`} // Pakai bg-success/10, bg-muted
                >
                  {product.isActive ? (
                    <CheckCircle className="h-6 w-6 text-success" />
                  ) : (
                    <XCircle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-h5">
                    {product.isActive ? "Layanan Aktif" : "Layanan Nonaktif"}
                  </h3>
                  <p className="text-muted-foreground mt-1">
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
          <Card className="card-custom bg-muted/50">
            {" "}
            {/* Pakai card-custom, bg-muted/50 */}
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-body-sm font-medium text-muted-foreground uppercase tracking-wide">
                  ID Layanan
                </p>
                <div className="mt-3">
                  <div className="inline-block bg-foreground text-background px-4 py-3 rounded-lg">
                    {" "}
                    {/* Pakai bg-foreground, text-background */}
                    <code className="text-h5 font-mono font-bold">
                      #{product.id}
                    </code>
                  </div>
                </div>
                <p className="text-caption text-muted-foreground mt-3">
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
