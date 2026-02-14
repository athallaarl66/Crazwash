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
}

export default function RevenueBreakdown({ data, formatCurrency }: Props) {
  const statusConfig: Record<
    string,
    { label: string; icon: React.ReactElement; color: string; bgColor: string }
  > = {
    PAID: {
      label: "Sudah Dibayar",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-500",
    },
    UNPAID: {
      label: "Belum Dibayar",
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-500",
    },
    REFUNDED: {
      label: "Refund",
      icon: <RotateCcw className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-500",
    },
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Status Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Belum ada data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Status Pembayaran
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => {
          const config = statusConfig[item.status] || {
            label: item.status,
            icon: <CreditCard className="h-5 w-5" />,
            color: "text-gray-600",
            bgColor: "bg-gray-500",
          };

          const percentage =
            totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;

          return (
            <div key={item.status} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={config.color}>{config.icon}</div>
                  <span className="font-medium">{config.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(item.amount)}</div>
                  <div className="text-xs text-gray-500">
                    {item.count} order
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${config.bgColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="text-xs text-gray-500 text-right">
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div className="pt-3 border-t mt-4">
          <div className="flex items-center justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
