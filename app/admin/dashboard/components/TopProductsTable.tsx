import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TopProducts({
  data,
}: {
  data: {
    name: string;
    category: string;
    quantity: number;
    revenue: number;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Layanan Terlaris</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((p, i) => (
          <div key={i} className="flex justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">
                {p.quantity} pesanan • {p.category}
              </div>
            </div>
            <div className="font-bold text-green-600">
              Rp {p.revenue.toLocaleString("id-ID")}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
