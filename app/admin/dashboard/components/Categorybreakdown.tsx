"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package } from "lucide-react";

interface Props {
  data: {
    category: string;
    revenue: number;
    orderCount: number;
  }[];
  formatCurrency: (v: number) => string;
}

// Category labels in Indonesian
const CATEGORY_LABELS: Record<string, string> = {
  BASIC: "Basic Cleaning",
  PREMIUM: "Premium Cleaning",
  DEEP: "Deep Cleaning",
  TREATMENT: "Treatment Khusus",
};

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  BASIC: "bg-blue-500",
  PREMIUM: "bg-purple-500",
  DEEP: "bg-green-500",
  TREATMENT: "bg-orange-500",
};

export default function CategoryBreakdown({ data, formatCurrency }: Props) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Breakdown per Kategori
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Belum ada data</p>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Breakdown per Kategori
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => {
          const percentage =
            totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0;

          const label = CATEGORY_LABELS[item.category] || item.category;
          const color = CATEGORY_COLORS[item.category] || "bg-gray-500";

          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {formatCurrency(item.revenue)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.orderCount} order
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="text-xs text-gray-500 text-right">
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
