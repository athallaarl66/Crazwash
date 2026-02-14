"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, ShoppingBag } from "lucide-react";

export default function TopProducts({
  data,
}: {
  data: {
    name: string;
    category: string;
    orderCount: number;
    totalShoes: number;
    revenue: number;
  }[];
}) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Layanan Terlaris</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Belum ada data layanan
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Layanan Terlaris
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((product, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            {/* LEFT - Product Info */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-semibold text-lg">{product.name}</div>
                  <div className="text-sm text-gray-500 uppercase">
                    {product.category}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 ml-10">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4" />
                  <span>
                    <strong>{product.orderCount}</strong> order
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Package className="h-4 w-4" />
                  <span>
                    <strong>{product.totalShoes}</strong> sepatu
                  </span>
                </div>
              </div>

              {/* Average per shoe */}
              <div className="text-xs text-gray-500 ml-10">
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
            <div className="text-right ml-4">
              <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
              <div className="font-bold text-green-600 text-xl">
                Rp {product.revenue.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
