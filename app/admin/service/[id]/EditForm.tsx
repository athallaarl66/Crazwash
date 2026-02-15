// app/admin/service/[id]/EditForm.tsx
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
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Memuat data layanan...</p>
      </div>
    );
  }

  return (
    <Card className="card-custom">
      <CardHeader className="bg-muted border-b border-border">
        {" "}
        {/* Pakai bg-muted, border-border */}
        <CardTitle className="flex items-center gap-3 text-h4">
          {" "}
          {/* Pakai text-h4 */}
          <Package className="h-7 w-7 text-primary" />
          Edit Layanan: <span className="text-primary">{product.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-8">
        {/* ALERTS */}
        {error && (
          <div className="p-4 mb-6 bg-destructive/10 border border-destructive/20 rounded-lg">
            {" "}
            {/* Pakai bg-destructive/10 */}
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 bg-success/10 border border-success/20 rounded-lg">
            {" "}
            {/* Pakai bg-success/10 */}
            <div className="flex items-center gap-2 text-success">
              <AlertCircle className="h-4 w-4" />
              <p>{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC INFORMATION SECTION */}
          <div className="space-y-6">
            <h3 className="text-h5 text-foreground border-l-4 border-primary pl-3">
              {" "}
              {/* Pakai text-h5, text-foreground, border-primary */}
              Informasi Dasar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NAME */}
              <div className="space-y-3">
                <Label
                  htmlFor="name"
                  className="font-semibold flex items-center gap-2 text-foreground" // Pakai text-foreground
                >
                  <span>Nama Layanan</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={product.name}
                  required
                  placeholder="Contoh: Premium Clean"
                  className="h-12"
                />
                <p className="text-body-sm text-muted-foreground">
                  {" "}
                  {/* Pakai text-body-sm, text-muted-foreground */}
                  Nama layanan yang akan ditampilkan
                </p>
              </div>

              {/* CATEGORY */}
              <div className="space-y-3">
                <Label
                  htmlFor="category"
                  className="font-semibold flex items-center gap-2 text-foreground"
                >
                  <span>Kategori</span>
                  <span className="text-destructive">*</span>
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
                          <span className="text-caption text-muted-foreground">
                            {" "}
                            {/* Pakai text-caption */}
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
              <Label
                htmlFor="description"
                className="font-semibold text-foreground"
              >
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
              <p className="text-body-sm text-muted-foreground">
                Deskripsi akan ditampilkan ke pelanggan
              </p>
            </div>
          </div>

          {/* PRICING & DURATION SECTION */}
          <div className="space-y-6">
            <h3 className="text-h5 text-foreground border-l-4 border-primary pl-3">
              Harga & Durasi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PRICE */}
              <div className="space-y-3">
                <Label
                  htmlFor="price"
                  className="font-semibold flex items-center gap-2 text-foreground"
                >
                  <span>Harga per Sepatu (Rp)</span>
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
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
                <p className="text-body-sm text-muted-foreground">
                  Minimal Rp 1.000
                </p>
              </div>

              {/* DURATION */}
              <div className="space-y-3">
                <Label
                  htmlFor="duration"
                  className="font-semibold flex items-center gap-2 text-foreground"
                >
                  <span>Durasi Pengerjaan (hari)</span>
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                <p className="text-body-sm text-muted-foreground">
                  Estimasi waktu dalam jam (1-168)
                </p>
              </div>
            </div>
          </div>

          {/* STATUS SECTION */}
          <div className="space-y-6">
            <h3 className="text-h5 text-foreground border-l-4 border-primary pl-3">
              Status & Visibilitas
            </h3>

            <div className="flex items-center justify-between p-6 bg-muted rounded-xl border border-border">
              {" "}
              {/* Pakai bg-muted, border-border */}
              <div className="space-y-1">
                <Label
                  htmlFor="isActive"
                  className="font-semibold text-h5 text-foreground"
                >
                  {" "}
                  {/* Pakai text-h5 */}
                  Aktifkan Layanan
                </Label>
                <p className="text-muted-foreground">
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
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
            {" "}
            {/* Mobile-first, border-border */}
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
              className="flex-1 h-12 gap-2 bg-primary hover:bg-primary/90" // Pakai bg-primary
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
