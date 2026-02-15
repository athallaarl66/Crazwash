// app/admin/dashboard/components/CategoryBreakdown.tsx
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
  loading?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  BASIC: "Basic Cleaning",
  PREMIUM: "Premium Cleaning",
  DEEP: "Deep Cleaning",
  TREATMENT: "Treatment Khusus",
};

const CATEGORY_COLORS: Record<string, string> = {
  BASIC: "bg-chart-1",
  PREMIUM: "bg-chart-2",
  DEEP: "bg-chart-3",
  TREATMENT: "bg-chart-4",
};

export default function CategoryBreakdown({
  data,
  formatCurrency,
  loading = false,
}: Props) {
  if (loading) {
    return (
      <Card className="card-custom">
        {" "}
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-primary">
            {" "}
            <BarChart3 className="h-5 w-5" />
            Breakdown per Kategori
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>{" "}
                <div className="h-2 bg-muted rounded"></div>
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
            <BarChart3 className="h-5 w-5" />
            Breakdown per Kategori
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8 text-body">
            Belum ada data
          </p>{" "}
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card className="card-custom">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-h4 text-primary">
          <BarChart3 className="h-5 w-5" />
          Breakdown per Kategori
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => {
          const percentage =
            totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0;

          const label = CATEGORY_LABELS[item.category] || item.category;
          const color = CATEGORY_COLORS[item.category] || "bg-muted";

          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />{" "}
                  <span className="font-medium text-body">{label}</span>{" "}
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">
                    {" "}
                    {formatCurrency(item.revenue)}
                  </div>
                  <div className="text-caption text-muted-foreground">
                    {" "}
                    {item.orderCount} order
                  </div>
                </div>
              </div>

              <div className="h-3 bg-muted rounded-full overflow-hidden min-w-0">
                {" "}
                <div
                  className={`h-full ${color} transition-all duration-300`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <div className="text-caption text-muted-foreground text-right">
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
