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
  const [selected, setSelected] = useState<number[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products");
      if (res.status === 401) {
        setError("Session expired");
        setTimeout(() => router.push("/api/auth/login"), 2000);
        return;
      }
      if (!res.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Server error");
      }
      const result = await res.json();
      if (result.success) {
        setProducts(result.data);
        setFilteredProducts(result.data);
      } else {
        setError(result.error || "Gagal fetch");
      }
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    <div className="container-custom py-8 space-y-6">
      {" "}
      {/* Pakai container-custom */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 text-primary">Layanan</h1>{" "}
          {/* Pakai text-h2, text-primary */}
          <p className="text-muted-foreground">
            Kelola layanan cuci sepatu
          </p>{" "}
          {/* Pakai text-muted-foreground */}
        </div>
        <Button onClick={() => router.push("/admin/service/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Layanan
        </Button>
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          {" "}
          {/* Pakai bg-destructive/10 */}
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-destructive">Error</p>
              <p className="text-body-sm text-muted-foreground mt-1">{error}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={fetchProducts}>
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-custom">
          {" "}
          {/* Pakai card-custom */}
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {products.length}
            </div>
            <p className="text-body-sm text-muted-foreground">Total Layanan</p>
          </CardContent>
        </Card>
        <Card className="card-custom">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{activeCount}</div>
            <p className="text-body-sm text-muted-foreground">Aktif</p>
          </CardContent>
        </Card>
        <Card className="card-custom">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-muted-foreground">
              {inactiveCount}
            </div>
            <p className="text-body-sm text-muted-foreground">Nonaktif</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground ml-3">Loading...</p>
        </div>
      ) : (
        <ProductsTable
          products={filteredProducts}
          onRefresh={fetchProducts}
          selected={selected}
          setSelected={setSelected}
        />
      )}
    </div>
  );
}
