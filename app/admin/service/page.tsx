// app/admin/service/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, RefreshCw, Search, AlertCircle } from "lucide-react";
import ProductsTable from "./ProductsTable";
import { ProductCategory } from "@prisma/client";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category: ProductCategory;
  duration: number;
  isActive: boolean;
  createdAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/products");

      // ✅ CHECK 1: Response status
      if (response.status === 401) {
        setError("Session expired. Redirecting to login...");
        setTimeout(() => router.push("/api/auth/login"), 2000);
        return;
      }

      // ✅ CHECK 2: Content type
      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        console.error("❌ Response is HTML, not JSON");
        console.error("Status:", response.status);
        console.error("URL:", response.url);

        const text = await response.text();
        console.error("Response preview:", text.substring(0, 500));

        throw new Error(
          "Server returned HTML instead of JSON. " +
            "This usually means authentication failed or wrong API endpoint.",
        );
      }

      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
        setFilteredProducts(result.data);
      } else {
        setError(result.error || "Failed to fetch products");
      }
    } catch (err: any) {
      console.error("❌ Fetch products error:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = search.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.length - activeCount;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Layanan</h1>
          <p className="text-gray-600">
            Kelola layanan cuci sepatu yang tersedia
          </p>
        </div>
        <Button onClick={() => router.push("/admin/service/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Layanan
        </Button>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-800">Error Loading Data</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchProducts}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Retry
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/api/auth/login")}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-sm text-gray-500">Total Layanan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {activeCount}
            </div>
            <p className="text-sm text-gray-500">Aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">
              {inactiveCount}
            </div>
            <p className="text-sm text-gray-500">Nonaktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={fetchProducts} disabled={loading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-500 ml-3">Memuat data...</p>
        </div>
      ) : (
        <ProductsTable products={filteredProducts} onRefresh={fetchProducts} />
      )}
    </div>
  );
}
