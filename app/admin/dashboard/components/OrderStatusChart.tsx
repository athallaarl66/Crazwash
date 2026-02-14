"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Status colors matching OrderStatus enum
const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b", // Orange
  CONFIRMED: "#3b82f6", // Blue
  PICKED_UP: "#8b5cf6", // Purple
  IN_PROGRESS: "#eab308", // Yellow
  READY: "#06b6d4", // Cyan
  COMPLETED: "#16a34a", // Green
  CANCELLED: "#dc2626", // Red
};

// Status labels in Indonesian
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  PICKED_UP: "Dijemput",
  IN_PROGRESS: "Proses",
  READY: "Siap",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export default function OrderStatusChart({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  // Transform data with labels
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    status: item.status,
  }));

  // Custom label to show count
  const renderLabel = (entry: any) => {
    return `${entry.value}`;
  };

  // Custom legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.value}: <strong>{entry.payload.value}</strong>
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Belum ada pesanan</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Pesanan</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={renderLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.status] || "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [`${value} order`, name]}
            />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
