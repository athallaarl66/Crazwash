"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string; // ← TAMBAH untuk info tambahan
  growth?: number;
  icon: ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}

export default function StatCard({
  title,
  value,
  subtitle,
  growth,
  icon,
  variant = "default",
}: Props) {
  const iconColors = {
    default: "text-gray-600",
    success: "text-green-600",
    warning: "text-orange-600",
    info: "text-blue-600",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-gray-600">{title}</CardTitle>
        <div className={iconColors[variant]}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        {/* Subtitle - Info tambahan */}
        {subtitle && (
          <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
        )}

        {/* Growth indicator */}
        {growth !== undefined && (
          <div className="flex items-center gap-1 text-sm mt-2">
            {growth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={growth >= 0 ? "text-green-600" : "text-red-600"}>
              {Math.abs(growth).toFixed(1)}% vs periode sebelumnya
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
