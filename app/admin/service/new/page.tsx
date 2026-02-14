// app/admin/service/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ProductCategory, CATEGORY_OPTIONS } from "@/lib/constants";
import {
  AlertCircle,
  Save,
  X,
  Loader2,
  Package,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function CreateServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as ProductCategory,
      duration: formData.get("duration") as string,
      isActive: formData.get("isActive") === "on",
    };

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // ✅ CHECK: Auth error
      if (response.status === 401) {
        setError("Session expired. Redirecting to login...");
        setTimeout(() => router.push("/api/auth/login"), 2000);
        return;
      }

      // ✅ CHECK: Content type
      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("❌ API returned HTML:", text.substring(0, 500));
        throw new Error(
          "Server returned HTML instead of JSON. Check authentication.",
        );
      }

      const result = await response.json();

      if (result.success) {
        setSuccess("Layanan berhasil dibuat!");
        setTimeout(() => {
          router.push("/admin/service");
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || "Gagal membuat layanan");
      }
    } catch (err: any) {
      console.error("❌ Create service error:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* HEADER */}
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
          <span className="font-medium text-gray-900">Buat Layanan Baru</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Buat Layanan Baru
            </h1>
            <p className="text-gray-600 mt-1">
              Tambahkan layanan cuci sepatu baru ke katalog
            </p>
          </div>
          <Link href="/admin/service">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-4xl mx-auto">
        <Card className="border shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Package className="h-7 w-7 text-blue-600" />
              Form Layanan Baru
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-8">
            {/* ALERTS */}
            {error && (
              <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="p-4 mb-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <AlertCircle className="h-4 w-4" />
                  <p>{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* BASIC INFORMATION */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-blue-500 pl-3">
                  Informasi Dasar
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NAME */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="name"
                      className="font-semibold flex items-center gap-2"
                    >
                      <span>Nama Layanan</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Contoh: Deep Clean"
                      className="h-12"
                    />
                    <p className="text-sm text-gray-500">
                      Sesuai dengan katalog (Deep Clean, Leather, Suede, dll)
                    </p>
                  </div>

                  {/* CATEGORY */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="category"
                      className="font-semibold flex items-center gap-2"
                    >
                      <span>Kategori</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select name="category" required>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="py-3"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {option.label}
                              </span>
                              <span className="text-xs text-gray-500">
                                {option.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      BASIC, PREMIUM, DEEP, atau TREATMENT
                    </p>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="font-semibold">
                    Deskripsi Layanan
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Jelaskan detail layanan, manfaat, dan proses pengerjaan..."
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-500">
                    Deskripsi akan ditampilkan ke pelanggan
                  </p>
                </div>
              </div>

              {/* PRICING & DURATION */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-blue-500 pl-3">
                  Harga & Durasi
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PRICE */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="price"
                      className="font-semibold flex items-center gap-2"
                    >
                      <span>Harga (Rp)</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Rp
                      </span>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="1000"
                        step="1000"
                        required
                        className="h-12 pl-12"
                        placeholder="50000"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Sesuai katalog: Deep Clean = 50K, Leather = 60K, dll
                    </p>
                  </div>

                  {/* DURATION */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="duration"
                      className="font-semibold flex items-center gap-2"
                    >
                      <span>Durasi Pengerjaan (hari)</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      max="30"
                      required
                      className="h-12"
                      placeholder="3"
                    />
                    <p className="text-sm text-gray-500">
                      Estimasi waktu pengerjaan (1-30 hari)
                    </p>
                  </div>
                </div>
              </div>

              {/* STATUS */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-blue-500 pl-3">
                  Status & Visibilitas
                </h3>

                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border">
                  <div className="space-y-1">
                    <Label htmlFor="isActive" className="font-semibold text-lg">
                      Aktifkan Layanan
                    </Label>
                    <p className="text-gray-600">
                      Tampilkan layanan ini ke pelanggan
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    name="isActive"
                    defaultChecked
                    className="scale-125"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/service")}
                  disabled={loading}
                  className="flex-1 h-12 gap-2"
                >
                  <X className="h-4 w-4" />
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Membuat...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Buat Layanan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
