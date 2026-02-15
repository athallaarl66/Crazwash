// app/admin/dashboard/components/Revenuebreakdown.tsx
"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle, Clock, RotateCcw } from "lucide-react";

interface Props {
  data: {
    status: string;
    amount: number;
    count: number;
  }[];
  formatCurrency: (v: number) => string;
  loading?: boolean;
}

export default function RevenueBreakdown({
  data,
  formatCurrency,
  loading = false,
}: Props) {
  const statusConfig: Record<
    string,
    { label: string; icon: React.ReactElement; color: string; bgColor: string }
  > = {
    PAID: {
      label: "Sudah Dibayar",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-success",
      bgColor: "bg-success",
    },
    UNPAID: {
      label: "Belum Dibayar",
      icon: <Clock className="h-5 w-5" />,
      color: "text-warning",
      bgColor: "bg-warning",
    },
    REFUNDED: {
      label: "Refund",
      icon: <RotateCcw className="h-5 w-5" />,
      color: "text-destructive",
      bgColor: "bg-destructive",
    },
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  if (loading) {
    return (
      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-primary">
            <CreditCard className="h-5 w-5" />
            Status Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
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
            <CreditCard className="h-5 w-5" />
            Status Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8 text-body">
            Belum ada data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-custom">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-h4 text-primary">
          <CreditCard className="h-5 w-5" />
          Status Pembayaran
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => {
          const config = statusConfig[item.status] || {
            label: item.status,
            icon: <CreditCard className="h-5 w-5" />,
            color: "text-muted-foreground",
            bgColor: "bg-muted",
          };

          const percentage =
            totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;

          return (
            <div key={item.status} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={config.color}>{config.icon}</div>
                  <span className="font-medium text-body">{config.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">
                    {formatCurrency(item.amount)}
                  </div>
                  <div className="text-caption text-muted-foreground">
                    {item.count} order
                  </div>
                </div>
              </div>

              {/* Progress Bar - Mobile-first */}
              <div className="h-3 bg-muted rounded-full overflow-hidden min-w-0">
                <div
                  className={`h-full ${config.bgColor} transition-all duration-300`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <div className="text-caption text-muted-foreground text-right">
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div className="pt-3 border-t mt-4 border-border">
          <div className="flex items-center justify-between font-bold text-h5 text-primary">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
