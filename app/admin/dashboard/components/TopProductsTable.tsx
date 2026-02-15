// app/admin/dashboard/components/TopProductsTable.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, ShoppingBag } from "lucide-react";

interface Props {
  data: {
    name: string;
    category: string;
    orderCount: number;
    totalShoes: number;
    revenue: number;
  }[];
  loading?: boolean;
}

export default function TopProducts({ data, loading = false }: Props) {
  if (loading) {
    return (
      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-primary">
            <TrendingUp className="h-5 w-5" />
            Layanan Terlaris
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse p-4 bg-muted rounded-lg">
                <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
                <div className="h-6 bg-muted-foreground/20 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-primary">
            <TrendingUp className="h-5 w-5" />
            Layanan Terlaris
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8 text-body">
            Belum ada data layanan
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-custom">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-h4 text-primary">
          <TrendingUp className="h-5 w-5" />
          Layanan Terlaris
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((product, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-start justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            {/* LEFT - Product Info */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-chart-1 text-primary font-bold text-body-sm">
                  {" "}
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-body">{product.name}</div>{" "}
                  <div className="text-caption text-muted-foreground uppercase">
                    {" "}
                    {product.category}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-body-sm text-muted-foreground ml-10">
                {" "}
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4" />
                  <span>
                    <strong className="text-primary">
                      {product.orderCount}
                    </strong>{" "}
                    order
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Package className="h-4 w-4" />
                  <span>
                    <strong className="text-primary">
                      {product.totalShoes}
                    </strong>{" "}
                    sepatu
                  </span>
                </div>
              </div>

              {/* Average per shoe */}
              <div className="text-caption text-muted-foreground ml-10">
                Rata-rata: Rp{" "}
                {(product.revenue / product.totalShoes).toLocaleString(
                  "id-ID",
                  {
                    maximumFractionDigits: 0,
                  },
                )}{" "}
                / sepatu
              </div>
            </div>

            {/* RIGHT - Revenue */}
            <div className="text-right ml-4 mt-4 sm:mt-0">
              <div className="text-caption text-muted-foreground mb-1">
                Total Revenue
              </div>
              <div className="font-bold text-success text-xl sm:text-2xl">
                {" "}
                Rp {product.revenue.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
