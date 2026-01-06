import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/hooks/useProducts";

interface ProductStatsProps {
  products: Product[];
}

export function ProductStats({ products }: ProductStatsProps) {
  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.length - activeCount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{products.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Inactive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-500">
            {inactiveCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
