// app/admin/dashboard/components/StatsCard.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
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
    default: "text-muted-foreground",
    success: "text-success",
    warning: "text-warning",
    info: "text-info",
  };

  return (
    <Card className="card-custom">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-body-sm text-muted-foreground">
          {title}
        </CardTitle>
        <div className={iconColors[variant]}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl sm:text-3xl font-bold text-primary">
          {value}
        </div>

        {subtitle && (
          <div className="text-caption text-muted-foreground mt-1">
            {subtitle}
          </div>
        )}

        {growth !== undefined && (
          <div className="flex items-center gap-1 text-body-sm mt-2">
            {growth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className={growth >= 0 ? "text-success" : "text-destructive"}>
              {Math.abs(growth).toFixed(1)}% vs periode sebelumnya
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
