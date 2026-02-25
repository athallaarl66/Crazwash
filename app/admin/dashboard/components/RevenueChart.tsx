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

  const isEmpty = data.length === 0;
  const maxRevenue = isEmpty ? 0 : Math.max(...data.map((d) => d.revenue));
  // Y-axis ceiling: 30% di atas max, dibulatkan ke 10rb terdekat
  const yMax =
    maxRevenue === 0 ? 100000 : Math.ceil((maxRevenue * 1.3) / 10000) * 10000;

  const formatYAxis = (value: number) => {
    if (value === 0) return "0";
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
    return String(value);
  };

  return (
    <Card className="card-custom">
      <CardHeader>
        <CardTitle className="text-h4 text-primary">Trend Penjualan</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <p className="text-muted-foreground text-center py-8 text-body">
            Belum ada data
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={[0, yMax]}
                width={48}
              />
              <Tooltip
                formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: 13,
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--primary)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
