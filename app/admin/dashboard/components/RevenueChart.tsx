// app/admin/dashboard/components/RevenueChart.tsx
"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: { month: string; revenue: number }[];
  formatCurrency: (v: number) => string;
  loading?: boolean;
}

export default function RevenueChart({
  data,
  formatCurrency,
  loading = false,
}: Props) {
  if (loading) {
    return (
      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="text-h4 text-primary">
            Trend Penjualan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-64 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-custom">
      <CardHeader>
        <CardTitle className="text-h4 text-primary">Trend Penjualan</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />{" "}
            <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)" }} />{" "}
            <YAxis tick={{ fill: "var(--muted-foreground)" }} />
            <Tooltip
              formatter={(v) => formatCurrency(Number(v))}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary)"
              strokeWidth={window.innerWidth < 640 ? 2 : 3}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
