// app/admin/orders/components/OrderFilters.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FilterX, Filter } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Semua Status" },
  { value: "PENDING", label: "Menunggu" },
  { value: "CONFIRMED", label: "Dikonfirmasi" },
  { value: "READY", label: "Siap / Diantar" },
  { value: "COMPLETED", label: "Selesai" },
  { value: "CANCELLED", label: "Dibatalkan" },
] as const;

const PAYMENT_OPTIONS = [
  { value: "ALL", label: "Semua Pembayaran" },
  { value: "PAID", label: "Lunas" },
  { value: "UNPAID", label: "Belum Bayar" },
  { value: "REFUNDED", label: "Dikembalikan" },
] as const;

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );

  function updateParam(key: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (!value || value === "ALL") params.delete(key);
    else params.set(key, value);

    router.push(`/admin/orders?${params.toString()}`);
  }

  const handleSearch = (value: string) => {
    setSearchValue(value);
    updateParam("search", value || undefined);
  };

  const clearFilters = () => {
    router.push("/admin/orders");
    setSearchValue("");
  };

  const currentPayment = searchParams.get("payment") as PaymentStatus | null;
  const currentStatus = searchParams.get("status") as OrderStatus | null;

  const hasActiveFilters =
    searchParams.get("search") ||
    searchParams.get("payment") ||
    searchParams.get("status");

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari order ID, nama, atau telepon..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filter:</span>
          </div>

          <Select
            value={currentPayment || "ALL"}
            onValueChange={(value) => updateParam("payment", value)}
          >
            <SelectTrigger className="w-[160px]" suppressHydrationWarning>
              {" "}
              {/* ← TAMBAH INI */}
              <SelectValue placeholder="Pembayaran" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentStatus || "ALL"}
            onValueChange={(value) => updateParam("status", value)}
          >
            <SelectTrigger className="w-[160px]" suppressHydrationWarning>
              {" "}
              {/* ← TAMBAH INI */}
              <SelectValue placeholder="Status Order" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9"
            >
              <FilterX className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchParams.get("search") && (
            <div className="inline-flex items-center gap-1 px-3 py-1 text-caption bg-chart-1/10 text-chart-1 rounded-full">
              <Search className="h-3 w-3" />
              Search: "{searchParams.get("search")}"
            </div>
          )}
          {currentPayment && (
            <div className="inline-flex items-center gap-1 px-3 py-1 text-caption bg-success/10 text-success rounded-full">
              Payment:{" "}
              {PAYMENT_OPTIONS.find((o) => o.value === currentPayment)?.label}
            </div>
          )}
          {currentStatus && (
            <div className="inline-flex items-center gap-1 px-3 py-1 text-caption bg-chart-2/10 text-chart-2 rounded-full">
              Status:{" "}
              {STATUS_OPTIONS.find((o) => o.value === currentStatus)?.label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
