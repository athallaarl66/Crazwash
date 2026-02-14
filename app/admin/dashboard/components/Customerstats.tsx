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
}

export default function CustomerStats({ data }: Props) {
  const stats = [
    {
      icon: <Users className="h-5 w-5 text-gray-600" />,
      label: "Total Pelanggan",
      value: data.total,
      color: "bg-gray-50",
    },
    {
      icon: <UserPlus className="h-5 w-5 text-blue-600" />,
      label: "Pelanggan Baru",
      value: data.new,
      subtitle: "First order",
      color: "bg-blue-50",
    },
    {
      icon: <UserCheck className="h-5 w-5 text-green-600" />,
      label: "Pelanggan Returning",
      value: data.returning,
      subtitle: "Repeat order",
      color: "bg-green-50",
    },
    {
      icon: <Activity className="h-5 w-5 text-purple-600" />,
      label: "Sedang Aktif",
      value: data.active,
      subtitle: "Ada order aktif",
      color: "bg-purple-50",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Statistik Pelanggan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg ${stat.color}`}
          >
            <div className="flex items-center gap-3">
              <div>{stat.icon}</div>
              <div>
                <div className="font-medium text-gray-700">{stat.label}</div>
                {stat.subtitle && (
                  <div className="text-xs text-gray-500">{stat.subtitle}</div>
                )}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
