// app/admin/orders/components/OrdersClient.tsx
"use client";

import OrdersTable from "./OrdersTable";
import OrderFilters from "./OrderFilters";
import { useRouter, useSearchParams } from "next/navigation";
import type { OrderWithServices } from "@/lib/orderService";

export default function OrdersClient({
  orders,
  page,
  totalPages,
}: {
  orders: OrderWithServices[];
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/admin/orders?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <OrderFilters />

      <OrdersTable orders={orders} />

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
