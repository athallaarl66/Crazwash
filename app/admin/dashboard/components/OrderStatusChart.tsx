// app/admin/dashboard/components/OrderStatusChart.tsx
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

const STATUS_COLORS: Record<string, string> = {
  PENDING: "var(--chart-4)",
  CONFIRMED: "var(--chart-1)",
  PICKED_UP: "var(--chart-2)",
  IN_PROGRESS: "var(--chart-5)",
  READY: "var(--chart-3)",
  COMPLETED: "var(--success)",
  CANCELLED: "var(--destructive)",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  PICKED_UP: "Dijemput",
  IN_PROGRESS: "Proses",
  READY: "Siap",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

interface Props {
  data: { status: string; count: number }[];
  loading?: boolean;
}

export default function OrderStatusChart({ data, loading = false }: Props) {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    status: item.status,
  }));

  const renderLabel = (entry: any) => {
    return `${entry.value}`;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 justify-center mt-4">
        {" "}
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 text-caption text-muted-foreground"
          >
            {" "}
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {entry.value}:{" "}
              <strong className="text-primary">
                {entry.payload.value}
              </strong>{" "}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="text-h4 text-primary">
            Status Pesanan
          </CardTitle>{" "}
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-64 bg-muted rounded"></div>{" "}
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="text-h4 text-primary">Status Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8 text-body">
            Belum ada pesanan
          </p>{" "}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-custom">
      <CardHeader>
        <CardTitle className="text-h4 text-primary">Status Pesanan</CardTitle>
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
              outerRadius={window.innerWidth < 640 ? 60 : 80}
              label={renderLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.status] || "var(--muted)"}
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
