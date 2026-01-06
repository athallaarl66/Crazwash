import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];

export default function OrderStatusChart({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Pesanan</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={300}>
          <PieChart>
            <Pie data={data} dataKey="count" label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
