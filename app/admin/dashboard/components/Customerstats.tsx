// app/admin/dashboard/components/Customerstats.tsx
"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, UserCheck, Activity } from "lucide-react";

interface Props {
  data: {
    total: number;
    new: number;
    returning: number;
    active: number;
  };
  loading?: boolean;
}

export default function CustomerStats({ data, loading = false }: Props) {
  const stats = [
    {
      icon: <Users className="h-5 w-5 text-muted-foreground" />,
      label: "Total Pelanggan",
      value: data.total,
      color: "bg-muted",
    },
    {
      icon: <UserPlus className="h-5 w-5 text-chart-1" />,
      label: "Pelanggan Baru",
      value: data.new,
      subtitle: "First order",
      color: "bg-chart-1/10",
    },
    {
      icon: <UserCheck className="h-5 w-5 text-chart-2" />,
      label: "Pelanggan Returning",
      value: data.returning,
      subtitle: "Repeat order",
      color: "bg-chart-2/10",
    },
    {
      icon: <Activity className="h-5 w-5 text-chart-3" />,
      label: "Sedang Aktif",
      value: data.active,
      subtitle: "Ada order aktif",
      color: "bg-chart-3/10",
    },
  ];

  if (loading) {
    return (
      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-primary">
            <Users className="h-5 w-5" />
            Statistik Pelanggan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse p-3 bg-muted rounded-lg">
                <div className="h-4 bg-muted-foreground/20 rounded mb-1"></div>
                <div className="h-6 bg-muted-foreground/20 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-custom">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-h4 text-primary">
          <Users className="h-5 w-5" />
          Statistik Pelanggan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 sm:p-4 rounded-lg ${stat.color} transition-colors`} // Mobile-first padding
          >
            <div className="flex items-center gap-3">
              <div>{stat.icon}</div>
              <div>
                <div className="font-medium text-body text-foreground">
                  {stat.label}
                </div>
                {stat.subtitle && (
                  <div className="text-caption text-muted-foreground">
                    {stat.subtitle}
                  </div>
                )}
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {stat.value}
            </div>{" "}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
