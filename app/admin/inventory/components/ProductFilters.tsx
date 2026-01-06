// app/admin/inventory/components/ProductFilters.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const CATEGORIES = [
  { value: "BASIC", label: "Basic" },
  { value: "PREMIUM", label: "Premium" },
  { value: "DEEP", label: "Deep" },
  { value: "TREATMENT", label: "Treatment" },
];

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  totalProducts: number;
  filteredCount: number;
}

export function ProductFilters({
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  totalProducts,
  filteredCount,
}: ProductFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>Search and filter your products</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-gray-500">
          Showing {filteredCount} of {totalProducts} products
        </div>
      </CardContent>
    </Card>
  );
}
