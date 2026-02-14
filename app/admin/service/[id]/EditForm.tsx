// app/admin/service/[id]/EditForm.tsx - REDESIGNED
"use client";

import { useState, useEffect } from "react";
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
  Clock,
  Tag,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category: ProductCategory;
  duration: number;
  isActive: boolean;
}

interface EditFormProps {
  productId: string;
  initialData?: Product;
}

export default function EditForm({ productId, initialData }: EditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [product, setProduct] = useState<Product | null>(initialData || null);

  useEffect(() => {
    if (!initialData) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/service/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();
      if (result.success) setProduct(result.data);
      else setError(result.error || "Gagal memuat data");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

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
      duration: parseInt(formData.get("duration") as string),
      isActive: formData.get("isActive") === "on",
    };

    try {
      const response = await fetch(`/api/admin/service/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error ${response.status}`);
      }

      if (result.success) {
        setSuccess("Layanan berhasil diperbarui!");
        setTimeout(() => {
          router.push("/admin/service");
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || "Gagal memperbarui layanan");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Memuat data layanan...</p>
      </div>
    );
  }

  return (
    <Card className="border shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Package className="h-7 w-7 text-blue-600" />
          Edit Layanan: <span className="text-blue-700">{product.name}</span>
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
          {/* BASIC INFORMATION SECTION */}
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
                  defaultValue={product.name}
                  required
                  placeholder="Contoh: Premium Clean"
                  className="h-12"
                />
                <p className="text-sm text-gray-500">
                  Nama layanan yang akan ditampilkan
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
                <Select
                  name="category"
                  defaultValue={product.category}
                  required
                >
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
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-gray-500">
                            {option.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                defaultValue={product.description || ""}
                rows={4}
                placeholder="Jelaskan detail layanan, manfaat, dan proses pengerjaan..."
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                Deskripsi akan ditampilkan ke pelanggan
              </p>
            </div>
          </div>

          {/* PRICING & DURATION SECTION */}
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
                  <span>Harga per Sepatu (Rp)</span>
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
                    defaultValue={product.price}
                    min="1000"
                    step="1000"
                    required
                    className="h-12 pl-12"
                    placeholder="45000"
                  />
                </div>
                <p className="text-sm text-gray-500">Minimal Rp 1.000</p>
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
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    defaultValue={product.duration}
                    min="1"
                    max="168"
                    required
                    className="h-12 pl-11"
                    placeholder="24"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Estimasi waktu dalam jam (1-168)
                </p>
              </div>
            </div>
          </div>

          {/* STATUS SECTION */}
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
                defaultChecked={product.isActive}
                className="scale-125"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/admin/service/${productId}`)}
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
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
