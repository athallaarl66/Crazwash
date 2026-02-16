// app/admin/orders/components/OrdersClient.tsx
"use client";

import OrdersTable from "./OrdersTable";
import OrderFilters from "./OrderFilters";
import { Button } from "@/components/ui/button";
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

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </Button>

        <span className="text-body-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
