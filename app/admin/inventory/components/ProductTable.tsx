import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Product } from "@/hooks/useProducts";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleActive: (product: Product) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductTableProps) {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      BASIC: "bg-blue-100 text-blue-800",
      PREMIUM: "bg-purple-100 text-purple-800",
      DEEP: "bg-orange-100 text-orange-800",
      TREATMENT: "bg-green-100 text-green-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {product.description}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <Badge className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(product.price)}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {product.duration} days
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => onToggleActive(product)}
                        className="flex items-center gap-2"
                      >
                        {product.isActive ? (
                          <>
                            <Eye size={16} className="text-green-600" />
                            <span className="text-sm text-green-600 font-medium">
                              Active
                            </span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-400 font-medium">
                              Inactive
                            </span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(product)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(product)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
