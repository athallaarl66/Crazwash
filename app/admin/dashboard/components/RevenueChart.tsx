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

export default function RevenueChart({
  data,
  formatCurrency,
}: {
  data: { month: string; revenue: number }[];
  formatCurrency: (v: number) => string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Penjualan</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
